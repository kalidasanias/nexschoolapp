/**
 * Created by Kiranmai A on 3/6/2017.
 */

var express = require('express'),
    baseService = require('../common/base.service'),
    constants = require('../../common/constants/constants'),
    models = require('../../models'),
    _ = require('lodash'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    assignmentConverter = require('../../converters/assignment.converter'),
    assignmentBase = require('../common/assignmentbase.service'),
    dateUtils = require('@nsa/nsa-commons').dateUtils,
    moment = require('moment');

var Assignments = function f(options) {
    var self = this;
};

Assignments.getAllAssignments = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.ASSIGNMENT_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.ASSIGNMENT_PERMISSIONS);
        models.instance.SchoolAssignment.find(findQuery, {allow_filtering : true}, function(err, result){
            callback(err, assignmentConverter.assignmentObjs(req,  _.sortBy(result, 'updated_date').reverse()));
        });
    } else {
        callback(null, []);
    }
};


//lists of assignmnets created by particular teacher
Assignments.getAssignmentListsByUser = function(req, callback) {
    var userId = req.params.id;
    var findQuery = getHeaders(req);
    findQuery.updated_by = userId;
    models.instance.SchoolAssignment.find(findQuery, {allow_filtering : true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, assignmentConverter.assignmentObjs(req, formattedResult));
    });
};

Assignments.getAssignment = function(req, callback) {
    var assignmentId = req.params.id;
    var findQuery = getHeaders(req);
    findQuery.assignment_id = models.uuidFromString(assignmentId);
    models.instance.SchoolAssignment.findOne(findQuery, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, assignmentConverter.assignmentObj(req, formattedResult));
    });
};

Assignments.deleteAssignment = function(req, callback) {
    var queryObject  = assignmentBase.assignmentQueryObject(req);

    models.instance.SchoolAssignment.findOne(queryObject, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, {message: message.nsa1208});
        } else {
            models.instance.SchoolAssignment.delete(queryObject, function(err, result){
                callback(err, {message: message.nsa1213});
            });
        }
    });
};

Assignments.getDetailsByAssignmentId = function(req, callback) {
    var assignmentId = req.params.id;
    var findQuery = getHeaders(req);
    findQuery.assignment_id = models.uuidFromString(assignmentId);

    models.instance.SchoolAssignmentDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, assignmentConverter.assignmentDetailObjs(req, formattedResult));
    });
};

Assignments.updateAssignmentDetailsStatus = function(req, callback) {
    var queryObject  = assignmentBase.assignmentDetailQueryObj(req);
    var updateValues  = assignmentBase.assignmentDetailUpdateValues(req);
    models.instance.SchoolAssignmentDetails.update(queryObject, updateValues, function(err, result){
        callback(err, result);
    });
};

// get all assignments based on selected filter
//TODO: refactor using waterfall
Assignments.getAssignmentLists = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.ASSIGNMENT_PERMISSIONS);
    if (havePermissions) {
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var class_id = body.classId;
        var section_id = body.sectionId;
        var subject_id = body.subjectId;
        var startDate = body.startDate;
        var endDate = body.endDate;

        var assignmentDetailFindQuery =  getHeaders(req);
        if(startDate != null &&  !(_.isEmpty(startDate)) && endDate != null && !(_.isEmpty(endDate))) {
            assignmentDetailFindQuery.due_date = {'$gte' : startDate, '$lte' : endDate};
        }

        if(class_id != null && !(_.isEmpty(class_id))) {
            assignmentDetailFindQuery.class_id = models.uuidFromString(class_id);
        }
        if (section_id != null && !(_.isEmpty(section_id))) {
            assignmentDetailFindQuery.section_id = models.uuidFromString(section_id);
        }

        if (subject_id != null && !(_.isEmpty(subject_id))) {
            assignmentDetailFindQuery.subjects = {'$contains_key' : models.uuidFromString(subject_id)};
        }
        models.instance.SchoolAssignmentDetails.find(assignmentDetailFindQuery, {allow_filtering: true}, function(err, result){
            if(!(_.isEmpty(result))) {
                var assignmentIds = [];
                _.forEach(result, function(value, key) {
                    assignmentIds.push((value.assignment_id));
                });
                var assignmentfindQuery = {
                    assignment_id : {'$in' : assignmentIds}
                };
                models.instance.SchoolAssignment.find(assignmentfindQuery, function(err, result){
                    var formattedResult = baseService.validateResult(result);
                    callback(err, assignmentConverter.assignmentObjs(req, formattedResult));
                });
            } else {
                callback(err, result);
            }
        });
    }  else {
        callback(null, []);
    }

};

//TODO: have to check hotcoded status
Assignments.getAssignmentAssignedUsers = function(req, callback) {
    var findQuery =  getHeaders(req);
    findQuery.user_name = req.params.id;
    findQuery.status = true;
    models.instance.SchoolAssignmentDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, assignmentConverter.assignmentDetailObjs(req,  _.sortBy(formattedResult, 'updated_date').reverse()));
    });
};

Assignments.getAssignmentsByMonthOfYear = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryParams = req.query;
    var monthNo = queryParams.monthNo;  // Ex: 17
    var year = queryParams.year;   //Ex: 2017
    var dates = dateUtils.getDatesByMonthOfYear(monthNo, year);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        due_date: { '$gte': dates.startDate, '$lte': dates.endDate },
        user_name: headers.user_id
    };
    models.instance.SchoolAssignmentDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, assignmentConverter.assignmentDetailObjs(req,  _.sortBy(formattedResult, 'updated_date').reverse()));
    });
};

Assignments.getAssignmentsByWeekOfYear = function(req, callback) {

    var headers = baseService.getHeaders(req);
    var queryParams = req.query;
    var weekNo = queryParams.weekNo;  // Ex: 26
    var year = queryParams.year;   //Ex: 2017
    var dates = dateUtils.getStartEndDatesOfYearOfWeek(weekNo, year);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        due_date: { '$gte': dates.startDate, '$lte': dates.endDate },
        user_name: headers.user_id,
        status: true,
    };

    models.instance.SchoolAssignmentDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, assignmentConverter.assignmentDetailObjs(req,  _.sortBy(result, 'updated_date').reverse()));
    });
};

Assignments.getEmpAssignmentsByWeekOfYear = function(req, callback) {

    var havePermissions = baseService.haveAnyPermissions(req, constant.ASSIGNMENT_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.ASSIGNMENT_PERMISSIONS);

        var queryParams = req.query;
        var weekNo = queryParams.weekNo;  // Ex: 26
        var year = queryParams.year;   //Ex: 2017
        if(weekNo != null && year != null && !_.isEmpty(weekNo) && !_.isEmpty(year)) {
            var dates = dateUtils.getStartEndDatesOfYearOfWeek(weekNo, year);
            findQuery.due_date = { '$gte': dates.startDate, '$lte': dates.endDate };
        }

        models.instance.SchoolAssignment.find(findQuery, {allow_filtering : true}, function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, assignmentConverter.assignmentObjs(req,  _.sortBy(formattedResult, 'updated_date').reverse()));
        });
    } else {
        callback(null, []);
    }
};

Assignments.getDueAssignmentLists = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        user_name: req.params.id, is_submitted: false
    };
    models.instance.SchoolAssignmentDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, assignmentConverter.assignmentDetailObjs(req, formattedResult));
    });
};

Assignments.getTodayAssignmentListsByUser = function(req, callback) {
    var userId = req.params.id;
    var start = moment().startOf('day').toDate(); // set to 12:00 am today
    var end = moment().endOf('day').toDate(); // set to 23:59 pm today
    var findQuery = getHeaders(req);
    findQuery.updated_by = userId;
    findQuery.updated_date =  {'$gte': start, '$lte': end};
    models.instance.SchoolAssignment.find(findQuery, {allow_filtering : true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, assignmentConverter.assignmentObjs(req, formattedResult));
    });
};

Assignments.getAssignments = function(req, callback) {
    /*models.instance.SchoolAssignment.find({}, function(err, result){
        callback(err, result);
    });*/
    var array = [];
    models.instance.SchoolAssignment.eachRow({}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            callback(err, array);
        }
    });
};

Assignments.getAssignmentDetails = function(req, callback) {
    /*models.instance.SchoolAssignmentDetails.find({}, function(err, result){
        callback(err, result);
    });*/
    var array = [];
    var queryParams = req.query;
    var findQuery = {};
    if(queryParams != null && !_.isEmpty(queryParams)) {
        findQuery.updated_date =  {'$gte': new Date(queryParams.start), '$lte': new Date(queryParams.end)};
    }
    models.instance.SchoolAssignmentDetails.eachRow(findQuery, {allow_filtering: true}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            callback(err, array);
        }
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

Assignments.findSubjectIdAssignments = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.subjects = {'$contains_key': models.uuidFromString(req.params.id)};
    models.instance.SchoolAssignment.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};


//For IOS Start
Assignments.updateUserAssignmentDetail = function (req, callback) {
    var queryObject = statusUpdateFindQuery(req);
    var updateValues = {
        deactivated: true
    };
    models.instance.SchoolAssignmentDetails.update(queryObject, updateValues, function (err, result) {
        callback(err, result);
    });
};

Assignments.updateUserReadStatus = function (req, callback) {
    var queryObject = statusUpdateFindQuery(req);
    var updateValues = {
        is_read: true
    };
    models.instance.SchoolAssignmentDetails.update(queryObject, updateValues, function (err, result) {
        callback(err, result);
    });
};

function statusUpdateFindQuery(req) {
    var id = models.uuidFromString(req.params.id);
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var queryObject = {
        assignment_detail_id: id,
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: headers.academic_year
    };
    return queryObject;
}
exports.statusUpdateFindQuery = statusUpdateFindQuery;

//For IOS End
module.exports = Assignments;
