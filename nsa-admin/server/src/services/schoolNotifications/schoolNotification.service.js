/**
 * Created by Kiranmai A on 1/6/2017.
 */

var express = require('express')
    , constants = require('../../common/constants/constants')
    , models = require('../../models');

const dataBaseUrl = '../../test/json-data/';

exports.saveSchoolNotifications = function(res, schoolNotification, cb) {
    schoolNotification.save(function (err, result) {
        console.log('err', err);
        if (err) {
            return res.status(constants.HTTP_BAD_REQUEST).send({ success: false, data: "Could not save data in school_notifications"});
        } else {
            cb(true);
        }
    });
};


exports.updateSchoolNotifications = function(res, queryObject, updateValues, filterParam , cb) {
    console.log('update');
    console.log('queryObject', queryObject);
    console.log('updateValues', updateValues);
    console.log('filterParam', filterParam);
    models.instance.SchoolNotifications.update(queryObject, updateValues, filterParam, function(err, result){
        console.log("error ",err);
        if(err) {
            return res.status(constants.HTTP_FORBIDDEN).send({success: false, data: "Update failed"});
        } else {
            cb(true);
            /*res.status(constants.HTTP_CREATED).send({success: true, data: "Draft Updated Successfully"});*/
        }
    });
};