/**
 * Created by Kiranmai A on 3/3/2017.
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
    assignmentBase = require('../common/assignmentbase.service');

var AssignmentTypes = function f(options) {
    var self = this;
};

AssignmentTypes.getAssignmentTypes = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.ASSIGNMENT_TYPE_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.ASSIGNMENT_TYPE_PERMISSIONS);

        models.instance.SchoolAssignmentType.find(findQuery, {allow_filtering: true}, function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, assignmentConverter.assignmentTypeObjs(req, formattedResult));
        });
    } else {
        callback(null, []);
    }

};

AssignmentTypes.getAssignmentType = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var assignmentTypeId = req.params.id;
    models.instance.SchoolAssignmentType.findOne({ assignment_type_id: models.uuidFromString(assignmentTypeId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, assignmentConverter.assignmentTypeObj(req, formattedResult));
    });
};

AssignmentTypes.saveAssignmentType = function(req, data, callback) {
    try {
        var schoolAssignmentType  = assignmentBase.constructAssignmentTypeDetails(req);
        var schoolAssignmentTypeObj = schoolAssignmentType.save({return_query: true});
        var array = [schoolAssignmentTypeObj];
        data.assignment_type_id = schoolAssignmentType.assignment_type_id;
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, data);
    }
};

AssignmentTypes.updateAssignmentType = function(req, callback) {
    var queryObject  = assignmentBase.assignmentTypeQueryObject(req);
    var updateValues  = assignmentBase.assignmentTypeUpdateValues(req);
    models.instance.SchoolAssignmentType.update(queryObject, updateValues, function(err, result){
        callback(err, result);
    });
};

AssignmentTypes.deleteAssignmentType = function(req, callback) {
    var queryObject  = assignmentBase.assignmentTypeQueryObject(req);

    models.instance.SchoolAssignmentType.findOne(queryObject, {allow_filtering: true}, function(err, result){
        if(_.isEmpty(result)) {
               callback(err, message.nsa1207);
        } else {
            models.instance.SchoolAssignmentType.delete(queryObject, function(err, result){
                callback(err, message.nsa1206);
            });
        }
    });
};

AssignmentTypes.findAssignmentTypeInAssignment = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var assignmentTypeId = req.params.id;
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        assignment_type_id: models.uuidFromString(assignmentTypeId)
    };
    models.instance.SchoolAssignment.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

module.exports = AssignmentTypes;