/**
 * Created by karthik on 06-01-2017.
 */
var express = require('express')
    , request = require('request')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , models = require('../../models/index');

var MediaUsageLimit = function f(options) {
    var self = this;
};

MediaUsageLimit.findLimitValue = function(mediaId, cb) {
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

MediaUsageLimit.findLimit = function(req, mediaId, cb){
    var headers = baseService.getHeaders(req);
    var findQuery = {tenant_id: models.timeuuidFromString(headers.tenant_id), school_id: models.uuidFromString(headers.school_id), media_id: mediaId};
    models.instance.SchoolMediaUsageLimit.find(findQuery, {allow_filtering: true}, function (err, result) {
        if (JSON.stringify(result) != '[]' && !err) {
            cb(null, result);
        } else {
            logger.debug(err)
            cb(err, null);
        }
    });
};

MediaUsageLimit.updateExisting = function(tenant_id, school_id, mediaId, id, limitValue, used_count){

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

MediaUsageLimit.checkSmsLimit = function(req, mediaId, notificationObj, media, cb) {

    var message = notificationObj.smsTemplate.templateName;
    var messageCount = Math.ceil(message.length / 153);
    var extraUsers = _.compact(_.split(notificationObj.phoneNo, ','));
    var totalSmsCount = ((notificationObj.users.length + extraUsers.length) * messageCount);
    var usedCount = media[0].used_count ;
    var available_limit = media[0].available_limit;
    var remaining_limit = available_limit - usedCount;

    if (totalSmsCount > remaining_limit) {
        cb(null, false);  //sms limit exceeds available sms count
    } else {
        cb(null, notificationObj);
    }

};

module.exports = MediaUsageLimit;