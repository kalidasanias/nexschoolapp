
var express = require('express')
    , request = require('request')
    , _ = require('lodash')
    , baseService = require('../common/base.service')
    , models = require('../../models/index')

var Notifications = function f(options) {
    var self = this; };

//Get All User Notification Logs
Notifications.getAllUserNotificationLogs = function(req, callback) {

    var headers = baseService.getHeaders(req);
    var currentDate = new Date();
    var userId = req.params.id;

    var findQuery = {
        user_name: userId,
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        deactivated: false
    };

    models.instance.SchoolMediaUsageLog.find(findQuery, {allow_filtering: true},
        function(err, result){
            if (err) {
                callback(err, null)
            } else {
                baseService.sendDateFormatedResult(_.orderBy(result, ['updated_date'], ['desc']), constants.UPDATED_DATE, function(data) {
                    callback(null, data);
                })
            }
        });
};

Notifications.updateNotificationLogs = function (req, callback) {
    var body = req.body;
    var queryParam = req.query;
    var id = models.uuidFromString(req.params.id);
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var currentDate = new Date();
    var queryObject = {
        id: id,
        notification_id: models.uuidFromString(queryParam.notification_id),
        user_name: headers.user_id,
        tenant_id: tenantId,
        school_id: schoolId,
    };
    var updateValues = {
        deactivated: true
    };
    models.instance.SchoolMediaUsageLog.update(queryObject, updateValues, function (err, result) {
        callback(err, result);
    });
};

//For IOS Start
Notifications.updateUserReadStatus = function (req, callback) {
    var queryObject = statusUpdateFindQuery(req); //this statusUpdateFindQuery can be reuse to above updateNotificationLogs method
    var updateValues = {
        is_read: true
    };
    models.instance.SchoolMediaUsageLog.update(queryObject, updateValues, function (err, result) {
        callback(err, result);
    });
};

function statusUpdateFindQuery(req) {
    var body = req.body;
    var queryParam = req.query;
    var id = models.uuidFromString(req.params.id);
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var currentDate = new Date();
    var queryObject = {
        id: id,
        notification_id: models.uuidFromString(queryParam.notification_id),
        user_name: headers.user_id,
        tenant_id: tenantId,
        school_id: schoolId,
    };
    return queryObject;
}
exports.statusUpdateFindQuery = statusUpdateFindQuery;
//For IOS End

module.exports = Notifications;