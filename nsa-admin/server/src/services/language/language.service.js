/**
 * Created by Kiranmai A on 2/8/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    message = require('@nsa/nsa-commons').messages,
    BaseError = require('@nsa/nsa-commons').BaseError,
    logger = require('../../../config/logger');

exports.getSchoolLanguages = function(req, res) {
    nsaCassandra.Languages.getSchoolLanguages(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1401));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.LANG_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

