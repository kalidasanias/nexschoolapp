/**
 * Created by senthil on 16/01/17.
 */

var status = require('../domains/Status')
    , constants = require('../constants/constants')
    , express = require('express')
    , session = require('express-session')
    , CassandraStore = require("cassandra-store")
    , jwta = require('jsonwebtoken')
    , events = require('@nsa/nsa-commons').events;



exports.initValidation = function(req, res, next) {
    var isHeaderParamAvailable = false, sessionId = req.headers['session-id'];
    //console.log('isHeaderParamAvailable', sessionId);
    if (!req.path.endsWith('auth/app') && !req.path.endsWith('auth/app/student') && !req.path.endsWith('auth/app/parent') && !req.path.endsWith('auth/app/authorize') && !req.path.endsWith('auth') && !req.path.endsWith('return') &&
        !req.path.endsWith('cancel') && !req.path.endsWith('sendotp') && !req.path.endsWith('reset') &&
        (sessionId == undefined)) {
        status.code = constants.HTTP_UNAUTHORIZED;
        status.message = "Header Parameters are not provided";
        res.send({status: status});
    } else {
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
            }
        });
        if (req.headers['session-id'] != undefined) {
            cassandraStore.get(req.headers['session-id'], function (err, sess) {
                if (sess != null && sess.login != null && sess != undefined && sess.login != undefined) {
                    user = jwta.verify(sess.login, global.config.cassandra.password);
                    req.headers.userInfo = user;
                    next(); // pass control to the next handler
                } else {
                    status.code = constants.HTTP_UNAUTHORIZED;
                    status.message = "Not Valid Session";
                    status.validSession = false;
                    cassandraStore.destroy(req.sessionID, function (err, sess) {

                    });
                    res.send({data: {status: status}, validSession: false});
                }
            });
        } else { //Login
            next(); // pass control to the next handler
        }

    }
};

function throwUserErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.USER_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwUserErr = throwUserErr;