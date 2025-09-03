/**
 * Created by Kiranmai A on 2/23/2017.
 */

var client = require('./es/es.config');

var esdelete = function f(options) {
    var self = this;
};

esdelete.delete  = function(params, callback) {
    client.getMaster.indices.delete(params, function(error, response){
        callback(error, response);
    });
};

esdelete.deleteDoc = function(params, callback) {
    client.getMaster.delete(params, function (error, response) {
        callback(error, response);
    });
};

module.exports = esdelete;