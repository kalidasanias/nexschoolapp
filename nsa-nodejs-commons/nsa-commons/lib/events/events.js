/**
 * Created by Sai Deepak on 12-Sep-16.
 */
var events = require('events');
var session = require('express-session')
    , CassandraStore = require("cassandra-store");

//create an object of EventEmitter class by using above reference
var rem = new events.EventEmitter();
rem.setMaxListeners(0)

rem.on('JsonResponse', function (req, res, data) {
    deleteSession(req, res);
    res.status(200).send({success: true, data: data});
});

rem.on('SearchResponse', function (req, res, data) {
    deleteSession(req, res);
    data.success = true;
    res.status(200).send(data);
});

rem.on('ErrorJsonResponse', function (req, res, err) {
    deleteSession(req, res);
    res.status(500).send({success: false, data: err});
});

function deleteSession(req, res) {
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
    var curentReqSession = req.sessionID;
    if (req.headers.session_id != undefined && curentReqSession != req.headers.session_id) {
        req.sessionID = req.headers.session_id;
        cassandraStore.destroy(curentReqSession, function (err) {

        })
    }
}
exports.deleteSession=deleteSession;

module.exports = rem;
