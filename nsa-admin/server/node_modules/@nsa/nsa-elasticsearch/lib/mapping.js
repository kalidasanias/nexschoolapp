/**
 * Created by Kiranmai A on 2/23/2017.
 */

'use strict';

var client = require('./es/es.config');

var mapping = function f(options) {
    var self = this;
};

mapping.initMapping = function(params, callback) {
    client.getMaster.indices.putMapping(params, function(error, response){
        callback(error, response);
    });
};

module.exports = mapping;