/**
 * Created by karthik on 05-01-2017.
 */

var fs = require('fs');
var cluster = require('cluster');

var express = require('express')
    , constants = require('../../common/constants/constants')
    , models = require('../../models')
    , baseService = require('../common/base.service')
    , userConverter = require('../../converters/user.converter');

var path = require('path');

//const cassandra = require('cassandra-driver');

const homeJson = require('../../test/json-data/config/home.json');
const configJson = require('../../test/json-data/config/config.json');

exports.getHomeConfig = function(req, res) {
    res.status(constants.HTTP_OK).send(homeJson);
};

exports.getConfig = function(req, res) {
    if (cluster && cluster.worker) {
        console.log('I am worker #' + cluster.worker.id);
    }
    res.status(constants.HTTP_OK).send(configJson);
};