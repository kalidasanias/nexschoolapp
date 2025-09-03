/**
 * Created by admin on 25/04/17.
 */
var nsaCassandra = require('@nsa/nsa-cassandra')
    , device = require('express-device')
    , events = require('@nsa/nsa-commons').events
    , s3 = require('@nsa/nsa-asset').s3
    , logger = require('../../../config/logger');

exports.listBuckets = function(req, res) {
    s3.listBuckets(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.createBuckets = function(req, res) {
    s3.createBuckets(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};
