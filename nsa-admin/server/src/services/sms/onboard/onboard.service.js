/**
 * Created by intellishine on 8/18/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    dateService = require('../../../utils/date.service'),
    es = require('../../../services/search/elasticsearch/elasticsearch.service'),
    events = require('@nsa/nsa-commons').events,
    async = require('async'),
    baseService = require('../../../services/common/base.service'),
    notificationService = require('../../sms/notifications/notification.service'),
    message = require('@nsa/nsa-commons').messages,
    _= require('lodash'),
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    BaseError = require('@nsa/nsa-commons').BaseError,
    taxanomyUtils = require('@nsa/nsa-commons').taxanomyUtils,
    constant = require('@nsa/nsa-commons').constants,
    dateUtils = require('@nsa/nsa-commons').dateUtils,
    logger = require('../../../common/logging');



exports.getAllOnboardMessage = function(req, res){
    async.parallel({
        notification: nsaCassandra.Onboard.getAllOnboardNotifications.bind(null, req),
        students: es.getActiveStudents.bind(null, req)
    }, function (err, data){
        if(err) {
            logger.debugLog(req, 'Get Onboard Notifications', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa10001));
        } else {
            events.emit('JsonResponse', req, res, buildOnboard(req, data));
        }
    });
};

function buildOnboard(req, data){

    var onboardNotification = [];
    _.forEach(data.notification, function(notification, key){
        var count = 0;
        var result = JSON.parse(JSON.stringify(notification));
        var NotificationSendUsers = _.map(JSON.parse(result.notified_students), 'userName');
        _.forEach(data.students , function(value, key){
            var logins =  getCurrentLogins(value.deviceToken);
            var CurrentUser = _.includes(NotificationSendUsers, value.user_name);
            if(logins && CurrentUser){
                count++;
            }
            result['currentLogins'] = count;
        });
        onboardNotification.push(result);
    })
    return onboardNotification;
}

function getCurrentLogins(target) {
    if(Array.isArray(target) && !_.isEmpty(target)){
        for (var member in target[0]) {
            if (target[0][member] !== null)
                return true;
        }
    }
    return false;
}

exports.saveOnboard = function(req, res) {

    async.waterfall(
        [
            buildTaxanomyObj.bind(null, req),
            getUsers.bind(),
            findSchoolDetails.bind(),
            getOnboardTemplate.bind(),
            buildNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind(),
        ],
        function (err,  data) {
            if(err) {
                logger.debugLog(req, 'Save OnBoard Err ', err);
                events.emit('ErrorJsonResponse', req, res, err);
            } else {
                var result = {};
                result['message'] = message.nsa216;
                result['data'] = data;
                events.emit('JsonResponse', req, res, result);
            }
        }
    );
/*    if (status == "Sent") {
 var status = req.body.notifyTo.status;
    } else {
        async.waterfall(
            [
                buildTaxanomyObj.bind(null, req),
                getUsers.bind(),
                findSchoolDetails.bind(),
                getOnboardTemplate.bind(),
                buildNotificationObj.bind(),
                notificationService.constructNotificationObj.bind(),
                executeBatch.bind(),
            ],
            function (err, data) {
                if(err) {
                    logger.debugLog(req, 'Save OnBoard Err ', err);
                    events.emit('ErrorJsonResponse', req, res, err);
                } else {
                    var result = {};
                    result['message'] = message.nsa214;
                    result['data'] = data;
                    events.emit('JsonResponse', req, res, result);
                }
            }
        );
    }*/
};

function buildTaxanomyObj(req, callback) {
    var data = [];
    taxanomyUtils.buildTaxanomyObj(req, function(err, result){
        data['taxanomy'] = result;
        callback(err, req, data)
    })
}
exports.buildTaxanomyObj = buildTaxanomyObj;

function getUsers(req, data, callback) {
    getContacts(req, function(err, result) {
        if (err) {
            logger.debugLog(req, 'Save OnBoard Err ', err);
            callback(err, req, null);
        } else {
            data['users'] = req.body.userTypes =='Parent' ? _.uniqBy(result, 'primaryPhone') : result;
            callback(null, req, data);
        }
    })
};
exports.getUsers = getUsers;

function getContacts(req, callback) {
     getUsersByClassSections(req, function(err, result){
         if (err) {
             logger.debugLog(req, 'Save OnBoard Err ', err);
             callback(err, null);
         } else {
            var users = result;
             callback(null, users);
         }
     });
};
exports.getContacts = getContacts;

function getUsersByClassSections(req, callback) {
    var classes = req.body.classes;
    if(Array.isArray(classes) && classes.length > 0) {
        es.getUsersByClassSections(req, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, []);
    }

};
exports.getUsersByClassSections = getUsersByClassSections;

function getOnboardTemplate(req, data, callback) {
    var templateObj = getTemplateObj(req, data);
    data.templateObj = templateObj;
    callback(null, req, data);
};
exports.getOnboardTemplate = getOnboardTemplate;

function getTemplateObj(req, data){
    var body = req.body;
    var schoolDetails = data.schoolDetails;
    var templateObj = {};
    var smsTemplate = {}, emailTemplate = {}, pushTemplate= {}, notifyTo = {};
    smsTemplate.sms_template_title = req.body.notificationName;
    if(body.userTypes == 'Parent'){
        smsTemplate.templateName =  message.nsa19008;
    }else {
        smsTemplate.templateName =  message.nsa19006;
    }

    smsTemplate.templateTitle = req.body.notificationName;
    smsTemplate.title = req.body.notificationName;
    smsTemplate.templateId = null;
    emailTemplate.email_template_title = null;
    emailTemplate.templateTitle = null;
    emailTemplate.templateName = null;
    pushTemplate.push_template_title = null;
    pushTemplate.templateTitle = null;
    pushTemplate.templateName = null;
    notifyTo.status = req.body.notifyTo.status;
    templateObj.smsTemplate = smsTemplate;
    templateObj.emailTemplate = emailTemplate;
    templateObj.pushTemplate = pushTemplate;
    templateObj.notifyTo = notifyTo;

    return templateObj;
}

function buildNotificationObj(req, data, callback) {
    var body = req.body || [];
    req.body.object_id = req.params.id;
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, data, data.templateObj, function(err, notificationObj) {
        notificationObj.isDetailedNotification = true;
        if(req.body.userTypes =='Parent'){
            notificationObj.replacementKeys = ['appLink','schoolName','primaryPhone', 'password'];
            notificationObj = getOnboardParentTemplateString(req, data, notificationObj);
        }else {
            notificationObj.replacementKeys = ['appLink','schoolName','userName', 'password'];
            notificationObj = getOnboardTemplateString(req, data, notificationObj);
        }

        callback(err, req, notificationObj);
    })
};
exports.buildNotificationObj = buildNotificationObj;


function getOnboardParentTemplateString(req, data, notificationObj) {
    var schoolDetails = data.schoolDetails;
    var obj = {};
    _.forEach(data.users, function (value, key) {
        obj[value.primaryPhone] = {appLink: schoolDetails.app_link, schoolName: schoolDetails.school_name, primaryPhone: value.primaryPhone ,  password: schoolDetails.password};
    });
    notificationObj.replacementMsgs = obj;
    return notificationObj;
};

function getOnboardTemplateString(req, data, notificationObj) {
    var schoolDetails = data.schoolDetails;
    var obj = {};
    _.forEach(data.users, function (value, key) {
        obj[value.primaryPhone] = {appLink: schoolDetails.app_link, schoolName: schoolDetails.school_name, userName: value.userName,  password: schoolDetails.password};
    })
    notificationObj.replacementMsgs = obj;
    return notificationObj;
};

function findSchoolDetails(req, data, callback){
    nsaCassandra.School.getSchoolDetails(req, function(err, result){
         data.schoolDetails = result;
        callback(err, req, data)
    })
};
exports.findSchoolDetails = findSchoolDetails;

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.insertAuditLog = insertAuditLog;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
};
exports.executeBatch = executeBatch;

/*exports.updateOnboard = function(req, res) {
    var status = req.body.notifyTo.status;
    if (status == "Sent") {
        async.waterfall(
            [
                buildTaxanomyObj.bind(null, req),
                getUsers.bind(),
                findSchoolDetails.bind(),
                getOnboardTemplate.bind(),
                buildNotificationObj.bind(),
                notificationService.sendAllNotification.bind(),
                notificationService.updateNotificationInfo.bind()
            ],
            function (err,  data) {
                if(err) {
                    logger.debugLog(req, 'Update Onboard Notifications', err);
                    events.emit('ErrorJsonResponse', req, res, err);
                } else {
                    var result = {};
                    result['message'] = message.nsa215;
                    result['data'] = data;
                    events.emit('JsonResponse', req, res, result);
                }
            }
        );

    } else {
        async.waterfall(
            [
                buildTaxanomyObj.bind(null, req),
                getUsers.bind(),
                findSchoolDetails.bind(),
                getOnboardTemplate.bind(),
                buildNotificationObj.bind(),
                notificationService.updateNotification.bind(),
                executeBatch.bind(),
            ],
            function (err, data) {
                if(err) {
                    logger.debugLog(req, 'update Onboard Notifications', err);
                    events.emit('ErrorJsonResponse', req, res, err);
                } else {
                    var result = {};
                    result['message'] = message.nsa214;
                    result['data'] = data;
                    events.emit('JsonResponse', req, res, result);
                }
            }
        );
    }
};*/

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.ONBOARD, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

function throwNotificationErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.ONBOARD, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwNotificationErr = throwNotificationErr;
