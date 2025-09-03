/**
 * Created by Kiranmai A on 2/9/2017.
 */

var express = require('express')
    , baseService = require('../common/base.service')
    , models = require('../../models')
    , message = require('@nsa/nsa-commons').messages
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , constant = require('@nsa/nsa-commons').constants
    , termsConverter = require('../../converters/terms.converter');

var Terms = function f(options) {
    var self = this;
};

Terms.getSchoolTerms = function(req, callback) {
    var headers = baseService.getHeaders(req);

    models.instance.SchoolTerms.find({tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id),ac_year: headers.academic_year}, {allow_filtering: true},
        function(err, result){
            callback(err, termsConverter.schoolTermsObjs(req, result));
        });
};

module.exports = Terms;
