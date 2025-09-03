/**
 * Created by bharatkumarr on 25/05/17.
 */

var _ = require('lodash')
    , Client = require('node-rest-client').Client
    , nsaCassandra = require('@nsa/nsa-cassandra')
    , httpArgs = { "headers": { "Content-Type": "application-json" }};


exports.getApiKey = function(callback) {
    getExistingKey(function(result){
        console.info('result...', result);
        if (result.message) {
            console.info('fetch api key from gps....')
            // fetchKey(callback);
        } else {
            var expires = new Date(result[0].expires).getTime();
            console.info('expired expires....',result[0].expires);

            if (new Date().getTime() > expires) {
                console.info('expired fetch api key from gps....')
                //fetchKey(callback);
            } else {
                global.gpsApiKey = result[0].api_key;
                global.gpsApitime = parseInt(result[0].validity);
                console.info('getApiKey global.gpsApiKey....',global.gpsApiKey);
                callback();
            }

        }
    });

}


function fetchKey(callback) {
    var baseUrl, gps = global.config.gps, time = Math.round((new Date()).getTime() / 1000);
    var httpArgs = {
        "headers": {
            "Content-Type": "application-json"
        }
    }
    baseUrl = gps.baseUrl + gps.apiKeyUrl + '?userId=' + gps.userId + '&time=' + time + '&signature=' + gps.signature
        + '&validDays=' + gps.validity;

    console.info('baseUrl...',baseUrl);
    var client = new Client();
    client.get(baseUrl, httpArgs, function (body, response) {
        console.info('GPS API....', body);
        global.gpsApiKey = body.apiKey;
        global.gpsApitime = parseInt(body.validity);
        updateGps({api_key: global.gpsApiKey, validity: global.gpsApitime }, function(err, result){
            console.info('callback err...',err);
            console.info('callback result...',result);
            if (callback) {
                callback();
            }
        })
    });
}
exports.fetchKey = fetchKey;

function getExistingKey(callback) {
    nsaCassandra.Gps.getApiKey(function(err, result){
        callback(result)
    });
}
exports.getExistingKey = getExistingKey;

function updateGps(gpsdata, callback) {
    nsaCassandra.Gps.updateApiKey(gpsdata, function(err, result){
        console.info('updateGps err...',err);
        console.info('updateGps result...',result);
        callback(err, result);
    });
}
exports.updateGps = updateGps;
