/**
 * Created by kiranmai on 9/5/17.
 */

var express = require('express')
    , request = require('request')
    , baseService = require('../common/base.service')
    , models = require('../../models/index');

var Grades = function f(options) {
    var self = this;
};

Grades.getSchoolGradeDetails = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
    };
    models.instance.SchoolGradingSystem.find(findQuery, {allow_filtering: true},
        function(err, result) {
            callback(err, result);
    });
};

module.exports = Grades;