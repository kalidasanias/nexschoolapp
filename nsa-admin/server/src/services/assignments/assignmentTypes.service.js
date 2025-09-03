/**
 * Created by Kiranmai A on 3/3/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger');

exports.getAssignmentTypes = function(req, res) {
    nsaCassandra.AssignmentTypes.getAssignmentTypes(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1201));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};



exports.getAssignmentType = function(req, res) {
    nsaCassandra.AssignmentTypes.findAssignmentTypeInAssignment(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            nsaCassandra.AssignmentTypes.getAssignmentType(req, function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1201));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    })
};



/*exports.getAssignmentType = function(req, res) {

    nsaCassandra.AssignmentTypes.getAssignmentType(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1201));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};*/

exports.saveAssignmentType = function(req, res) {
    var data = [];
    async.waterfall([
        saveAssignmentTypes.bind(null, req, data),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1203));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa1202});
        }
    });
};

exports.updateAssignmentType = function(req, res) {
    var data = [];
    nsaCassandra.AssignmentTypes.updateAssignmentType(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('JsonResponse', req, res, buildErrResponse(err, message.nsa1205));
        } else {
            data.features = {featureId : constant.ASSIGNMENT, actions : constant.UPDATE, featureTypeId : req.params.id};
            saveAuditLog(req, data, function(err1, result){
                if(err1) {
                    logger.debug(err1);
                    events.emit('JsonResponse', req, res, buildErrResponse(err1, message.nsa1205));
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa1204});
                }
            })
        }
    })
};

exports.deleteAssignmentType = function(req, res) {
    nsaCassandra.AssignmentTypes.findAssignmentTypeInAssignment(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            var data = [];
            nsaCassandra.AssignmentTypes.deleteAssignmentType(req, function(err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1207));
                } else {
                    data.features = {featureId : constant.ASSIGNMENT, actions : constant.DELETE, featureTypeId : req.params.id};
                    saveAuditLog(req, data, function(err1, result){
                        if(err1) {
                            logger.debug(err1);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa1207));
                        } else {
                            events.emit('JsonResponse', req, res, {message: message.nsa1206});
                        }
                    })
                }
            })
        }
    });
};


function saveAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveAuditLog(req, data, function(err, result) {
        callback(err, req, data);
    })
};
exports.saveAuditLog = saveAuditLog;

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.insertAuditLog = insertAuditLog;

function saveAssignmentTypes(req, data, callback) {
    nsaCassandra.AssignmentTypes.saveAssignmentType(req, data, function(err, result) {
        data.features = {featureId : constant.ASSIGNMENT, actions : constant.CREATE, featureTypeId : data.assignment_type_id};
        callback(err, req, data);
    })
};
exports.saveAssignmentTypes = saveAssignmentTypes;


function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
};
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.ASSIGNMENT_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;

function throwAssignmentErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.ASSIGNMENT_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwAssignmentErr = throwAssignmentErr;
