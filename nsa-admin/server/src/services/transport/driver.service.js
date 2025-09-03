/**
 * Created by bharatkumarr on 20/03/17.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    constant = require('@nsa/nsa-commons').constants,
    message = require('@nsa/nsa-commons').messages,
    logger = require('../../../config/logger'),
    responseBuilder = require('@nsa/nsa-commons').responseBuilder;

exports.getAllDrivers = function(req, res) {
    nsaCassandra.Driver.getAllDrivers(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4507));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getDriver = function (req, res) {
    nsaCassandra.Driver.getDriver(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4507));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveDriver = function(req, res) {
    nsaCassandra.Driver.saveDriver(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4502));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.updateDriver = function(req, res) {
    nsaCassandra.Driver.updateDriver(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err, message.nsa4504));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.deleteDriver = function(req, res) {
    nsaCassandra.Driver.deleteDriver(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildResponseErr(err,
                err.message === message.nsa10002 ? message.nsa10002 : message.nsa4506));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

function buildResponseErr(err, message) {
    return responseBuilder.buildResponse(constant.DRIVER, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildResponseErr = buildResponseErr;