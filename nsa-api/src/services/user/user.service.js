/**
 * Created by karthik on 05-01-2017.
 */

var express = require('express')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , models = require('../../models')
    ,  passwordHash = require('password-hash');
//const dataBaseUrl = '../../test/json-data/';

exports.getUserDetails = function(req, res) {
    var headers = baseService.getHeaders(req);
    var userId = req.params.id;
    models.instance.UserDetails.find({ user_id: userId, tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)},{allow_filtering: true}, function(err, result){
        if(result) {
            res.status(constants.HTTP_OK).send({success: true, data: result});
        } else {
            res.status(constants.HTTP_NO_CONTENT).send({success: false, data: err});
        }
    });
};

exports.fetchContacts = function(res, roleId, tenant_id, school_id, recepients, messageCount, cb) {
    var findQuery;
    var roleName;
    var notifiedList = [];
    var notifiedPhoneNumbers = [];
    var phoneNumbers = [];
    var usedCount;

    if (!roleId == "") {
        if (roleId == 0) {
            findQuery = {role_id: {'$token': {'$gt': 1}}, tenant_id: tenant_id, school_id: school_id};
            roleName = "All";
        } else {
            findQuery = {role_id: parseInt(roleId), tenant_id: tenant_id, school_id: school_id};
        }

        models.instance.UserByRole.find(findQuery, {allow_filtering: true}, function (err, result) {

            if (JSON.stringify(result) != '[]' && !err) {
                if (roleId != 0) {
                    roleName = result[0].role_name;
                }

                for (var i = 0; i < result.length; i++) {
                    phoneNumbers[i] = result[i].primary_phone;
                }

                var array = recepients.length === 0 ? [] : recepients.toString().split(",");

                notifiedList.push(roleName);  //To store notification type in school_notifications table
                notifiedPhoneNumbers = notifiedPhoneNumbers.concat(array); // to store entered mobile numbers in school_notifications table
                phoneNumbers = phoneNumbers.concat(array);
                usedCount = phoneNumbers.length * messageCount;
                recepients = phoneNumbers.toString() + ',';
                cb(phoneNumbers,  notifiedList, notifiedPhoneNumbers, recepients, usedCount);
            } else {
                return res.status(constants.HTTP_FORBIDDEN).send({success: false, data: "Could not fetch contacts"});
            }
        });
    } else {
        phoneNumbers = recepients.toString().split(",");
        notifiedPhoneNumbers = phoneNumbers; // to store entered mobile numbers in school_notifications table
        usedCount = phoneNumbers.length * messageCount;
        recepients = recepients.toString() + ',';
        cb(phoneNumbers,  notifiedList, notifiedPhoneNumbers, recepients, usedCount);
    }
};

exports.saveUser = function(req, res) {

    var userDetails = baseService.getUserFromRequestBody(req, res);

    userDetails.save(function (err, result) {
        if (result) {
            res.status(constants.HTTP_OK).send({
                status: baseService.getSuccessStatus(req, res, "Successfully Saved")});
        } else {
            console.info('err = ', err);
            return res.status(constants.HTTP_OK).send({status : baseService.getFailureStatus(req, res, constants.HTTP_BAD_REQUEST, "Could not save user!!!")});
        }
    });
};

exports.updateUser = function(req, res) {
    var count = 0;
    var username = req.body.username;
    var user = req.body.user;

    for(var i=0; i<user.length; i++) {
        if(user[i].id != null) {
            var queryObject = ({id: models.uuidFromString(user[i].id), user_name: user[i].username});
            var updateValue = ({registration_id: user[i].registrationId, endpoint_arn: user[i].endpointARN});
            models.instance.User.update(queryObject, updateValue, function (err, result) {
                if (err) {
                    saved = false;
                    count++;
                } else {
                    saved = true;
                    count++;
                }

                if(count == user.length) {
                    console.log(count);
                    if(saved) {
                        return res.status(constants.HTTP_OK).send({status: true, message: "update successfull"});
                    } else {
                        return res.status(constants.HTTP_BAD_REQUEST).send({status: false, message: "update failed"});
                    }
                }
            });
        }
    }
}
