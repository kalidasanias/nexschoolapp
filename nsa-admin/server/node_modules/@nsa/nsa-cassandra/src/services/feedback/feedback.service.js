/**
 * Created by praga on 7/26/2017.
 */


var express = require('express'),
    baseService = require('../common/base.service'),
    constants = require('../../common/constants/constants'),
    models = require('../../models'),
    _ = require('lodash'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants;

var FeedBackDetails = function f(options) {
    var self = this;
};

FeedBackDetails.saveFeedBackDetails = function (req, callback) {
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var userName = headers.user_id;
    var currentDate = new Date();

    var feedBackDetails = new models.instance.SchoolFeedBackDetails({
        feedback_id: models.uuid(),
        tenant_id: tenantId,
        school_id: schoolId,
        feedback_desc: body.feedback_desc,
        first_name: body.first_name,
        updated_date: currentDate,
        updated_by: userName,
        updated_username: userName,
        class_id: models.uuidFromString(body.class_id),
        class_name: body.class_name,
        section_id: models.uuidFromString(body.section_id),
        section_name: body.section_name,
        feature_id: body.feature_id ? models.uuidFromString(body.feature_id) : null,
        feature_name: body.feature_name ? body.feature_name : null
    });

        feedBackDetails.save(function(err, result){
            callback(err, result);
        });
};

FeedBackDetails.getFeedBackDetails = function(req, callback) {

    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };

    models.instance.SchoolFeedBackDetails.find(findQuery, {allow_filtering: true},
        function(err, result){
            if (err) {
                callback(err, null)
            } else {
                baseService.sendDateFormatedResult(_.orderBy(result, ['updated_date'], ['desc']), constants.UPDATED_DATE, function(data) {
                    callback(null, data);
                })
            }
        });
};


module.exports = FeedBackDetails;