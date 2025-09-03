/**
 * Created by senthil on 26/12/16.
 */
var nsaCassandra = require('@nsa/nsa-cassandra')
	, device = require('express-device')
    , events = require('@nsa/nsa-commons').events
    , constant = require('@nsa/nsa-commons').constants
    , message = require('@nsa/nsa-commons').messages
    , s3 = require('@nsa/nsa-asset').s3;

exports.ping = function(req, res) {
	// console.info('ping = ', is_mobile);
    events.emit('JsonResponse', req, res, {message: 'Success'});
};

exports.testing = function(req, res) {
    events.emit('JsonResponse', req, res, [{name: 'senthil',1: "", 2: 50, 3: 60, 4: 89, 5: 87, 6:400},{name: 'kiran',1: 100, 2: 50, 3: 60, 4: 89, 5: 87, 6:400},{name: 'deepak',1: 100, 2: 50, 3: 60, 4: 89, 5: 87, 6:400}]);
};

exports.heading = function(req, res) {
    events.emit('JsonResponse', req, res, [
        {name: 'name', priority: 0, label: "Name"},
        {name: 'tamil', priority: 1, label: "Tamil(100)"},
        {name: 'english', priority: 2, label: "English(100)"},
        {name: 'maths', priority: 3, label: "Maths(100)"},
        {name: 'science', priority: 4, label: "Science(100)"},
        {name: 'social', priority: 5, label: "Social Science(100)"},
        {name: 'total', priority: 6, label: "Total(500)"}
    ]);
};

exports.data = function(req, res) {
    events.emit('JsonResponse', req, res, [{name: 'senthil',tamil: 100, english: 100, maths: 100, science: 100, social: 100, total:500},
        {name: 'deepak',tamil: 100, english: 100, maths: 100, science: 100, social: 100, total:500},
        {name: 'kiran',tamil: 100, english: 100, maths: 100, science: 100, social: 100, total:500},
        {name: 'cyril',tamil: 100, english: 100, maths: 100, science: 100, social: 100, total:500},
        {name: 'kamala',tamil: 100, english: 100, maths: 100, science: 100, social: 100, total:500},
        {name: 'pooji',tamil: 100, english: 100, maths: 100, science: 100, social: 100, total:500},
        {name: 'parga',tamil: 100, english: 100, maths: 100, science: 100, social: 100, total:500},
        ]);
};

exports.deleteObj = function(req, res) {
    var key = req.body.key
    s3.deleteObject(req, key, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14001));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};