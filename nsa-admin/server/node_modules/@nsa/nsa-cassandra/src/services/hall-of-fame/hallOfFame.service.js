/**
 * Created by intellishine on 9/12/2017.
 */
var express = require('express'),
    models = require('../../models/index'),
    baseService = require('../common/base.service'),
    message = require('@nsa/nsa-commons').messages,
    constant = require('@nsa/nsa-commons').constants,
    dateService = require('../../utils/date.service'),
    _ = require('lodash'),
    async = require('async'),
    templateConverter = require('../../converters/template.converter');

var HallOfFame = function f(options){
    var self = this;
};

HallOfFame.getAllAwards = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.HALL_OF_FAME_PERMISSIONS);
    if (havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.HALL_OF_FAME_PERMISSIONS);
        findQuery.status = true;
        models.instance.SchoolAward.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, []);
    }
};

HallOfFame.getAllHallOfFames = function (req, callback) {

    getResults(req, false, function(err, result){
        callback(err, result)
    });
};


function getResults(req, status, callback){
    var havePermissions = baseService.haveAnyPermissions(req, constant.HALL_OF_FAME_PERMISSIONS);
    if (havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.HALL_OF_FAME_PERMISSIONS);
        if(status){findQuery.status = true;}
        models.instance.SchoolHallOfFame.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, getPermissionResult(req, result));
        });
    } else {
        callback(null, []);
    }

}

HallOfFame.getPublishHallOfFame = function (req, callback) {
    getResults(req, true, function(err, result){
        callback(err, result)
    });
};

function getPermissionResult(req, result){
        var hallOfFameObjects = [];
    var results = JSON.parse(JSON.stringify(result));
        try {
            var myarr = results;
            if(myarr.length > 0) {
                myarr.forEach(function (hallOfFameObject) {
                    hallOfFameObject.date_of_issue = dateService.getFormattedDate(hallOfFameObject.date_of_issue);
                    hallOfFameObject.editPermissions = baseService.havePermissionsToEdit(req, constant.HALL_OF_FAME_PERMISSIONS, hallOfFameObject.created_by);
                    hallOfFameObjects.push(hallOfFameObject);
                });
            }
        }
        catch (err) {
            return err;
        }
        return hallOfFameObjects;
}

HallOfFame.getHallOfDetails = function (req, callback) {
    var findQuery = getFindQuery(req);
        findQuery.hall_of_fame_id = models.uuidFromString(req.params.id);
    models.instance.SchoolHallOfFameDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

function getFindQuery(req){
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;

    return findQuery;
}

HallOfFame.findUserInExistHallOfFame = function (req, callback) {
    var body = req.body;
    if(!body.status){
        var findQuery = getFindQuery(req);
        var date_of_issue = baseService.getFormattedDate(body.dateOfIssue);
        var dataOfIssue = models.datatypes.LocalDate.fromDate(date_of_issue);
        findQuery.date_of_issue = dataOfIssue;
        findQuery.award_id = models.uuidFromString(body.awardId);
        models.instance.SchoolHallOfFameDetails.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, getUsers(req, result));
        });
    }else {
        callback(null, []);
    }
};

function getUsers(req, students){
     var users = [];
    if(!_.isEmpty(students)){
        var studentObj = req.body.students;
        if(req.params.id){
            students =  _.filter(students, function(o) { return o['hall_of_fame_id'] != req.params.id; });
        }
        var result = _.intersectionWith(students,  studentObj, function(student, obj){
            return student.user_name === obj.userName;
        });
        users = result.map(function(a){return a.first_name});
    }
    return users;
}


HallOfFame.getHallOfFameById = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.id = models.uuidFromString(req.params.id);
    findQuery.academic_year = headers.academic_year;
    models.instance.SchoolHallOfFame.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};


HallOfFame.getHallOfFameByUserName = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
        findQuery.user_name = req.params.id;
        findQuery.academic_year = headers.academic_year;
        findQuery.status = true;
    models.instance.SchoolHallOfFameDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

HallOfFame.deleteHallOfFameDetailsObj = function(req, data, callback){
    try {
        var headers = baseService.getHeaders(req);
        var findQuery = baseService.getFindQuery(req);
            findQuery.academic_year = headers.academic_year;
        var hallOFFameId = req.params.id ? models.uuidFromString(req.params.id) : data.id;
        findQuery.hall_of_fame_id = hallOFFameId;
        models.instance.SchoolHallOfFameDetails.find(findQuery, {allow_filtering: true}, function(err, result){
            if(_.isEmpty(result)) {
                callback(null, data);
            } else {
                var array = data.batchObj || [];
                var results = JSON.parse(JSON.stringify(result));
                _.forEach(results, function(value, key) {
                    delete findQuery.hall_of_fame_id;
                    findQuery.hall_of_fame_details_id = models.uuidFromString(value.hall_of_fame_details_id);
                    var deleteQuery = (new models.instance.SchoolHallOfFameDetails(findQuery)).delete({return_query: true});
                    array.push(deleteQuery);
                    if (results.length -1 === key) {
                        data.batchObj = array;
                        callback(null, data);
                    }
                });
            }
        });
    }catch (err){
        callback(err, null);
    }
};

HallOfFame.constructHallOfFameObj = function(req, data, callback) {
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var Id = req.params.id ? models.uuidFromString(req.params.id) : models.uuid();
        var count = body.students.length;
        var dateOfIssueFormate = baseService.getFormattedDate(body.dateOfIssue);
        var hallOFFameObj = new models.instance.SchoolHallOfFame({
            id: Id, tenant_id: tenantId, school_id: schoolId,
            academic_year : headers.academic_year,
            award_name: body.awardName,
            date_of_issue: models.datatypes.LocalDate.fromDate(dateOfIssueFormate),
            award_id:  models.uuidFromString(body.awardId),
            description: body.desc,
            notified_students: JSON.stringify(body.students),
            number_of_students: count,
            /*media_name: body.MediaName,*/
            updated_firstname: headers.user_name,
            updated_date: currentDate,
            updated_by: headers.user_id,
            created_firstname: headers.user_name,
            created_date: currentDate,
            created_by: headers.user_id,
            status: JSON.parse(body.status)
        });
        var saveObj = [hallOFFameObj.save({return_query: true})];
        data.batchObj = saveObj;
        data.id = Id;
        data.users = body.students;
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

HallOfFame.constructHallOfFameDetailsObj  = function(req, data, callback){
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var array = data.batchObj || [];
        var users = body.students || [];
        _.forEach(users, function(value, key){
            var classId = value.classes.length > 0 ? (value.classes[0].class_id != '' ? models.uuidFromString(value.classes[0].class_id) : null) : null;
            var className = value.classes.length > 0 ? (value.classes[0].class_name != '' ? value.classes[0].class_name : null) : null;
            var sectionId = value.classes.length > 0 ? (value.classes[0].section_id != '' ? models.uuidFromString(value.classes[0].section_id) : null) : null;
            var sectionName = value.classes.length > 0 ? (value.classes[0].section_name != '' ? value.classes[0].section_name : null) : null;
            var hallOfFameDetailsId = models.uuid();
            var dateOfIssueFormate = baseService.getFormattedDate(body.dateOfIssue);
            var hallOfFameDetails = new models.instance.SchoolHallOfFameDetails ({
                hall_of_fame_details_id: hallOfFameDetailsId,
                hall_of_fame_id: data.id,
                tenant_id: tenantId,
                school_id: schoolId,
                academic_year : headers.academic_year,
                award_name: body.awardName,
                date_of_issue: models.datatypes.LocalDate.fromDate(dateOfIssueFormate),
                award_id:  models.uuidFromString(body.awardId),
                description: body.desc,
                user_name: value.userName,
                first_name: value.firstName,
                class_id: classId,
                class_name: className,
                section_id: sectionId,
                section_name: sectionName,
                /*media_name: body.MediaName,*/
                updated_firstname: headers.user_name,
                updated_date: currentDate,
                updated_by: headers.user_id,
                created_date: currentDate,
                created_by: headers.user_id,
                created_firstname: headers.user_name,
                status: JSON.parse(body.status)
            });
            array.push(hallOfFameDetails.save({return_query: true}));
        });
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
}

HallOfFame.deleteHallOfFame = function(req, data, callback){
    try{
        var array = data.batchObj || [];
        var headers = baseService.getHeaders(req);
        var findQuery = baseService.getFindQuery(req);
        findQuery.academic_year = headers.academic_year;
        findQuery.id = models.uuidFromString(req.params.id);
        var deleteQuery = (new models.instance.SchoolHallOfFame(findQuery)).delete({return_query: true});
        array.push(deleteQuery);
        data.batchObj = array;
        callback(null, data);
    }catch (err){
        callback(err, null);
    }
};


HallOfFame.getHallOfFameTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var params = {awardName: body.awardName};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};


module.exports = HallOfFame;

