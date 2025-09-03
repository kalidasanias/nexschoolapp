/**
 * Created by senthil on 08/02/17.
 */

var express = require('express')
    , router = express.Router()
    , constants = require('../../../common/constants/constants')
    , baseService = require('../../common/base.service')
    , elasticSearch = require('nsa-elasticsearch')
    , nsabb = require('nsa-bodybuilder')
    , rem = require('../../../lib/events');

var Promise = require('promise');

exports.searchUsers = function(req, res) {

    var searchParams = nsabb.builderutil.getStudentSearchQueryParam(req, res);

    elasticSearch.search.searchUsers(searchParams, function (error, data, status) {
        if (error) {
            rem.emit('JsonResponse', req, res, err);
        } else {
            rem.emit('JsonResponse', req, res, data);
        }
    })
};