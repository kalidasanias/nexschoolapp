/**
 * Created by Kiranmai A on 3/14/2017.
 */


var express = require('express'),
    baseService = require('../common/base.service'),
    constants = require('../../common/constants/constants'),
    models = require('../../models'),
    _ = require('lodash'),
    attendanceConverter = require('../../converters/attendance.converter'),
    nsaCommons = require('@nsa/nsa-commons'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    dateUtils = require('@nsa/nsa-commons').dateUtils,
    logger = require('../../../config/logger');

var Attendance = function f(options) {
    var self = this;
};

Attendance.getAttendanceForClsByDate = function(req, callback) {
    var findQuery = getHeaders(req);
    var params = req.params;
    var classId = params.classId;
    var sectionId = params.sectionId;
    if (classId != null && classId != 'undefined' && sectionId != null && sectionId != 'undefined') {
        findQuery.class_id = models.uuidFromString(classId);
        findQuery.section_id = models.uuidFromString(sectionId);
        var date = params.date;
        date = date.replace("%20", "");
        var formatDate = baseService.getFormattedDate(date); 
        findQuery.attendance_date = formatDate;
        models.instance.SchoolAttendance.find(findQuery, {allow_filtering : true}, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, []);
    }
};

//TODO : cancelled value false have to refactor
Attendance.getLeaveHistoryByDate = function(req, callback) {
    var findQuery = getHeaders(req);
    var date = req.params.date;
    date = date.replace("%20", "");
    var formatDate = baseService.getFormattedDate(date);
    findQuery.from_date = { '$lte':  formatDate};
    findQuery.to_date = {'$gte': formatDate};
    findQuery.is_cancelled = false;
    models.instance.SchoolLeaveHistoryDetails.find(findQuery, {allow_filtering : true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, attendanceConverter.leaveHistoryObj(req, formattedResult));
    });
};

Attendance.constructStudentInfoListsObj = function(req, data, callback) {
        callback(null, attendanceConverter.studentInfoListsObjs(req, data));
};

Attendance.getAttendanceLists = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.ATTENDANCE_INFO_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.ATTENDANCE_INFO_PERMISSIONS);
        var queryParam = req.query;
        var startDate = queryParam.startDate;
        var endDate = queryParam.endDate;
        if(startDate != null &&  !(_.isEmpty(startDate)) && endDate != null && !(_.isEmpty(endDate))) {
            findQuery.attendance_date = {'$gte' : startDate, '$lte' : endDate};
        }
        models.instance.SchoolAttendance.find(findQuery, {allow_filtering : true}, function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, attendanceConverter.attendanceObjs(req, formattedResult));
        });
    } else {
        callback(null, []);
    }
};

Attendance.getDetailsByAttendanceId = function(req, callback) {
    var attendanceId = req.params.id;
    var findQuery = getHeaders(req);
    findQuery.attendance_id = models.uuidFromString(attendanceId);

    models.instance.SchoolAttendanceDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, attendanceConverter.assignmentDetailObjs(req, formattedResult));
    });
};

Attendance.getDetailsByUserId = function(req, callback) {
    var attendanceId = req.params.id;
    var findQuery = getHeaders(req);
    findQuery.user_name = attendanceId;
    findQuery.is_present = false;

    models.instance.SchoolAttendanceDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, attendanceConverter.assignmentDetailObjs(req, formattedResult));
    });
};

Attendance.getDetailsMobileByUserId = function(req, callback) {
    var attendanceId = req.params.id;
    var findQuery = getHeaders(req);
    findQuery.user_name = attendanceId;
    models.instance.SchoolAttendanceDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, attendanceConverter.assignmentDetailObjs(req, formattedResult));
    });
};

Attendance.getAttendanceDetailsByUserId = function(req, data, callback) {
    var userId = req.params.id;
    var findQuery = getHeaders(req);
    var startDate = data.academicYear.start_date;
    findQuery.user_name = userId;
    findQuery.attendance_date = {'$gte' : new Date(startDate), '$lte' : new Date()};

    models.instance.SchoolAttendanceDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, attendanceConverter.assignmentDetailObjs(req, formattedResult));
    });
};

Attendance.saveLeaveDetails = function(req, data, callback) {

    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var academicYear = headers.academic_year;
        var leaveHistoryId = models.uuid();
        var fromDate = baseService.getFormattedDate(body.fromDate);
        var toDate = baseService.getFormattedDate(body.toDate);
        var isCancelled = false;
        var noOfDays = nsaCommons.dateUtils.getNoOfDays(fromDate, toDate);
        var weekEndCount = nsaCommons.dateUtils.calculateWeekendDays(fromDate, toDate);
        var leaveCount = noOfDays - weekEndCount;
        var reason = body.reason;
        var updatedBy = headers.user_id;
        var updatedDate = new Date();
        var userName = headers.user_id;
        

        var leaveObj = new models.instance.SchoolLeaveHistoryDetails({
            leave_history_id: leaveHistoryId,
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year : academicYear,
            from_date: baseService.getFormattedDate(body.fromDate),
            is_cancelled: isCancelled,
            leaves_count: leaveCount,
            reason: reason,
            to_date: baseService.getFormattedDate(body.toDate),
            updated_by: updatedBy,
            updated_date: updatedDate,
            user_name: userName,
            created_date: updatedDate,
            created_by: updatedBy,
            created_firstname: userName
            
        });
        var attendanceObject = leaveObj.save({return_query: true});

        var array = [attendanceObject];
        data.leave_history_id = leaveObj.leave_history_id;
        data.batchObj = array;
        callback(null, data);
    } catch(err) {
        callback(err, data);
    }

};

Attendance.updateLeaveDetails = function(req, callback) {

    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var leaveHistoryId = models.uuidFromString(req.params.id);
    var queryObject = {leave_history_id: leaveHistoryId, tenant_id: tenantId, school_id: schoolId, academic_year: academicYear};
    var updateValues = {
        is_cancelled: true,
        cancelled_date: baseService.getFormattedDate(body.cancelledDate),
        reason: body.reason,
        updated_by: headers.user_id,
        updated_date: new Date()
    };
    models.instance.SchoolLeaveHistoryDetails.update(queryObject, updateValues, function (err, result){
        callback(err, result);
    });
};


Attendance.getUserLeaveHistory = function(req, callback) {
    var findQuery = getHeaders(req);
    var userId = req.params.id;
    var date = new Date();
    findQuery.updated_by = userId;
    findQuery.from_date = { '$lte':  date};
    findQuery.to_date = {'$lte': date};
    models.instance.SchoolLeaveHistoryDetails.find(findQuery, {allow_filtering : true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, attendanceConverter.leaveHistoryObj(req, formattedResult));
    });
};

Attendance.getDetailsByClassAndSec = function(req, data, callback) {
    var queryParam = req.query;
    var classId = queryParam.classId;
    var sectionId = queryParam.sectionId;
    var startDate = queryParam.startDate;
    var endDate = queryParam.endDate;
    var currentDate = new Date();

    var findQuery = getHeaders(req);

    if(classId != null && !(_.isEmpty(classId))) {
        findQuery.class_id = models.uuidFromString(classId);
    }
    if(sectionId != null && !(_.isEmpty(sectionId))) {
        findQuery.section_id = models.uuidFromString(sectionId);
    }
    if(startDate != null &&  !(_.isEmpty(startDate)) && endDate != null && !(_.isEmpty(endDate))) {
        startDate = baseService.getFormattedDate(startDate);
        endDate = baseService.getFormattedDate(endDate);
        findQuery.attendance_date = {'$gte' : startDate, '$lte' : endDate};
    } else {
        startDate = data.academicYear.start_date;
        endDate = currentDate;
        findQuery.attendance_date = {'$gte' : new Date(startDate), '$lte' : endDate};
    }
    if (endDate > currentDate ) {
        endDate =  currentDate;
    } else {
        endDate = endDate;
    }
    var totalDuration = nsaCommons.dateUtils.getNoOfDays(startDate, endDate);
    data.totalDuration = totalDuration;
    models.instance.SchoolAttendanceDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        data.attendanceDetails = attendanceConverter.assignmentDetailObjs(req, formattedResult);
        callback(err, data);
    });
};


Attendance.getDetailsByClassAndSecPrintProgressCard = function(req, data, callback) {
    var queryParam = req.query;
    var classId = queryParam.classId;
    var sectionId = queryParam.sectionId;
    var startDate = queryParam.startDate;
    var endDate = queryParam.endDate;
    var currentDate = new Date();

    var findQuery = getHeaders(req);

    if(classId != null && !(_.isEmpty(classId))) {
        findQuery.class_id = models.uuidFromString(classId);
    }
    if(sectionId != null && !(_.isEmpty(sectionId))) {
        findQuery.section_id = models.uuidFromString(sectionId);
    }
    if(startDate != null &&  !(_.isEmpty(startDate)) && endDate != null && !(_.isEmpty(endDate))) {
        findQuery.attendance_date = {'$gte' : startDate, '$lte' : endDate};
    } else {
        startDate = data.academicYear.start_date;
        endDate = currentDate;
        findQuery.attendance_date = {'$gte' : new Date(startDate), '$lte' : endDate};
    }
    if (endDate > currentDate ) {
        endDate =  currentDate;
    } else {
        endDate = endDate;
    }
    var totalDuration = nsaCommons.dateUtils.getNoOfDays(startDate, endDate);
    data.totalDuration = totalDuration;
    models.instance.SchoolAttendanceDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        data.attendanceDetails = attendanceConverter.assignmentDetailObjs(req, formattedResult);
        callback(err, data);
    });
};

Attendance.getAttendanceHistoryObjs = function (data, callback) {
    try {
        var attendanceHistoryObjs = [];
        var user = {};
        var users =_.groupBy(data.attendanceDetails, 'userName');
        if(!(_.isEmpty(users))) {
            _.forEach(users, function(value) {
                user = value[0];
                var present = _.filter(value, ['isPresent', true]);
                var absent = _.filter(value, ['isPresent', false]);
                var totalDays = present.length + absent.length;
                user['present'] = present.length;
                user['absent'] = absent.length;
                user['totalDays'] = present.length + absent.length;
                user['percent'] = ((present.length/totalDays) * 100).toFixed(2);
                attendanceHistoryObjs.push(user);
            });
        }
        callback(null, attendanceHistoryObjs);
    } catch(err) {
        callback(err, null);
    }
};

Attendance.getAttendanceHistoryOverviewObjs = function (data, callback) {
    try {
        var attendanceHistoryObjs = [];
        var attendanceHistoryOverviewObj = {};
        var totalStudents = 0;   //total no of students
        var totalPresentPercent = 0; // total students precent percent
        var avgPrecentPercent = 0;  // avg percent percent of students
        var workingDays = 0;  // total no of working days within the duration selected
        var user = {};
        var users =_.groupBy(data.attendanceDetails, 'userName');
        if(!(_.isEmpty(users))) {
            _.forEach(users, function(value) {
                user = value[0];
                var present = _.filter(value, ['isPresent', true]);
                var absent = _.filter(value, ['isPresent', false]);
                var totalDays = present.length + absent.length;
                user['present'] = present.length;
                user['absent'] = absent.length;
                user['totalDays'] = totalDays;
                var studentPresentPercent = ((present.length/totalDays) * 100).toFixed(2);
                user['percent'] = studentPresentPercent;
                attendanceHistoryObjs.push(user);

                totalStudents = attendanceHistoryObjs.length;
                workingDays = totalDays;
                totalPresentPercent = totalPresentPercent + Number(studentPresentPercent);
                avgPrecentPercent = totalPresentPercent / totalStudents;
                attendanceHistoryOverviewObj.avgPrecentPercent = avgPrecentPercent.toFixed(2);
                attendanceHistoryOverviewObj.avgAbsentPercent = (100 - avgPrecentPercent).toFixed(2);
            });
        }
        var leaveDays = data.totalDuration - workingDays;
        attendanceHistoryOverviewObj.workingDays = workingDays;
        attendanceHistoryOverviewObj.leaveDays = leaveDays;
        var result = {};
        result.attendanceHistoryOverview = attendanceHistoryOverviewObj;
        callback(null, result);
    } catch(err) {
        callback(err, null);
    }
};

Attendance.getAttendanceByMonthOfYear = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryParams = req.query;
    var monthNo = queryParams.monthNo;  // Ex: 17
    var year = queryParams.year;   //Ex: 2017
    var dates = dateUtils.getDatesByMonthOfYear(monthNo, year);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        attendance_date: {'$gte' : dates.startDate, '$lte' : dates.endDate},
        user_name: (req.params.id) ? req.params.id : headers.user_id
    };
    models.instance.SchoolAttendanceDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, attendanceConverter.assignmentDetailObjs(req, formattedResult));
    });
};

function getHeaders(req) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year
    };
    return findQuery;
};
exports.getHeaders = getHeaders;

module.exports = Attendance;
