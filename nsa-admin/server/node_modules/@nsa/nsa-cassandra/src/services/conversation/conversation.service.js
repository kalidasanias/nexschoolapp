/**
 * Created by Kiranmai A on 3/8/2017.
 */

var express = require('express')
    baseService = require('../common/base.service'),
    models = require('../../models'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants;

var Conversation = function f(options) {
    var self = this;
};

Conversation.getUserComments = function(req, callback) {
    featureDetailId = models.uuidFromString(req.params.featureDetailId);
    models.instance.Conversation.find({feature_detail_id : featureDetailId}, {allow_filtering: true}, function(err, result){
        if (err) {
            callback(err, null)
        } else {
            baseService.sendDateFormatedResult(result, constants.MESSAGE_DATE, function(data) {
                callback(null, data);
            })
        }
    });
};

Conversation.getFeatureComments = function(req, callback) {
    featureId = models.uuidFromString(req.params.featureId);
    models.instance.Conversation.find({feature_id : featureId}, {allow_filtering: true}, function(err, result){
        if (err) {
            callback(err, null)
        } else {
            baseService.sendDateFormatedResult(result, constants.MESSAGE_DATE, function(data) {
                callback(null, data);
            })
        }
    });
};

Conversation.saveUserComments = function(req, callback) {
    var body = req.body;
    var featureId = models.uuidFromString(body.featureId);
    var featureDetailId = models.uuidFromString(body.featureDetailId);
    var classId = body.classId != "" ? models.uuidFromString(body.classId) : null;
    var sectionId = body.sectionId != "" ? models.uuidFromString(body.sectionId): null;
    var msgRead = body.messageRead;
    var commentObj = new models.instance.Conversation({
        conversation_id: models.uuid(),
        feature_id: featureId,
        feature_detail_id : featureDetailId,
        admission_no: body.admissionNo,
        user_name: body.userName,
        name: body.name,
        class_id: classId,
        class_name: body.className,
        section_id: sectionId,
        section_name: body.sectionName,
        message: body.message,
        message_read: JSON.parse(msgRead),
        message_date: new Date()
    });
    commentObj.save(function(err, result){
        callback(err, result);
    });
};

Conversation.updateUserComments = function(req, callback) {
    var data;
    var array = [];
    try {
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var featureDetailId = models.uuidFromString(body.featureDetailId);
        var userId = headers.user_id;
        var messageDate = new Date(body.messageDate);
        var msgRead = body.messageRead;
        var commentsArr = body.comments;
        _.forEach(commentsArr, function(value, key){
            var queryObject = { feature_detail_id:  value.featureDetailId, user_name: userId, message_date: value.messageDate};
            var updateValues = { message_read: JSON.parse(value.msgRead) };
            var commentsObj = models.instance.Conversation.update(queryObject, updateValues, {return_query: true});
            array.push(commentsObj);
        })
    } catch (err) {
        throwConversationErr(err, message.nsa2605);
    }
    data = {batchObj : array};
    callback(null, data);
};

Conversation.getUnreadComments = function(req, callback) {
    var findQuery = {feature_detail_id: featureDetailId,
        user_name: userId,
        message_read: false
    };
    models.instance.Conversation.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

function throwConversationErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.CONVERSATION_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwConversationErr = throwConversationErr;

module.exports = Conversation;