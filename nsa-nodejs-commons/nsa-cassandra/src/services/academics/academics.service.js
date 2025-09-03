/**
 * Created by Kiranmai A on 3/17/2017.
 */

var express = require('express')
    , baseService = require('../common/base.service')
    , models = require('../../models/index')
    , academicConverter = require('../../converters/academic.converter')
    , constants = require('../../common/constants/constants')
    , async = require('async')
    , moment = require('moment')
    , logger = require('../../../../../../config/logger');

var Academics = function f(options) {
    var self = this;
};

Academics.getAcademicYearDetails = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.ACADEMIC_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.ACADEMIC_PERMISSIONS);

        models.instance.AcademicYear.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, academicConverter.academicObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

Academics.getAcademicYear = function(req, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var findQuery = {tenant_id: models.timeuuidFromString(req.headers.userInfo.tenant_id),
            school_id: models.uuidFromString(req.headers.userInfo.school_id),
            ac_year: headers.academic_year};
        models.instance.AcademicYear.findOne(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, result);
        });
    } catch (err) {
        logger.debug(err);
    }
};

Academics.getAcademicYears = function(req, user, callback) {
    var findQuery = { tenant_id: user.tenant_id, school_id: user.school_id };
        models.instance.AcademicYear.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, academicConverter.academicObjs(req, result));
        });
};

Academics.getAcademicYearInfo = function(req, callback) {
    var findQuery = baseService.getFindQuery(req);
    models.instance.AcademicYear.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, academicConverter.academicObjs(req, result));
    });
};

Academics.getAllSchoolAcademicYears = function(req, val, callback) {
    try {
        var findQuery = {
            "ac_year": req.body.year,
            "tenant_id": val.tenant_id,
            "school_id": val.school_id
        }
        models.instance.AcademicYear.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(null, result);
        });
    }catch (err){
        callback(err, null)
    }
};

function findAcademicYearInAcademics(req, object, callback){
    try {
        var findQuery = {};
        findQuery.school_id = object.school_id;
        findQuery.tenant_id = object.tenant_id;
        findQuery.ac_year = req.body.academicYear;
        models.instance.AcademicYear.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(null, result);
        });
    }catch (err){
        callback(err, null)
    }
};

Academics.updateAcademicYear = function (req, data, callback) {
    var body = req.body;
    var addingobjs = [];
    try {
        var createObj = function (object, callback) {
            findAcademicYearInAcademics(req, object, function (err, result) {
                if (!_.isEmpty(result)) {
                    callback(null, [])
                } else {
                    var obj = getAcademicModel(object, body.academicYear, true)
                    var oldObj = getAcademicModel(object, body.year, false)
                    obj = obj.save({return_query: true});
                    oldObj = oldObj.save({return_query: true});
                    addingobjs.push(obj);
                    addingobjs.push(oldObj);
                    callback(null, obj);
                }
            })
        };

        async.times(data.academics.length, function (i, next) {
            var obj = data.academics[i];
            createObj(obj, function (err, data) {
                next(err, data);
            });
        }, function (err, Objs) {
            data.batchObj = addingobjs;
            callback(err, data)
        });
    } catch (err) {
        callback(err, null)
    }
};

function getAcademicModel(object, academicYear, cyear) {
    var endDate, startDate, createdDate, id;
    if(cyear) {
        id =  models.uuid(),
        endDate = moment(object.end_date, 'YYYY-MM-DDTHH:mm:ss.SSS').add(1, 'year').format(),
        startDate = moment(object.start_date, 'YYYY-MM-DDTHH:mm:ss.SSS').add(1, 'year').format(),
        createdDate = new Date()
    } else {
        id =  object.id,
        createdDate = object.created_date
        endDate = object.end_date,
        startDate = object.start_date
    }

    var obj = new models.instance.AcademicYear({
        id: id,
        tenant_id: object.tenant_id,
        school_id: object.school_id,
        ac_year: academicYear,
        end_date: endDate,
        start_date: startDate,
        created_date: createdDate,
        terms: object.terms,
        is_current_year: cyear,
    });

    return obj;
}

module.exports = Academics;

