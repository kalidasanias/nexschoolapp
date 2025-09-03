/**
 * Created by Anjan on 3/31/2017.
 */
var express = require('express')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , models = require('../../models')
    , message = require('@nsa/nsa-commons').messages
    ,aspectsConverter   = require('../../converters/aspects.converter');


var SchoolAspect = function f(options) {
    var self = this;
};

SchoolAspect.getAllSchoolAspects = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var findQuery = {
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: headers.academic_year
    };
    models.instance.SchoolAspects.find(findQuery, function (err, result) {
        callback(err, aspectsConverter.aspectsObjs( req, result));
    });
};

SchoolAspect.getSchoolAspectsById = function (req, callback) {

    var aspect_id = models.uuidFromString(req.params.id);
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var findQuery = {
        aspect_id: aspect_id,
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: headers.academic_year
    };
    models.instance.SchoolAspects.findOne(findQuery, function (err, result) {
        callback(err, aspectsConverter.aspectsObj(req, result));
    });
};

SchoolAspect.saveSchoolAspects = function (req, callback) {
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var currentDate = new Date();
    var aspectId = models.uuid();
    var aspectObj = {};
        aspectObj.tenant_id = tenantId;
        aspectObj.school_id = schoolId;
        aspectObj.academic_year = headers.academic_year;
        aspectObj.updated_by = headers.user_id;
        aspectObj.updated_username = headers.user_name;
        aspectObj.updated_date = currentDate;
        aspectObj.aspect_id = aspectId;
        aspectObj.aspect_code = body.aspectCode;
        aspectObj.aspect_name = body.aspectName;
        aspectObj.created_date = currentDate;
        aspectObj.created_by = headers.user_id;
        aspectObj.created_firstname = headers.user_name;
    var aspectObject = baseService.updateIdsFromHeader(req, aspectObj);
    var aspect = new models.instance.SchoolAspects(aspectObject);
    aspect.save(function (err, result) {
        callback(err, result)
    });
};

SchoolAspect.updateSchoolAspects = function (req, callback) {
    var body = req.body;
    var aspectId = req.params.id;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var currentDate = new Date();
    var queryObject = {
        aspect_id: models.uuidFromString(aspectId),
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: headers.academic_year
    };
    var updateValues = {
        aspect_code: body.aspectCode,
        aspect_name: body.aspectName,
        updated_by: headers.user_id,
        updated_username: headers.user_name,
        updated_date: currentDate
    };
    models.instance.SchoolAspects.update(queryObject, updateValues, function (err, result) {
        callback(err, result);
    });
};

SchoolAspect.deleteSchoolAspects = function (req, callback) {
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var aspectId = models.uuidFromString(req.params.id);
    var academicYear = headers.academic_year;

    var queryObject = {
        aspect_id: aspectId,
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: academicYear
    };
    models.instance.SchoolAspects.delete(queryObject, function (err, result) {
        callback(err, result);
    });
};

module.exports = SchoolAspect;
