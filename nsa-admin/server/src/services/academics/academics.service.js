/**
 * Created by Kiranmai A on 3/17/2017.
 */

var events = require('@nsa/nsa-commons').events,
    nsaCassandra = require('@nsa/nsa-cassandra'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger');

exports.getAcademicYearDetails = function(req, res) {
    nsaCassandra.Academics.getAcademicYearDetails(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa3001));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

function executeBatch(req, data, callback) {
    console.info('data.batchObj..',data.batchObj);
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
}
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.ACADEMIC_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;