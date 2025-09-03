/**
 * Created by Kiranmai A on 3/4/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger');

exports.getRepeatOptions = function(req, res) {
    nsaCassandra.Scheduler.getRepeatOptions(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2001));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.SCHEDULER_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;