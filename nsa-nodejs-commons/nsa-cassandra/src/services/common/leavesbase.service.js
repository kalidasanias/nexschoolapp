/**
 * Created by Kiranmai A on 5/25/2017.
 */

var express = require('express')
    , constants = require('../../common/constants/constants')
    , models = require('../../models/index')
    , baseService = require('./base.service')
    , message = require('@nsa/nsa-commons').messages
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , constant = require('@nsa/nsa-commons').constants
    , async = require('async')
    , templateConverter = require('../../converters/template.converter')
    , logger = require('../../../config/logger');

exports.empLeaveAppliedDetailsObj = function(req, data, callback) {
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var appliedLeaveId = models.uuid();
        var currentDate = new Date();

        var appliedLeaveObj = new models.instance.SchoolEmpLeaveAppliedDetails  ({
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id),
            academic_year : headers.academic_year,
            applied_leave_id: appliedLeaveId,
            emp_id: body.empId,
            leave_type_id: models.uuidFromString(body.leaveTypeId),
            from_date: baseService.getFormattedDate(body.fromDate),
            to_date: baseService.getFormattedDate(body.toDate),
            leaves_count: parseInt(body.leavesCount),
            leave_reason: body.leaveReason,
            reporting_emp_id: data.reporting_emp_id,
            status: body.status,
            updated_by: headers.user_id,
            updated_first_name: headers.user_name,
            created_date: currentDate,
            updated_date: currentDate,
            created_by: headers.user_id,
            created_firstname: headers.user_name
        });
        var saveObj = appliedLeaveObj.save({return_query: true});
        var array = [saveObj];
        data['applied_leave_id'] = appliedLeaveId;
        data['batchObj'] = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

exports.empLeaveAppliedLogObj = function(req, data, callback) {
    try {
        var array = data.batchObj || [];
        var body = req.body;
        var headers = baseService.getHeaders(req);

        var appliedLeaveLogsObj = new models.instance.SchoolEmpLeaveAppliedLogs  ({
            id: models.uuid(),
            applied_leave_id: data.applied_leave_id,
            media_name: [],
            status: body.status,
            reason: body.leaveReason,
            updated_by: headers.user_id,
            updated_first_name: headers.user_name,
            updated_date: new Date(),
            created_date: new Date(),
            created_by: headers.user_id,
            created_firstname: headers.user_name,

        });
        var saveObj = appliedLeaveLogsObj.save({return_query: true});
        array.push(saveObj);
        data.batchObj= array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

exports.empLeaveAppliedHistoryObj = function(req, data, callback) {
    try {
        var array = data.batchObj || [];
        var body = req.body;
        var headers = baseService.getHeaders(req);

        var leaveHistoryObj = new models.instance.SchoolEmpLeaveHistoryDetails  ({
            id: models.uuid(),
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id),
            academic_year : headers.academic_year,
            reporting_emp_id: data.reportingEmpObj.userName,
            reporting_emp_first_name: data.reportingEmpObj.firstName,
            emp_id: body.empId,
            emp_first_name: body.empFirstName,
            leave_type_id: models.uuidFromString(body.leaveTypeId),
            leave_type_name: body.leaveTypeName,
            from_date: baseService.getFormattedDate(body.fromDate),
            to_date: baseService.getFormattedDate(body.toDate),
            leaves_count: parseInt(body.leavesCount),
            status: body.status,
            reason: body.leaveReason,
            media_name: [],
            updated_by: headers.user_id,
            updated_first_name: headers.user_name,
            updated_date: new Date(),
            created_date: new Date(),
            created_by: headers.user_id,
            created_firstname: headers.user_name,
        });
        var saveObj = leaveHistoryObj.save({return_query: true});
        array.push(saveObj);
        data.batchObj= array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

exports.empEditLeaveAppliedObj = function(req, data, callback) {
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var appliedLeaveId = models.uuidFromString(req.params.id);

        var queryObject = {tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id),
            academic_year : headers.academic_year,
            applied_leave_id: appliedLeaveId};

        var updateValues =   {
            leave_type_id: models.uuidFromString(body.leaveTypeId),
            from_date: baseService.getFormattedDate(body.fromDate),
            to_date: baseService.getFormattedDate(body.toDate),
            leaves_count: parseInt(body.leavesCount),
            status: body.status,
            leave_reason: body.leaveReason,
            updated_by: headers.user_id,
            updated_first_name: headers.user_name,
            updated_date: new Date()
        };

        var updateQuery = models.instance.SchoolEmpLeaveAppliedDetails.update(queryObject, updateValues, {return_query: true});
        var array = [updateQuery];
        //data = {applied_leave_id: appliedLeaveId, batchObj: array};
        data['applied_leave_id'] = appliedLeaveId;
        data['batchObj'] = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

exports.empEditLeaveAppliedLogObj = function(req, data, callback) {
    try {
        var array = data.batchObj || [];
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var queryObj = { applied_leave_id : models.uuidFromString(req.params.id), status: body.status };

        var updateValues = {
            media_name: [],
            reason: body.leaveReason,
            updated_by: headers.user_id,
            updated_first_name: headers.user_name,
            updated_date: new Date()

        };
        var updateQuery = models.instance.SchoolEmpLeaveAppliedLogs.update(queryObj, updateValues, {return_query: true});
        array.push(updateQuery);
        data.batchObj= array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

exports.getTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var params = {staff_name: body.empFirstName, start_date: body.fromDate, end_date: body.toDate};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        callback(err, result);
    });
};

exports.getUpdateTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var params = {leave_type_name: body.leaveTypeName, start_date: body.fromDate, end_date: body.toDate};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        callback(err, result);
    });
};