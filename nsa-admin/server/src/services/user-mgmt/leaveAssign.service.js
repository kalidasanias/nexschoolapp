/**
 * Created by bharatkumarr on 20/03/17.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    async = require('async'),
    _ = require('lodash'),
    events = require('@nsa/nsa-commons').events,
    constant = require('@nsa/nsa-commons').constants,
    message = require('@nsa/nsa-commons').messages,
    BaseError = require('@nsa/nsa-commons').BaseError,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    logger = require('../../../config/logger');

exports.getAllLeaveAssign = function(req, res) {
    nsaCassandra.LeaveAssign.getAllLeaveAssign(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa6017));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getLeaveAssign = function (req, res) {
    nsaCassandra.LeaveAssign.getLeaveAssign(req, function(err, result) {
        async.parallel({
            department: fetchDepartment.bind(null, req, result),
            designation: fetchDesignation.bind(null, req, result)
        }, function(err, concatResult) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa6018));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    })
};

exports.getLeaveAssignByName = function (req, res) {
    nsaCassandra.LeaveAssign.getLeaveAssignByName(req, function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa6018));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};


function fetchDepartment(req, obj, callback) {
    if (obj.dept_id == null || obj.dept_id == undefined) {
        callback(null, obj);
    } else {
        nsaCassandra.Department.fetchDepartment(req, obj.dept_id, function(err, result) {
            if (err) {
                callback(err, null);
            } else {
                obj.department = result;
                callback(null, result);
            }
        });
    }

}
exports.fetchDepartment = fetchDepartment;

function fetchDesignation(req, obj, callback) {
    if (obj.desg_id == null || obj.desg_id == undefined) {
        callback(null, {});
    } else {
        nsaCassandra.Designation.fetchDesignation(req, obj.desg_id, function (err, result) {
            if (err) {
                callback(err, null);
            } else {
                obj.designation = result;
                callback(null, result);
            }
        })
    }
}
exports.fetchDesignation = fetchDesignation;

exports.saveLeaveAssign = function(req, res) {
    nsaCassandra.LeaveAssign.saveLeaveAssign(req, function(err, response) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa6002));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.saveLeave = function(req, res) {
    async.waterfall([
            saveLeaveAssign.bind(null, req),
            saveReportingEmp.bind(),
            findREmpForEmp.bind(),
            updateEmpLeaveAssign.bind(),
            executeBatch.bind()
        ], function (err, data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa6014));
            } else {
                events.emit('JsonResponse', req, res, {message: message.nsa6019});
            }
        }
    );
};

function saveLeaveAssign(req, callback) {
    nsaCassandra.LeaveAssign.saveLeave(req, function(err, result){
        callback(err, req, result);
    });
};
exports.saveLeaveAssign = saveLeaveAssign;

function saveReportingEmp(req, data, callback) {
    nsaCassandra.LeaveAssign.saveReportingEmp(req, data, function(err, result){
        callback(err, req, result);
    });
};
exports.saveReportingEmp = saveReportingEmp;

function findREmpForEmp(req, data, callback) {
    nsaCassandra.LeaveAssign.findREmpForEmp(req, data, function(err, result){
        data['empObjs'] = result;
        callback(err, req, data);
    });
};
exports.findREmpForEmp = findREmpForEmp;

function updateEmpLeaveAssign(req, data, callback) {
    nsaCassandra.LeaveAssign.updateEmpLeaveAssign(req, data, function (err, result) {
        callback(err, req, result);
    })
};
exports.updateEmpLeaveAssign = updateEmpLeaveAssign;

function fetchAcademicYear(req, data, callback) {
    nsaCassandra.Academics.getAcademicYear(req, function(err, result) {
        data.academic_year = JSON.parse(JSON.stringify(result));
        callback(err, req, data);
    })
};
exports.fetchAcademicYear = fetchAcademicYear;

exports.updateLeaveAssign = function(req, res) {
    nsaCassandra.LeaveAssign.updateLeave(req, function (err1, response) {
        if (err1) {
            logger.debug(err1);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa6014));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa6019});
        }
    })
};

exports.deleteLeaveAssign = function(req, res) {
    nsaCassandra.Leaves.getLeavesByEmpAndLeaveType(req, function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa10002));
        } else {
            if(result.length > 0) {
                events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
            } else {
                fetchAcademicYear(req, {}, function (err, req, data) {
                    nsaCassandra.LeaveAssign.deleteLeave(req, data, function (err, response) {
                        if (err) {
                            logger.debug(err);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa10002));
                        } else {
                            events.emit('JsonResponse', req, res, response);
                        }
                    })
                });
            }
        }
    })
};

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
};
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.LEAVE_ASSIGN, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;