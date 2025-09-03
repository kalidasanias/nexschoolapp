/**
 * Created by bharatkumarr on 20/03/17.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    constant = require('@nsa/nsa-commons').constants,
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    _ = require('lodash'),
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    logger = require('../../../config/logger');

exports.getAllDesignations = function(req, res) {
    nsaCassandra.Designation.getAllDesignations(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4017));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};


/*exports.getDesignation = function (req, res) {
    nsaCassandra.UserClassify.findDesgIdInEmpClassification(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            nsaCassandra.Designation.getDesignation(req, function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4017));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    })
};*/





exports.getDesignation = function (req, res) {
    nsaCassandra.Designation.getDesignation(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4017));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveDesignation = function(req, res) {
    nsaCassandra.Designation.saveDesignation(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4012));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.updateDesignation = function(req, res) {
    nsaCassandra.Designation.updateDesignation(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4014));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.deleteDesignation = function(req,res){
    nsaCassandra.UserClassify.findDesgIdInEmpClassification(req, function(err, result){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4016));
        }  else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else{
            nsaCassandra.Designation.deleteDesignation(req, function(err, response) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4016));
                } else {
                    events.emit('JsonResponse', req, res, response);
                }
            })
        }
    })
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.DESIGNATION, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;

function throwUserErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.DESIGNATION, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwUserErr = throwUserErr;