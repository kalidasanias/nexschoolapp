/**
 * Created by bharatkumarr on 20/03/17.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    message = require('@nsa/nsa-commons').messages,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger'),
    baseService = require('../common/base.service'),
    userConverter = require('../../converters/user.converter'),
    elasticSearch = require('../search/elasticsearch/elasticsearch.service'),
    nsabaseService = require('../../../node_modules/@nsa/nsa-cassandra/src/services/common/base.service'),
    _ = require('lodash'),
    async = require('async'),
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    BaseError = require('@nsa/nsa-commons').BaseError;

exports.getAllVehicleAllocations = function(req, res) {
    nsaCassandra.VehicleAllocation.getAllVehicleAllocations(req, function(err, response) {
        if(err) {
            logger.debug('Get All Vehicle Allocations ', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4127));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getVehicleAllocation = function (req, res) {
    nsaCassandra.VehicleAllocation.getVehicleAllocation(req, function(err, result) {
        if (err) {
            logger.debug('Get Vehicle Allocations ', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4127));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getVehicleAllocationByUser = function (req, res) {
    nsaCassandra.VehicleAllocation.getVehicleAllocationByUser(req, function(err, result) {
        if (err) {
            logger.debug('Get All Vehicle Allocation By User ', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4127));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getVehicleAllocationByRoute = function (req, res) {

    nsaCassandra.VehicleAllocation.getVehicleAllocationByRoute(req, function(err, result) {
        if (err) {
            logger.debug('Get All Vehicle Allocation By Route ', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4127));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveVehicleAllocation = function(req, res) {
    var assignObjs = req.body.users, data = {};
    data.assignQueries = [];
    data.user_name = [];
    data.user_code = [];
    baseService.waterfallOver(req, assignObjs, saveObj, data, function(err, result) {
        nsaCassandra.Base.baseService.executeBatch(data.assignQueries, function(err, result) {
            if (err) {
                logger.debug('Save Vehicle Allocation Execute Batch ', err);
                events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa5005));
            } else {
                updateEsVehicle(req, data, function(err, result){
                    var output = {result: result, message: message.nsa5006};
                    events.emit('JsonResponse', req, res, output);
                });
            }
        })
    });
};

exports.getStudentsByClassSection = function (req, res){
    async.parallel({
        classSection: studentsByClassSection.bind(null, req),
        vehicleUsers: vehicleAllocatedStudents.bind(null, req)
    },function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa5004));
        }else{
            var filterUsers = [];
            _.forEach(result, function(value, key){
                var resultFiltered = _.map(result.classSection.hits.hits, function(value, key){
                    var found = _.find(result.vehicleUsers, { 'user_name': value._source.user_name});
                    if(!found){
                        filterUsers.push(value._source);
                    }
            })
            })
            events.emit('JsonResponse', req, res, filterUsers);
        }
    })
};

function studentsByClassSection(req, callback){
    elasticSearch.getUsersByClassSection(req, function(err, data){
        callback(err, data)
    })
};

function vehicleAllocatedStudents(req, callback){
    nsaCassandra.VehicleAllocation.getVehicleAllocationByClassSection(req, function(err, data) {
        callback(err, data)
    })
};

function saveObj(req, assignObj, data, callback) {
    assignObj = baseService.updateIdsFromHeader(req, assignObj, false);
    assignObj.pickup_location_index = parseInt(assignObj.pickup_location_index);
    assignObj.pickup_location = JSON.stringify(assignObj.pickup_location);
    data.user_code.push(assignObj.user_code);
    data.user_name.push(assignObj.user_name);
    nsaCassandra.VehicleAllocation.saveVehicleAllocation(req, assignObj, data, function(err, data, result){
        if (err) {
            logger.debug('Save Vehicle Allocation ', err);
        }
        callback(err, data, result);
    });

};

function updateEsVehicle(req, data, callback) {
    elasticSearch.getEsVehilces(req, function(err, result) {
        if (err) {
            logger.debug('Update Vehicle Allocation - Fetch Vehicle from Elastic Search ', err);
        }
        if (result.hits.hits && result.hits.hits.length > 0) {
            var stops = result.hits.hits[0]._source.stops;
            var stop = _.find(stops, function (stop) {
                return stop.location === req.body.stop.location;
            });
            if (stop !== undefined) {
                stop['radius'] = req.body.stop.radius;
                stop.user_name = _.union(stop.user_name, data.user_name);
            } else {
                var stop = {};
                result.hits.hits[0]._source.stops = [];
                stop['location'] = req.body.stop.location;
                stop['geopoints'] = { lat: req.body.stop.lat, lon: req.body.stop.lng };
                stop['radius'] = req.body.stop.radius;
                stop['user_name'] = data.user_name;
                result.hits.hits[0]._source.stops.push(stop);
            }

            elasticSearch.updateEsVehicle(result.hits.hits[0]._source.stops, result.hits.hits[0]._id, function (err, result) {
                if (err) {
                    logger.debug('Update Vehicle Allocation - Update Vehicle to Elastic Search ', err);
                }
                callback(err, result);
            });
        } else {
            var esData = {}, stops = [], stop = {};
            stop['location'] = req.body.stop.location;
            stop['geopoints'] = { lat: req.body.stop.lat, lon: req.body.stop.lng };
            stop['radius'] = req.body.stop.radius;
            stop['user_name'] = data.user_name;
            stops.push(stop);
            esData['stops'] = stops;
            esData['academic_year'] = nsabaseService.getHeaders(req).academic_year;
            esData['vehicle_no'] = req.body.reg_no;
            esData['route_name'] = req.body.route_id;
            esData['tenant_id'] = req.headers.userInfo.tenant_id;
            esData['school_id'] = req.headers.userInfo.school_id;

            elasticSearch.createVehicleDetails(esData, function (err, result) {
                if (err) {
                    logger.debug('Update Vehicle Allocation - Create Vehicle to Elastic Search ', err);
                }
                callback(err, result);
            });
        }
    });
}

exports.updateVehicleAllocation = function(req, res) {
    nsaCassandra.VehicleAllocation.updateVehicleAllocation(req, function(err, response) {
        if(err) {
            logger.debug('Update Vehicle Allocation ', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4124));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.deleteVehicleAllocation = function(req, res) {
    nsaCassandra.VehicleAllocation.deleteVehicleAllocation(req, function(err, response, deletedObj) {
        if(err) {
            logger.debug('Delete Vehicle Allocation ', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4126));
        } else {
            if (deletedObj !== null) {
                req.body.reg_no = deletedObj.reg_no;
                elasticSearch.getEsVehilces(req, function(err, result) {
                    if (err) {
                        logger.debug('Delete Vehicle - Fetch Elastic Search ', err);
                    }
                    if (result.hits.hits && result.hits.hits.length > 0) {
                        var stops = result.hits.hits[0]._source.stops;
                        var stop = _.find(stops, function (stop) {
                            var pickup_location = JSON.parse(deletedObj.pickup_location);
                            return stop.location === pickup_location.location;
                        });
                        if (stop) {
                            var deleteUsers = _.remove(stop.user_name, function (user) {
                                return user === deletedObj.user_name;
                            });
                            elasticSearch.updateEsVehicle(result.hits.hits[0]._source.stops, result.hits.hits[0]._id, function (err, result) {
                                if (err) {
                                    logger.debug('Delete Vehicle - Update Elastic Search ', err);
                                }
                                events.emit('JsonResponse', req, res, message.nsa4125);
                            });
                        } else {
                            events.emit('JsonResponse', req, res, message.nsa4125);
                        }
                    } else {
                        events.emit('JsonResponse', req, res, message.nsa4125);
                    }
                })
            } else {
                events.emit('JsonResponse', req, res, message.nsa4125);
            }
        }
    })
};


exports.generateVehicleJson = function(req, res) {
    var vehicles = {}, vehicleNos = [];
    nsaCassandra.VehicleAllocation.getAllVehiclesData(req, function(err, response) {
        async.each(response, function (vehicleAllocation, callback) {
            var pickupLocation = JSON.parse(vehicleAllocation.pickup_location);
            if (vehicles[pickupLocation.reg_no]) {
                var vehicleData = vehicles[pickupLocation.reg_no];
                var stop = _.find(vehicleData.stops, function (stop) {
                    return stop.location === pickupLocation.location;
                });
                if (stop !== undefined) {
                    stop.user_name.push(vehicleAllocation.user_name);
                } else {
                    var stop = {};
                    stop.location = pickupLocation.location;
                    stop.geopoints = { lat: pickupLocation.lat, lon: pickupLocation.lng };
                    if (vehicleAllocation.school_id === '34e6bb25-9d8d-434d-b42f-0e825057ed59' && pickupLocation.location === 'Gnanapuram Rd, Machampalayam, Sundarapuram, Kurichi, Coimbatore, Tamil Nadu 641008, India') {
                        stop.radius = 200;
                    } else if (vehicleAllocation.school_id === '34e6bb25-9d8d-434d-b42f-0e825057ed59' && pickupLocation.radius >= 500) {
                        stop.radius = 500;
                    } else {
                        stop.radius = pickupLocation.radius
                    }
                    stop.user_name = [vehicleAllocation.user_name];
                    vehicleData.stops.push(stop);
                }

            } else {
                var vehicleData = {}, stop = {};
                vehicleData.vehicle_no = pickupLocation.reg_no;
                vehicleData.route_name = vehicleAllocation.route_id;
                vehicleData.tenant_id = vehicleAllocation.tenant_id;
                vehicleData.school_id = vehicleAllocation.school_id;

                stop.location = pickupLocation.location;
                stop.geopoints = { lat: pickupLocation.lat, lon: pickupLocation.lng };
                console.info('school_id...',vehicleAllocation.school_id, vehicleAllocation.school_id === '34e6bb25-9d8d-434d-b42f-0e825057ed59')
                if (response.school_id === '34e6bb25-9d8d-434d-b42f-0e825057ed59' && pickupLocation.location === 'Gnanapuram Rd, Machampalayam, Sundarapuram, Kurichi, Coimbatore, Tamil Nadu 641008, India') {
                    stop.radius = 200;
                } else if (vehicleAllocation.school_id === '34e6bb25-9d8d-434d-b42f-0e825057ed59' && pickupLocation.radius >= 500) {
                    stop.radius = 500;
                } else {
                    stop.radius = pickupLocation.radius
                }
                stop.user_name = [vehicleAllocation.user_name];

                vehicleData.stops = [stop];

                vehicles[pickupLocation.reg_no] = vehicleData;
                vehicleNos.push(pickupLocation.reg_no);
            }
            callback();
        }, function(err) {
            console.info(vehicles);
            if (req.query.push) {
                vehicleNos.forEach(function(regNo) {
                    elasticSearch.createVehicleDetails(vehicles[regNo], function (err, result) {
                        if (err) {
                            logger.debug('Update Vehicle Allocation - Create Vehicle to Elastic Search ', err);
                            events.emit('JsonResponse', req, res, {esUpdate: false, message: 'ES Update failed'});
                        }
                    });
                });
                events.emit('JsonResponse', req, res, {esUpdate: true, regNos: vehicleNos, vehicles: vehicles});

            } else {
                events.emit('JsonResponse', req, res, {esUpdate: false, regNos: vehicleNos, vehicles: vehicles});
            }
        });
    });
};

function buildResponseErr(err, message) {
    return responseBuilder.buildResponse(constant.VEHICLE, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildResponseErr = buildResponseErr;