/**
 * Created by Kiranmai A on 2/8/2017.
 */
var express = require('express')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , models = require('../../models')
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , constant = require('@nsa/nsa-commons').constants
    , languageConverter = require('../../converters/language.converter');

var Languages = function f(options) {
    var self = this;
};

Languages.getSchoolLanguages = function(req, callback) {
    var headers = baseService.getHeaders(req);

    models.instance.SchoolLanguages.find({tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id)}, {allow_filtering: true},
        function(err, result){
            callback(err, languageConverter.schoolLanguageObjs(req, result));
        });
};

module.exports = Languages;
