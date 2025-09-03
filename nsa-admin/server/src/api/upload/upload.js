/**
 * Created by admin on 25/04/17.
 */
var express = require('express')
    , router = express.Router()
    , events = require('@nsa/nsa-commons').events
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , constant = require('@nsa/nsa-commons').constants
    , _ = require('lodash')
    , s3 = require('@nsa/nsa-asset').s3
    , nsaVimeo = require('@nsa/nsa-asset').nsaVimeo
    , logger = require('../../../config/logger')
    , baseService = require('../../services/common/base.service');

router.post('/', baseService.getAssetUrl, s3.upload, function(req, res) {
    res.send({success: true, files: req.files});
});

router.post('/video', function(req, res) {
    nsaVimeo.uploadVideo(req, function (err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, 'Upload Video Error'));
        } else {
            events.emit('JsonResponse', req, res,  data);
        }
    })
});


module.exports = router;

function changeFile(req, res, next) {
    req.headers.basepath = 'senthil/test/'
    next();
}

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.NOTIFY_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;