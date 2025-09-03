/**
 * Created by Anjan on 3/30/2017.
 */
var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    _ = require('lodash'),
    logger = require('../../../config/logger'),
    constant = require('@nsa/nsa-commons').constants;

exports.getAllDays = function(req, res){
    nsaCassandra.Days.getAllDays(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa3202));
        } else {
            result = _.orderBy(result,  ['id'], ['asc'])
            events.emit('JsonResponse', req, res, result);
        }
    })
}

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.DASHBOARD, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
}
exports.buildErrResponse = buildErrResponse;