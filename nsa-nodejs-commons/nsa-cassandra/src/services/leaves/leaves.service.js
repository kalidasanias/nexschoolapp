/**
 * Created by Kiranmai A on 5/25/2017.
 */

var baseService = require('../common/base.service'),
    models = require('../../models'),
    message = require('@nsa/nsa-commons').messages,
    constant = require('@nsa/nsa-commons').constants,
    leaveTypeDomain = require('../common/leavesbase.service'),
    logger = require('../../../config/logger'),
    leavesConverter = require('../../converters/leaves.converter');

var LeaveDetails = function f(options) {
    var self = this;
};

LeaveDetails.findReportingEmpForEmp = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var body = req.body;
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        emp_id: body.empId,
    };
    models.instance.SchoolLeaveAssign.findOne(findQuery, {allow_filtering: true}, function(err, result){
        if(err){
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

LeaveDetails.saveEmpAppliedLeaveDetails = function(req, data, callback) {
    leaveTypeDomain.empLeaveAppliedDetailsObj(req, data, function(err, result){
        callback(err, result);
    });
};

LeaveDetails.saveEmpAppliedLeaveLogs = function(req, data, callback) {
    leaveTypeDomain.empLeaveAppliedLogObj(req, data, function(err, result){
        callback(err, result);
    });
};

LeaveDetails.saveLeaveAppliedHistory = function(req, data, callback) {
    leaveTypeDomain.empLeaveAppliedHistoryObj(req, data, function(err, result){
        callback(err, result);
    });
};

LeaveDetails.editEmpAppliedLeaveDetails = function(req, data, callback) {
    leaveTypeDomain.empEditLeaveAppliedObj(req, data, function(err, result){
        callback(err, result);
    });
};

LeaveDetails.editEmpAppliedLeaveLogs = function(req, data, callback) {
    leaveTypeDomain.empEditLeaveAppliedLogObj(req, data, function(err, result){
        callback(err, result);
    });
};

/*
 LeaveDetails.editLeaveAppliedHistory = function(req, data, callback) {
 leaveTypeDomain.empLeaveAppliedHistoryObj(req, data, function(err, result){
 callback(err, result);
 });
 };
 */

LeaveDetails.leavesTakenByEmp = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var id = req.params.id;
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        emp_id: id, status: constant.APPROVED
    };
    empLeaveAppliedDetailsObjs(findQuery, function(err, result){
        if(err){
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, leavesConverter.appliedLeaveConverterObjs(result));
        }
    });
};

LeaveDetails.getTakenLeavesByEmp = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var id = req.params.id;
    var today = new Date();
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        emp_id: id, status: constant.APPROVED,
        academic_year: headers.academic_year,
        to_date:{'$lt': today}
    };
    empLeaveAppliedDetailsObjs(findQuery, function(err, result){
        if(err){
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, leavesConverter.appliedLeaveConverterObjs(result));
        }
    });
};


LeaveDetails.leavesTakenByEmployee = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var id = headers.user_id;
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        emp_id: id, status: constant.APPROVED
    };
    empLeaveAppliedDetailsObjs(findQuery, function(err, result){
        if(err){
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, leavesConverter.appliedLeaveConverterObjs(result));
        }
    });
};

LeaveDetails.getEmpAppliedLeaves = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var id = req.params.id;
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        emp_id: id
    };
    empLeaveAppliedDetailsObjs(findQuery, function(err, result){
        if(err){
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, leavesConverter.appliedLeaveConverterObjs(result));
        }
    });
};

LeaveDetails.getEmpLeavebyStatus = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var params = req.params;
    var findQuery = {
        applied_leave_id: models.uuidFromString(params.id), status: params.status
    };
    models.instance.SchoolEmpLeaveAppliedLogs.findOne(findQuery, {allow_filtering: true}, function(err, result){
        if(err){
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

LeaveDetails.getAppliedLeaveDetailsById = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var params = req.params;
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        applied_leave_id: models.uuidFromString(params.id)
    };
    models.instance.SchoolEmpLeaveAppliedDetails.findOne(findQuery, {allow_filtering: true}, function(err, result){
        if(err){
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, leavesConverter.appliedLeaveConverterObj(result));
        }
    });
};

LeaveDetails.getReqLeavesByRempId = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var params = req.params;
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        reporting_emp_id: params.id
    };
    empLeaveAppliedDetailsObjs(findQuery, function(err, result){
        if(err){
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, leavesConverter.appliedLeaveConverterObjs(result));
        }
    });
};

LeaveDetails.getEmpByRempId = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var params = req.params;
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        reporting_emp_id: params.id
    };
    models.instance.SchoolLeaveAssign.find(findQuery, {allow_filtering: true}, function(err, result){
        if(err){
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, leavesConverter.convertLeaveAssignObjs(result));
        }
    });
};

LeaveDetails.getLeavesApprovedByRemp = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var params = req.params;
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        reporting_emp_id: params.id, status: constant.APPROVED
    };
    empLeaveAppliedDetailsObjs(findQuery, function(err, result){
        if(err){
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, leavesConverter.appliedLeaveConverterObjs(result));
        }
    });
};

function empLeaveAppliedDetailsObjs(findQuery, callback) {
    models.instance.SchoolEmpLeaveAppliedDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

LeaveDetails.getLeavesByEmpAndLeaveType = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var params = req.params;
    var body = req.body;
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        emp_id: body.emp_id,
        leave_type_id: models.uuidFromString(body.leave_type_id)
    };
    empLeaveAppliedDetailsObjs(findQuery, function(err, result){
        if(err){
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, leavesConverter.appliedLeaveConverterObjs(result));
        }
    });
};

module.exports = LeaveDetails;