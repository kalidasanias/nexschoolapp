/**
 * Created by senthil on 2/24/2017.
 */

var express = require('express'),
    models = require('../../models'),
    baseService = require('./base.service'),
    dateService = require('../../utils/date.service'),
    _ = require('lodash'),
    constant = require('@nsa/nsa-commons').constants;

var NotificationBase = function f(options) {
    var self = this;
};

NotificationBase.constructNotificationObj = function(req, notificationObj, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var mediaStatus = 'Sent';
        if(headers.feature_id == constant.NOTIFICATION) {
            mediaStatus = 'Progress'
        }
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var featureId = models.uuidFromString(headers.feature_id);
        var notification_id =  models.uuid();
        var currentDate = new Date();
        var smsTemplate = notificationObj.smsTemplate;
        var pushTemplate = notificationObj.pushTemplate;
        var emailTemplate = notificationObj.emailTemplate;
        var recepients = _.compact(_.split(notificationObj.phoneNo, ','));
        var status = notificationObj.notifyTo.status;
        var templateId = smsTemplate.templateId ? models.uuidFromString(smsTemplate.templateId) : null;
        var templateTitle = smsTemplate.templateTitle;
        var title = smsTemplate.title;
        var message = smsTemplate.templateName;
        var attachmentsObj = [];
        if(notificationObj.attachments != null) {
            attachmentsObj = baseService.getMapFromFormattedMap(notificationObj.attachments);
        }

        var user_types = req.body.userTypes ? [req.body.userTypes] : null;
        var notifiedCategories = notificationObj.notifiedCategories != null ? JSON.stringify(notificationObj.notifiedCategories) : null;
        var notifiedStudents = notificationObj.notifiedStudents != null ? JSON.stringify(notificationObj.notifiedStudents) : null;

        var messageCount = Math.ceil(message.length / 153);
        var usedCount = ((notificationObj.users.length + recepients.length) * messageCount) || 0;
        var object_id = _.isEmpty(req.body.object_id) ? null : req.body.object_id;
        object_id = typeof(object_id) == 'string' ?  models.uuidFromString(object_id) : object_id;

        var obj = {
            notification_id: notification_id,
            updated_date: currentDate,
            tenant_id: tenantId,
            school_id: schoolId,
            media_name: notificationObj.mediaName,
            template_id: templateId,
            template_title: templateTitle,
            feature_id: featureId,
            object_id: object_id|| null,
            title: title,
            message: message,
            sms_raw_response: JSON.stringify(notificationObj.smsResponse),
            email_template_title: emailTemplate.templateTitle,
            email_template_message: emailTemplate.templateName,
            push_template_title: pushTemplate.templateTitle,
            push_template_message: pushTemplate.templateName,
            notified_mobile_numbers: recepients,
            count: usedCount,
            status: status,
            academic_year: headers.academic_year,
            notified_categories: notifiedCategories,
            notified_students: notifiedStudents,
            updated_by : headers.user_id,
            updated_username: headers.user_name,
            created_by: headers.user_id,
            created_firstname: headers.user_name,
            created_date: currentDate,
            user_types: user_types,
            attachments: attachmentsObj,
            media_status: mediaStatus
        };

        var notifyObj = new models.instance.SchoolNotifications(obj);
        var notification = notifyObj.save({return_query: true});
        var array = [notification];
        notificationObj.notification_id = notification_id;
        notificationObj.batchObj = array;
        obj.attachments = attachmentsObj;
        notificationObj.esNotificationObj = obj;

        callback(null, notificationObj)
    } catch (err) {
        logger.debug(err);
        callback(err, null)
    }
};

NotificationBase.constructVoiceNotificationObj = function(req, data, callback) {
    try {
        var notification_id = req.params.id;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var featureId = models.uuidFromString(headers.feature_id);
        var notification_id = req.params.id ? models.uuidFromString(req.params.id) : models.uuid();
        var currentDate = dateService.getCurrentDate();
        var recepients = _.compact(_.split(req.body.phoneNo, ','));
        var usedCount = data['users'].length + recepients.length;
        var notifiedCategories = data.taxanomy != null ? JSON.stringify(data.taxanomy) : null;
        var object_id = _.isEmpty(req.body.object_id) ? null : req.body.object_id;
        object_id = typeof(object_id) == 'string' ? models.uuidFromString(object_id) : object_id;
        var notifiedStudents = data.students != null ? JSON.stringify(data.students) : null;
        req.body.object_id = object_id;
        var notification = new models.instance.SchoolVoiceNotifications({
            notification_id: notification_id,
            updated_date: currentDate,
            tenant_id: tenantId,
            school_id: schoolId,
            media_name: 'voice',
            feature_id: featureId,
            object_id: object_id|| null,
            notified_mobile_numbers: recepients,
            audio_id: req.body.audio_id ? parseInt(req.body.audio_id) : null,
            audio_uuid: req.body.id ? models.uuidFromString(req.body.id) : null,
            is_app_notification: req.body.is_app_notification ? req.body.is_app_notification : null,
            download_link: req.body.download_link ? req.body.download_link : null,
            campaign_name: req.body.name,
            schedule_date: req.body.schedule_date ? dateService.getFormattedDate(req.body.schedule_date) : currentDate,
            retry_condition: req.body.retry_condition,
            retry_times: req.body.retry_times,
            retry_interval: req.body.retry_interval,
            count: usedCount,
            status: req.body.notifyTo.status,
            academic_year: headers.academic_year,
            notified_categories: notifiedCategories,
            notified_students: notifiedStudents,
            updated_by : headers.user_id,
            updated_username: headers.user_name,
            created_by: headers.user_id,
            created_firstname: headers.user_name,
            created_date: currentDate
        });
        var notification = notification.save({return_query: true});
        var array = [notification];
        data.notification_id = notification_id;
        data.batchObj = array;

        callback(null, data)
    } catch(err) {
        logger.debug(err);
        callback(err, null)
    }

};


NotificationBase.updateAttachmentsObj = function(req, data, callback) {

    try{
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var academicYear = headers.academic_year;
        var notificationId = models.uuidFromString(req.params.id);
        var currentDate = new Date();

        var attachmentsObj = baseService.getMapFromFormattedMap(body.attachments);

        var queryObject = { notification_id: notificationId, tenant_id: tenantId, school_id:  schoolId, academic_year: academicYear };
        var updateValues = { attachments: {'$add' : attachmentsObj} , status : req.body.notifyTo.status};
        var updateQuery = models.instance.SchoolNotifications.update(queryObject, updateValues, {return_query: true});

        var array = [updateQuery];
        data.notification_id = notificationId;
        data.batchObj = array;
        data.esNotificationObj = _.assignIn(queryObject, {attachments: attachmentsObj});

        callback(null, data);
    } catch(err) {
        logger.debug(err);
        callback(err, null);
    }
};


NotificationBase.findMediaLogsObj = function (req, data, callback) {
    var headers = baseService.getHeaders(req);
    var assignmentId = req.params.id;
    var body = req.body;
    var academicYear = headers.academic_year;

    var queryObject = {
        notification_id: models.uuidFromString(assignmentId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id:  models.uuidFromString(headers.school_id),
        academic_year: academicYear
    };
    models.instance.SchoolMediaUsageLog.find(queryObject, {allow_filtering: true}, function(err, result){
        if (err) {
            logger.debug(err);
            callback(err, null);
        } else {
            data.result = result;
            callback(null, data);
        }
    });
};

NotificationBase.updateMediaLogsObj = function(req, data, callback) {
    try {
        var esDetailObjs = [];
        var users = req.body.users;
        var array = data.batchObj;
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var attachmentsObj = baseService.getMapFromFormattedMap(body.attachments);
        var exisitngAttachments = {};
        _.forEach(data.result, function(value, key){
            exisitngAttachments = value.attachments;
            var queryObject = { id: value.id, tenant_id: models.timeuuidFromString(headers.tenant_id), notification_id: value.notification_id, user_name: value.user_name,
                school_id:  models.uuidFromString(headers.school_id)};
            var updateValues = { attachments: {'$add' : attachmentsObj} };

            var updateQuery = models.instance.SchoolMediaUsageLog.update(queryObject, updateValues, {return_query: true});
            array.push(updateQuery);
            esDetailObjs.push(_.assignIn(queryObject, {attachments: attachmentsObj}))
        });
        data.batchObj = array;
        data.esMediaLogsObj = esDetailObjs;
        data.attachmentObjs = _.assignIn(attachmentsObj, exisitngAttachments);
        callback(null, data)
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};


NotificationBase.updateNotification = function(req, notificationObj, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var mediaStatus = 'Sent';
        if(headers.feature_id == constant.NOTIFICATION) {
            mediaStatus = 'Progress'
        }

        var smsTemplate = notificationObj.smsTemplate;
        var pushTemplate = notificationObj.pushTemplate;
        var emailTemplate = notificationObj.emailTemplate;
        var recepients = _.compact(_.split(notificationObj.phoneNo, ','));
        var status = notificationObj.notifyTo.status;

        var templateId = smsTemplate.templateId ? models.uuidFromString(smsTemplate.templateId) : null;
        var templateTitle = smsTemplate.templateTitle;
        var title = smsTemplate.title;
        var message = smsTemplate.templateName;
        var notifiedCategories = notificationObj.notifiedCategories != null ? JSON.stringify(notificationObj.notifiedCategories) : null;
        var notifiedStudents = notificationObj.notifiedStudents != null ? JSON.stringify(notificationObj.notifiedStudents) : null;

        var messageCount = Math.ceil(message.length / 153);
        var attachmentsObj = baseService.getMapFromFormattedMap(notificationObj.attachments);
        var usedCount = ((notificationObj.users.length + recepients.length) * messageCount) || 0;
        var notification_id = models.uuidFromString(req.params.id);

        var queryObject = { notification_id: models.uuidFromString(req.params.id),
            school_id: schoolId, tenant_id: tenantId, academic_year: headers.academic_year };

        var updateValues = {
            updated_date: currentDate,
            media_name: notificationObj.mediaName,
            template_id: templateId,
            template_title: templateTitle,
            title: title,
            message: message,
            email_template_title: emailTemplate.templateTitle,
            email_template_message: emailTemplate.templateName,
            push_template_title: pushTemplate.templateTitle,
            push_template_message: pushTemplate.templateName,
            notified_mobile_numbers: recepients,
            count: usedCount,
            status: status,
            notified_categories: notifiedCategories,
            notified_students: notifiedStudents,
            updated_by : headers.user_id,
            updated_username: headers.user_name,
            attachments: attachmentsObj,
            media_status : mediaStatus
        };

        var updateQuery = models.instance.SchoolNotifications.update(queryObject, updateValues, {return_query: true});

        var array = [updateQuery];
        notificationObj.notification_id = notification_id;
        notificationObj.batchObj = array;
        notificationObj.esNotificationObj = _.assignIn(queryObject, updateValues);

        callback(null, notificationObj)
    } catch (err) {
        logger.debug(err);
        callback(err, null)
    }
};

NotificationBase.deleteAttachmentsObj = function(req, data, callback) {
    try {
        var body = req.body;
        var findQuery = getFindQuery(req);
        findQuery.notification_id = models.uuidFromString(req.params.id);
        var existingFiles = baseService.getExistingFiles(body);
        req.body.attachments = existingFiles;
        var updateQuery = models.instance.SchoolNotifications.update(findQuery, {attachments: baseService.getMapFromFormattedMap(existingFiles)}, {return_query: true});
        data.batchObj = [updateQuery];
        data.id = findQuery.notification_id;
        data.s3DeleteIds = [req.body.curentFile];
        data.existingFiles = existingFiles;
        data.esNotificationObj = _.assignIn(findQuery, {attachments: baseService.getMapFromFormattedMap(existingFiles)});
        data.attachmentObjs = baseService.getMapFromFormattedMap(existingFiles);
        callback(null, data)
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

NotificationBase.deleteAttachmentByKey = function(req, data, callback) {
    try {
        var body = req.body;
        var findQuery = getFindQuery(req);
        findQuery.attachments = {'$contains_key': req.body.curentFile};
        models.instance.SchoolNotifications.find(findQuery, {allow_filtering: true}, function (err, result) {
            callback(err, result)
        });

    } catch (err) {
        callback(err, null);
    }
};

function getFindQuery(req){
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;

    return findQuery;
}


NotificationBase.updateNotificationStatus = function(req, notificationObj, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        console.log("notificationObj", notificationObj)
        var notificationId = notificationObj.notification_id;
        if(req.params.id != undefined) {
            notificationId = models.uuidFromString(req.params.id);
        }
        var queryObject = { notification_id: notificationId,
            school_id: schoolId, tenant_id: tenantId, academic_year: headers.academic_year };

        var updateValues = {
            media_status : 'Sent'
        };
        notificationObj.notification_id = notificationId;
        models.instance.SchoolNotifications.update(queryObject, updateValues, function (err, result) {
            notificationObj.esNotificationObj = _.assignIn(queryObject, updateValues);
            callback(err, notificationObj)
        });

    } catch (err) {
        logger.debug(err);
        callback(err, null)
    }
};

NotificationBase.deleteAttachmentsDetailsObj = function(req, data, callback) {
    try {
        var esDetailObjs = [];
        var body = req.body;
        var findQuery = getFindQuery(req);
        findQuery.notification_id = models.uuidFromString(req.params.id);
        models.instance.SchoolMediaUsageLog.find(findQuery, {allow_filtering: true}, function(err, result){
            if(_.isEmpty(result)) {
                callback(null, data);
            } else {
                var array = data.batchObj || [];
                var results = JSON.parse(JSON.stringify(result));
                _.forEach(results, function(value, key) {
                    delete findQuery.academic_year;
                    findQuery.user_name = value.user_name;
                    findQuery.id = models.uuidFromString(value.id);
                    esDetailObjs.push(_.assignIn(value, {attachments: baseService.getMapFromFormattedMap(data.existingFiles)}))
                    var updateQuery = models.instance.SchoolMediaUsageLog.update(findQuery, {attachments: baseService.getMapFromFormattedMap(data.existingFiles)}, {return_query: true});
                    array.push(updateQuery);
                    if (results.length -1 === key) {
                        data.batchObj = array;
                        data.esMediaLogsObj = esDetailObjs;
                        data.attachmentObjs = baseService.getMapFromFormattedMap(data.existingFiles);
                        callback(null, data);
                    }
                });
            }
        });
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};


module.exports = NotificationBase;
