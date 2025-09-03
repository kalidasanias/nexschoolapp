/**
 * Created by kiranmai on 9/5/17.
 */


var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger');

exports.getSchoolGradeDetails = function(req, res) {
    nsaCassandra.Grades.getSchoolGradeDetails(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa18401));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.GRADE_DETAILS, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;