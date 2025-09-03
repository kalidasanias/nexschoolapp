/**
 * Created by Kiranmai A on 2/23/2017.
 */

var client = require('./es/es.config');

var esindex = function f(options) {
    var self = this;
};

esindex.createIndex = function(params, callback) {
    client.getMaster.indices.create(params, function(error, response){
        callback(error, response);
    });
};

esindex.indexExists = function(params, callback) {
    client.getMaster.indices.exists(params, function(error, response){
        callback(error, response);
    });
};

esindex.indexDoc = function(doc, callback) {
    client.getMaster.index(doc, function(error, response){
        callback(error, response);
    });
};

esindex.bulkDoc = function(doc, callback) {
    client.getMaster.bulk(doc, function(error, response){
        callback(error, response);
    });
};

module.exports = esindex;