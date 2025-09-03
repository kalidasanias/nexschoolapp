/**
 * Created by senthil on 2/23/2017.
 */
var express = require('express')
    , request = require('request')

'use strict';

var SMS = function f(options) {
    var self = this;
};

SMS.sendSMS = function(notificationObj, callback) {
    if(notificationObj.canSendNotification) {
        var configObj = notificationObj.configObj;
        request({
            url: configObj.smsUrl, //URL to hit
            method: configObj.method,
            json: notificationObj.smsObj,
            headers: {
                'Content-Type': configObj.contentType
            }
        }, function (error, response, body) {
            notificationObj.smsResponse = body
            if (error) {
                callback(error, notificationObj)
            } else {
                callback(null, notificationObj)
            }
        });

    } else {
        notificationObj.smsResponseObj =  {
            "status": "OK",
            "data": {
                "0": {
                    "id": "4532301239-1",
                    "customid": "",
                    "customid1": "",
                    "customid2": "",
                    "mobile": "9003248824",
                    "status": "AWAITED-DLR"
                },
                "1": {
                    "id": "4532301239-2",
                    "customid": "",
                    "customid1": "",
                    "customid2": "",
                    "mobile": "9751959531",
                    "status": "AWAITED-DLR"
                },
                "group_id": 4532301239
            },
            "message": "Campaign of 2 numbers Submitted successfully."
        }
        callback(null, notificationObj)
    }

}

SMS.sendOTP = function (notificationObj, callback) {
    var configObj = notificationObj.configObj;
    request({
        url: configObj.smsUrl, //URL to hit
        method: configObj.method,
        json: notificationObj.smsObj,
        headers: {
            'Content-Type': configObj.contentType
        }
    }, function (error, response, body) {
        if (error) {
            callback(error, notificationObj)
        } else {
            notificationObj.smsResponse = body;
            callback(null, notificationObj)
        }

    });
}

SMS.checkStatus = function (req, notificationObj, callback) {
    var configObj = notificationObj.configObj;
    request({
        url: configObj.statusUrl + req.params.id, //URL to hit
        method: configObj.method,
        headers: {
            'Content-Type': configObj.contentType
        }
    }, function (error, response, body) {
        if (error) {
            callback(error, body)
        } else {
            callback(null, body)
        }

    });
}

SMS.checkGroupStatus = function (req, notificationObj, callback) {
    var configObj = notificationObj.configObj;
    request({
        url: configObj.groupStatusUrl + req.params.id, //URL to hit
        method: configObj.method,
        headers: {
            'Content-Type': configObj.contentType
        }
    }, function (error, response, body) {
        if (error) {
            callback(error, body)
        } else {
            callback(null, body)
        }

    });
}

module.exports = SMS;