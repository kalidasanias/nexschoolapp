/**
 * Created by Anjan on 3/31/2017.
 */
var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger');

exports.getAllSchoolAspects = function(req, res){
    nsaCassandra.Aspect.getAllSchoolAspects(req, function(err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
        }else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};
exports.getSchoolAspectsById = function(req, res){
    nsaCassandra.Aspect.getSchoolAspectsById(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1892));
        }else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.saveSchoolAspects = function(req, res){
    nsaCassandra.Aspect.saveSchoolAspects(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1893));
        } else {
            result['message'] = message.nsa1889;
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.updateSchoolAspects = function(req, res){
    nsaCassandra.Aspect.updateSchoolAspects(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1894));
        } else {
            result['message'] = message.nsa1898;
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.deleteSchoolAspects = function(req, res){
    nsaCassandra.Subject.findAspectIdInSubjectDetails(req, function(err, result){
        if(err){
            logger.debug('Delete Aspect ', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa1895));
        }else if(!_.isEmpty(result)){
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        }else{
            nsaCassandra.Aspect.deleteSchoolAspects(req, function(err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1895));
                } else {
                    result['message'] = message.nsa1897;
                    events.emit('JsonResponse', req, res, result);
                }
            });
        }
    })
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.NOTIFY_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;