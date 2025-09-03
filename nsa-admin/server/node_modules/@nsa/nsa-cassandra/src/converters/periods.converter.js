/**
 * Created by senthil on 3/30/2017.
 */

var schoolPeriods = require('../common/domains/SchoolPeriods'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../../../config/logger');

exports.periodsObjs = function(req, data) {
    var schoolPeriodObjs = [];
    try {
        data.forEach(function (periodObj) {
            if(!periodObj['is_break']) {
                var obj = Object.assign({}, schoolPeriods);
                obj.id = periodObj['period_id'],
                    obj.timetable_config_id = periodObj['timetable_config_id'],
                    obj.class_id = periodObj['class_id'],
                    obj.period_name = periodObj['period_name'],
                    obj.school_period_id = periodObj['school_period_id'],
                    obj.start = periodObj['period_start_time'],
                    obj.end = periodObj['period_end_time'],
                    obj.is_break = periodObj['is_break'],
                    schoolPeriodObjs.push(obj);
            }

        });
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return schoolPeriodObjs;
};