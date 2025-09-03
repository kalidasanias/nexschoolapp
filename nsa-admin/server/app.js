var env = process.env.NODE_ENV || "development";
global.config = require('./config/config.json')[env];

var express = require('express')
    , app = express()
    , http = require('http').Server(app)
    , configuration = require('./src/common/configure')
    , port = process.env.PORT || global.config.server.port;

configuration.init(app);



http.listen(port, function () {
    console.log('Nexrise server listening on port ', port);
});