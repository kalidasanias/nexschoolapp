/**
 * Created by Kiranmai A on 3/29/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    _ = require('lodash'),
    async = require('async'),
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger');

exports.getAllPeriods = function(req, res) {
    nsaCassandra.Periods.getAllPeriods(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa3201));
        } else {
            result = _.orderBy(result, ['id'], ['asc'])
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getAllClassTimings = function(req, res) {
    async.parallel({
        schoolPeriods: getSchoolPeriodsByClass.bind(null, req),
        config: getConfig.bind(null, req)
    }, function(err, result) {
        result = !_.isEmpty(result.config) ? result : [];
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa3201));
        } else {
            getClassTimings(result, function(err, data) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa3201));
                } else {
                    events.emit('JsonResponse', req, res, data);
                }
            })

        }
    })
};


function getSchoolPeriodsByClass(req, callback) {
    nsaCassandra.Periods.getAllClassTimings(req, function(err, result) {
        callback(err, result);
    })
}
exports.getSchoolPeriodsByClass = getSchoolPeriodsByClass;

function getConfig(req, callback) {
    nsaCassandra.Timetable.getClassTimetableConfig(req, function(err, result) {
        callback(err, result);
    })
}
exports.getConfig = getConfig;

function getClassTimings(data, callback) {
    var classTimings = [];
    try {
        if(!_.isEmpty(data)) {
            _.forEach(data.schoolPeriods, function(val) {
                val['days'] = data.config.working_days;
                classTimings.push(val);
            })
        }
        callback(null, classTimings)
    } catch(err) {
        callback(err, null)
    }

}
exports.getClassTimings = getClassTimings;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.PERIODS_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;
