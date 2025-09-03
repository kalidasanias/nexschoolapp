/**
 * Created by bharatkumarr on 05/06/17.
 */

var async = require('async')
    , nsaCassandra = require('@nsa/nsa-cassandra')
    , smsService = require('@nsa/nsa-notification').SMSService
    , pushService = require('@nsa/nsa-notification').PushNotificationService
    , emailService = require('@nsa/nsa-notification').EmailService
    , serviceUtils = require('@nsa/nsa-commons').serviceUtils
    , logger = require('../../config/logger');

function sendAllNotification(req, notificationObj, callback) {
    async.parallel({
        sms: smsNotification.bind(null, req, notificationObj),
        push: pushNotification.bind(null, req, notificationObj),
        email: emailNotification.bind(null, req, notificationObj)
    }, function(err, result) {
        if (err) {
            logger.debug('sendAllNotification Err ', err);
        }
        callback(err, req, notificationObj);
    });
};
exports.sendAllNotification = sendAllNotification;

function smsNotification(req, notificationObj, callback) {
    if(notificationObj.notify.sms) {
        async.waterfall([
            findLimit.bind(null, req, notificationObj),
            checkSmsLimit.bind()
        ], function(err, result) {
            if (err ) {
                logger.debug('sms limit check error ', err);
            }
            if(result) {
                async.waterfall(
                    [
                        getSenderIds.bind(null, req, notificationObj),
                        serviceUtils.buildSMSObj.bind(),
                        getSMSConfigObj.bind(),
                        smsService.sendSMS.bind(),
                    ],
                    function (err,  data) {
                        if(err) {
                            logger.debug('SMS Notification err ', err);
                        } else {
                            // logger.debug('SMS Notification Sent ', data);
                        }
                        callback(err, data)
                    }
                );
            } else {
                logger.debug('SMS Notification failed as limit reached ');
                notificationObj.smsObj = false;
                callback(err, notificationObj.smsObj);
            }
        });
    } else {
        callback(null, false)
    }

};
exports.smsNotification = smsNotification;

function findLimit(req, notificationObj, callback) {
    if(notificationObj.notify.sms) {
        nsaCassandra.MediaUsageLimit.findLimit(req, 1, function(err, result) {
            if (err) {
                logger.debug('find SMS limit ', err);
            }
            callback(err, req, notificationObj, result);
        })
    } else {
        callback(null, req, notificationObj, null);
    }

};
exports.findLimit = findLimit;

function checkSmsLimit(req, notificationObj, media, callback) {
    if(notificationObj.notify.sms) {
        nsaCassandra.MediaUsageLimit.checkSmsLimit(req, 1, notificationObj, media, function(err, result) {
            if (err) {
                logger.debug('Check SMS limit ', err);
            }
            callback(err, result);
        })
    }
};
exports.checkSmsLimit = checkSmsLimit;

function getSenderIds(req, notificationObj, callback) {
    nsaCassandra.Template.getAllSenderIds(req, 1, function(err, senderIds) {
        if (err) {
            logger.debug('Get Sender Id ', err);
        }
        callback(err, req, notificationObj, senderIds);
    })
};
exports.getSenderIds = getSenderIds;

function getSMSConfigObj(notificationObj, callback) {
    // TODO : below code method and contentType to be moved to common constants
    notificationObj.configObj = {smsUrl: global.config.sms.valueLeaf.url, method: 'POST', contentType: 'Application/json'}
    callback(null, notificationObj);
};
exports.getSMSConfigObj = getSMSConfigObj;

function pushNotification(req, notificationObj, callback) {
    notificationObj.notifiedStudents = notificationObj.users;
    if(notificationObj.notify.push) {
        async.waterfall(
            [
                serviceUtils.buildPushObj.bind(null, req, notificationObj),
                pushService.pushNotification.bind()
            ],
            function (err,  data) {
                if (err) {
                    logger.debug('Push Notification ', err);
                } else {
                    // logger.debug('Push Notification Sent ');
                }
                callback(err, data);
            }
        );
    } else {
        callback(null, false)
    }
};
exports.pushNotification = pushNotification;

function emailNotification(req, notificationObj, callback) {
    if(notificationObj.notify.email) {
        async.waterfall(
            [
                emailService.sendEmail.bind(null, req)
            ],
            function (err,  data) {
                if (err) {
                    logger.debug('Email Notification ', err);
                }
                callback(err, data);
            }
        );
    } else {
        callback(null, false)
    }
};
exports.emailNotification = emailNotification;