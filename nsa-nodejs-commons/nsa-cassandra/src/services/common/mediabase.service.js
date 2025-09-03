/**
 * Created by senthil on 2/24/2017.
 */

var express = require('express'),
    baseService = require('./base.service'),
    _ = require('lodash'),
    models = require('../../models'),
    util = require('util'),
    logger = require('../../../../../../config/logger');

exports.constructMediaUsageLogObj = function(req, notificationObj, callback) {
    try {
        var esDetailObjs = [];
        var smsResponse = extractSMSResponse(notificationObj.smsResponse)
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var featureId = models.uuidFromString(headers.feature_id);
        var object_id = _.isEmpty(req.body.object_id) ? null : req.body.object_id;
        var currentDate = new Date();

        var smsTemplate = notificationObj.smsTemplate;
        var pushTemplate = notificationObj.pushTemplate;
        var emailTemplate = notificationObj.emailTemplate;
        var status = notificationObj.notifyTo.status;
        var attachmentsObj = [];
        if(notificationObj.attachments != null) {
            attachmentsObj = baseService.getMapFromFormattedMap(notificationObj.attachments);
        }


        var templateTitle = smsTemplate.templateTitle;
        var title = smsTemplate.title;
        var message = smsTemplate.templateName;
        var messageCount = Math.ceil(message.length / 153);
        var array = notificationObj.batchObj;
        if(!(_.isEmpty(notificationObj.users))) {
            _.forEach(notificationObj.users, function(value, key) {
                var msg = message
                var primaryPhone = value.primaryPhone;
                if(notificationObj.isDetailedNotification) {
                    var detailedMessages = notificationObj.detailedMessages;
                    if(detailedMessages != null && detailedMessages != typeof 'undefined')
                    msg = detailedMessages[primaryPhone] || message
                }
                var classId = value.classes > 0 ? (value.classes[0].class_id != '' ? models.uuidFromString(value.classes[0].class_id) : null) : null;
                var sectionId = value.classes > 0 ? (value.classes[0].section_id != '' ? models.uuidFromString(value.classes[0].section_id) : null) : null;
                var obj = {
                    id: models.uuid(),
                    notification_id: notificationObj.notification_id,
                    tenant_id: tenantId,
                    school_id: schoolId,
                    academic_year: headers.academic_year,
                    // sender_id: models.uuid(),
                    feature_id: featureId || null,
                    object_id: object_id|| null,
                    employee_username: "",
                    user_name: value.userName,
                    first_name: value.firstName,
                    user_type: value.userType,
                    class_id: classId,
                    section_id: sectionId,
                    primary_phone: value.primaryPhone,
                    sms_response: JSON.stringify(smsResponse[value.primaryPhone]),
                    feature_name: "",
                    group_name: "",
                    media_name: notificationObj.mediaName,
                    message: msg,
                    template_title: templateTitle,
                    title: title,
                    email_template_title: emailTemplate.templateTitle,
                    email_template_message: emailTemplate.templateName,
                    push_template_title: pushTemplate.templateTitle,
                    push_template_message: pushTemplate.templateName,
                    count: messageCount,
                    notification_type: "",
                    priority: parseInt("1"),
                    status: status,
                    deactivated: false,
                    updated_date: currentDate,
                    updated_by : headers.user_id,
                    updated_username: headers.user_name,
                    created_by: headers.user_id,
                    created_firstname: headers.user_name,
                    created_date: currentDate,
                    attachments: attachmentsObj,
                };
                var logObj = new models.instance.SchoolMediaUsageLog(obj);
                var mediaUsageLogObj = logObj.save({return_query: true});
                array.push(mediaUsageLogObj);
                obj.attachments = attachmentsObj;
                esDetailObjs.push(obj);
            });
        };
        if(!(_.isEmpty(notificationObj.phoneNo))) {
            _.forEach(_.split(notificationObj.phoneNo, ','), function(value, key) {
                var obj = {
                    id: models.uuid(),
                    notification_id: notificationObj.notification_id,
                    tenant_id: tenantId,
                    school_id: schoolId,
                    academic_year: headers.academic_year,
                    sender_id: models.uuid(),
                    user_name: value,
                    primary_phone: value,
                    sms_response: JSON.stringify(smsResponse[value]),
                    media_name: notificationObj.mediaName,
                    message: message,
                    template_title: templateTitle,
                    title: title,
                    email_template_title: emailTemplate.templateTitle,
                    email_template_message: emailTemplate.templateName,
                    push_template_title: pushTemplate.templateTitle,
                    push_template_message: pushTemplate.templateName,
                    count: messageCount,
                    priority: parseInt("1"),
                    status: status,
                    deactivated: false,
                    updated_date: currentDate,
                    updated_by : headers.user_id,
                    updated_username: headers.user_name,
                    created_by: headers.user_id,
                    created_firstname: headers.user_name,
                    created_date: currentDate
                };
                var logObj = new models.instance.SchoolMediaUsageLog(obj);
                var mediaUsageLogObj = logObj.save({return_query: true});
                array.push(mediaUsageLogObj);
                esDetailObjs.push(obj);
            });
        }
        notificationObj.batchObj = array;
        notificationObj.esNotificationDetailObjs = esDetailObjs;
        callback(null, notificationObj)
    } catch (err) {
        logger.debug(err)
        callback(err, null)
    }

};

exports.updateMediaLimitObj = function(req, notificationObj, media, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);

        var message = notificationObj.smsTemplate.templateName;
        var messageCount = Math.ceil(message.length / 153);
        var extraUsers =  _.compact(_.split(notificationObj.phoneNo, ','));
        var usedCount = ((notificationObj.users.length + extraUsers.length) * messageCount) + media[0].used_count;

        var queryObject = {id: media[0].id, tenant_id: tenantId, school_id: schoolId, media_id: media[0].media_id};
        var updateValue = { used_count: usedCount};

        mediaUsageLimitObj = models.instance.SchoolMediaUsageLimit.update(queryObject, updateValue, {return_query: true});
        var array = notificationObj.batchObj;
        array.push(mediaUsageLimitObj);
        notificationObj.batchObj = array;

        callback(null, notificationObj)
    } catch (err) {
        logger.debug(err)
        callback(err, null)
    }
};

exports.updateVoiceLimitObj = function(req, data, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);

        var queryObject = {id: data.media[0].id, tenant_id: tenantId, school_id: schoolId, media_id: data.media[0].media_id};
        var updateValue = { used_count: data.usedCount};

        mediaUsageLimitObj = models.instance.SchoolMediaUsageLimit.update(queryObject, updateValue, {return_query: true});
        var array = data.batchObj;
        array.push(mediaUsageLimitObj);
        data.batchObj = array;

        callback(null, data)
    } catch (err) {
        logger.debug(err)
        callback(err, null)
    }
};


function extractSMSResponse(data) {
    var smsResponse = {}
    if(Array.isArray(data)) {
        _.forEach(data, function(value, key) {
            smsResponse[value.data['0'].mobile] = value.data['0']
        })
    } else {
        if(data != undefined && data.data != null && data.data != undefined) {
            _.forEach(data.data, function(value, key) {
                smsResponse[value.mobile] = value
            })
        }
    }

    return smsResponse;
};
exports.extractSMSResponse = extractSMSResponse;
