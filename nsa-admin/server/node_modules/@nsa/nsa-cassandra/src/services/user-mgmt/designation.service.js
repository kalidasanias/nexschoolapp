/**
 * Created by bharatkumarr on 20/03/17.
 */

var baseService = require('../common/base.service')
    , models = require('../../models')
    , dateService = require('../../utils/date.service')
    ,_ = require('lodash')
    , message = require('@nsa/nsa-commons').messages
    , usermgmtConverter = require('../../converters/usermgmt.converter')
    , constant = require('@nsa/nsa-commons').constants;


var Designation = function f(options) {
    // var self = this;
};

Designation.getAllDesignations = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.DESIGNATION_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.DESIGNATION_PERMISSIONS);

        models.instance.SchoolDesignation.find(findQuery, {allow_filtering: true}, function(err, result) {
            callback(err, usermgmtConverter.convertDesgObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

Designation.getDesignation = function(req, callback) {
    var findQuery = getQuery(req);
    models.instance.SchoolDesignation.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, usermgmtConverter.convertDesignation(req, formattedResult));
    });
};

Designation.fetchDesignation = function(req, desg_id, callback) {
    var findQuery = getBaseQuery(req);
    findQuery.desg_id = desg_id;
    models.instance.SchoolDesignation.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, usermgmtConverter.convertDesignation(req, formattedResult));
    });
};

Designation.saveDesignation = function(req, callback) {
    var desgObj = req.body,  currentDate = new Date();
    desgObj = baseService.updateIdsFromHeader(req, desgObj);
    desgObj.desg_id = models.uuid();
    desgObj.default_value = false;
    desgObj.status= true;

    var Designation = new models.instance.SchoolDesignation(desgObj);
    Designation.save(function (err, result) {
        result['message'] = message.nsa4011;
        callback(err, result);
    });
};

Designation.updateDesignation = function(req, callback) {
    var currentDate = new Date();
    req.body.updated_by = baseService.getHeaders(req).user_id;
    req.body.updated_username = baseService.getHeaders(req).user_name;
    req.body.updated_date = dateService.getCurrentDate();

    var queryObject = getQuery(req);
    delete req.body.desg_id;

    models.instance.SchoolDesignation.update(queryObject, req.body, function(err, result){
        result['message'] = message.nsa4013;
        callback(err, result);
    });
};

Designation.deleteDesignation = function(req, callback) {
    var queryObject = getQuery(req);
    models.instance.SchoolDesignation.findOne(queryObject, {allow_filtering: true}, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, message.nsa4017);
        } else {
            models.instance.SchoolDesignation.delete(queryObject, function(err, result){
                result['message'] = message.nsa4015;
                callback(err, result);
            });
        }
    });
};

function getBaseQuery(req) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };
    return findQuery;
}

function getQuery(req) {
    var findQuery = getBaseQuery(req);
    if (req.body.desg_id !== undefined) {
        findQuery.desg_id = models.uuidFromString(req.body.desg_id);
    } else {
        findQuery.desg_id = models.uuidFromString(req.params.id);
    }
    return findQuery;
};

exports.getQuery = getQuery;
module.exports = Designation;
