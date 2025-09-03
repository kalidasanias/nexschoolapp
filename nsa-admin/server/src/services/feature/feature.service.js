/**
 * Created by Kiranmai A on 2/8/2017.
 */
var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    message = require('@nsa/nsa-commons').messages,
    _ = require('lodash'),
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants;
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    logger = require('../../../config/logger');

exports.getActiveSchoolFeatures = function(req, res) {
    nsaCassandra.Feature.getActiveSchoolFeatures(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1601));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getActiveChildFeatures = function(req, res) {
    nsaCassandra.Feature.getActiveChildFeatures(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1601));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getActiveSchoolFeaturesMobile = function(req, res) {
    nsaCassandra.Feature.getActiveSchoolFeaturesMobile(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1601));
        } else {
            response = _.orderBy(response,['mobilePriority'],['asc'])
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getFeatureChannelConfiguration = function(req, res) {
    nsaCassandra.Feature.getFeatureChannelConfiguration(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1601));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getFeatureDetails = function(req, res) {
    nsaCassandra.Feature.getFeatureDetails(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1601));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getChannelFeatureDetails = function(req, res){
    nsaCassandra.Feature.getChannelFeatureDetails(req, function(err, response){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1601));
        }else {
            events.emit('JsonResponse', req, res, response)
        }
    })
};

exports.updateChannelFeatureDetails = function(req, res){
    
    async.waterfall([
        updateChannelFeature.bind(null, req),
        executeBatch.bind(),
    ],function (err, data) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    }
    );
};
 function updateChannelFeature(req, callback){
     nsaCassandra.Feature.updateChannelFeatureDetails(req, function(err, response){
         callback(err, req, response);
     })
 };

exports.updateChannelFeature = updateChannelFeature;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, result);
    })
};
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    throw responseBuilder.buildResponse(constant.FEATURE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;