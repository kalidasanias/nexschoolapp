/**
 * Created by Kiranmai A on 3/7/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants;

//For User Comments
exports.getUserComments = function (req, res) {
    nsaCassandra.Conversation.getUserComments(req, function(err, result) {
        if (err) {
            throwConversationErr(err, message.nsa2601);
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

//For Assignment Comments
exports.getFeatureComments = function (req, res) {
    nsaCassandra.Conversation.getFeatureComments(req, function(err, result) {
        if (err) {
            throwConversationErr(err, message.nsa2601);
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveUserComments = function (req, res) {
    nsaCassandra.Conversation.saveUserComments(req, function(err, result) {
        if (err) {
            throwConversationErr(err, message.nsa2603);
        } else {
            result['message'] =  message.nsa2602;
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.updateUserComments = function (req, res) {
    async.waterfall([
        userCommentsUpdate.bind(null, req),
        executeBatch.bind()
    ], function(err, result){
        if (err) {
            throwConversationErr(err, message.nsa2605);
        } else {
            result['message'] = message.nsa2604;
            events.emit('JsonResponse', req, res, result);
        }
    });
};

function userCommentsUpdate(req, callback) {
    nsaCassandra.Conversation.updateUserComments(req, function(err, result) {
       callback(err, result);
    })
};
exports.userCommentsUpdate = userCommentsUpdate;


function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, data) {
        callback(err, data);
    })
};
exports.executeBatch = executeBatch;


exports.getUnreadComments = function (req, res) {
    nsaCassandra.Conversation.getUnreadComments(req, function(err, result) {
        if (err) {
            throwConversationErr(err, message.nsa2605);
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

function throwConversationErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.CONVERSATION_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwConversationErr = throwConversationErr;