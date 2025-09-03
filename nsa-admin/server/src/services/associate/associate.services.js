/**
 * Created by Britto on 3/31/2017.
 */


var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    notificationService = require('../sms/notifications/notification.service');

exports.getAllAssociates = function(req, res) {
    nsaCassandra.Assignments.getAllAssignments(req, function(err, result) {
        if (err) {
            throwAssignmentErr(err, message.nsa1208);
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};