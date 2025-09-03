/**
 * Created by praga on 7/26/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../common/logging');


exports.saveFeedBackDetails = function(req, res) {
    try {
        nsaCassandra.feedBackDetails.saveFeedBackDetails(req, function(err, result) {
            if (err) {
                logger.debugLog(req, 'Save Feedback', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa19002));
            } else {
                events.emit('JsonResponse', req, res, {message: message.nsa19001});
            }
        })
    } catch (err) {
        logger.debugLog(req, 'Save Feedback', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa19004));
    }
};
exports.getFeedBackDetails = function(req, res) {
    try {
        nsaCassandra.feedBackDetails.getFeedBackDetails(req, function (err, response) {
            if (err) {
                logger.debugLog(req, 'Get Feedback', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa19003));
            } else {
                events.emit('JsonResponse', req, res, response);
            }
        })
    } catch (err) {
        logger.debugLog(req, 'Get Feedback', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa19004));
    }
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.SCHOOL, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;
