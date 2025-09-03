/**
 * Created by Kiranmai A on 3/3/2017.
 */

var baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    dateService = require('../utils/date.service'),
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    Department = require('../common/domains/Department'),
    Designation = require('../common/domains/Designation'),
    LeaveType = require('../common/domains/LeaveType'),
    LeaveAssign = require('../common/domains/LeaveAssign'),
    logger = require('../../../../../config/logger');

exports.convertDeptObjs = function(req, data) {
    var deptObjs = [];
    try {
        data.forEach(function (value) {
            deptObjs.push(convertDepartment(req, value));
        });
    }
    catch (err) {
        logger.debug(err);
        return responseBuilder.buildResponse(constant.DEPARTMENT, constant.APP_TYPE, message.nsa4007, err.message, constant.HTTP_BAD_REQUEST);
    }
    return deptObjs;
};

function convertDepartment(req, data) {
    var departmentObj = {};
    if(_.isEmpty(data)) {
        departmentObj = baseService.emptyResponse();
    } else {
        departmentObj = Object.assign({}, Department);
        try {
            var updatedDate = dateService.getFormattedDate(data['updated_date']);
            departmentObj.dept_id= data['dept_id'];
            departmentObj.dept_name= data['dept_name'];
            departmentObj.dept_alias= data['dept_alias'];
            departmentObj.updated_by= data['updated_by'];
            departmentObj.updated_username= data['updated_username'];
            departmentObj.editPermissions = baseService.havePermissionsToEdit(req, constant.DEPARTMENT_PERMISSIONS, data['created_by']);
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.DEPARTMENT, constant.APP_TYPE, message.nsa4007, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return departmentObj;
};
exports.convertDepartment = convertDepartment;

exports.convertDesgObjs = function(req, data) {
    var desgObjs = [];
    try {
        data.forEach(function (value) {
            desgObjs.push(convertDesignation(req, value));
        });
    }
    catch (err) {
        logger.debug(err);
        return responseBuilder.buildResponse(constant.DESIGNATION, constant.APP_TYPE, message.nsa4017, err.message, constant.HTTP_BAD_REQUEST);
    }
    return desgObjs;
};

function convertDesignation(req, data) {

    var designationObj = {};
    if(_.isEmpty(data)) {
        designationObj = baseService.emptyResponse();
    } else {
        designationObj = Object.assign({}, Designation);
        try {
            var updatedDate = dateService.getFormattedDate(data['updated_date']);
            designationObj.desg_id= data['desg_id'];
            designationObj.desg_name= data['desg_name'];
            designationObj.desg_alias= data['desg_alias'];
            designationObj.updated_by= data['updated_by'];
            designationObj.updated_username= data['updated_username'];
            designationObj.editPermissions = baseService.havePermissionsToEdit(req, constant.DESIGNATION_PERMISSIONS, data['created_by']);
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.DESIGNATION, constant.APP_TYPE, message.nsa4017, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return designationObj;
};
exports.convertDesignation = convertDesignation;

exports.convertUser = function(req, data) {

    var userObj = {};
    if(_.isEmpty(data)) {
        userObj = baseService.emptyResponse();
    } else {
        userObj = Object.assign({}, Designation);
        try {
            var updatedDate = dateService.getFormattedDate(data['updated_date']);
            userObj.user_name= data['user_name'];
            userObj.name= data['name'];
            userObj.user_type = data['user_type'];
            userObj.admission_date = data['admission_date'];
            userObj.admission_no = data['admission_no'];
            userObj.emp_id = data['emp_id'];
            userObj.date_of_joining = data['date_of_joining'];
            userObj.roles = data['roles'];
            userObj.primary_phone= data['primary_phone'];
            userObj.email= data['email'];
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.EMPLOYEE, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return userObj;
};

exports.convertUserDetails = function(req, data) {

    var userObj = {};
    if(_.isEmpty(data)) {
        userObj = baseService.emptyResponse();
    } else {
        userObj = Object.assign({}, Designation);
        try {
            var updatedDate = dateService.getFormattedDate(data['updated_date']);
            userObj.user_name= data['user_name'];
            userObj.blood_group= data['blood_group'];
            userObj.date_of_birth = data['date_of_birth'];
            userObj.first_name = data['first_name'];
            userObj.middle_name = data['middle_name'];
            userObj.last_name = data['last_name'];
            userObj.gender = data['gender'];
            userObj.nationality = data['nationality'];
            userObj.profile_picture= data['profile_picture'];
            userObj.title= data['title'];
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.EMPLOYEE, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return userObj;
};

exports.convertLeaveTypeObjs = function(req, data) {
    var leaveTyeObjs = [];
    if(_.isEmpty(data)) {
        leaveTyeObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function(value, key) {
                var leaveTypeObj = convertLeaveTypeObj(req, value);
                leaveTyeObjs.push(leaveTypeObj);
            });
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.CLASS_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return leaveTyeObjs;
};

function convertLeaveTypeObj(req, data) {
    var leaveTypeObj = {};
    if(_.isEmpty(data)) {
        leaveTypeObj = baseService.emptyResponse();
    } else {
        leaveTypeObj = Object.assign({}, LeaveType);
        try {
            var updatedDate = dateService.getFormattedDate(data['updated_date']);
            leaveTypeObj.leave_type_id= data['leave_type_id'] || 0;
            leaveTypeObj.leave_type_name= data['leave_type_name'] || '';
            leaveTypeObj.days= data['days'] || 0;
            leaveTypeObj.description= data['description'] || '';
            leaveTypeObj.updated_by= data['updated_by'] || '';
            leaveTypeObj.updated_name= data['updated_username'] || '';
            leaveTypeObj.editPermissions = baseService.havePermissionsToEdit(req, constant.LEAVE_TYPE_PERMISSIONS, data['created_by']);
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.LEAVE_TYPE, constant.APP_TYPE, message.nsa6018, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return leaveTypeObj;
};
exports.convertLeaveTypeObj = convertLeaveTypeObj;

exports.convertLeaveAsignObjs = function(req, data) {
    var assignLeaveObjs = [];
    try {
        if(!_.isEmpty(data)) {
            data.forEach(function (value) {
                assignLeaveObjs.push(convertLeaveAssignObj(req, value));
            });
        }
    }
    catch (err) {
        logger.debug(err);
        return responseBuilder.buildResponse(constant.LEAVES_NAME, constant.APP_TYPE, message.nsa2810, err.message, constant.HTTP_BAD_REQUEST);
    }
    return assignLeaveObjs;
};

function convertLeaveAssignObj(req, val) {
    var leaveObj = {};
    if(_.isEmpty(val)) {
        leaveObj = baseService.emptyResponse();
    } else {
        try {
                leaveObj = Object.assign({}, LeaveAssign);
                var updatedDate = dateService.getFormattedDate(val['updated_date']);
                leaveObj.id= val['id'];
                leaveObj.emp_id= val['emp_id'];
                leaveObj.emp_username= val['emp_username'];
                leaveObj.reporting_emp_id= val['reporting_emp_id'];
                leaveObj.reporting_emp_username= val['reporting_emp_username'];
                leaveObj.dept_id= val['dept_id'];
                leaveObj.desg_id= val['desg_id'];
                leaveObj.leave_type_id= val['leave_type_id'];
                leaveObj.leave_type_name= val['leave_type_name'];
                leaveObj.no_of_leaves= val['no_of_leaves'];
                leaveObj.updated_date= updatedDate;
                leaveObj.updated_by= val['updated_by'];
                leaveObj.updated_name= val['updated_username'];
                leaveObj.editPermissions = baseService.havePermissionsToEdit(req, constant.LEAVE_ASSIGN_PERMISSIONS, val['created_by']);

        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.LEAVE_ASSIGN, constant.APP_TYPE, message.nsa6018, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return leaveObj;
};
exports.convertLeaveAssignObj = convertLeaveAssignObj;


exports.convertUserObj = function (user) {
    var userObj = {};
    try {
        if(!_.isEmpty(user)) {
            var attachmentsObj = baseService.getFormattedMap(user['attachments']);
            if(!_.isEmpty(attachmentsObj)) {
                _.forEach(attachmentsObj, function(val){
                    var fileName = val.id.split('/');
                    val['fileName'] = fileName[2];
                })
            }
            userObj.id = user['id'];
            userObj.tenant_id = user['tenant_id'];
            userObj.school_id = user['school_id'];
            userObj.school_name = user['school_name'];
            userObj.user_name = user['user_name'];
            userObj.user_code = user['user_code'];
            userObj.short_name = user['short_name'];
            userObj.date_of_joining = user['date_of_joining'];
            userObj.device_token = user['device_token'];
            userObj.device_id = user['device_id'];
            userObj.password = user['password'];
            userObj.user_type = user['user_type'];
            userObj.name = user['name'];
            userObj.email = user['email'];
            userObj.primary_phone = user['primary_phone'];
            userObj.roles = baseService.getFormattedMap(user['roles']);
            userObj.blood_group = user['blood_group'];
            userObj.first_name = user['first_name'];
            userObj.last_name = user['last_name'];
            userObj.middle_name = user['middle_name'];
            userObj.gender = user['gender'];
            userObj.date_of_birth = user['date_of_birth'];
            userObj.place_of_birth = user['place_of_birth'];
            userObj.nationality = user['nationality'];
            userObj.community = user['community'];
            userObj.mother_tongue = user['mother_tongue'];
            userObj.is_hostel = user['is_hostel'];
            userObj.profile_picture = user['profile_picture'];
            userObj.title = user['title'];
            userObj.created_date = user['created_date'];
            userObj.updated_date = user['updated_date'];
            userObj.active = user['active'];
            userObj.transport_required = user['transport_required'];
            userObj.medical_info = user['medical_info'];
            userObj.height = user['height'];
            userObj.weight = user['weight'];
            userObj.attachments = attachmentsObj;
        }

    }
    catch (err) {
        logger.debug(err);
        return responseBuilder.buildResponse(constant.USER_NAME, constant.APP_TYPE, message.nsa4821, err.message, constant.HTTP_BAD_REQUEST);
    }
    return userObj;
};
