
var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError;

exports.suggestions = function(req, res) {
    nsaCassandra.Contact.suggestions(req, function(err, response) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.roles = function(req, res) {
    nsaCassandra.Contact.roles(req, function(err, response) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};
