/**
 * Created by Kiranmai A on 3/29/2017.
 */


var express = require('express')
    , _ = require('lodash')
    , baseService = require('../common/base.service')
    , periodsBase = require('../common/periodsbase.service.js')
    , constants = require('../../common/constants/constants')
    , models = require('../../models')
    , message = require('@nsa/nsa-commons').messages
    , periodsConverter = require('../../converters/periods.converter')

var Periods = function f(options) {
    var self = this;
};

Periods.getAllPeriods = function(data, callback) {
    models.instance.Periods.find({}, function(err, result){
        callback(err, result);
    });
};

Periods.getAllClassTimings = function(req, callback) {
    var body = req.body;
    var headers = baseService.getHeaders(req);
    models.instance.SchoolPeriods.find({
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        academic_year : headers.academic_year,
        class_id : models.uuidFromString(req.params.id),
    }, {allow_filtering : true}, function(err, result){
        callback(err, periodsConverter.periodsObjs(req, result));
    });
};

Periods.saveSchoolPeriod = function(req, callback) {
    callback(null, periodsBase.buildSchoolPeriodObject(req));
};

Periods.updateSchoolPeriods = function(req, data, callback) {
    callback(null, periodsBase.buildSchoolPeriodUpdateObj(req, data));
}

Periods.getSchoolPeriodsByClass = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        academic_year : headers.academic_year,
        class_id : models.uuidFromString(req.params.classId)
    }
    models.instance.SchoolPeriods.find(queryObject, {allow_filtering : true}, function(err, result){
        callback(err, result);
    });
};

Periods.getSchoolPeriods = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        academic_year : headers.academic_year,
    }
    models.instance.SchoolPeriods.find(queryObject, {allow_filtering : true}, function(err, result){
        callback(err, result);
    });
};

Periods.deleteSchoolPeriods = function(req, data, callback) {
    callback(null, periodsBase.buildSchoolPeriodDeleteObj(req, data));
};

Periods.getSchoolPeriodsById = function(req, callback) {
    var ids = [models.uuidFromString('07df5c76-d8c6-42ed-8a5d-d3638b4106ab'), models.uuidFromString('092aee8e-3344-46e7-b26e-cc50c1ed47cf')]
    models.instance.SchoolPeriods.find({school_period_id: {'$in': ids}}, function(err, result){
        callback(err, result);
    });
};


Periods.getSchoolPeriodsByIds = function(periodIds, callback) {
    models.instance.SchoolPeriods.find({school_period_id: {'$in': periodIds}}, function(err, result){
        callback(err, _.sortBy(JSON.parse(JSON.stringify(result)), "period_id"));
    });
};


module.exports = Periods;
