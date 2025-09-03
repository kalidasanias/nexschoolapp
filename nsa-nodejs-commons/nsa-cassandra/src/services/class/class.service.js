/**
 * Created by Kiranmai A on 1/19/2017.
 */

var express = require('express')
    , request = require('request')
    , baseService = require('../common/base.service')
    , models = require('../../models/index')
    , constants = require('../../common/constants/constants')
    , classConverter = require('../../converters/class.converter')
    , logger = require('../../../config/logger')
    , constant = require('@nsa/nsa-commons').constants;

var Classes = function f(options) {
    var self = this;
};

Classes.getClasses = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.CLASS_PERMISSIONS);
    if(havePermissions) {
       var findQuery = baseService.getFindAllQuery(req, true, constant.CLASS_PERMISSIONS);
       getClassesObject(findQuery, function(err, result){
            if(err){
                logger.debug(err);
                callback(err, null);
            } else {
                callback(null, classConverter.classObjs(req, result));
            }
        })
    } else {
        callback(null, []);
    }
};

Classes.getActiveClasses = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        status : true};
    getClassesObject(findQuery, function(err, result){
        if(err){
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, classConverter.classObjs(req, result));
        }
    })
};

Classes.getAllClasses = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year
    };
    models.instance.SchoolClassDetails.find(findQuery, {allow_filtering: true},
        function(err, result){
            callback(err, result);
        });
};

Classes.getAllClassAndSections = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year
    };
    models.instance.SchoolClassSectionDetails.find(findQuery, {allow_filtering: true},
        function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, classConverter.classSection(req, formattedResult));
        });
};

Classes.getClassByClassId = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        class_id: models.uuidFromString(req.params.id),
        academic_year: headers.academic_year};
    models.instance.SchoolClassDetails.findOne(findQuery, function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, classConverter.ClassObj(req, formattedResult));
        });
};

Classes.updateClassStatus = function(req, callback) {
    var data = [];
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var classId = models.uuidFromString(req.params.id);
        var status = JSON.parse(body.status);
        var array = [];
        var currentDate = new Date();

        var queryObject =  { school_id : schoolId, tenant_id : tenantId, class_id : classId, academic_year : headers.academic_year };
        var updateValues ={ status: status, updated_by: headers.user_id, updated_date: currentDate, updated_username: headers.user_name };

        var updateQuery = models.instance.SchoolClassDetails.update(queryObject, updateValues, {return_query: true});
        array.push(updateQuery)
        data['batchObj'] = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

Classes.getClassTaxanomy = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var classId = models.uuidFromString(req.params.id);
    models.instance.Taxanomy.findOne({ tenant_id: tenantId,
        school_id: schoolId, id: classId,
        academic_year: headers.academic_year
    }, {allow_filtering: true}, function(err, result){
        data['taxanomy'] = result;
        callback(err, data);
    });
};

Classes.updateClassTaxanomy = function(req, data, callback) {
    try {
        var array = data.batchObj || [];
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var status = JSON.parse(body.status);
        var queryObj = {
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year: headers.academic_year,
            category_id: data.taxanomy.category_id,
        };
        var updateValues ={ status: status };
        var updateObj = models.instance.Taxanomy.update(queryObj, updateValues, {return_query: true});
        array.push(updateObj);
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, data);
    }
};

function getClassesObject (findQuery, callback){
    models.instance.SchoolClassDetails.find(findQuery, {allow_filtering: true},
        function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, formattedResult);
        });
}
exports.getClassesObject =getClassesObject;


module.exports = Classes;
