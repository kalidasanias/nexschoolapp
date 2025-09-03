/**
 * Created by bharatkumarr on 25/43/17.
 */

var baseService = require('../common/base.service')
    , models = require('../../models')
    , dateService = require('../../utils/date.service')
    ,_ = require('lodash')
    , message = require('@nsa/nsa-commons').messages
    , transportConverter = require('../../converters/transport.converter')
    , constant = require('@nsa/nsa-commons').constants;


var Driver = function f(options) {
    // var self = this;
};

Driver.getAllDrivers = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.DRIVER_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.DRIVER_PERMISSIONS);

        models.instance.SchoolDriver.find(findQuery, {allow_filtering: true}, function(err, result) {
            callback(err, transportConverter.convertDriverObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

Driver.getDriver = function(req, callback) {
    var findQuery = getQuery(req);
    models.instance.SchoolDriver.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, transportConverter.convertDriver(req, formattedResult));
    });
};

Driver.fetchDriver = function(req, callback) {
    var findQuery = getBaseQuery(req);
    findQuery.id = req.body.driver_id;
    models.instance.SchoolDriver.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, transportConverter.convertDriver(req, formattedResult));
    });
};

Driver.extractObject = function (req) {
    var driverObj = req.body;
    driverObj.driver_dl_validity = dateService.getFormattedDate(driverObj.driver_dl_validity);
    driverObj.updated_by = baseService.getHeaders(req).user_id;
    driverObj.updated_username = baseService.getHeaders(req).user_name;
    driverObj.updated_date = dateService.getCurrentDate();
    return driverObj;
};

Driver.saveDriver = function(req, callback) {
    var driverObj = this.extractObject(req);
    driverObj = baseService.updateIdsFromHeader(req, driverObj);
    driverObj.id = models.uuid();
    var driver = new models.instance.SchoolDriver(driverObj);
    driver.save(function (err, result) {
        result['message'] = message.nsa4501
        callback(err, result);
    });
};

Driver.updateDriver = function(req, callback) {
    var driverObj = this.extractObject(req);
    var findQuery = getQuery(req);
    delete driverObj.id;
    models.instance.SchoolDriver.update(findQuery, driverObj, function(err, result){
        result['message'] = message.nsa4503
        callback(err, result);
    });
};

Driver.deleteDriver = function(req, callback) {
    var queryObject = getQuery(req);
    models.instance.SchoolDriver.findOne(queryObject, {allow_filtering: true}, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, message.nsa4507);
        } else {
            models.instance.SchoolVehicleRoute.findOne({driver_id: queryObject.id}, {allow_filtering: true}, function(err, result) {
                if (result && result.id){
                    var err ={};
                    err['message'] = message.nsa10002;
                    callback(err,null);
                } else {
                    models.instance.SchoolDriver.delete(queryObject, function (err, result) {
                        result['message'] = message.nsa4505
                        callback(err, result);
                    });
                }
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
    if (req.body.id !== undefined) {
        findQuery.id = models.uuidFromString(req.body.id);
    } else {
        findQuery.id = models.uuidFromString(req.params.id);
    }
    return findQuery;
};

exports.getQuery = getQuery;
module.exports = Driver;
