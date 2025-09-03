/**
 * Created by Kiranmai A on 2/28/2017.
 */

var ResponseBuilder = function f(options) {
    var self = this;
};

ResponseBuilder.buildResponse = function(name, type, message, detail, errorCode) {
    var response = {};
    response.name = name;
    response.type = type;
    response.message = message;
    response.detail = detail;
    response.errorCode = errorCode;

    return response;
};

module.exports = ResponseBuilder;