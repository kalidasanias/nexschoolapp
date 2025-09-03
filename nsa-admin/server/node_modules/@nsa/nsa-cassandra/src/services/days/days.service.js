/**
 * Created by Anjan on 3/30/2017.
 */

var express = require('express')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , models = require('../../models')
    , message = require('@nsa/nsa-commons').messages;

var Days = function f(options){
    var self = this;
}

Days.getAllDays =function(req, callback){
    models.instance.Days.find({},function(err, result){
           callback(err, result);
        });
};

module.exports = Days;