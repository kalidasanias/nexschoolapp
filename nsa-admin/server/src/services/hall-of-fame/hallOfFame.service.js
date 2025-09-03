/**
 * Created by intellishine on 9/12/2017.
 */
var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../common/logging'),
    _ = require('lodash'),
    notificationService = require('../sms/notifications/notification.service');

exports.getAllAwards = function(req, res) {
    try {
        nsaCassandra.HallOFFame.getAllAwards(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get All Award', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21000));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get All Award', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21000));
    }
};

exports.getAllHallOfFames = function(req, res) {
    try {
        nsaCassandra.HallOFFame.getAllHallOfFames(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get All Hall Of Fames', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21000));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get All Hall Of Fames', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21000));
    }
};

exports.getPublishHallOfFame = function(req, res) {
    try {
        nsaCassandra.HallOFFame.getPublishHallOfFame(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get Publish Hall Of Fames', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21000));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Publish Hall Of Fames', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21000));
    }
};

exports.getHallOfFameById = function(req, res) {
    try {
        nsaCassandra.HallOFFame.getHallOfFameById(req,function (err, result){
            if(err) {
                logger.debugLog(req, 'Get Hall Of Fame By Id', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa10001));
            } else {
                events.emit('JsonResponse', req, res,  result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Hall Of Fame By Id', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21000));
    }
};

exports.getHallOfDetailsById = function(req, res) {
    try {
        nsaCassandra.HallOFFame.getHallOfDetails(req,function (err, result){
            if(err) {
                logger.debugLog(req, 'Get Hall Of Fame Details By Id', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa10001));
            } else {
                events.emit('JsonResponse', req, res,  result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Hall Of Fame Details By Id', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21000));
    }
};

exports.saveHallOfFame  = function (req, res) {
    try {
        nsaCassandra.HallOFFame.findUserInExistHallOfFame(req, function(err, result){
            var status = req.body.status;
            if(err){
                logger.debugLog(req, 'Save Hall Of Fame Err ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21001));
            }else if(!_.isEmpty(result) && !status){
                events.emit('ErrorJsonResponse', req, res,  {message: message.nsa21007.replace('%s', result)});
            }else {
                var data = {};
                async.waterfall(
                    [
                        constructHallOfFameObjs.bind(null, req, data),
                        deleteHallOfFameDetailsObjs.bind(),
                        constructHallOfFameDetailsObjs.bind(),
                        insertAuditLog.bind(),
                        executeBatch.bind(),
                    ],
                    function (err, req, result) {
                        if (err) {
                            logger.debugLog(req, 'Save Hall Of Fame Err ', err);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21001));
                        } else {
                            if(status == true){
                                result['students'] = req.body.students;
                                sendNotification(req, result, function(err1, result1){
                                    if(err1) {
                                        logger.debugLog(req, 'Save Hall Of Fame Err ', err);
                                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa21001));
                                    } else {
                                        events.emit('JsonResponse', req, res, {message: message.nsa21002});
                                    }
                                })
                            }else {
                                events.emit('JsonResponse', req, res, {message: message.nsa21002});
                            }

                        }
                    }
                );
            }
        })

    } catch (err) {
        logger.debugLog(req, 'Save Hall Of Fame Err ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21001));
    }
};

function sendNotification(req, data, callback) {
    async.waterfall([
        getHallOfFameTemplate.bind(null, req, data),
        getHallOfFameTemplateObject.bind(),
        buildFeatureNotificationObj.bind(),
        notificationService.sendAllNotification.bind(),
        notificationService.saveNotificationInfo.bind()
    ],function (err, data) {
        callback(err, data);
    })
};
exports.sendNotification = sendNotification;

function getHallOfFameTemplate(req, users, callback) {
    var data = {featureId : constant.ACTIVITIES, subFeatureId: constant.HALL_OF_FAME, action: constant.CREATE_ACTION, userType: constant.STUDENT};
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getHallOfFameTemplate = getHallOfFameTemplate;

function getHallOfFameTemplateObject(req, users, templates, callback) {
    nsaCassandra.HallOFFame.getHallOfFameTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getHallOfFameTemplateObject = getHallOfFameTemplateObject;

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        notificationObj.isDetailedNotification = true;
        notificationObj.replacementKeys = [constant.FIRST_NAME];
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;

function constructHallOfFameObjs(req, data, callback) {
    nsaCassandra.HallOFFame.constructHallOfFameObj(req, data, function(err, result) {
        result.features = {actions: constant.CREATE, featureTypeId: result.id};
        callback(err, req, result);
    })
};
exports.constructHallOfFameObjs = constructHallOfFameObjs;

function constructHallOfFameDetailsObjs(req, data, callback) {
    nsaCassandra.HallOFFame.constructHallOfFameDetailsObj(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.constructHallOfFameDetailsObjs = constructHallOfFameDetailsObjs;

function deleteHallOfFameDetailsObjs(req, data, callback) {
    nsaCassandra.HallOFFame.deleteHallOfFameDetailsObj(req, data, function(err, result) {
        callback(err, req, result);
    });
};
exports.deleteHallOfFameDetailsObjs = deleteHallOfFameDetailsObjs;

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err ,req, data);
    })
};


exports.deleteHallOfFame = function(req, res) {
    try {
        var data = {};
        async.waterfall(
            [
                deleteHallOfFameDetailsObjs.bind(null, req, data),
                deleteHallOfFames.bind(),
                insertAuditLog.bind(),
                executeBatch.bind(),
            ],function(err, req, data){
                if(err){
                    logger.debugLog(req, 'Delete Hall Of Fame Err ', err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21005));
                }else {
                    events.emit('JsonResponse', req, res, {message: message.nsa21006});
                }
            })
    } catch (err) {
        logger.debugLog(req, 'Delete Hall Of Fame Err ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21005));
    }
};

function deleteHallOfFames(req, data, callback){
    nsaCassandra.HallOFFame.deleteHallOfFame(req, data, function (err, result) {
        result.features = {actions : constant.DELETE, featureTypeId : models.uuidFromString(req.params.id)};
        callback(err, req, result);
    })
}

exports.getHallOfFameByUserName = function(req, res) {
    try {
        nsaCassandra.HallOFFame.getHallOfFameByUserName(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get All Hall Of Fames By UserName', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21000));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get All Hall Of Fames By UserName', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa21000));
    }
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constants.HALLOFFAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;