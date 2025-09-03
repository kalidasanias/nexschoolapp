/**
 * Created by Kiranmai A on 3/4/2017.
 */

var express = require('express'),
    models = require('../../models/index'),
    baseService = require('../common/base.service');

var Scheduler = function f(options) {
    var self = this;
};

Scheduler.getRepeatOptions = function(req, callback) {
    var headers = baseService.getHeaders(req);
    models.instance.RepeatOption.find({}, function(err, result){
        callback(err, result);
    });
};

module.exports = Scheduler;