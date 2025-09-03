/**
 * Created by Kiranmai A on 1/6/2017.
 */

var express = require('express')
    , constants = require('../../common/constants/constants')
    , models = require('../../models/index');

const dataBaseUrl = '../../test/json-data/';

exports.saveSchoolNotifications = function(res, schoolNotification, cb) {
    schoolNotification.save(function (err, result) {
        if (err) {
            return res.status(constants.HTTP_BAD_REQUEST).send({ success: false, data: "Could not save data in school_notifications"});
        } else {
            cb(true);
        }
    });
};


exports.updateSchoolNotifications = function(res, queryObject, updateValues, filterParam , cb) {
    models.instance.SchoolNotifications.update(queryObject, updateValues, filterParam, function(err, result){
        if(err) {
            return res.status(constants.HTTP_FORBIDDEN).send({success: false, data: "Update failed"});
        } else {
            cb(true);
            /*res.status(constants.HTTP_CREATED).send({success: true, data: "Draft Updated Successfully"});*/
        }
    });
};