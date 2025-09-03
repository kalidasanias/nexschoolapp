/**
 * Created by senthil on 3/30/2017.
 */
var events = require('@nsa/nsa-commons').events,
    nsaCassandra = require('@nsa/nsa-cassandra'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    _= require('lodash'),
    constant = require('@nsa/nsa-commons').constants;

const timeTableConfig = require('../../test/json-data/timetable/get-timetable-by-employee.json');

exports.getTimetablebyEmpId = function(req, res) {
    events.emit('JsonResponse', req, res, timeTableConfig);
};
