/**
 * Created by senthil on 2/20/2017.
 */
var bodyParser = require('body-parser')
    , cors = require('cors')
    , morgan = require('morgan')
    , logger = require("../../config/logger")
    , validator = require('express-validator')
    , cookieParser = require('cookie-parser')
    , session = require('express-session')
    , events = require('@nsa/nsa-commons').events
    , device = require('express-device')
    , CassandraStore = require("cassandra-store")
    , passport = require('passport')
    , models = require('express-cassandra');

exports.init = function(app) {
    app.use(bodyParser.json({limit: "50mb"}))
    app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}))
    app.use(validator());
    // app.use(cors({origin : 'http://localhost:8081', methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'], credentials: true}));
    app.use(cors());
    app.use(morgan('combined', {"stream": logger.stream}));

    /*app.set('trust proxy', 1);*/
    var cassandraStore = new CassandraStore({
        "table": "sessions",
        "client": null,
        "clientOptions": {
            "contactPoints": global.config.cassandra.contactPoints,
            "keyspace": global.config.cassandra.keyspace,
            "queryOptions": {
                "prepare": true
            },
            authProvider: new models.driver.auth.DsePlainTextAuthProvider(global.config.cassandra.username, global.config.cassandra.password)
        },
        "saveUninitialized": false,
        "unset": "destroy"
    });
    /*var appSession = session({
        secret: 'rvsbx8b2-rsjm-xo4t-p5f4-apv2npeibhcd',
        resave: false,
        saveUninitialized: true
    });*/
    app.use(cookieParser('rvsbx8b2-rsjm-xo4t-p5f4-apv2npeibhcd'));
    app.use(device.capture());
    device.enableViewRouting(app, {
    "noPartials":true
    });
    app.use(session({
        secret: 'rvsbx8b2-rsjm-xo4t-p5f4-apv2npeibhcd',
        store: cassandraStore,
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
        cookie: {
            expires: false,
            maxAge : 30000,
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(require('../api'));

    console.log("common/config ku vanthuruchu")

    app.use(function (err, req, res, next) {
        //res.status(500).send({"Error": err.stack});
        //events.emit('ErrorJsonResponse', req, res, {"status" : err});
    });
}