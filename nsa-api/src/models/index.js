/**
 *  created by kiranmai on 27/12/2016
 **/
var models = require('express-cassandra');
var env = process.env.NODE_ENV || "development";
global.config = require('../../config/config.json')[env];

//Tell express-cassandra to use the models-directory, and
//use bind() to load the models using cassandra configurations.
models.setDirectory( __dirname ).bind(
    {
        clientOptions: {
            contactPoints:  global.config.cassandra.contactPoints,
            protocolOptions: global.config.cassandra.protocolOptions,
            keyspace: global.config.cassandra.keyspace,
            queryOptions: global.config.cassandra.queryOptions
        }
    },
    function(err) {
        if(err) console.log(err);
        else console.log(models.uuid());
    }

);

module.exports = models;