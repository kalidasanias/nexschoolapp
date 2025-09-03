/**
 * Created by senthil on 10/02/17.
 */
'use strict';

var param = require('./domains/param');

var domains = function f(options) {
    var self = this;
};

domains.getParamObject = function(req) {
    return param;
};

module.exports = domains;