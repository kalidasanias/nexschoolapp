/**
 * Created by Kiranmai A on 2/9/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    logger = require('../../../config/logger');

exports.getSchoolTerms = function(req, res) {
    nsaCassandra.Terms.getSchoolTerms(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse((err, message.nsa801)));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.TERM_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
}
exports.buildErrResponse = buildErrResponse;