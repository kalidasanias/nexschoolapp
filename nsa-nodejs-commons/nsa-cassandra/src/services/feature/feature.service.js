/**
 * Created by Kiranmai A on 2/8/2017.
 */

var express = require('express')
    , baseService = require('../common/base.service')
    , models = require('../../models')
    , featureConverter = require('../../converters/feature.converter')
    , _ = require('lodash')
    , constant = require('@nsa/nsa-commons').constants
    , logger =require('../../../config/logger');

var Feature = function f(options) {
    var self = this;
};

Feature.getActiveSchoolFeatures = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var currentDate = new Date();
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        expire_date: {'$gte' : currentDate},
        status: true,
        academic_year: headers.academic_year,
        user_types: { '$contains': headers.user_type }
    };
    models.instance.SchoolFeature.find(findQuery, {allow_filtering: true}, function(err, result){
        if(err) {
            callback(err, null);
        } else {
            callback(null, featureConverter.schoolFeatureObjs(req, result));
        }
    });
};
Feature.getActiveSchoolFeaturesMobile= function(req, callback) {
    var currentDate = new Date();
    var findQuery = getHeaders(req);
    findQuery.expire_date = {'$gte' : currentDate};
    findQuery.status = true;

    models.instance.SchoolFeature.find(findQuery, {allow_filtering: true},
        function(err, result){
            var results = _.filter(result, function(res){
                return res.mobile_priority != null
            });
            callback(err, featureConverter.schoolFeatureObjsMobile(req, results));
        });
};

Feature.getFeatureTemplate = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        sub_feature_id: models.uuidFromString(headers.feature_id),
        actions: data.action,
        user_type: data.userType,
        status: true,
        tenant_id:  models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }
    models.instance.SchoolFeatureNotificationTemplates.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Feature.getTransportTemplate = function(callback) {
    var findQuery = {
        sub_feature_id: models.uuidFromString(constant.LIVETRACKING),
        actions: constant.CREATE_ACTION,
        user_type: constant.STUDENT,
        status: true,
    }
    models.instance.SchoolFeatureNotificationTemplates.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Feature.getAssignmentCreateTemplate = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        feature_id: models.uuidFromString(constant.ASSIGNMENT),
        sub_feature_id: models.uuidFromString(constant.CREATE_ASSIGNMENT),
        actions: constant.CREATE_ACTION,
        user_type: constant.STUDENT,
        status: true,
        tenant_id:  models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }
    models.instance.SchoolFeatureNotificationTemplates.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Feature.getAssignmentUpdateTemplate = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        feature_id: models.uuidFromString(constant.ASSIGNMENT),
        sub_feature_id: models.uuidFromString(constant.UPDATE_ASSIGNMENT),
        actions: constant.UPDATE_ACTION,
        user_type: constant.STUDENT,
        status: true,
        tenant_id:  models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }
    models.instance.SchoolFeatureNotificationTemplates.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Feature.getPresentAttendanceTemplate = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        feature_id: models.uuidFromString(constant.ATTENDANCE),
        sub_feature_id: models.uuidFromString(constant.PRESENT_ATTENDANCE),
        actions: constant.CREATE_ACTION,
        user_type: constant.STUDENT,
        status: true,
        tenant_id:  models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }
    models.instance.SchoolFeatureNotificationTemplates.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Feature.getAbsentAttendanceTemplate = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        feature_id: models.uuidFromString(constant.ATTENDANCE),
        sub_feature_id: models.uuidFromString(constant.ABSENT_ATTENDANCE),
        actions: constant.CREATE_ACTION,
        user_type: constant.STUDENT,
        status: true,
        tenant_id:  models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }
    models.instance.SchoolFeatureNotificationTemplates.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Feature.getFeatureChannelConfiguration = function(req, callback) {
    var findQuery = getHeaders(req);
    findQuery.feature_id = models.uuidFromString(req.params.featureId);
    models.instance.SchoolChannelConfiguration.findOne(findQuery, function(err, result){
        callback(err, result);
    });
};

Feature.getFeatureDetails = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        feature_id: models.uuidFromString(headers.feature_id),
        academic_year: headers.academic_year
    };

    models.instance.SchoolFeature.findOne(findQuery, {allow_filtering: true}, function(err, result){

        callback(err, result);
    });
};

Feature.getTransportNotify = function(callback) {
    var findQuery = {
        feature_id: models.uuidFromString(constant.LIVETRACKING)
    };
    models.instance.SchoolFeature.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Feature.getFeeCreateTemplate = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        feature_id: models.uuidFromString(constant.FEE),
        sub_feature_id: models.uuidFromString(constant.CREATE_FEE),
        actions: constant.CREATE_ACTION,
        user_type: constant.STUDENT,
        status: true,
        tenant_id:  models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }
    models.instance.SchoolFeatureNotificationTemplates.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Feature.getChannelFeatureDetails = function(req, callback) {

    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        is_channels:true,
    };
    models.instance.SchoolFeature.find(findQuery, {allow_filtering: true},
        function(err, result){
            callback(err, featureConverter.schoolChannelFeatureObjs(req, result));
        });
};

Feature.updateChannelFeatureDetails = function(req, callback) {
    try{
        var headers = baseService.getHeaders(req);
        var array =[];
        var body = req.body;
        _.forEach(body ,function(value, key){
            var findQuery = {
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id: models.uuidFromString(headers.school_id),
                academic_year: headers.academic_year,
                id : models.uuidFromString(value.featureId),
            };
            var updatedValues ={
                sms: value.sms,
                email:false,
                push: value.push,
                /*notify_hostelers: value.notifyHostelers,*/
                is_override: JSON.parse(value.isOverride)
            };
            var updateObj = models.instance.SchoolFeature.update(findQuery, updatedValues,{return_query: true});
            array.push(updateObj);
        });
        var data = {batchObj: array};
        callback(null, data);
    }catch (err){
        logger.debug(err);
        callback(err, null);
    }
};


function getHeaders(req) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
    };
    return findQuery;
};
exports.getHeaders = getHeaders;

module.exports = Feature;