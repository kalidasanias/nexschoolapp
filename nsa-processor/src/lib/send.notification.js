/**
 * Created by bharatkumarr on 12/07/17.
 */

var nsaCassandra = require('@nsa/nsa-cassandra')
    , _ = require('lodash')
    , async = require('async')
    , nsaCommons = require('@nsa/nsa-commons')
    , nsabb = require('@nsa/nsa-bodybuilder').builderutil
    , nsaElasticSearch = require('@nsa/nsa-elasticsearch')
    , constant = require('@nsa/nsa-commons').constants
    , logger = require('../../config/logger')
    , notifyUser = require('./notify.user.js');


function sendNotification(preparationData, school_id, users, params, callback) {
    if (preparationData.transportNotify[school_id] === undefined) {
        logger.debug('Notification Channel not found for ', school_id);
        return;
    }

    var data = {}, notificationObj = {}, mediaName = []; //school_id = vehicleInfo.school_id;//school.substr(0, school.indexOf(':SMP'));
    data.userNames = users;

    notificationObj['notify'] = preparationData.transportNotify[school_id].notify;
    notificationObj['notifyTo'] =  {status: 'Sent'};
    notificationObj['canSendNotification'] = true;
    if (notificationObj.notify.sms) {
        mediaName.push("sms");
    }
    if (notificationObj.notify.push) {
        mediaName.push("push");
    }
    notificationObj['mediaName'] = mediaName;

    // logger.debug(school_id+' schoolDetails ...',preparationData.schoolDetails[school_id]);
    notificationObj['schoolDetails'] = preparationData.schoolDetails[school_id];
    var templates = preparationData.transportTemplate[school_id];

    var req = { body: {object_id: params.routeId}, headers: { id: nsaCommons.constants.LIVETRACKING, userInfo: { school_id: templates.school_id, tenant_id: templates.tenant_id, user_name: 'nsa-processor', first_name: 'processor' } } };

    getTemplate(templates, params, function(err, templates){
        notificationObj['smsTemplate'] = templates.smsTemplate || null;
        notificationObj['emailTemplate'] = templates.emailTemplate || null;
        notificationObj['pushTemplate'] = templates.pushTemplate || null;
    });

    // logger.debug('Going to fetch Student details ...');
    var searchParams = nsabb.usersByListsQuery(data);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, result, status) {
        notificationObj['users'] = result;
        notifyUser.sendAllNotification(req, notificationObj, function(err, result) {
            logger.debug('Notification send to the users are ', users);
            saveNotificationInfo(req, notificationObj, function (err, result) {
                // logger.debug('Save Notification ', result);
                if (err) {
                    logger.debug('Save Notification Error ', err);
                }
                callback(err, result);
            })
            if (err) {
                logger.debug('Notification Sent Error ', err);
            }
            // logger.debug('Notification Sent ', result);
        });
    });
}
exports.sendNotification = sendNotification;

function saveNotificationInfo(req, notificationObj, callback) {
    async.waterfall(
        [
            constructNotificationObj.bind(null, req, notificationObj),
            constructMediaUsageLogObj.bind(),
            findLimit.bind(),
            updateMediaLimitObj.bind(),
            insertAuditLog.bind(),
            executeBatch.bind(),
        ],
        function (err, result) {
            if (err) {
                logger.debug('saveNotificationInfo err', err);
                callback(err, null)
            } else {
                updateNotificationInES(req, result, function (err, result) {
                    if (err) {
                        logger.debug('saveNotificationInfo ES err', err);
                    }
                    callback(err, result)
                })
            }
        }
    );
};
exports.saveNotificationInfo = saveNotificationInfo;

function updateNotificationInES(req, data, callback) {
    var notifyObjs = data.esNotificationObj;
    var notifyDetailObjs = data.esNotificationDetailObjs;
    async.parallel({
        notificationObjs : nsaCassandra.UserJson.buildNotificationObj.bind(null, req, notifyObjs),
        notificationDetailsObjs : nsaCassandra.UserJson.buildNotificationDetailObjs.bind(null, req, notifyDetailObjs)
    }, function (err, result) {
        var bulkParams = _.concat(result.notificationObjs, result.notificationDetailsObjs);
        var array = _.chunk(bulkParams, constant.ES_CHUNK_SIZE);
        async.times(array.length, function(i, next) {
            var objs = array[i];
            updateBulkObjs(objs, function(err, result) {
                if (err) {
                    logger.debug('saveNotificationInfo update bulk ES err ', err);
                }
                next(err, result);
            });
        }, function(err, objs) {
            if (err) {
                logger.debug('saveNotificationInfo all bulk ES err ', err);
            }
            callback(err, data);
        });
    })
};
exports.updateNotificationInES = updateNotificationInES;

function updateBulkObjs(bulkParams, callback) {
    nsaElasticSearch.index.bulkDoc({body: bulkParams}, function (err, result) {
        callback(err, result);
    });
};

function findLimit(req, notificationObj, callback) {
    if(notificationObj.notify.sms) {
        nsaCassandra.MediaUsageLimit.findLimit(req, 1, function(err, result) {
            callback(err, req, notificationObj, result);
        })
    } else {
        callback(null, req, notificationObj, null);
    }

};
exports.findLimit = findLimit;

function constructMediaUsageLogObj(req, notificationObj, callback) {
    nsaCassandra.Base.mediabase.constructMediaUsageLogObj(req, notificationObj, function(err, data) {
        callback(err, req, data);
    })
};
exports.constructMediaUsageLogObj = constructMediaUsageLogObj;

function constructNotificationObj(req, notificationObj, callback) {
    nsaCassandra.Base.notificationbase.constructNotificationObj(req, notificationObj, function(err, data) {
        data.features = {featureId : constant.NOTIFICATION, actions : constant.CREATE, featureTypeId : notificationObj.notification_id};
        callback(err, req, data);
    })
};
exports.constructNotificationObj = constructNotificationObj;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
};
exports.executeBatch = executeBatch;

function updateMediaLimitObj(req, notificationObj, media, callback) {
    if(media != null) {
        nsaCassandra.Base.mediabase.updateMediaLimitObj(req, notificationObj, media, function(err, data) {
            callback(err, req, data);
        })
    } else {
        callback(null, req, notificationObj);
    }

};
exports.updateMediaLimitObj = updateMediaLimitObj;

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.insertAuditLog = insertAuditLog;


function getTemplate(templates, params, callback) {
    try {
        var templateObj = {};
        var smsTemplateMsg = nsaCommons.serviceUtils.getFormattedString(templates.sms_template_message, params);
        var emailTemplateMsg = nsaCommons.serviceUtils.getFormattedString(templates.email_template_message, params);
        var pushTemplateMsg = nsaCommons.serviceUtils.getFormattedString(templates.push_template_message, params);
        var smsTemplate = {};
        var emailTemplate = {};
        var pushTemplate = {};
        smsTemplate.title = templates.sms_template_title;
        smsTemplate.templateName = smsTemplateMsg;
        smsTemplate.templateTitle = templates.sms_template_title;
        emailTemplate.templateName = emailTemplateMsg;
        emailTemplate.templateTitle = templates.email_template_title;
        pushTemplate.templateName = pushTemplateMsg;
        pushTemplate.templateTitle = templates.push_template_title;
        templateObj.smsTemplate = smsTemplate;
        templateObj.emailTemplate = emailTemplate;
        templateObj.pushTemplate = pushTemplate;
        callback(null, templateObj);
    } catch (err) {
        callback(err, null);
    }
}
exports.getTemplate = getTemplate;