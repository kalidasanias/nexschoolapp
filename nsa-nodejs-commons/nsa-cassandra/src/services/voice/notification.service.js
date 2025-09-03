/**
 * Created by Sai Deepak on 27-Dec-16.
 */

var express = require('express')
    , baseService = require('../common/base.service')
    , _ = require('lodash')
    , constants = require('../../common/constants/constants')
    , models = require('../../models/index')
    , message = require('@nsa/nsa-commons').messages
    , constant = require('@nsa/nsa-commons').constants
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , notificationConverter = require('../../converters/notification.converter');


var VoiceNotification = function f(options) {
    var self = this;
};


VoiceNotification.getAllAudios = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
       findQuery.academic_year = headers.academic_year;
    models.instance.SchoolAudios.find(findQuery, {allow_filtering: true}, function (err, result) {
        baseService.sendDateFormatedResult(result, 'updated_date', function(result) {
            callback(err, result);
        });
    });
};

VoiceNotification.getAllDeviceAudios = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    // findQuery.is_mobile_recording = true;
    models.instance.SchoolAudios.find(findQuery, {allow_filtering: true}, function (err, result) {
        baseService.sendDateFormatedResult(result, 'updated_date', function(result) {
            callback(err, result);
        });
    });
};

VoiceNotification.getAllNotifications = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.VOICE_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.VOICE_PERMISSIONS);
        var startDate = req.query.startDate;
        var endDate = req.query.endDate;
        if (startDate != null &&  !(_.isEmpty(startDate)) && endDate != null && !(_.isEmpty(endDate))) {
            findQuery.updated_date = {'$gte' : startDate, '$lte' : endDate};
        }
        models.instance.SchoolVoiceNotifications.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, notificationConverter.voiceObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

VoiceNotification.getAllNotificationsByCreatedById = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year =  headers.academic_year
    findQuery.created_by = req.params.id;
    // findQuery.is_app_notification = true;
    models.instance.SchoolVoiceNotifications.find(findQuery, {allow_filtering: true}, function(err, result) {
        callback(err, updatePermission(req, result));
    });
};

function updatePermission(req, data) {
    try {

        var objs = [];
        data.forEach(function (value) {
            value['editPermissions'] = baseService.havePermissionsToEdit(req, constant.VOICE_PERMISSIONS, data['created_by']);
            objs.push(value);
        });
        return objs;
    } catch (e) {
        return responseBuilder.buildResponse('Voice Message', constant.APP_TYPE, message.nsa14006, e.message, constant.HTTP_BAD_REQUEST);
    }
}

VoiceNotification.saveAudio = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var body = req.body;
    var audioObj = {};

    if (body.is_app_notification) {
        audioObj.is_mobile_recording = body.is_app_notification;
        audioObj.download_link = body.download_link;
        audioObj.name = body.file_name;
        audioObj.status = 'approved';
        audioObj.id = req.body.id;

    } else {
        audioObj.id = models.uuid();
        audioObj.audio_id = body.id.toString();
        audioObj.download_link = body.attachments[0].key;
        audioObj.name = body.attachments[0].name;
        audioObj.status = 'initiated';
    }

    audioObj.academic_year = headers.academic_year;

    var audioObject = baseService.updateIdsFromHeader(req, audioObj);
    var audio = new models.instance.SchoolAudios(audioObject);
    audio.save(function (err, result) {
        callback(err, result);
    });
};

VoiceNotification.updateAudio = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
        findQuery.academic_year = headers.academic_year;
        findQuery.id = data.uniqId;
    models.instance.SchoolAudios.update(findQuery, {status: data.status},function (err, result) {
        callback(err, data);
    });
};

VoiceNotification.getVoiceNotificationById = function(req, callback) {
    var headers = baseService.getHeaders(req);
    models.instance.SchoolVoiceNotifications.find({
        notification_id:  models.uuidFromString(req.params.id),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, {allow_filtering: true}, function (err, result) {
        callback(err, result);
    });
};

VoiceNotification.deleteNotificationById = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
        findQuery.academic_year =  headers.academic_year
        findQuery.notification_id = models.uuidFromString(req.params.id);
    models.instance.SchoolVoiceNotifications.delete(findQuery, function(err, result){
        callback(err, result);
    });
};

module.exports = VoiceNotification;
