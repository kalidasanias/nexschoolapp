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


var Route = function f(options) {
    // var self = this;
};

Route.getAllRoutes = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.ROUTE_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.ROUTE_PERMISSIONS);
        models.instance.SchoolVehicleRoute.find(findQuery, {allow_filtering: true}, function(err, result) {
            if (err) {
                callback(err, []);
            } else {
                transportConverter.convertRouteObjs(req, result, function (err, result) {
                    callback(err, result);
                })
            }
        });
    } else {
        callback(null, []);
    }
};

Route.getAllStops = function(req, callback) {
    var route_id = models.uuidFromString(req.params.id);
    models.instance.SchoolVehicleStop.find({route_id: route_id}, {allow_filtering: true}, function(err, result) {
        var response = [];
        if(_.isEmpty(result)) {
            response = [];
        } else {
            response = result;
        }
        callback(err, JSON.parse(JSON.stringify(response)));
    });
};

Route.getRoute = function(req, callback) {
    var findQuery = getQuery(req);
    models.instance.SchoolVehicleRoute.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, transportConverter.convertRoute(req, formattedResult));
    });
};

Route.fetchRoute = function(req, callback) {
    var findQuery = getBaseQuery(req);
    findQuery.id = req.body.route_id;
    models.instance.SchoolVehicleRoute.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, transportConverter.convertRoute(req, formattedResult));
    });
};

Route.extractObject = function (req) {
    var routeObj = req.body;
    routeObj.radius = parseInt(routeObj.radius);
    routeObj.driver_id = models.uuidFromString(routeObj.driver_id);
    routeObj.updated_by = baseService.getHeaders(req).user_id;
    routeObj.updated_username = baseService.getHeaders(req).user_name;
    routeObj.updated_date = dateService.getCurrentDate();
    return routeObj;
};

Route.saveRoute = function(req, data, callback) {
    var routeObj = this.extractObject(req);
    routeObj = baseService.updateIdsFromHeader(req, routeObj);
    routeObj.id = models.uuid();
    var route = new models.instance.SchoolVehicleRoute(routeObj);
    var routeQuery = route.save({return_query: true});
    var array = [routeQuery];
    data.route_id = routeObj.id;
    data.batchObj = array;
    callback(null, data);
};

Route.saveStop = function(req, data, callback) {
    var stopObjs = req.body.stops;
    for(var i=0; i<stopObjs.length; i++) {
        var stopObj = stopObjs[i];
        stopObj.route_id = data.route_id;
        stopObj.radius = parseInt(stopObj.radius);
        stopObj.reg_no = req.body.reg_no;
        var stop = new models.instance.SchoolVehicleStop(stopObj);
        var stopQuery = stop.save({return_query: true});
        data.batchObj.push(stopQuery);
        if (i === (stopObjs.length-1)) {
            callback(null, data);
        }
    }
};

Route.updateRoute = function(req, data, callback) {
    var routeObj = this.extractObject(req);
    var findQuery = getQuery(req);
    data.route_id = findQuery.id;
    delete routeObj.id;
    var updateQuery = models.instance.SchoolVehicleRoute.update(findQuery, routeObj, {return_query: true});
    data.batchObj = [updateQuery];
    callback(null, data);
};

Route.deleteRoute = function(req, data, callback) {
    var queryObject = getQuery(req);
    models.instance.SchoolVehicleRoute.findOne(queryObject, {allow_filtering: true}, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, message.nsa4307);
        } else {
            var deleteQuery = (new models.instance.SchoolVehicleRoute(result)).delete({return_query: true});
            data.batchObj = [deleteQuery];
            callback(null, data);
        }
    });
};

Route.findVehicleNoInRouteDetails = function(req, callback) {
    var findQuery = baseService.getFindQuery(req);
      findQuery.reg_no = req.params.id;
    models.instance.SchoolVehicleRoute.find(findQuery, {allow_filtering: true}, function(err, result){
           callback(err, result);
    });
};


Route.deleteStop = function(req, data, callback) {
    var route_id = models.uuidFromString(req.params.id)
    models.instance.SchoolVehicleStop.find({route_id: route_id}, {allow_filtering: true}, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, message.nsa4307);
        } else {
            var results = JSON.parse(JSON.stringify(result));
            _.forEach(results, function(value, key) {
                var findQuery = {route_id: route_id, stop_id: value.stop_id};
                var deleteQuery = (new models.instance.SchoolVehicleStop(findQuery)).delete({return_query: true});
                data.batchObj.push(deleteQuery);
                if (results.length -1 === key) {
                    callback(null, data);
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
module.exports = Route;
