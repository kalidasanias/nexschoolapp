/**
 * Created by bharatkumarr on 20/03/17.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    constant = require('@nsa/nsa-commons').constants,
    message = require('@nsa/nsa-commons').messages,
    baseService = require('../common/base.service'),
    logger = require('../../../config/logger'),
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    async = require('async');

exports.getAllRoutes = function(req, res) {
    nsaCassandra.Route.getAllRoutes(req, function(err, response) {
        if(err) {
            logger.debug('All Routes Error ', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4307));
        } else {
            var routes = JSON.parse(JSON.stringify(response)), data={routes: []};
            if (routes && routes.length > 0) {
                baseService.waterfallOver(req, routes, fetchStop, data, function (err, data) {
                    events.emit('JsonResponse', req, res, data.routes);
                });
            } else {
                events.emit('JsonResponse', req, res, response);
            }

        }
    })
};

function fetchStop(req, route, data, callback) {
    req.params.id = route.id;
    nsaCassandra.Route.getAllStops(req, function(err, stops) {
        route.stops = stops;
        data.routes.push(route);
        callback(err, data, data);
    });
}

exports.getRoute = function (req, res) {
    nsaCassandra.Route.getRoute(req, function(err, result) {
        if (err) {
            logger.debug('All Routes Error ', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4307));
        } else {
            nsaCassandra.Route.getAllStops(req, function(err, stops) {
                if (err) {
                    logger.debug('Get Route '+req.params.id,err);
                    events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4307));
                } else {
                    result.stops = stops;
                    events.emit('JsonResponse', req, res, result);
                }
            });
        }
    })
};

exports.saveRoute = function(req, res) {
    async.waterfall(
        [
            saveVehicleRoute.bind(null, req, []),
            saveStop.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug('Save Route ', err);
                events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4302));
            } else {
                var output = {id: result.id, message: message.nsa5001};
                events.emit('JsonResponse', req, res, output);
            }
        }
    );
};

function saveVehicleRoute(req, data, callback) {
    nsaCassandra.Route.saveRoute(req, data, function(err, data) {
        if (err) {
            logger.debug('Save Vehicle Route ', err);
        }
        callback(err, req, data);
    });
}
exports.saveVehicleRoute = saveVehicleRoute;

function saveStop(req, data, callback) {
    if (req.body.stops.length > 0) {
        nsaCassandra.Route.saveStop(req, data, function (err, data) {
            if (err) {
                logger.debug('Save Stop ', err);
            }
            callback(err, req, data);
        });
    } else {
        callback(null, req, data);
    }
}
exports.saveStop = saveStop;


function updateVehicleRoute(req, data, callback) {
    nsaCassandra.Route.updateRoute(req, data, function(err, response) {
        if (err) {
            logger.debug('Update Vehicle Route  ', err);
        }
        callback(err, req, data);
    });
}
exports.updateVehicleRoute = updateVehicleRoute;

exports.updateRoute = function(req, res) {
    var data = {};
    data.batchObj = [];
    async.waterfall([
        deleteStop.bind(null, req, data),
        executeBatch.bind()
    ], function (err, result) {

        if (err) {
            logger.debug('Delete Stop to Update Vehicle Route  ', err);
        }
        async.waterfall([
            updateVehicleRoute.bind(null, req, []),
            saveStop.bind(),
            executeBatch.bind()
        ], function (err, result) {
            if (err) {
                logger.debug('Update Vehicle Route ', err);
                events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4302));
            } else {
                var output = {id: result.id, message: message.nsa5001};
                events.emit('JsonResponse', req, res, output);
            }
        });
    });
};

exports.deleteRoute = function(req, res) {
    req.params.routeId = req.params.id;
    nsaCassandra.VehicleAllocation.getVehicleAllocationByRoute(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4306));
        } else {
            var route = JSON.parse(JSON.stringify(response));
            if (route && route.length > 0) {
                events.emit('ErrorJsonResponse', req, res, buildResponseErr(message.nsa4306, message.nsa10002));
            } else {
                async.waterfall(
                    [
                        deleteVehicleRoute.bind(null, req, {}),
                        deleteStop.bind(),
                        executeBatch.bind()
                    ],
                    function (err, result) {
                        if (err) {
                            logger.debug('Delete Route ', err);
                            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4302));
                        } else {
                            var output = {id: result.id, message: message.nsa5001};
                            events.emit('JsonResponse', req, res, output);
                        }
                    }
                );
            }
        }
    })
};




function deleteVehicleRoute(req, data, callback) {
    nsaCassandra.Route.deleteRoute(req, data, function(err, response) {
        if (err) {
            logger.debug('Delete Vehicle Route ', err);
        }
        callback(err, req, data);
    });
}
exports.deleteVehicleRoute = deleteVehicleRoute;

function deleteStop(req, data, callback) {
    nsaCassandra.Route.deleteStop(req, data, function(err, response) {
        if (err) {
            logger.debug('Delete Vehicle Stop ', err);
        }
        callback(err, req, data);
    });
}
exports.deleteStop = deleteStop;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        if (err) {
            logger.debug('Route ExecuteBatch ', err);
        }
        logger.debug(err);
        callback(err, result);
    })
}
exports.executeBatch = executeBatch;

function buildResponseErr(err, message) {
    return responseBuilder.buildResponse(constant.ROUTE, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildResponseErr = buildResponseErr;