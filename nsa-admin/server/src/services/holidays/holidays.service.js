var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    notificationService = require('../sms/notifications/notification.service'),
    es = require('../search/elasticsearch/elasticsearch.service'),
    async = require('async'),
    logger = require('../../../config/logger'),
    _ = require("lodash");



exports.getHolidaysTypes = function(req, res){
    nsaCassandra.Holiday.getHolidaysTypes(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4201));
        }else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};
exports.getHolidayTypeById = function(req, res){
    nsaCassandra.Holiday.getHolidayTypeById(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4202));
        }else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.saveHolidayType = function(req, res){
    nsaCassandra.Holiday.saveHolidayType(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4204));
        } else {
            result['message'] = message.nsa4203;
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.updateHolidayType = function(req, res){
    nsaCassandra.Holiday.updateHolidayType(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4206));
        } else {
            result['message'] = message.nsa4205;
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.deleteHolidayType = function(req, res){
    nsaCassandra.Holiday.findHolidayTypeInHolidays(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            nsaCassandra.Holiday.deleteHolidayType(req, function(err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4208));
                } else {
                    result['message'] = message.nsa4207;
                    events.emit('JsonResponse', req, res, result);
                }
            });
        }
    });
};

/*
*
* schoolholdiays */

exports.getAllSchoolHolidays = function(req, res){
    nsaCassandra.Holiday.getAllSchoolHolidays(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4401));
        }else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};
exports.getSchoolHolidayById = function(req, res){
    nsaCassandra.Holiday.getSchoolHolidayById(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4402));
        }else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.saveSchoolHoliday = function(req, res){
    async.waterfall([
        saveSchoolHolidays.bind(null, req),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, result){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4404));
        } else {
            /*events.emit('JsonResponse', req, res, message.nsa4403);*/
            if(req.body.status) {
                sendNotification(req, function(err1, data){
                    if(err1) {
                        logger.debug(err1);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4404));
                    } else {
                        events.emit('JsonResponse', req, res, {message: message.nsa4403});
                    }
                })
            } else {
                events.emit('JsonResponse', req, res, {message : message.nsa4403});
            }
        }
    });
};

function sendNotification(req, callback) {
    var data = [];
    async.waterfall([
            buildUsers.bind(null, req),
            getFeatureTemplate.bind(),
            getTemplateObj.bind(),
            buildFeatureNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind()
        ],function (err, data) {
            callback(err, data);
    })
};
exports.sendNotification = sendNotification;

function buildUsers(req, callback) {
    var users = [];
    req.body.notifyTo.userType = 'Employee';
    async.parallel({
        emp: es.getActiveEmployees.bind(null, req),
        student: es.getActiveStudents.bind(null, req)
    }, function(err, result) {
        users = _.concat(users, result.emp, result.student);
        users['users'] = users;
        callback(err, req, users);
    });
};
exports.buildUsers = buildUsers;

function getFeatureTemplate(req, users, callback) {
    var data = {featureId : constant.HOLIDAYS, subFeatureId: constant.CREATE_HOLIDAYS, action: constant.CREATE_ACTION, userType: constant.STUDENT};
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getFeatureTemplate = getFeatureTemplate;

function getTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.holidaybase.getTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getTemplateObj = getTemplateObj;

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;


function saveSchoolHolidays(req, callback) {
    nsaCassandra.Holiday.saveSchoolHoliday(req, function(err, result) {
        result.features = {featureId : constant.HOLIDAYS, actions : constant.CREATE, featureTypeId : result.holiday_id};
        callback(err, req, result);
    });
};
exports.saveSchoolHolidays = saveSchoolHolidays;

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.insertAuditLog = insertAuditLog;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, result);
    })
};
exports.executeBatch = executeBatch;

exports.updateSchoolHoliday = function(req, res){
    async.waterfall([
        updateSchoolHoliday.bind(null, req),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, result){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4406));
        } else {
            if(req.body.status) {
                sendUpdateNotification(req, function(err, data){
                    if(err) {
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4406));
                    } else {
                        events.emit('JsonResponse', req, res, {message: message.nsa4405});
                    }
                })
            } else {
                events.emit('JsonResponse', req, res, {message : message.nsa4405});
            }
        }
    });
};

function sendUpdateNotification(req, callback) {
    var data = [];
    async.waterfall([
        buildUsers.bind(null, req),
        getUpdateFeatureTemplate.bind(),
        getUpdateTemplateObj.bind(),
        buildFeatureNotificationObj.bind(),
        notificationService.sendAllNotification.bind(),
        notificationService.saveNotificationInfo.bind()
    ],function (err, data) {
        callback(err, data);
    })
};

function updateSchoolHoliday(req, callback) {
    nsaCassandra.Holiday.updateSchoolHoliday(req, function(err, result) {
        result.features = {featureId : constant.HOLIDAYS, actions : constant.UPDATE, featureTypeId : result.holiday_id};
        callback(err, req, result);
    });
};

function getUpdateFeatureTemplate(req, users, callback) {
    var data = {featureId : constant.HOLIDAYS, subFeatureId: constant.CREATE_HOLIDAYS, action: constant.UPDATE_ACTION, userType: constant.STUDENT};
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getUpdateFeatureTemplate = getUpdateFeatureTemplate;

function getUpdateTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.holidaybase.getUpdateTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getUpdateTemplateObj = getUpdateTemplateObj;


exports.deleteSchoolHoliday = function(req, res) {
    nsaCassandra.Holiday.deleteSchoolHoliday(req, function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4408));
        } else {
            result['message'] = message.nsa4407;
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.getSchoolWeekOff = function(req, res){
    nsaCassandra.Holiday.getSchoolWeekOff(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4201));
        }else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.saveSchoolWeekOff = function(req, res){
    async.waterfall([
        saveSchoolWeekOffDetails.bind(null, req),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, req, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4404));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa4409});
        }
    });
};

function saveSchoolWeekOffDetails(req, callback) {
    nsaCassandra.Holiday.saveSchoolWeekOff(req, function(err, result) {
        result.features = {actions : constant.CREATE, featureTypeId : result.id};
        callback(err, req, result);
    });
};

exports.updateSchoolWeekOff = function(req, res){
    async.waterfall([
        updateSchoolWeekOffDetails.bind(null, req),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, req, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4406));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa4405});
        }
    });
};

//For IOS Start
exports.getSchoolHolidays = function(req, res){
    nsaCassandra.Holiday.getSchoolHolidays(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4401));
        }else {
            events.emit('JsonResponse', req, res, convertHolidays(result));
        }
    });
};

exports.getSchoolHolidaysByMonthOfYear = function(req, res){
    nsaCassandra.Holiday.getSchoolHolidaysByMonthOfYear(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4401));
        }else {
            events.emit('JsonResponse', req, res, convertHolidays(result));
        }
    });
};

function convertHolidays(holidays) {
    var result = [];
    if(Array.isArray(holidays) && !_.isEmpty(holidays)) {
        var obj = _.groupBy(holidays, 'month');
        result = _.map(_.toPairs(obj), function (value) {
            return _.fromPairs([value]);
        });
    }
    return result;
}
exports.convertHolidays = convertHolidays;
//For IOS End

function updateSchoolWeekOffDetails(req, callback) {
    nsaCassandra.Holiday.updateSchoolWeekOff(req, function(err, result) {
        result.features = {actions : constant.CREATE, featureTypeId : result.id};
        callback(err, req, result);
    });
};

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.insertAuditLog = insertAuditLog;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, req, data);
    })
};
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    console.log("build error response")
    return responseBuilder.buildResponse(constant.HOLIDAY_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

function throwHolidaysDetailsErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.HOLIDAY_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};

exports.throwHolidaysDetailsErr = throwHolidaysDetailsErr;
