var env = process.env.NODE_ENV || "development";
global.config = require('./config/config.json')[env];

var express = require('express')
    , app = express()
    , http = require('http').Server(app)
    , bodyParser = require('body-parser')
    , async = require('async')
    , schedule = require('node-schedule')
    , request = require('request')
    , logger = require('./config/logger')
    , port = process.env.PORT || global.config.server.port;

const fs = require('fs');
const  child_process = require('child_process');

http.listen(port, function () {
    console.log(new Date().toString()+ ' Nexrise processor listening on port ', port);
});

app.use(bodyParser.json({limit: "50mb"}))
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}))

var routes = require('./src/lib/api');
routes(app);

setTimeout(function() {
    recursive();
}, 1000);

var notifyPrepare;
function preparation(data, cb) {
    notifyPrepare = require('./src/lib/notify.preparation');
    notifyPrepare.preparation(data, cb);
}

function recursive() {
    var schedule = require('node-schedule'), preparationData = null;

    var rule = new schedule.RecurrenceRule(),
        weekRange = new schedule.Range(global.config.gps.schedule.dayOfWeek.start,
            global.config.gps.schedule.dayOfWeek.end);

    rule.dayOfWeek = [weekRange];
    rule.hour = global.config.gps.schedule.hour;
    rule.minute = new schedule.Range(0, 59);
    rule.second = new schedule.Range(0, 59, global.config.gps.schedule.secondInterval);

    var j = schedule.scheduleJob(rule, function() {
        logger.debug('Triggered live tracking '+ new Date().toString());
        if (preparationData == null) {
            preparation([], function (err, data) {
                if (err) {
                    logger.debug('Unable to track on ' + new Date().toString() + ' and error is ', err);
                } else {
                    preparationData = data;
                    tracking(data);
                }
            });
        } else {
            tracking(preparationData);
        }
    });

    var rule2 = new schedule.RecurrenceRule();
    rule2.dayOfWeek = [weekRange];
    rule2.hour = global.config.gps.schedule.resetHour;
    rule2.minute = 0;
    rule2.second = 0;


    var k = schedule.scheduleJob(rule2, function() {
        preparationData = null;
        vehicleNotified = {};
        vehicles = {};
        reset();
    });
}

var vehicleNotified = {};
var vehicles = {};
var url = 'http://'+ global.config.server.host + ':' +  global.config.server.port + '/tracking';
var headers = { 'content-type': 'application/json'};


function tracking(data) {
    request.post(url, { headers: headers, body: { preparationData: data }, json: true }, function(err, res, body) {
        if (body) {
            vehicles = body.data.vehicles;
            vehicleNotified = body.data.vehicleNotified;
        }
    });
}

function reset() {
    request.get(url+'/reset', { headers: headers, json: true }, function(err, res, body) {
        if (body) {
            logger.debug(body.message);
        }
    });
}

/*function tracking(preparationData) {
    // logger.debug('Tracking prepared data (template and channel)...', preparationData);
    if (preparationData) {
        const workerProcess = child_process.spawn('node', ['./src/lib/track.js',
            JSON.stringify(global.config),
            JSON.stringify(preparationData.transportTemplate),
            JSON.stringify(preparationData.transportNotify),
            JSON.stringify(vehicleNotified),
            JSON.stringify(vehicles)
        ]);
        // console.log('workerProcess.pid ######################## ..',workerProcess.pid);
        // console.log('workerProcess..',workerProcess);
        // console.log('workerProcess.stdout..',workerProcess.stdout);
        workerProcess.stdout.on('data', function (data) {
            if (data) {
                // console.log('data..',data);
                sendNotification(data);
                setTimeout(() => {
                    workerProcess.kill(); // does not terminate the node process in the shell
                }, 200);

            }
        });

        workerProcess.stderr.on('data', function (data) {
            console.log('stderr ', data.toString());
        });

        workerProcess.on('close', function (code) {
            console.log(new Date().toString() + '  child process close with code ' + code + ' pid ######################## ' + workerProcess.pid);
        });

        workerProcess.on('exit', function (code) {
            console.log(new Date().toString() + ' child process exited with code ' + code + ' pid ########################  ' + workerProcess.pid);
        });
    }
}*/

/*function sendNotification(data) {
    try {
        var returnData = JSON.parse(data.toString());
        // logger.debug('Received Data (Notification) : ', data.toString());
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
}*/

