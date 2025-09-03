/**
 * Created by Kiranmai A on 3/15/2017.
 */

var baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    dateService = require('../utils/date.service'),
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    LeaveHistoryDomain = require('../common/domains/LeaveHistory'),
    AttendanceDomain = require('../common/domains/Attendance'),
    AttendanceDetailsDomain = require('../common/domains/AttendanceDetails'),
    logger = require('../../../../../config/logger');

exports.leaveHistoryObj = function(req, data) {
    var convertLeaveHistoryObjs = [];
    if(_.isEmpty(data)) {
        convertLeaveHistoryObj = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function(value, key) {
                var convertLeaveHistoryObj = Object.assign({}, LeaveHistoryDomain);
                    convertLeaveHistoryObj.id= value['leave_history_id'],
                    convertLeaveHistoryObj.tenantId= value['tenant_id'],
                    convertLeaveHistoryObj.schoolId= value['school_id'],
                    convertLeaveHistoryObj.academicYear= value['academic_year'],
                    convertLeaveHistoryObj.userName= value['user_name'],
                    convertLeaveHistoryObj.userType= value['user_type'],
                    convertLeaveHistoryObj.fromDate= value['from_date'],
                    convertLeaveHistoryObj.toDate= value['to_date'],
                    convertLeaveHistoryObj.leavesCount= value['leaves_count'],
                    convertLeaveHistoryObj.isCancelled= value['is_cancelled'],
                    convertLeaveHistoryObj.cancelledDate= value['cancelled_date'],
                    convertLeaveHistoryObj.reason= value['reason'],
                    convertLeaveHistoryObj.updatedBy= value['updated_by'],
                    convertLeaveHistoryObj.updatedDate= value['updated_date']
                convertLeaveHistoryObjs.push(convertLeaveHistoryObj);
            });
        }
        catch (err) {
            logger.debug(err);
            return buildErrResponse(err, message.nsa2801);
        }
    }
    return convertLeaveHistoryObjs;
};

exports.studentInfoListsObjs = function(req, data) {
    var users = data.usersByClassAndSection.hits.hits;
    var leaveUsers = data.leaveHistoryByDate;
    var attendanceDetailObjs = [];
    try {
        _.forEach(users, function(value, key) {
            var userObj = value._source;
            var absentUser = _.find(leaveUsers , ['userName', userObj.user_name]);
            var attendanceDetailObj = Object.assign({}, AttendanceDetailsDomain);
                attendanceDetailObj.id= '',
                attendanceDetailObj.tenantId= userObj['tenant_id'],
                attendanceDetailObj.schoolId= userObj['school_id'],
                attendanceDetailObj.academicYear= userObj['academic_year'],
                attendanceDetailObj.attendanceId= '',
                attendanceDetailObj.mediaName= '',
                attendanceDetailObj.userName= userObj['user_name'],
                attendanceDetailObj.admissionNo= userObj['user_code'],
                attendanceDetailObj.firstName= userObj['first_name'],
                attendanceDetailObj.primaryPhone = userObj['primary_phone'],
                attendanceDetailObj.deviceToken = userObj['device_token'],
                attendanceDetailObj.classes= userObj.classes,
             	attendanceDetailObj.isPresent= ((absentUser != undefined) ? false : true),
                attendanceDetailObj.attendanceDate= '',
                attendanceDetailObj.recordedDate= '',
                attendanceDetailObj.recordedBy= '',
                attendanceDetailObj.recordedUsername= '',
                attendanceDetailObj.updatedBy= '',
                attendanceDetailObj.updatedDate= '',
                attendanceDetailObj.updatedUsername= '',
                attendanceDetailObj.remarks= ((absentUser != undefined) ? absentUser.reason : ''),
                attendanceDetailObj.isHostel=userObj['is_hostel'],
                attendanceDetailObjs.push(attendanceDetailObj);
        });
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa2801);
    }
    return _.orderBy(attendanceDetailObjs, ['firstName'],['asc']);
};

exports.attendanceObjs = function(req, data) {
    var attendanceObjs = [];
    if(_.isEmpty(data)) {
        attendanceObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function(value, key) {
                var attendanceObj = Object.assign({}, AttendanceDomain);
                var attendanceDate = dateService.getFormattedDateWithoutTime(value['attendance_date']);
                    attendanceObj.id= value['attendance_id'],
                    attendanceObj.tenantId= value['tenant_id'],
                    attendanceObj.schoolId= value['school_id'],
                    attendanceObj.academicYear= value['academic_year'],
                    attendanceObj.mediaName= value['media_name'],
                    attendanceObj.classId= value['class_id'],
                    attendanceObj.className= value['class_name'],
                    attendanceObj.sectionId= value['section_id'],
                    attendanceObj.sectionName= value['section_name'],
                    attendanceObj.totalStrength= value['total_strength'],
                    attendanceObj.noOfPresent= value['no_of_present'],
                    attendanceObj.noOfAbsent= value['no_of_absent'],
                    attendanceObj.presentPercent= value['present_percent'],
                    attendanceObj.attendanceDate= attendanceDate,
                    attendanceObj.recordedDate= value['recorded_date'],
                    attendanceObj.recordedBy= value['recorded_by'],
                    attendanceObj.recordedUsername= value['recorded_username'],
                    attendanceObj.updatedBy= value['updated_by'],
                    attendanceObj.updatedDate= value['updated_date'],
                    attendanceObj.updatedUserName= value['updated_username'],
                    attendanceObj.editPermissions = baseService.havePermissionsToEdit(req, constant.ATTENDANCE_INFO_PERMISSIONS, value['created_by']);
                    attendanceObjs.push(attendanceObj);
            });
        }
        catch (err) {
            logger.debug(err);
            return buildErrResponse(err, message.nsa2801);
        }
    }
    return attendanceObjs;
};

exports.assignmentDetailObjs = function(req, data) {
    var assignmentDetailObjs = [];
    if(_.isEmpty(data)) {
        assignmentDetailObjs = assignmentDetailObjs;
    } else {
        try {
            _.forEach(data, function(value, key) {
                var attendanceDetailObj = Object.assign({}, AttendanceDetailsDomain);
                var attendanceDate = dateService.getFormattedDateWithoutTime(value['attendance_date']);
                    attendanceDetailObj.id= value['attendance_detail_id'],
                    attendanceDetailObj.tenantId= value['tenant_id'],
                    attendanceDetailObj.schoolId= value['school_id'],
                    attendanceDetailObj.academicYear= value['academic_year'],
                    attendanceDetailObj.attendanceId= value['attendance_id'],
                    attendanceDetailObj.mediaName= value['media_name'],
                    attendanceDetailObj.userName= value['user_name'],
                    attendanceDetailObj.admissionNo= value['admission_no'],
                    attendanceDetailObj.firstName= value['first_name'],
                    attendanceDetailObj.classId= value['class_id'],
                    attendanceDetailObj.className= value['class_name'],
                    attendanceDetailObj.sectionId= value['section_id'],
                    attendanceDetailObj.sectionName= value['section_name'],
                    attendanceDetailObj.isPresent= value['is_present'],
                    attendanceDetailObj.attendanceDate= attendanceDate,
                    attendanceDetailObj.recordedDate= dateService.getFormattedDate(value['recorded_date']),
                    attendanceDetailObj.recordedBy= value['recorded_by'],
                    attendanceDetailObj.recordedUsername= value['recorded_username'],
                    attendanceDetailObj.updatedBy= value['updated_by'],
                    attendanceDetailObj.updatedDate= value['updated_date'],
                    attendanceDetailObj.updatedUsername= value['updated_username'],
                    attendanceDetailObj.remarks= value['remarks'],
                        attendanceDetailObj.isHostel= value['is_hostel'],

                    assignmentDetailObjs.push(attendanceDetailObj);
            });
        }
        catch (err) {
            logger.debug(err);
            return buildErrResponse(err, message.nsa2801);
        }
    }
    return _.orderBy(assignmentDetailObjs, ['firstName'],['asc']);
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.ATTENDANCE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;

function throwConverterErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.ATTENDANCE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwConverterErr = throwConverterErr;