/**
 * Created by senthil on 2/2/2017.
 */
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: global.config.elasticSearch.host + ':' + global.config.elasticSearch.port,
    log: global.config.elasticSearch.log
});

module.exports = client;