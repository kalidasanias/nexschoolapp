/**
 * Created by bharatkumarr on 20/03/17.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    constant = require('@nsa/nsa-commons').constants,
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    logger = require('../../../config/logger');

exports.getAllLeaveTypes = function(req, res) {
    nsaCassandra.LeaveType.getAllLeaveTypes(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa6007));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};



exports.getLeaveType = function (req, res) {
    nsaCassandra.LeaveType.findLeaveTypeInAssignLeave(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            nsaCassandra.LeaveType.getLeaveType(req, function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa6007));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    })
};



/*exports.getLeaveType = function (req, res) {

    nsaCassandra.LeaveType.getLeaveType(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa6007));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};*/

exports.saveLeaveType = function(req, res) {
    nsaCassandra.LeaveType.saveLeaveType(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa6002));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.updateLeaveType = function(req, res) {
    nsaCassandra.LeaveType.updateLeaveType(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa6004));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.deleteLeaveType = function(req, res) {
    nsaCassandra.LeaveType.findLeaveTypeInAssignLeave(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            nsaCassandra.LeaveType.deleteLeaveType(req, function(err, response) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa6006));
                } else {
                    events.emit('JsonResponse', req, res, response);
                }
            })
        }
    });
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.LEAVE_TYPE, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

function throwUserErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.LEAVE_TYPE, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwUserErr = throwUserErr;