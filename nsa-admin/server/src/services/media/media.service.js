/**
 * Created by Kiranmai A on 2/14/2017.
 */

var express = require('express')
    , request = require('request')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , models = require('../../models');

function getMediaTypes(findQuery, callback) {
    var findQuery =  {
        is_channel: true
    };
    models.instance.MediaType.find(findQuery, {allow_filtering: true}, function (err, result) {
        if(err){
            callback(err)
        } else {
            callback(result);
        }
    });
};
exports.getMediaTypes = getMediaTypes;