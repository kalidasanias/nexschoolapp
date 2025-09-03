/**
 * Created by Kiranmai A on 1/6/2017.
 */
var express = require('express')
    , request = require('request')
    , constants = require('../../common/constants/constants');

exports.sendSms = function(req, res, value, title, message, senderId, cb) {
    request({
        url: constants.SMS_URL, //URL to hit
        qs: {
            username: constants.SMS_USER_NAME, to: "'" + value + "'", from: senderId,
            message: message,
            seckey: constants.SMS_SEC_KEY
        },
        method: constants.METHOD_POST,
        headers: {
            'Content-Type': constants.CONTENT_TYPE
        }
    }, function (error, response, body) {
        if (error) {
            cb(false);
        } else {
            cb(true);
        }
    });
};