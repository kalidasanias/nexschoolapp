/**
 * Created by Sai Deepak on 01-Feb-17.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    BaseError = require('@nsa/nsa-commons').BaseError,
    logger = require('../../../config/logger');

exports.getAllCategories = function(req, res) {
    nsaCassandra.Taxanomy.getAllCategories(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse((err, message.nsa8001)));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getDeptCategories = function(req, res) {
    deptCategories(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse((err, message.nsa8001)));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

function deptCategories(req, callback) {
    nsaCassandra.Taxanomy.getDeptCategories(req, function(err, response) {
        callback(err, response)
    })
}
exports.deptCategories = deptCategories;

exports.getTwoLevelCategories = function(req, res) {
    nsaCassandra.Taxanomy.getTwoLevelCategories(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse((err, message.nsa8001)));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getLevelCategories = function(req, res) {
    nsaCassandra.Taxanomy.getLevelCategories(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse((err, message.nsa8001)));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.TAXANOMY_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
}
exports.buildErrResponse = buildErrResponse;

function throwNotificationErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.TAXANOMY_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwNotificationErr = throwNotificationErr;
