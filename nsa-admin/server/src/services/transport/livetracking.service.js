/**
 * Created by bharatkumarr on 25/05/17.
 */

var Client = require('node-rest-client').Client
    , events = require('@nsa/nsa-commons').events
    , fs = require('fs')
    , async = require('async')
    , constant = require('@nsa/nsa-commons').constants
    , message = require('@nsa/nsa-commons').messages
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , logger = require('../../../config/logger')
    , httpArgs = {
    "headers": {
        "Content-Type": "application-json"
    }
};

var index = 70;
var obj1 = JSON.parse(fs.readFileSync(__dirname +'/19_04_data.json', 'utf8'));
var obj2 = JSON.parse(fs.readFileSync(__dirname +'/data.json', 'utf8'));


exports.livetracking = function(req, res) {
    if (req.params.id === 'TN14E1869' && index < obj1.vehicleLocations.length) {
        vehicleLocation = obj1.vehicleLocations[index];
        index++;
        if (index === 75) {
            index = 0;
        }
        events.emit('JsonResponse', req, res, vehicleLocation);
    } else if (req.params.id === 'TN22CF8989' && index < obj2.vehicleLocations.length) {
        vehicleLocation = obj2.vehicleLocations[index];
        index++;
        if (index === 93) {
            index = 0;
        }
        events.emit('JsonResponse', req, res, vehicleLocation);
    } else {
        var client = new Client(), url, gps = global.config.gps, _self = this, group = req.headers.userInfo.school_id;

        url = gps.baseUrl + gps.trackingSingle + '?apiKey=' + gps.apiKey + "&userId=" +
            gps.userId + '&group=' + group + ':SMP&vehicleId=' + req.params.id;

        client.get(url, httpArgs, function(gpsVehicle, response) {
            events.emit('JsonResponse', req, res, gpsVehicle);
        });
    }

};


exports.livetrackingall = function(req, res) {
    var client = new Client(), url, gps = global.config.gps, _self = this;
    url = gps.baseUrl + gps.trackingUrl + '?apiKey=' + gps.apiKey + "&userId=" +
        gps.userId + "&group=" + req.headers.userInfo.school_id.toString().toUpperCase() + ':SMP' ;

    if (req.headers.userInfo.tenant_id !== '8eb846a0-4549-11e7-9543-276f818a8422') {
        client.get(url, httpArgs, function (gpsVehicleGroups, response) {
            var schoolVehicleFound = false;
            async.each(gpsVehicleGroups, function (vehicleGroup, callback) {
                if (vehicleGroup.group === req.headers.userInfo.school_id.toString().toUpperCase() + ':SMP') {
                    schoolVehicleFound = true;
                    events.emit('JsonResponse', req, res, vehicleGroup.vehicleLocations);
                }
                callback();
            }, function (err) {
                if (err) {
                    logger.debug('Live tracking all vehicle from GPS ', err);
                }
                if (!schoolVehicleFound) {
                    logger.debug('No Vehicle Found for this School ',req.headers.userInfo.school_id.toString().toUpperCase());
                    events.emit('ErrorJsonResponse', req, res, { message: message.nsa4107 });
                }
            });

        });
    }

    if (req.headers.userInfo.tenant_id === '8eb846a0-4549-11e7-9543-276f818a8422') {
        var vehicleLocation, length, array = [], vehicleLocations = [];
        if (index < 93) {
            if (index >= 75) {
                vehicleLocation = obj1.vehicleLocations[74];
            } else {
                vehicleLocation = obj1.vehicleLocations[index];
            }
            vehicleLocation.regNo = "TN14E1869";
            vehicleLocation.vehicleType = "Car";
            vehicleLocation.vehicleId = "TN14E1869";
            vehicleLocations.push(vehicleLocation);
        }

        if (index <= 93) {
            vehicleLocation = obj2.vehicleLocations[index];
            vehicleLocation.regNo = "TN22CF8989";
            vehicleLocation.vehicleType = "Car";
            vehicleLocation.vehicleId = "TN22CF8989";
            vehicleLocations.push(vehicleLocation);
        }
        index++;
        if (index === 93) {
            index = 0;
        }

        events.emit('JsonResponse', req, res, vehicleLocations)
    }
};

function buildResponseErr(err, message) {
    return responseBuilder.buildResponse(constant.DRIVER, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildResponseErr = buildResponseErr;
