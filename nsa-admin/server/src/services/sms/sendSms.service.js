/**
 * Created by Kiranmai A on 1/6/2017.
 */
var express = require('express')
    , request = require('request')
    , constants = require('../../common/constants/constants');

exports.sendSms = function(req, res, phNosJson, senderId,  cb) {
    console.log("constants.SMS_URL", constants.SMS_URL);

    var requestData = {
        "sender":senderId,
        "message":"message text",
        "sms":[
            {
                "to": "9952990355"
            },
            {
                "to": "8248525343"
            }
        ]
    };
    console.log("Phone No sender id" , phNosJson);
    request({
        url: constants.SMS_URL, //URL to hit
        method: constants.METHOD_POST,
        json: phNosJson,
        headers: {
            'Content-Type': constants.CONTENT_TYPE
        }
    }, function (error, response, body) {
        if (error) {
            cb(false, response.body.status);
        } else {
            cb(true, response.body.status);
        }
        console.log("response -- ", response.body.status);
    });
};