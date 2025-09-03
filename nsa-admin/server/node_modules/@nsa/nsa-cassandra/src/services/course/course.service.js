/**
 * Created by Cyril on 4/25/2017.
 */
var baseService = require('../common/base.service')
    , models = require('../../models')
    , message = require('@nsa/nsa-commons').messages
    , constant = require('@nsa/nsa-commons').constants;

var Course = function f(options){
    var self = this;
}

Course.getAllCourseDepartments = function(req, callback) {
    var headers = baseService.getHeaders(req);
    models.instance.SchoolCourseDepartment.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    } , {allow_filtering: true}, function(err, result) {
        callback(err, result);
    });
};

module.exports =Course;