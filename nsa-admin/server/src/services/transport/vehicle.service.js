/**
 * Created by bharatkumarr on 20/03/17.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    message = require('@nsa/nsa-commons').messages,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger'),
    _ = require('lodash'),
    responseBuilder = require('@nsa/nsa-commons').responseBuilder;

exports.getAllVehicles = function(req, res) {
    nsaCassandra.Vehicle.getAllVehicles(req, function(err, response) {
        if(err) {
            logger.debug('All Vehicles', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4107));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getActiveVehicles = function(req, res) {
    nsaCassandra.Vehicle.getActiveVehicles(req, function(err, response) {
        if(err) {
            logger.debug('active Vehicles', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4107));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getVehicle = function (req, res) {
    nsaCassandra.Vehicle.getVehicle(req, function(err, result) {
        if (err) {
            logger.debug('Get Vehicle', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4107));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveVehicle = function(req, res) {
    nsaCassandra.Vehicle.findVehicleNoInvehicle(req,function(err,result){
        if (err){
            logger.debug('Save Vehicle ', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4102));
        } else if (result){
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa4509});
        } else {
            nsaCassandra.Vehicle.saveVehicle(req, function(err, response) {
                if (err) {
                    logger.debug('Save Vehicle ', err);
                    events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4102));
                } else {
                    events.emit('JsonResponse', req, res, response);
                }
            })
        }

    })
};

exports.updateVehicle = function(req, res) {
    nsaCassandra.Vehicle.updateVehicle(req, function(err, response) {
        if(err) {
            logger.debug('Update Vehicle ', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4104));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.deleteVehicle = function(req, res) {
    nsaCassandra.Route.findVehicleNoInRouteDetails(req, function(err, result) {
        if (err) {
            logger.debug('Delete Vehicle ', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4105));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            nsaCassandra.Vehicle.deleteVehicle(req, function (err, response) {
                if (err) {
                    logger.debug('Delete Vehicle ', err);
                    events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4105));
                } else {
                    events.emit('JsonResponse', req, res, response);
                }
            })
        }
    })
};

exports.statusChange = function(req, res) {
    nsaCassandra.Route.findVehicleNoInRouteDetails(req, function(err, result){
        if(err){
            logger.debug('Change Status Vehicle ', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4109));
        }else if(!_.isEmpty(result)){
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        }else {
            nsaCassandra.Vehicle.changeStatus(req, function(err, response) {
                if(err) {
                    logger.debug('Change Status Vehicle ', err);
                    events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4109));
                } else {
                    events.emit('JsonResponse', req, res, response);
                }
            })
        }
    })
};

exports.getRoutesByVehicle = function(req, res) {
    nsaCassandra.Vehicle.getRoutesByVehicles(req, function(err, response) {
        if(err) {
            logger.debug('Get Routes By Vehicle', err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4106));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

function buildResponseErr(err, message) {
    return responseBuilder.buildResponse(constant.VEHICLE, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildResponseErr = buildResponseErr;
