/**
 * Created by intellishine on 8/18/2017.
 */
var models = require('../../../models/index'),
    baseService = require('../../common/base.service'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    _ = require('lodash'),
    logger = require('../../../../config/logger');


var Onboard = function f(options) {
    var self = this;
};

Onboard.getAllOnboardNotifications = function(req, callback){
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
     findQuery.feature_id = models.uuidFromString(headers.feature_id);
    models.instance.SchoolNotifications.find(findQuery,{allow_filtering: true}, function (err, result) {
        callback(err, result);
    });
};


module.exports = Onboard;
