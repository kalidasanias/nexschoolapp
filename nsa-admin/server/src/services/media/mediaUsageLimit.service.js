/**
 * Created by karthik on 06-01-2017.
 */
var express = require('express')
    , request = require('request')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , models = require('../../models/index');


exports.findLimitValue = function(mediaId, cb) {
    var limitValue = 0;
    models.instance.MediaType.find({media_id: mediaId}, {select: ['limit_value']}, function (err, result) {
        if (JSON.stringify(result) != '[]' && !err) {
            limitValue = result[0].limit_value;
            cb(limitValue)
        } else {
            cb(limitValue);
        }
    });
};

function findLimit(tenant_id, school_id, mediaId, cb){
    var findQuery = {tenant_id: tenant_id, school_id: school_id, media_id: mediaId};
    models.instance.SchoolMediaUsageLimit.find(findQuery, {allow_filtering: true}, function (err, result) {
        if (JSON.stringify(result) != '[]' && !err) {
            cb(result);
        } else {
            cb(err);
        }
    });
};
exports.findLimit = findLimit;

exports.updateExisting = function(res, tenant_id, school_id, mediaId, id, limitValue, used_count){

    var queryObject = {id:id, tenant_id: tenant_id, school_id: school_id, media_id: mediaId};
    var updateValue = { available_limit: limitValue, used_count: used_count};

    models.instance.SchoolMediaUsageLimit.update(queryObject, updateValue, function (err, result) {
        if (err) {
            res.status(constants.HTTP_BAD_REQUEST).send({success: false, data: "Could not update the database"});
        } else {
            res.status(constants.HTTP_OK).send({success: true, data: "Update successfull"});
        }
    });
};

exports.mediaUsageLimitNewEntry = function(res, schoolMediaUsageLimit){

    schoolMediaUsageLimit.save(function (err, result) {
        if (result) {
            res.status(constants.HTTP_CREATED).send({success: true, data: "New entry created successfully"});
        } else {
            res.status(constants.HTTP_FORBIDDEN).send({success: false,  data: "There was an error while creating new entry"});
        }
    });
};

exports.findSmsLimit = function(req, res, mediaId, usedCount, cb) {
    var headers = baseService.getHeaders(req);
    var tenant_id = models.timeuuidFromString(headers.tenant_id);
    var school_id = models.uuidFromString(headers.school_id);

    findLimit(tenant_id, school_id, mediaId, function (result) {
        if (result != null) {
            used_count = result[0].used_count ;
            var available_limit = result[0].available_limit;
            var remaining_limit = available_limit - used_count;
            if (usedCount > remaining_limit) {
                res.status(constants.HTTP_BAD_REQUEST).send({success: false, data: "sms count exceeds available sms count"});
            } else {
                cb(true);
            }
        } else {
            res.status(constants.HTTP_BAD_REQUEST).send({success: false, data: "can't get sms count"});
        }
    });
};