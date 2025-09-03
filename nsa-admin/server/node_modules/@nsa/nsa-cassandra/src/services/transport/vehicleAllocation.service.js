/**
 * Created by bharatkumarr on 25/43/17.
 */

var baseService = require('../common/base.service')
    , models = require('../../models')
    , vehicleService = require('./vehicle.service')
    , routeService = require('./route.service')
    , driverService = require('./driver.service')
    , dateService = require('../../utils/date.service')
    ,_ = require('lodash')
    , message = require('@nsa/nsa-commons').messages
    , transportConverter = require('../../converters/transport.converter')
    , constant = require('@nsa/nsa-commons').constants;


var VehicleAllocation = function f(options) {
    // var self = this;
};

VehicleAllocation.getAllVehiclesData = function(req, callback) {
    models.instance.SchoolVehicleAllocation.find({}, {}, function(err, result) {
        console.info(result);
        callback(err, JSON.parse(JSON.stringify(result)));
    });
};


VehicleAllocation.getAllVehicleAllocations = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.VEHICLE_ALLOC__PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.VEHICLE_ALLOC__PERMISSIONS);
        models.instance.SchoolVehicleAllocation.find(findQuery, {allow_filtering: true}, function(err, result) {
            callback(err, transportConverter.convertVehicleAllocationObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

VehicleAllocation.getUsersByVehicle = function(queryObj, callback) {
    // var headers = baseService.getHeaders(req);
    var schoolId = models.uuidFromString(queryObjs.school_id);
    // var tenantId = models.timeuuidFromString(headers.tenant_id);

    models.instance.SchoolVehicleAllocation.find({school_id: schoolId, reg_no: queryObj.reg_no}, {allow_filtering: true}, function(err, result) {
        var response = [];
        if(_.isEmpty(result)) {
            response = baseService.emptyResponse();
        } else {
            response = result;
        }
        callback(err, response);
    });
};

VehicleAllocation.getVehicleAllocation = function(req, callback) {
    var findQuery = getQuery(req);
    models.instance.SchoolVehicleAllocation.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, transportConverter.convertVehicleAllocation(req, formattedResult));
    });
};

VehicleAllocation.getVehicleAllocationByClassSection = function(req, callback){
    var findQuery = getBaseQuery(req);
        findQuery.class_id = models.uuidFromString(req.params.classId);
        findQuery.section_id = models.uuidFromString(req.params.sectionId);
        findQuery.academic_year = baseService.getHeaders(req).academic_year;
        models.instance.SchoolVehicleAllocation.find(findQuery, {allow_filtering: true},function(err, result){
            callback(err, transportConverter.convertVehicleAllocationObjs(req, result));
        });
};

VehicleAllocation.getVehicleAllocationByUser = function(req, callback) {
    var findQuery = getBaseQuery(req);
    if (req.body.userName !== undefined) {
        findQuery.user_name = req.body.userName;
    } else {
        findQuery.user_name = req.params.id;
    }
    var error = '';
    models.instance.SchoolVehicleAllocation.findOne(findQuery, {allow_filtering: true}, function(err, result){
        if (err) {
            error  += err;
        }
        var formattedResult = baseService.validateResult(result);
        var response = transportConverter.convertVehicleAllocation(req, formattedResult);
        req.body.route_id = response.route_id;

        if (response && response.message === 'No Result Found') {
            callback(null, response);
        } else {
            vehicleService.fetchVehicle(req, response.reg_no, function (err, vehicleObj) {
                if (err) {
                    error += err;
                }
                response['vehicle'] = vehicleObj;
                routeService.fetchRoute(req, function (err, routeObj) {
                    if (err) {
                        error += err;
                    }
                    response['route'] = routeObj;
                    req.body.driver_id = routeObj.driver_id;
                    driverService.fetchDriver(req, function (err, driverObj) {
                        if (err) {
                            error += err;
                        }
                        response['driver'] = driverObj;
                        callback(error, response);
                    })
                });
            })
        }
    });
};



VehicleAllocation.getVehicleAllocationByRoute = function(req, callback) {
    var routeId = models.uuidFromString(req.params.routeId);
    models.instance.SchoolVehicleAllocation.find({route_id: routeId}, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

VehicleAllocation.extractObject = function (req) {
    var vehicleAllocationObj = req.body;
    vehicleAllocationObj.driver_id = models.uuidFromString(vehicleAllocationObj.driver_id);
    vehicleAllocationObj.updated_by = baseService.getHeaders(req).user_id;
    vehicleAllocationObj.updated_username = baseService.getHeaders(req).user_name;
    vehicleAllocationObj.updated_date = dateService.getCurrentDate();
    return vehicleAllocationObj;
};

VehicleAllocation.saveVehicleAllocation = function(req, assignObj, data, callback) {
    assignObj.id = models.uuid();
    assignObj.route_id = models.uuidFromString(assignObj.route_id);
    assignObj.class_id = models.uuidFromString(assignObj.class_id);
    assignObj.section_id = models.uuidFromString(assignObj.section_id);
    assignObj.academic_year = baseService.getHeaders(req).academic_year;
    var vehicleAllocation = new models.instance.SchoolVehicleAllocation(assignObj);
    var assignUserObject = vehicleAllocation.save({return_query: true});
    data.assignQueries.push(assignUserObject);
    callback(null, data, null);
    /*vehicleAllocation.save(function (err, result) {
        callback(err, message.nsa4121);
    });*/
};

VehicleAllocation.updateVehicleAllocation = function(req, callback) {
    var vehicleAllocationObj = this.extractObject(req);
    var findQuery = getQuery(req);
    delete vehicleAllocationObj.id;
    models.instance.SchoolVehicleAllocation.update(findQuery, vehicleAllocationObj, function(err, result){
        callback(err, message.nsa4123);
    });
};

VehicleAllocation.deleteVehicleAllocation = function(req, callback) {
    var queryObject = getQuery(req);
    queryObject.id = models.uuidFromString(req.params.id);
    models.instance.SchoolVehicleAllocation.findOne(queryObject, {allow_filtering: true}, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, message.nsa4127, null);
        } else {
            models.instance.SchoolVehicleAllocation.delete(queryObject, function(err, result){
                callback(err, message.nsa4125, JSON.parse(JSON.stringify(result)));
            });
        }
    });
};

function getBaseQuery(req) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year
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
module.exports = VehicleAllocation;
