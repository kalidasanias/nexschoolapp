/**
 * Created by senthil on 26/12/16.
 */
var session = require('express-session')
    , nsaCassandra = require('nsa-cassandra');

exports.ping = function(req, res) {

    res.status(global.constants.HTTP_OK).send(nsaCassandra.ping);

};