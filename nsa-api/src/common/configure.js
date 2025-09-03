var bodyParser = require('body-parser')
    , cors = require('cors')
    , morgan = require('morgan')
    , logger = require("../../config/logger")
    , session = require('express-session')
    , rem = require('../lib/events');

exports.init = function(app) {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(cors());
    app.use(morgan('combined', {"stream": logger.stream}));
    app.use(require('../api'));
    app.use(session({
        secret: 'ssshhhhh',
        name: 'nexriseapp',
        proxy: true,
        resave: true,
        saveUninitialized: true
    }));
    app.use(function (err, req, res, next) {
        console.log(err.stack);
        //res.status(500).send({"Error": err.stack});
        rem.emit('ErrorJsonResponse', req, res, {"status" : err});
    });
}