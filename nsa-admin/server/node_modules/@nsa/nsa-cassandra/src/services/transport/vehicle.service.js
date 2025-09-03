/**
 * Created by bharatkumarr on 20/03/17.
 */

var baseService = require('../common/base.service')
    , models = require('../../models')
    , dateService = require('../../utils/date.service')
    ,_ = require('lodash')
    , message = require('@nsa/nsa-commons').messages
    , transportConverter = require('../../converters/transport.converter')
    , constant = require('@nsa/nsa-commons').constants;


var Vehicle = function f(options) {
    // var self = this;
};

Vehicle.getAllVehicles = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.VEHICLE_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.VEHICLE_PERMISSIONS);
            models.instance.SchoolVehicle.find(findQuery, {allow_filtering: true}, function(err, result) {
                callback(err, transportConverter.convertVehicleObjs(req, result));
            });
    } else {
        callback(null, []);
    }
};

Vehicle.getActiveVehicles = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.VEHICLE_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.VEHICLE_PERMISSIONS);
           findQuery.active = true;
        models.instance.SchoolVehicle.find(findQuery, {allow_filtering: true}, function(err, result) {
            callback(err, (!_.isEmpty(result) ? transportConverter.convertVehicleObjs(req, result): []));
        });
    } else {
        callback(null, []);
    }
};

Vehicle.entireVehicles = function(callback) {
    models.instance.SchoolVehicle.find({}, function(err, result) {
        var response = [];
        if(_.isEmpty(result)) {
            response = baseService.emptyResponse();
        } else {
            response = result;
        }
        callback(err, response);
    });
};

Vehicle.getVehicle = function(req, callback) {
    var findQuery = getQuery(req);
    models.instance.SchoolVehicle.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, transportConverter.convertVehicle(req, formattedResult));
    });
};

Vehicle.fetchVehicle = function(req, reg_no, callback) {
    var findQuery = getBaseQuery(req);
    findQuery.reg_no = reg_no;
    models.instance.SchoolVehicle.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, transportConverter.convertVehicle(req, formattedResult));
    });
};

Vehicle.extractObject = function (req) {
    var vehicleObj = req.body;
    vehicleObj.seating_capacity = parseInt(vehicleObj.seating_capacity || 0);
    vehicleObj.is_hired = vehicleObj.is_hired || false;
    vehicleObj.vehicle_reg_date = dateService.getFormattedDate(vehicleObj.vehicle_reg_date);
    vehicleObj.vehicle_fc_date = dateService.getFormattedDate(vehicleObj.vehicle_fc_date);
    vehicleObj.updated_by = baseService.getHeaders(req).user_id;
    vehicleObj.updated_username = baseService.getHeaders(req).user_name;
    vehicleObj.updated_date = dateService.getCurrentDate();
    return vehicleObj;
};

Vehicle.saveVehicle = function(req, callback) {
    var vehicleObj = this.extractObject(req);
    vehicleObj = baseService.updateIdsFromHeader(req, vehicleObj);
    var vehicle = new models.instance.SchoolVehicle(vehicleObj);
    vehicle.save(function (err, result) {
        result['message'] = message.nsa4101;
        callback(err, result);
    });
};

Vehicle.findVehicleNoInvehicle = function(req, callback) {
    var findQuery = baseService.getFindQuery(req);
        findQuery.reg_no = req.body.reg_no;
    models.instance.SchoolVehicle.findOne(findQuery, {allow_filtering: true}, function (err, result) {
       callback(err, result);
   });
};

Vehicle.updateVehicle = function(req, callback) {
    var queryObject = getQuery(req);
    queryObject.reg_no = req.params.id;
    var vehicleObj = this.extractObject(req);
    delete vehicleObj.reg_no;
    models.instance.SchoolVehicle.update(queryObject, vehicleObj, function(err, result){
        result['message'] = message.nsa4103;
        callback(err, result);
    });
};

Vehicle.deleteVehicle = function(req, callback) {
    var queryObject = getQuery(req);
    models.instance.SchoolVehicle.findOne(queryObject, {allow_filtering: true}, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, message.nsa4107);
        } else {
            models.instance.SchoolVehicle.delete(queryObject, function (err, result) {
                result['message'] = message.nsa4105;
                callback(err, result);
            });

        }
    });
};

Vehicle.changeStatus = function(req, callback) {
    var queryObject = getQuery(req);
    models.instance.SchoolVehicle.findOne(queryObject, {allow_filtering: true}, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, message.nsa4107);
        } else {
            var vehicleObj = JSON.parse(JSON.stringify(result));
            delete vehicleObj.reg_no;
            delete vehicleObj.tenant_id;
            delete vehicleObj.school_id;
            vehicleObj.active = req.body.active === 'active' ? true : false;
            models.instance.SchoolVehicle.update(queryObject, vehicleObj, function (err, updateResult) {
                updateResult['message'] = message.nsa4108;
                callback(err, updateResult);
            });
        }
    });
};

Vehicle.getRoutesByVehicles = function(req, callback) {
    var findQuery = getBaseQuery(req);
      findQuery.reg_no = req.params.id;
    models.instance.SchoolVehicleRoute.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err,  result);
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
    findQuery.reg_no = req.params.id;
    return findQuery;
};

exports.getQuery = getQuery;
module.exports = Vehicle;
