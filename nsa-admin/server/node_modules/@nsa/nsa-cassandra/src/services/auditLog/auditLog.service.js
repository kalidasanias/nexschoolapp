/**
 * Created by Kiranmai A on 3/8/2017.
 */

var express = require('express')
    , request = require('request')
    , baseService = require('../common/base.service')
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , models = require('../../models/index')
    , logger = require('../../../../../../config/logger')

var AuditLog = function f(options) {
    var self = this; };

//Get All Logs for Particular Feature
AuditLog.getLogs = function(req, callback) {
    var featureId = models.uuidFromString(req.params.id);
    models.instance.AuditLog.find({feature_id: featureId}, function(err, result){
        callback(err, result);
    });
};

AuditLog.saveLogs = function(req, data, callback) {
    try{
        var array = data.batchObj;
        var headers = baseService.getHeaders(req);
        var queryObj = new models.instance.AuditLog({
            audit_id : models.uuid(),
            feature_id : models.uuidFromString(req.headers.id),
            feature_type_id: data.features.featureTypeId,
            updated_by : headers.user_id,
            updated_date : new Date(),
            updated_username: headers.user_name,
            type: data.features.actions
        });
        var saveObj = queryObj.save({return_query: true});
        array.push(saveObj);
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }

};

AuditLog.saveAuditLog = function(req, data, callback) {
    var array = data.batchObj;
    var headers = baseService.getHeaders(req);
    var queryObj = new models.instance.AuditLog({
        audit_id : models.uuid(),
        feature_id : models.uuidFromString(data.features.featureId),
        feature_type_id: models.uuidFromString(data.features.featureTypeId),
        updated_by : headers.user_id,
        updated_date : new Date(),
        updated_username: headers.user_name,
        type: data.features.actions
    });
    queryObj.save(function(err, result) {
        callback(err, result);
    });
};

function throwConverterErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.AUDITLOG, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwConverterErr = throwConverterErr;

module.exports = AuditLog;