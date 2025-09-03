/**
 * Created by senthil-p on 12/06/17.
 */
var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    http = require('http'),
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    request = require('ajax-request'),
    logger = require('../../common/logging');


exports.getSchoolDetails = function (req, res) {
    nsaCassandra.School.getSchoolDetails(req, function(err, result){
        if (err) {
            logger.debugLog(req,'Unable to get school details ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getSchoolLogo = function (req, res) {
    nsaCassandra.School.getSchoolDetails(req, function(err, result) {
        if (err) {
            logger.debugLog(req,'Unable to get school details for logo  ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12001));
        } else {
            request({
                url: global.config.aws.s3AccessUrl + result.logo,
                method: 'GET',
                isBuffer: true,
                headers: {
                    Accept: '*'
                }
            }, function(err, resp, body) {
                var data = 'data:' + resp.headers['content-type'] + ';base64,' + body.toString('base64');
                events.emit('JsonResponse', req, res, data);
            });
        }

    });
};

exports.updateSchoolImages = function (req, res) {
    nsaCassandra.School.updateSchoolDetailsImages(req, function(err, result) {
        if (err) {
            logger.debugLog(req,'Unable to get school Images  ', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa12002));
        } else {
            result['message'] = message.nsa12003;
            events.emit('JsonResponse', req, res, result);
        }

    });
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.SCHOOL, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;
