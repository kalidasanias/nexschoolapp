/**
 * Created by Kiranmai A on 1/19/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger');

exports.getClasses = function(req, res) {
    nsaCassandra.Classes.getClasses(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2201));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.getActiveClasses = function(req, res) {
    nsaCassandra.Classes.getActiveClasses(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2201));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.getClassByClassId = function(req, res) {
    nsaCassandra.Classes.getClassByClassId(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2201));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.updateClassStatus = function(req, res) {
    nsaCassandra.Section.getSecByClass(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2203));
        }else if(!_.isEmpty(result) && !result.classId){
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        }else {
            async.waterfall([
                updateClassDetails.bind(null, req),
                getClassTaxanomy.bind(),
                updateClassTaxanomy.bind(),
                executeBatch.bind()
            ], function (err, result) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2203));
                } else {
                    result['message'] = message.nsa2202;
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    })
};

function updateClassTaxanomy(req, data, callback) {
    nsaCassandra.Classes.updateClassTaxanomy(req, data, function (err, result) {
        callback(err, req, result);
    })
};
exports.updateClassTaxanomy = updateClassTaxanomy;

function getClassTaxanomy(req, data, callback) {
    nsaCassandra.Classes.getClassTaxanomy(req, data, function(err, result){
        callback(err, req, result);
    })
};
exports.getClassTaxanomy = getClassTaxanomy;

function updateClassDetails(req, callback) {
    nsaCassandra.Classes.updateClassStatus(req, function(err, result) {
        callback(err, req, result);
    });
};
exports.updateClassDetails = updateClassDetails;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, result);
    })
};
exports.executeBatch = executeBatch;

exports.getAllClassAndSections = function (req, res) {
    nsaCassandra.Classes.getAllClassAndSections(req, function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2401));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

function buildErrResponse(err, message) {
   return responseBuilder.buildResponse(constant.CLASS_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

function throwClassErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.CLASS_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwClassErr = throwClassErr;