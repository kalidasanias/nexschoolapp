/**
 * Created by Sai Deepak on 27-Dec-16.
 */

var express = require('express')
    , baseService = require('../../shared/base.service')
    , constants = require('../../../common/constants/constants')
    , router = express.Router()
    , request = require('request')
    , models = require('../../../models')
    , smsService = require('../sendSms.service.js')
    , userService = require('../../user/user.service')
    , usageLog = require('../../media/mediaUsageLog.service')
    , usageLimit = require('../../media/mediaUsageLimit.service')
    , schoolNotificationService = require('../../schoolNotifications/schoolNotification.service')
    , temaplateService = require('../templates/templates.service');

const dataBaseUrl = '../../../test/json-data/';

exports.getAllNotifications = function(req, res) {
    var headers = baseService.getHeaders(req);
    models.instance.SchoolNotifications.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, {allow_filtering: true}, function(err, result){
        if (err) {
            res.status(constants.HTTP_BAD_REQUEST).send({success: false, data: err});
        } else {
            /*res.status(constants.HTTP_CREATED).send({success: true, data: result});*/
            baseService.sendDateFormatedResult(result, constants.UPDATED_DATE, res)
        }
    });
};

exports.notificationById = function(req, res) {
    var headers = baseService.getHeaders(req);
    models.instance.SchoolNotifications.find({
        notification_id:  models.uuidFromString(req.params.id),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, {allow_filtering: true}, function (err, result) {
        if (err) {
            res.status(constants.HTTP_BAD_REQUEST).send({success: false, data: err});
        } else {
            res.status(constants.HTTP_CREATED).send({success: true, data: result});
        }
    });
};

exports.deleteNotifications = function(req, res) {
    var data = require(dataBaseUrl + 'notifications/sms/delete-all-notification.json');
    var notificationsArray = req.body.notifications;
    var tenant_id = header.getHeaders(req).tenant_id;
    var school_id = header.getHeaders(req).school_id;
    var i = 0;

    while(i < notificationsArray.length){
        var findQuery = { notification_id: models.datatypes.Long.fromInt(notificationsArray[i]),
            tenant_id: models.datatypes.TimeUuid.fromString(tenant_id),
            school_id: models.uuidFromString(school_id)};

        var deleteQuery = { notification_id: models.datatypes.Long.fromInt(notificationsArray[i])};

        models.instance.SchoolNotifications.find(findQuery, {allow_filtering: true}, function (err, result) {

            if (JSON.stringify(result) != '[]') {
                models.instance.SchoolNotifications.delete(deleteQuery,{allow_filtering: true}, function (err, result) {
                    if (result) {
                    } else {
                        var failureData = require(dataBaseUrl + 'failure/failure.json');
                    }
                });
            } else {
                data = require(dataBaseUrl + 'failure/failure.json');
            }
        });
        ++i;
    }
    res.status(403).send({success:false, message:"Unable to delete the notification. Check your notification id"});
};

exports.saveNotification = function(req, res) {
    var data;
    var headers = baseService.getHeaders(req);
    var tenant_id = models.timeuuidFromString(headers.tenant_id);
    var school_id = models.uuidFromString(headers.school_id);
    var userId = headers.user_id;
    var body = req.body;
    var roleId = body.notifyTo.roleId;

    /* notifyToPhoneNumbers will be sotred in the school_notifications table - notified list column */
    var notifiedList = [];
    var notifiedPhoneNumbers = [];
    /* phoneNumbers array is used to display the count in school_notifications and also to create seperate log entry for each
     numbers in school_media_usage_log */
    var phoneNumbers = [];

    var recepients = body.phoneNo;
    var notificationId = models.uuid();
    var status = body.notifyTo.status;
    var templateId = models.uuidFromString(body.sms.templateId);
    var templateTitle = body.sms.templateTitle;
    var title = body.sms.title;
    var message = body.sms.templateName;
    var messageCount = Math.ceil(message.length / 153);
    var usedCount;
    var currentDate = new Date();
    var senderId;

    var sms = body.notify.sms;
    var mediaId;
    if (sms) {
        mediaId = 1;
    }

    fetchContacts();

    function fetchContacts() {
        userService.fetchContacts(res, roleId, tenant_id, school_id, recepients, messageCount, function (phoneNos,  notifyList, notifiedPhoneNos, recepient, usedCunt){
            phoneNumbers = phoneNos;
            notifiedList = notifyList;
            notifiedPhoneNumbers = notifiedPhoneNos;
            recepients = recepient;
            usedCount = usedCunt;

             temaplateService.getAllSenderIds(req, res, mediaId, function(result) {
                 senderId = result[0].sender_name;
                 sendSms(recepients, senderId);
             });

        });
    }

    function saveNotification() {

        var schoolNotification = new models.instance.SchoolNotifications({notification_id: notificationId, created_date: currentDate,
            updated_date: currentDate, tenant_id: tenant_id, school_id: school_id, template_id: templateId, template_title: templateTitle, title: title,
            message: message, sent_id: userId, notified_list: notifiedList, notified_mobile_numbers: notifiedPhoneNumbers, count: usedCount, status: status
        });

        schoolNotificationService.saveSchoolNotifications(res, schoolNotification, function(result) {
            if(result) {
                mediaUsageLog(phoneNumbers);
            }
        });
    }

    function sendSms(value, senderId) {
        smsService.sendSms(req, res, value, title, message, senderId, function(result){
            if(result) {
                saveNotification();
            } else {
                res.status(constants.HTTP_FORBIDDEN).send({success: false, data: "sms not sent"});
            }
        });
    }

    function mediaUsageLog(notifiedList) {
        usageLog.saveMediaUsageLog(res, tenant_id, school_id, userId, notificationId,
            notifiedList, messageCount, title, message, status, function (saved) {
                if (saved) {
                    var limitValue;
                    usageLimit.findLimitValue(mediaId, function (limit) {
                        limitValue = limit;

                        usageLimit.find(tenant_id, school_id, mediaId, function (result) {
                            if (result != null) {
                                var id = result[0].id;
                                used_count = result[0].used_count + usedCount;
                                usageLimit.updateExisting(res, tenant_id, school_id, mediaId, id, limitValue, used_count);
                            } else {

                                var schoolMediaUsageLimit = new models.instance.SchoolMediaUsageLimit({
                                    id: models.uuid(), tenant_id: tenant_id, school_id: school_id,
                                    media_id: mediaId, available_limit: limitValue,  used_count: usedCount
                                });

                                usageLimit.mediaUsageLimitNewEntry(res, schoolMediaUsageLimit);
                            }
                        });
                    });
                } else {
                    res.status(constants.HTTP_BAD_REQUEST).send({
                        success: false,
                        data: "Failed to save in media usage log"
                    });
                }
            });
    }
};

exports.saveDraftNotification = function(req, res) {

    var headers = baseService.getHeaders(req);

    var tenant_id = models.timeuuidFromString(headers.tenant_id);
    var school_id = models.uuidFromString(headers.school_id);
    var userId = headers.user_id;
    var body = req.body;
    var roleId = body.notifyTo.roleId;
    var recepients = body.phoneNo;
    var notificationId = models.uuid();
    var status = body.notifyTo.status;
    var templateId = models.uuidFromString(body.sms.templateId);
    var templateTitle = body.sms.templateTitle;
    var title = body.sms.title;
    var message = body.sms.templateName;
    var messageCount = Math.ceil(message.length / 153);

    var notifiedList = [];
    var notifiedPhoneNumbers = [];
    var usedCount;
    var currentDate = new Date();

    fetchContacts();

    function  fetchContacts() {
        userService.fetchContacts(res, roleId, tenant_id, school_id, recepients, messageCount, function (phoneNos,  notifyList, notifiedPhoneNos, recepient, usedCunt){
            notifiedList = notifyList;
            notifiedPhoneNumbers = notifiedPhoneNos;
            usedCount = usedCunt;
            saveSchoolNotification();
        });
    }

    function saveSchoolNotification() {

        var schoolNotification = new models.instance.SchoolNotifications({notification_id: notificationId, created_date: currentDate,
            updated_date: currentDate, tenant_id: tenant_id, school_id: school_id, template_id: templateId, template_title: templateTitle, title: title,
            message: message, sent_id: userId, notified_list: notifiedList, notified_mobile_numbers: notifiedPhoneNumbers, count: usedCount, status: status
        });

        schoolNotificationService.saveSchoolNotifications(res, schoolNotification, function(result) {
            if(result) {
                res.status(constants.HTTP_CREATED).send({success: true, data: "Draft Saved Successfully"});
            }
        });
    }
};

exports.draftNotificationById = function(req, res) {
    var headers = baseService.getHeaders(req);
    var param = req.params.id;
    var data;
    var tenant_id = models.timeuuidFromString(headers.tenant_id);
    var school_id = models.uuidFromString(headers.school_id);

    models.instance.SchoolNotifications.find({notification_id: models.uuidFromString(param),
        tenant_id: tenant_id, school_id: school_id
    }, {allow_filtering:true}, function(err, result){
        if(result) {
            res.status(constants.HTTP_CREATED).send({success: true, data: result});
        } else {
            res.status(constants.HTTP_FORBIDDEN).send({success: false, message: "Given id is not found in the database"});
        }
    });
};

exports.deleteDraftNotificationById = function(req, res) {
    var headers = baseService.getHeaders(req);
    var param = req.params.id;
    var queries = [];

    var tenant_id = models.timeuuidFromString(headers.tenant_id);
    var school_id = models.uuidFromString(headers.school_id);

    var queryObject = { notification_id: models.uuidFromString(param),
        tenant_id: tenant_id, school_id: school_id };
    var del = { notification_id: models.uuidFromString(param) };

    models.instance.SchoolNotifications.find(queryObject,{allow_filtering: true}, function(err, result){
        if(JSON.stringify(result) != '[]') {
            models.instance.SchoolNotifications.delete(del, {allow_filtering: true}, function(err, result){
                if(err) {
                    res.status(constants.HTTP_FORBIDDEN).send({success: false, message: err});
                } else{
                    res.status(constants.HTTP_CREATED).send({success: true, data: result});
                }
            });
        } else {
            res.status(constants.HTTP_FORBIDDEN).send({success: false, message: "Given id is not found in the database"});
        }
    });
};

exports.updateDraftNotificationById = function(req, res) {
    var headers = baseService.getHeaders(req);
    var param = req.params.id;
    var tenant_id = models.timeuuidFromString(headers.tenant_id);
    var school_id = models.uuidFromString(headers.school_id);
    var userId = headers.user_id;
    var body = req.body;

    var notificationId = models.uuidFromString(param);
    var roleId = body.notifyTo.roleId;
    var templateId = models.uuidFromString(body.sms.templateId);
    var sms = body.notify.sms;
    var templateTitle = body.sms.templateTitle;
    var title = body.sms.title;
    var message = body.sms.templateName;
    var status = body.notifyTo.status;
    var messageCount = Math.ceil(message.length / 153);

    /* notifyToPhoneNumbers will be sotred in the school_notifications table - notified list column */
    var notifiedList = [];
    var notifiedPhoneNumbers = [];
    var phoneNumbers = [];
    var recepients = body.phoneNo;
    var usedCount;
    var mediaId;
    var senderId;

    if (sms) {
        mediaId = 1;
    }

    var queryObject = {notification_id: notificationId, created_date: new Date(body.createdDate)};
    var filterParam = {school_id: school_id, tenant_id: tenant_id};
    fetchContacts();

    function fetchContacts() {
        userService.fetchContacts(res, roleId, tenant_id, school_id, recepients, messageCount, function (phoneNos,  notifyList, notifiedPhoneNos, recepient, usedCunt){
            phoneNumbers = phoneNos;
            notifiedList = notifyList;
            notifiedPhoneNumbers = notifiedPhoneNos;
            recepients = recepient;
            usedCount = usedCunt;

            if (status == 'Sent') {

                temaplateService.getAllSenderIds(req, res, mediaId, function(result) {
                    senderId = result[0].sender_name;
                    sendSms(recepients, senderId);
                });

            } else {

                var updateValues = {tenant_id: tenant_id, school_id: school_id, notified_list: notifiedList,
                    notified_mobile_numbers: notifiedPhoneNumbers, updated_date: new Date(), template_id: templateId,
                    template_title: templateTitle, title: title, message: message, status: status, count: usedCount};

                schoolNotificationService.updateSchoolNotifications(res, queryObject, updateValues, filterParam, function (result) {
                    if (result) {
                        return res.status(constants.HTTP_CREATED).send({success: true, data: "Draft Updated Successfully"});
                    }
                });
            }

        });
    }

    function updateSchoolNotification() {

        var updateValues = {tenant_id: tenant_id, school_id: school_id, notified_list: notifiedList,
            notified_mobile_numbers: notifiedPhoneNumbers, updated_date: new Date(), template_id: templateId,
            template_title: templateTitle, title: title, message: message, status: status, count: usedCount};

        schoolNotificationService.updateSchoolNotifications(res, queryObject, updateValues, filterParam, function (result) {
            if (result) {
                mediaUsageLog(phoneNumbers);
            }
        });
    }

    function sendSms(value, senderId) {
        smsService.sendSms(req, res, value, title, message, senderId, function(result){
            if(result) {
                updateSchoolNotification();
            } else {
                res.status(constants.HTTP_FORBIDDEN).send({success: false, data: "sms not sent"});
            }
        });
    }

    function mediaUsageLog(notifiedList) {
        usageLog.saveMediaUsageLog(res, tenant_id, school_id, userId, notificationId,
            notifiedList, messageCount, title, message, status, function (saved) {
                if (saved) {
                    var limitValue;
                    usageLimit.findLimitValue(mediaId, function (limit) {
                        limitValue = limit;

                        usageLimit.find(tenant_id, school_id, mediaId, function (result) {
                            if (result != null) {
                                var id = result[0].id;
                                used_count = result[0].used_count + usedCount;
                                usageLimit.updateExisting(res, tenant_id, school_id, mediaId, id, limitValue, used_count);
                            } else {

                                var schoolMediaUsageLimit = new models.instance.SchoolMediaUsageLimit({
                                    id: models.uuid(), tenant_id: tenant_id, school_id: school_id, media_id: mediaId,
                                    available_limit: limitValue, used_count: usedCount
                                });

                                usageLimit.mediaUsageLimitNewEntry(res,schoolMediaUsageLimit);
                            }
                        });
                    });
                } else {
                    res.status(constants.HTTP_BAD_REQUEST).send({success: false, data: "Failed to save in media usage log"});
                }
         });
    }
};

exports.getNotificationlogsById = function(req, res) {
    var headers = baseService.getHeaders(req);
    var param = req.params.id;

    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var notificationId = models.uuidFromString(param);

    models.instance.SchoolMediaUsageLog.find({
        notification_id : notificationId, tenant_id : tenantId, school_id : schoolId
    }, {allow_filtering : true}, function(err, result) {
        if(err) {
            res.status(constants.HTTP_FORBIDDEN).send({success: false, data: "Could not get logs"});
        } else {
            res.status(constants.HTTP_CREATED).send({success: true, data: result});
        }
    });
};

exports.getMediaUsedCount = function(req, res) {
    var headers = baseService.getHeaders(req);

    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var mediaId = req.params.id;

    models.instance.SchoolMediaUsageLimit.find({
        tenant_id : tenantId, school_id : schoolId, media_id : parseInt(mediaId)
    }, {allow_filtering : true} , function (err, result) {
        if(err) {
            res.status(constants.HTTP_FORBIDDEN).send({success: false, data: "Could not get Count"});
        } else {
            res.status(constants.HTTP_CREATED).send({success: true, data: result});
        }
    });
};

exports.getSmsCountByType = function(req, res) {

    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);

    var roleId = parseInt(req.params.id);
    var findQuery;

    if(roleId == 0) {
        var findQuery ={ role_id : {'$token' : { '$gt': 1}}, tenant_id: tenantId, school_id: schoolId };
    } else {
        findQuery = {role_id: roleId, tenant_id: tenantId, school_id: schoolId};
    }

    models.instance.UserByRole.find(findQuery, {allow_filtering : true}, function (err, result) {
        if(err) {
            res.status(constants.HTTP_FORBIDDEN).send({success: false, data: "Could not get Count"});
        } else {
            res.status(constants.HTTP_CREATED).send({success: true, count: result.length});
        }
    });
};