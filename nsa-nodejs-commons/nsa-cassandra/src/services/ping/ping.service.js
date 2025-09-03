/**
 * Created by senthil on 26/12/16.
 */
var responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    BaseError = require('@nsa/nsa-commons').BaseError;

var Ping = function f(options) {
    var self = this;
};

Ping.getStatus = function(callback) {
    var response = {};
    response.code = 200;
    response.message = "Success";
    throw new BaseError(responseBuilder.buildResponse('ping', 'app', 'ping error', 'ping detail error', '400'));
    /*callback(null, responseBuilder.buildResponse('ping', null, 'ping error', null, '400'));*/
};

module.exports = Ping;