/**
 * Created by Kiranmai A on 3/8/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants;

exports.getLogs = function(req, res) {
    nsaCassandra.AuditLog.getLogs(req, function(err, result) {
         if (err) {
             events.emit('ErrorJsonResponse', req, res, err);
         } else {
            events.emit('JsonResponse', req, res, result);
         }
     });
};

exports.saveLogs = function(req, res) {
    nsaCassandra.AuditLog.saveLogs(req, function(err, result) {
        if (err) {
            events.emit('ErrorJsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};