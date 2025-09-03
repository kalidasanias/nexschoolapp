/**
 * Created by bharatkumarr on 26/05/17.
 */

var http = require('http')
    , _ = require('lodash')
    , async = require('async')
    , events = require('@nsa/nsa-commons').events
    , notifyPrepare = require('./notify.preparation')
    , logger = require('../../config/logger')
    , httpArgs = {
    "headers": {
        "Content-Type": "application-json"
    }
};

var vehicleNotified = {};
var vehicles = {};
var preparationData;
/*exports.livetrack = function(pVehicleNotified, pVehicles) {
    vehicleNotified = pVehicleNotified;
    vehicles = pVehicles;
    trackVehicle();
};*/

exports.reset = function(req, resp) {
    vehicleNotified = {};
    vehicles = {};
    events.emit('JsonResponse', req, resp, { message: 'Reset tracking cache done !!!'});

}

exports.livetrack = function(req, resp) {
    trackVehicle(req, resp);
}

function trackVehicle(req, resp) {
    preparationData = req.body.preparationData;
    fetchGpsData(function (err, vehicleLocations) {
        if (err) {
            logger.debug('Vechicle fetech error ', err);
        }
        async.each(vehicleLocations, function (vehicleLocation, callback2) {

            try {

                fetchEsVehicle(vehicleLocation, function(vehicleInfo, stops) {
                    if (err) {
                        logger.debug('Fetch Vehicle from Es Error ', err);
                        return;
                    }
                    // console.info('vehicleInfo....',vehicleInfo);
                    async.each(stops, function (stop, callback3) {
                        var distance = getDistanceFromLatLonInMetre(vehicleLocation.latitude, vehicleLocation.longitude, stop.geopoints.lat, stop.geopoints.lon);
                        if (distance > stop.radius) { //Outside radius
                            if (!vehicleNotified[vehicleLocation.regNo] || vehicleNotified[vehicleLocation.regNo] && vehicleNotified[vehicleLocation.regNo].location.indexOf(stop.location) === -1) {
                                logger.debug('Distance ' + distance, ' Outside Radius of the Stop ' + stop.location);
                            }
                            callback3();
                        } else { // Inside radius

                            if (!vehicleNotified[vehicleLocation.regNo]) {
                                vehicleNotified[vehicleLocation.regNo] = { location: [] };
                            }

                            if (vehicleNotified[vehicleLocation.regNo].location.indexOf(stop.location) === -1) {

                                // console.info(new Date().toString()+ 'pushing vehicleNotified '+ vehicleLocation.regNo);
                                vehicleNotified[vehicleLocation.regNo].location.push(stop.location);

                                // console.info('send Notification for : ', vehicleLocation.regNo);
                                var returnData = {school_id:vehicleInfo.school_id, users: stop.user_name,
                                    vehicleNotified: vehicleNotified,
                                    vehicles: vehicles,
                                    params:{
                                        routeId: vehicleInfo.route_name,
                                        vehicle: vehicleLocation.regNo,
                                        location: vehicleLocation.address,
                                        distance: (distance/1000).toFixed(2) +' KMs',
                                    }};
                                sendNotification(preparationData, returnData);
                            }
                            callback3();
                        }

                    }, function(err) {
                        callback2(null);
                    });
                });

            } catch (err) {
                callback2(err);
                logger.debug('live track error ', err);
            }
        }, function(err){
            if (err) {
                logger.debug('Vehicle fetch Error ', err);
            }
            // console.info('tracking finsihed session ',  {vehicleNotified: vehicleNotified, vehicles: vehicles});
            events.emit('JsonResponse', req, resp, {vehicleNotified: vehicleNotified, vehicles: vehicles});
        })
    });
};
exports.trackVehicle = trackVehicle;


function fetchGpsData(cb) {
    var gps = global.config.gps,
        baseUrl = gps.baseUrl+gps.trackingUrl + '?apiKey=' + gps.apiKey + '&userId=' + gps.userId + '&group=track:SMP';

    // console.info('baseUrl....', baseUrl);
    //baseUrl = 'http://localhost:9090/getVehicleLocations';
    var requestObj = http.get(baseUrl, function (res) {
        var body = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var allVehilces = JSON.parse(body);
            var vehicleGroups = _.find(allVehilces, {"group": "TRACK:SMP"});
            if (vehicleGroups.vehicleLocations != null && vehicleGroups.vehicleLocations != 'null') {
                var vehicles = _.filter(vehicleGroups.vehicleLocations, function (vehicle) {
                    return vehicle.ignitionStatus === 'ON';
                });
                // console.info('vehicles to track....', vehicles);
                cb(null, vehicles);
            } else {
                cb(null, null);
            }
        });

        res.on('error', cb);
    })
        .on('error', cb)
        .end();
};
exports.fetchGpsData = fetchGpsData;


function fetchEsVehicle(vehicleLocation, callback) {
    if (vehicles[vehicleLocation.regNo]) {
        var cIndex = vehicles[vehicleLocation.regNo].currentStopIndex;
        if (vehicles[vehicleLocation.regNo].stops && cIndex < vehicles[vehicleLocation.regNo].stops.length) {
            callback(vehicles[vehicleLocation.regNo], vehicles[vehicleLocation.regNo].stops);
        } else {
            vehicles[vehicleLocation.regNo].islistening = false;
            // console.warn('No Vehicle Found in ES ');
            callback(null, null);
        }
    } else {
        getVehicleUsers(vehicleLocation.regNo, function(err, vehicleInfo) {
            if (vehicleInfo) {
                vehicles[vehicleLocation.regNo] = vehicleInfo;
                vehicles[vehicleLocation.regNo].currentStopIndex = 0;
                vehicles[vehicleLocation.regNo].islistening = true;
                callback(vehicles[vehicleLocation.regNo], vehicles[vehicleLocation.regNo].stops);
            } else {
                callback(null, null);
            }
        });
    }
}

function getVehicleUsers(regNo, cb) {
    // console.warn('Vehilce No for Students ', regNo);
    var url = 'http://'+ global.config.server.host + ':' +  global.config.server.port + '/vehicle/'+regNo;
    var requestObj = http.get(url, function (res) {
        var body = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            try {
                var returnData = JSON.parse(body)
                // logger.debug('Vehicle Info : ', returnData.data);
                cb(null, returnData.data);
            } catch (e) {
                cb(e, null);
            }
        });

        res.on('error', cb);
    }).on('error', cb).end();
}

// currently not in use
function fetchStop(vehicleLocation, callback) {
    if (vehicles[vehicleLocation.regNo]) {
        var cIndex = vehicles[vehicleLocation.regNo].currentStopIndex;
        if (cIndex < vehicles[vehicleLocation.regNo].stops.length) {
            callback(vehicles[vehicleLocation.regNo], vehicles[vehicleLocation.regNo].stops[cIndex]);
        } else {
            vehicles[vehicleLocation.regNo].islistening = false;
            callback(null);
        }
    } else {
        var searchParams = nsabb.getStopsByVehicle(vehicleLocation.regNo);
        nsaElasticSearch.search.searchUsers(searchParams, function (err, res, status) {
            if (err) {
                logger.debug('Search ES Vehile Error ', err);
            } else {
                if (res.hits.hits.length > 0) {
                    vehicles[vehicleLocation.regNo] = res.hits.hits[0]._source;
                    vehicles[vehicleLocation.regNo].currentStopIndex = 0;
                    vehicles[vehicleLocation.regNo].islistening = true;
                    callback(vehicles[vehicleLocation.regNo], vehicles[vehicleLocation.regNo].stops[0]);
                }
            }
        });
    }
}
exports.fetchStop = fetchStop;

function getDistanceFromLatLonInMetre(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d*1000; // Distance in Metre
}
exports.getDistanceFromLatLonInMetre = getDistanceFromLatLonInMetre;

function deg2rad(deg) {
    return deg * (Math.PI/180)
}
exports.deg2rad = deg2rad;

function sendNotification(preparationData, returnData) {
    try {
        // var returnData = JSON.parse(data.toString());
        // logger.debug('Received Data (Notification) : ', returnData);
        vehicleNotified = returnData.vehicleNotified;
        vehicles = returnData.vehicles;
        notifyPrepare.sendNotification(preparationData, returnData.school_id, returnData.users, returnData.params,
            function (response) {
                logger.debug(new Date().toString() + " Send Notification response ", response.toString());
            }
        );
    } catch (e) {
        if (e instanceof SyntaxError) {
            logger.debug("Received Data (INFO) ", data.toString());
        } else {
            logger.debug("Error on Received Data ", e);
        }
    }
}