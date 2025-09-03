/**
 * Created by Kiranmai A on 3/3/2017.
 */

var baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    models = require('../models'),
    dateService = require('../utils/date.service'),
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    Vehicle = require('../common/domains/Vehicle'),
    Driver = require('../common/domains/Driver'),
    Route = require('../common/domains/Route'),
    VehicleAllocation = require('../common/domains/VehicleAllocation');

exports.convertVehicleObjs = function(req, data) {
    var vehicleObjs = [];
    try {
        data.forEach(function (value) {
            vehicleObjs.push(convertVehicle(req, value));
        });
    }
    catch (err) {
        logger.debug(err);
        return responseBuilder.buildResponse(constant.VEHICLE, constant.APP_TYPE, message.nsa4107, err.message, constant.HTTP_BAD_REQUEST);
    }
    return vehicleObjs;
};

function convertVehicle(req, data) {

    var vehicleObj = {};
    if(_.isEmpty(data)) {
        vehicleObj = baseService.emptyResponse();
    } else {
        vehicleObj = Object.assign({}, Vehicle);
        try {
            var updatedDate = dateService.getFormattedDate(data['updated_date']);
            var fcDate = dateService.getFormattedDate(data['vehicle_fc_date']);
            vehicleObj.reg_no= data['reg_no'];
            vehicleObj.vehicle_type= data['vehicle_type'];
            vehicleObj.seating_capacity= data['seating_capacity'];
            vehicleObj.vehicle_reg_date= data['vehicle_reg_date'];
            vehicleObj.vehicle_fc_date= fcDate ;
            vehicleObj.is_hired= data['is_hired'];
            vehicleObj.vehicle_owner_name= data['vehicle_owner_name'];
            vehicleObj.vehicle_owner_address= data['vehicle_owner_address'];
            vehicleObj.vehicle_owner_city= data['vehicle_owner_city'];
            vehicleObj.vehicle_owner_state= data['vehicle_owner_state'];
            vehicleObj.vehicle_owner_phone= data['vehicle_owner_phone'];
            vehicleObj.updated_date= updatedDate;
            vehicleObj.updated_by= data['updated_by'];
            vehicleObj.updated_username= data['updated_username'];
            vehicleObj.active = data['active'];
            vehicleObj.editPermissions = baseService.havePermissionsToEdit(req, constant.VEHICLE_PERMISSIONS, data['created_by']);
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.VEHICLE, constant.APP_TYPE, message.nsa4107, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return vehicleObj;
};
exports.convertVehicle = convertVehicle;

exports.convertDriverObjs = function(req, data) {
    var driverobjs = [];
    try {
        data.forEach(function (value) {
            driverobjs.push(convertDriver(req, value));
        });
    }
    catch (err) {
        logger.debug(err);
        return responseBuilder.buildResponse(constant.DRIVER, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
    }
    return driverobjs;
};

function convertDriver(req, data) {

    var driverObj = {};
    if(_.isEmpty(data)) {
        driverObj = baseService.emptyResponse();
    } else {
        driverObj = Object.assign({}, Driver);
        try {
            var updatedDate = dateService.getFormattedDate(data['updated_date']);
            var driverDlValidity = dateService.getFormattedDate(data['driver_dl_validity']);
            driverObj.id= data['id'];
            driverObj.driver_name= data['driver_name'];
            driverObj.driver_address= data['driver_address'];
            driverObj.driver_city= data['driver_city'];
            driverObj.driver_state= data['driver_state'];
            driverObj.driver_phone= data['driver_phone'];
            driverObj.driver_type= data['driver_type'];
            driverObj.driver_dl_number= data['driver_dl_number'];
            driverObj.driver_dl_type= data['driver_dl_type'];
            driverObj.driver_dl_validity= driverDlValidity;
            driverObj.updated_date= updatedDate;
            driverObj.updated_by= data['updated_by'];
            driverObj.updated_username= data['updated_username'];
            driverObj.editPermissions = baseService.havePermissionsToEdit(req, constant.DRIVER_PERMISSIONS, data['created_by']);
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.DRIVER, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return driverObj;
};
exports.convertDriver = convertDriver;

exports.convertRouteObjs = function (req, data, callback) {
    var routeObjs = [];
    try {
        if(!_.isEmpty(data) && data.length > 0) {
            baseService.waterfallOver(req, data, getVehicle, routeObjs, function (err, result) {
                callback(null, result);
            });
        } else {
            callback(null, baseService.emptyResponse());
        }

    }
    catch (err) {
        logger.debug(err);
        callback(responseBuilder.buildResponse(constant.ROUTE, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST), null);
    }
};


function getVehicle(req, value, routeObjs, report) {
    models.instance.SchoolVehicle.findOne({reg_no: value['reg_no']}, {allow_filtering: true}, function(err, result) {
        var formattedResult = baseService.validateResult(result);
        var route = convertRoute(req, value);
        if (err) {
            // nothing
        } else {
            route['vehicle'] = convertVehicle(req, formattedResult);
        }
        routeObjs.push(route);
        report(err, routeObjs);
    });
}

function convertRoute(req, data) {

    var routeObj = {};
    if(_.isEmpty(data)) {
        routeObj = baseService.emptyResponse();
    } else {
        routeObj = Object.assign({}, Route);
        try {
            var updatedDate = dateService.getFormattedDate(data['updated_date']);
            routeObj.id= data['id'];
            routeObj.conductor_name= data['conductor_name'];
            routeObj.conductor_address= data['conductor_address'];
            routeObj.conductor_phone= data['conductor_phone'];
            routeObj.destination= data['destination'];
            routeObj.driver_id= data['driver_id'];
            routeObj.driver_name= data['driver_name'];
            routeObj.driver_phone= data['driver_phone'];
            routeObj.orgin= data['orgin'];
            routeObj.reg_no= data['reg_no'];
            routeObj.from_lat= data['from_lat'];
            routeObj.from_lng= data['from_lng'];
            routeObj.to_lat= data['to_lat'];
            routeObj.to_lng= data['to_lng'];
            routeObj.route_desc= data['route_desc'];
            routeObj.route_name= data['route_name'];
            routeObj.radius= data['radius'];
            routeObj.waypoints= data['waypoints'];
            routeObj.overview_path= data['overview_path'];
            routeObj.stops= data['stops'];
            routeObj.updated_date= updatedDate;
            routeObj.updated_by= data['updated_by'];
            routeObj.updated_username= data['updated_username'];
            routeObj.editPermissions = baseService.havePermissionsToEdit(req, constant.ROUTE_PERMISSIONS, data['created_by']);
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.ROUTE, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return routeObj;
};
exports.convertRoute = convertRoute;

exports.convertVehicleAllocationObjs = function (req, data) {
    var vehicleObjs = [];
    try {
        data.forEach(function (value) {
            vehicleObjs.push(convertVehicleAllocation(req, value));
        });
    }
    catch (err) {
        logger.debug(err);
        return responseBuilder.buildResponse(constant.VEHICLE_ALLOCATION, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
    }
    return vehicleObjs;
};

function convertVehicleAllocation(req, data) {

    var vehicleAllocatoin = {};
    if(_.isEmpty(data)) {
        vehicleAllocatoin = baseService.emptyResponse();
    } else {
        vehicleAllocatoin = Object.assign({}, VehicleAllocation);
        try {
            var updatedDate = dateService.getFormattedDate(data['updated_date']);
            vehicleAllocatoin.id= data['id'];
            vehicleAllocatoin.route_id= data['route_id'];
            vehicleAllocatoin.reg_no= data['reg_no'];
            vehicleAllocatoin.user_id= data['user_id'];
            vehicleAllocatoin.user_name= data['user_name'];
            vehicleAllocatoin.user_code= data['user_code'];
            vehicleAllocatoin.class_name= data['class_name'];
            vehicleAllocatoin.section_name= data['section_name'];
            vehicleAllocatoin.first_name= data['first_name'];
            vehicleAllocatoin.pickup_location= data['pickup_location'];
            vehicleAllocatoin.notify_distance= data['notify_distance'];
            vehicleAllocatoin.notify_type= data['notify_type'];
            vehicleAllocatoin.updated_date= updatedDate;
            vehicleAllocatoin.updated_by= data['updated_by'];
            vehicleAllocatoin.updated_username= data['updated_username'];
            vehicleAllocatoin.editPermissions = baseService.havePermissionsToEdit(req, constant.VEHICLE_ALLOC__PERMISSIONS, data['created_by']);
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.VEHICLE_ALLOCATION, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return vehicleAllocatoin;
};
exports.convertVehicleAllocation = convertVehicleAllocation;
