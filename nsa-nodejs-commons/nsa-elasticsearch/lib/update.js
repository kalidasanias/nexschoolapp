/**
 * Created by Kiranmai A on 2/23/2017.
 */

var client = require('./es/es.config')

var update = function f(options) {
    var self = this;
};

//Ex:
/*params = {
 index: global.config.elasticSearch.indexDefaultName,
 type: global.config.elasticSearch.defaultTypeName,
 id: '1',
 body: {
 title: 'Test 1',
 tags: ['y', 'z'],
 published: true,
 }
 }*/
update.updateDoc = function(params, callback) {
    client.getMaster.update(params, function (error, response) {
        callback(error, response);
    });
};

module.exports = update;