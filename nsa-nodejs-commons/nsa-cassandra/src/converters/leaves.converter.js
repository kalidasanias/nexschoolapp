/**
 * Created by Kiranmai A on 5/26/2017.
 */


var baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    dateService = require('../utils/date.service'),
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../../../config/logger'),
    LeaveAssign = require('../common/domains/LeaveAssign');

exports.appliedLeaveConverterObjs = function (data) {
    var appliedLeaveObjs = [];
    try {
        data.forEach(function (value) {
            appliedLeaveObjs.push(appliedLeaveConverterObj(value));
        });
    }
    catch (err) {
        logger.debug(err);
        return responseBuilder.buildResponse(constant.LEAVES_NAME, constant.APP_TYPE, message.nsa2810, err.message, constant.HTTP_BAD_REQUEST);
    }
    return appliedLeaveObjs;
};

function appliedLeaveConverterObj(value) {
    var appliedLeaveObj = {};
    try {
        var updatedDate = dateService.getFormattedDate(value['updated_date']);
            appliedLeaveObj.appliedLeaveId= value['applied_leave_id'],
            appliedLeaveObj.tenantId= value['tenant_id'],
            appliedLeaveObj.schoolId= value['school_id'],
            appliedLeaveObj.academicYear= value['academic_year'],
            appliedLeaveObj.reportingEmpId= value['reporting_emp_id'],
            appliedLeaveObj.empId= value['emp_id'],
            appliedLeaveObj.leaveTypeId= value['leave_type_id'],
            appliedLeaveObj.fromDate= dateService.getFormattedDateWithoutTime(value['from_date']),
            appliedLeaveObj.toDate= dateService.getFormattedDateWithoutTime(value['to_date']),
            appliedLeaveObj.leavesCount= value['leaves_count'],
            appliedLeaveObj.leaveReason= value['leave_reason'],
            appliedLeaveObj.status= value['status'],
            appliedLeaveObj.requestedDate= dateService.getFormattedDate(value['created_date']),
            appliedLeaveObj.updatedDate= updatedDate,
            appliedLeaveObj.updatedBy= value['updated_by'],
            appliedLeaveObj.updatedUserName= value['updated_username'];
    }
    catch (err) {
        logger.debug(err);
        return responseBuilder.buildResponse(constant.LEAVES_NAME, constant.APP_TYPE, message.nsa2810, err.message, constant.HTTP_BAD_REQUEST);
    }
    return appliedLeaveObj;
};
exports.appliedLeaveConverterObj = appliedLeaveConverterObj;

exports.convertLeaveAssignObjs = function (data) {
    var leaveAssignObjs = [];
    try {
        data.forEach(function (value) {
            leaveAssignObjs.push(convertLeaveAssignObj(value));
        });
    }
    catch (err) {
        logger.debug(err);
        return responseBuilder.buildResponse(constant.LEAVES_NAME, constant.APP_TYPE, message.nsa2810, err.message, constant.HTTP_BAD_REQUEST);
    }
    return leaveAssignObjs;
};

function convertLeaveAssignObj(data) {
    var leaveObj = {};
    if(_.isEmpty(data)) {
        leaveObj = baseService.emptyResponse();
    } else {
        leaveObj = Object.assign({}, LeaveAssign);
        try {
            var updatedDate = dateService.getFormattedDate(data['updated_date']);
            leaveObj.id= data['id'];
            leaveObj.empId= data['emp_id'];
            leaveObj.empName= data['emp_username'];
            leaveObj.reportingEmpId= data['reporting_emp_id'];
            leaveObj.reportingEmpName= data['reporting_emp_username'];
            leaveObj.deptId= data['dept_id'];
            leaveObj.desgId= data['desg_id'];
            leaveObj.leaveTypeId= data['leave_type_id'];
            leaveObj.leaveTypeName= data['leave_type_name'];
            leaveObj.totalLeaves= data['no_of_leaves'];
            leaveObj.updatedDate= updatedDate;
            leaveObj.updatedBy= data['updated_by'];
            leaveObj.updatedName= data['updated_username'];
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.LEAVE_ASSIGN, constant.APP_TYPE, message.nsa6018, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return leaveObj;
};
exports.convertLeaveAssignObj = convertLeaveAssignObj;