/**
 * Created by senthil on 3/28/2017.
 */


var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger');

exports.getFeeTransactionDetails = function(req, res) {
    nsaCassandra.FeeTransaction.getFeeTransactionDetails(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse((err, message.nsa401)));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.FEE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
}
exports.buildErrResponse = buildErrResponse;
