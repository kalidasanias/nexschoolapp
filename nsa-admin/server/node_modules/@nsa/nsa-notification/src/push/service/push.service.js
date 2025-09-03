/**
 * Created by senthil on 2/23/2017.
 */
'use strict';

var express = require('express'),
    request = require('request'),
    gcm = require('node-gcm')

var Push = function f(options) {
    var self = this;
};

Push.pushNotification = function(notificationObj, callback) {
    var pushObj = notificationObj.pushObj;
    var sender = new gcm.Sender(pushObj.senderId);
    sender.sendNoRetry(pushObj.message, {registrationTokens: pushObj.recipients}, function (err, response) {
        if (err) {
            callback(err, null);
        }
        else {
            notificationObj.pushResponseObj = response
            callback(null, notificationObj);
        }
    });
}

module.exports = Push;