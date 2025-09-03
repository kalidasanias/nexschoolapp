/**
 * Created by senthil on 3/30/2017.
 */
var models = require('../../models/index'),
    baseService = require('./base.service'),
    dateService = require('../../utils/date.service.js'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    constants = require('../../common/constants/constants'),
    schoolPeriodsConverter = require('../../converters/periods.converter.js'),
    dateUtils = require('@nsa/nsa-commons').dateUtils,
    _ = require('lodash'),
    logger = require('../../../../../../config/logger');

var PeriodBase = function f(options) {
    var self = this;
};

PeriodBase.buildSchoolPeriodObject = function(req)  {
    var schoolPeriodsObjs = [];
    var classPeriods = {};
    var breaks = {};
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var classes = body.classes;
        var schoolPeriods = body.periods;
        var schoolPeriodsObj;
        var date = new Date();
        _.forEach(classes, function(value, key){
            var schoolPeriodsIds = [];
            var breakPeriods = [];
            var classId = models.uuidFromString(value.id)
            _.forEach(schoolPeriods, function(value, key){
                var schoolPeriodId = models.uuid();
                var breakPeriod = value.break;
                if (breakPeriod) {
                    breakPeriods.push(schoolPeriodId)
                }
                var periodHour = value.periodHours.split(" - ");
                periodHour[0] = dateUtils.convertTo24Hour(periodHour[0].toLowerCase());
                periodHour[1] = dateUtils.convertTo24Hour(periodHour[1].toLowerCase());
                var time1 = models.datatypes.LocalTime.fromString(periodHour[0]);
                var time2 = models.datatypes.LocalTime.fromString(periodHour[1]);
                schoolPeriodsObj = new models.instance.SchoolPeriods ({
                    school_period_id: schoolPeriodId,
                    tenant_id: tenantId,
                    school_id: schoolId,
                    academic_year: headers.academic_year,
                    class_id: classId,
                    period_id: parseInt(value.periodId) || "",
                    period_name: value.periodName || "",
                    period_start_time: time1,
                    period_end_time: time2,
                    is_break: breakPeriod || false
                });
                schoolPeriodsObj = schoolPeriodsObj.save({return_query: true});
                schoolPeriodsObjs.push(schoolPeriodsObj)
                schoolPeriodsIds.push(schoolPeriodId)
            })
            breaks[classId] = breakPeriods;
            classPeriods[classId] = schoolPeriodsIds;
        })
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4603)
    }
    var backupObj = {batchObj: schoolPeriodsObjs, classPeriods: classPeriods, breaks: breaks}
    return backupObj;
};

PeriodBase.buildSchoolPeriodUpdateObj = function(req, data)  {

    var schoolPeriodsObjs = [];
    var schoolPeriodsIds = [];
    var batchObj = data.batchObj || [];
    var breaks = [];
    try {
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var body = req.body;
        var schoolPeriods = body.periods;
        var date = new Date();
        var schoolPeriodsObj;
        var classId = models.uuidFromString(body.classId);
        _.forEach(schoolPeriods, function(value, key){
            var schoolPeriodId = models.uuid();
            var breakPeriod = value.break;
            if (breakPeriod) {
                breaks.push(schoolPeriodId)
            }
            var periodHour = value.periodHours.split(" - ");
            periodHour[0] = dateUtils.convertTo24Hour(periodHour[0].toLowerCase());
            periodHour[1] = dateUtils.convertTo24Hour(periodHour[1].toLowerCase());
            var time1 = models.datatypes.LocalTime.fromString(periodHour[0]);
            var time2 = models.datatypes.LocalTime.fromString(periodHour[1]);
            schoolPeriodsObj = new models.instance.SchoolPeriods ({
                school_period_id: schoolPeriodId,
                tenant_id: tenantId,
                school_id: schoolId,
                academic_year: headers.academic_year,
                class_id: classId,
                period_id: parseInt(value.periodId) || "",
                period_name: value.periodName || "",
                period_start_time: time1,
                period_end_time: time2,
                is_break: breakPeriod || false
            });

            var schoolPeriodsObj = schoolPeriodsObj.save({return_query: true});
            batchObj.push(schoolPeriodsObj)
            schoolPeriodsIds.push(schoolPeriodId)
        })
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4601)
    }
    data.batchObj = batchObj;
    data['schoolPeriodsIds'] = schoolPeriodsIds;
    data['breaks'] =  breaks;
    return data;
};

PeriodBase.buildSchoolPeriodDeleteObj = function(req, data)  {
    var batchObj = data.batchObj || [];
    try {
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var classId = data.applicable_class;
        var schoolPeriods = data.school_periods;
        _.forEach(schoolPeriods, function(value, key){
            var queryObj = {school_period_id: value, tenant_id: tenantId,
                school_id: schoolId, academic_year: headers.academic_year, class_id: classId};

            var schoolPeriodsDeleteObjs = models.instance.SchoolPeriods.delete(queryObj, {return_query: true});
            batchObj.push(schoolPeriodsDeleteObjs);
        })
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4601)
    }

    data.batchObj = batchObj;
    return data;
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.TIME_TABLE, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

module.exports = PeriodBase;