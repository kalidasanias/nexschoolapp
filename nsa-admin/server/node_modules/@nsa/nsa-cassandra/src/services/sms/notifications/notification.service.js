/**
 * Created by Sai Deepak on 27-Dec-16.
 */

var express = require('express')
    , baseService = require('../../common/base.service')
    , _ = require('lodash')
    , constants = require('../../../common/constants/constants')
    , models = require('../../../models/index')
    , message = require('@nsa/nsa-commons').messages
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , constant = require('@nsa/nsa-commons').constants
    , notificationConverter = require('../../../converters/notification.converter');


var Notification = function f(options) {
    var self = this;
};

Notification.getNotifications = function(req, callback) {
    var array = [];
    models.instance.SchoolNotifications.eachRow({}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            callback(err, array);
        }
    });
};

Notification.getNotificationLogs = function(req, callback) {
    var array = [];
    var queryParams = req.query;
    var findQuery = {};
    if(queryParams != null && !_.isEmpty(queryParams)) {
        findQuery.updated_date =  {'$gte': new Date(queryParams.start), '$lte': new Date(queryParams.end)};
    }
    models.instance.SchoolMediaUsageLog.eachRow(findQuery, {fetchSize : 30000, allow_filtering: true}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage && array.length >= 0 && array.length < 30000) {
            result.nextPage();
        } else {
            callback(err, array);
        }
    });

};

Notification.getAllNotificationLogs = function(req, callback) {
    var data = {};
    var array = [];
    models.instance.SchoolMediaUsageLog.eachRow({}, {fetchSize : 5000}, function(n, value){
        // invoked per each row in all the pages , here value is row
        if(value.deactivated == null) {
            if(array.length >= 0 && array.length < 15000) {
                var queryObject = { id: value.id, notification_id: value.notification_id, tenant_id: value.tenant_id,
                    school_id:  value.school_id, user_name: value.user_name};
                var updateValues = { deactivated:  false };

                var updateQuery = models.instance.SchoolMediaUsageLog.update(queryObject, updateValues, {return_query: true});
                array.push(updateQuery);
            }
        }
    }, function(err, result){
        if(err) {
            throw err;
        }
        if (result.nextPage && array.length >= 0 && array.length < 15000) {
            result.nextPage();
        } else {
            data['batchObj'] = array;
            callback(err, req, data);
        }
    });
};

Notification.getAllNotifications = function(req, callback) {

    var havePermissions = baseService.haveAnyPermissions(req, constant.NOTIFICATION_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.NOTIFICATION_PERMISSIONS);
        var startDate = req.query.startDate;
        var endDate = req.query.endDate;
        if (startDate != null &&  !(_.isEmpty(startDate)) && endDate != null && !(_.isEmpty(endDate))) {
            findQuery.updated_date = {'$gte' : startDate, '$lte' : endDate};
        }
        models.instance.SchoolNotifications.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, notificationConverter.notificationObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};


Notification.notificationById = function(req, callback) {
    var headers = baseService.getHeaders(req);
    models.instance.SchoolNotifications.find({
        notification_id:  models.uuidFromString(req.params.id),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, {allow_filtering: true}, function (err, result) {
        callback(err, notificationConverter.notificationObjs(req, result));
    });
};

Notification.notificationByObjectId = function(req, callback) {
    var headers = baseService.getHeaders(req);
    models.instance.SchoolNotifications.find({
        object_id:  models.uuidFromString(req.params.id),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, {allow_filtering: true}, function (err, result) {
        callback(err, result);
    });
};

Notification.draftNotificationById = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var param = req.params.id;
    var tenant_id = models.timeuuidFromString(headers.tenant_id);
    var school_id = models.uuidFromString(headers.school_id);

    models.instance.SchoolNotifications.find({notification_id: models.uuidFromString(param),
        tenant_id: tenant_id, school_id: school_id
    }, {allow_filtering:true}, function(err, result){
        callback(err, result);
    });
};

Notification.deleteDraftNotificationById = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var param = req.params.id;

    var tenant_id = models.timeuuidFromString(headers.tenant_id);
    var school_id = models.uuidFromString(headers.school_id);

    var del = { notification_id: models.uuidFromString(param), tenant_id: tenant_id, school_id: school_id,
        academic_year: headers.academic_year};

    models.instance.SchoolNotifications.delete(del, function(err, result){
        callback(err, result);
    });
};

Notification.getNotificationlogsById = function(req, callback) {
    var findQuery = {};
    var headers = baseService.getHeaders(req);
    var param = req.params.id;
    var queryParams = req.query;
    findQuery.tenant_id = models.timeuuidFromString(headers.tenant_id);
    findQuery.school_id = models.uuidFromString(headers.school_id);
    findQuery.notification_id = models.uuidFromString(param);
    findQuery.academic_year = headers.academic_year;
    if(queryParams.startDate){
        var startDate = queryParams.startDate;
        var endDate = queryParams.endDate;
        findQuery.updated_date = {'$gte': startDate, '$lte': endDate};
    }
    models.instance.SchoolMediaUsageLog.find(findQuery, {allow_filtering : true}, function(err, result) {
        callback(err, result);
    });
};

Notification.getMediaUsedCount = function(req, callback) {
    var headers = baseService.getHeaders(req);

    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var mediaId = req.params.id;

    models.instance.SchoolMediaUsageLimit.find({
        tenant_id : tenantId, school_id : schoolId, media_id : parseInt(mediaId)
    }, {allow_filtering : true} , function (err, result) {
        callback(err, result);
    });
};

Notification.getNotificationByUser = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;

    var username = req.params.id;
    models.instance.SchoolNotifications.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: academicYear,  updated_by:  username
    }, {allow_filtering: true}, function (err, result) {
        if (err) {
            callback(err, null)
        } else {
            baseService.sendDateFormatedResult(result, constants.UPDATED_DATE, function(data) {
                callback(null, _.sortBy(data, 'updated_date').reverse());
            })
        }
    });
};

module.exports = Notification;
