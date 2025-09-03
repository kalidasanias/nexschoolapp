/**
 * Created by Kiranmai A on 4/26/2017.
 */

var baseService = require('./base.service'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    templateConverter = require('../../converters/template.converter'),
    dateService = require('../../../src/utils/date.service');


var HolidayBase = function f(options) {
    var self = this;
};

HolidayBase.getTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var fulldate = body.fullDate;
    var date = fulldate.split('-');
    var sdate = date[0];
    var edate = date[1];
    var startDate = dateService.getFormattedDateWithoutTime(sdate);
    var endDate = dateService.getFormattedDateWithoutTime(edate);
    var params = {holiday_name: body.holidayName,  start_date: startDate, end_date: endDate};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        if (err) {
            callback(responseBuilder.buildResponse(constant.HOLIDAY_NAME, constant.APP_TYPE, 'template obj error', err.message, constant.HTTP_BAD_REQUEST), null);
        } else {
            callback(null, result);
        }
    })
};

HolidayBase.getUpdateTemplateObj = function(req, templates, callback) {
    var templateObj = {};
    try{
        var body =  req.body;
        var fulldate = body.fullDate;
        var date = fulldate.split('-');
        var sdate = date[0];
        var edate = date[1];
        var startDate = dateService.getFormattedDateWithoutTime(sdate);
        var endDate = dateService.getFormattedDateWithoutTime(edate);
        var params = {holiday_name: body.holidayName, start_date: startDate, end_date: endDate};
        templateConverter.buildTemplateObj(templates, params, function(err, result) {
            callback(err, result);
        })
    } catch(err) {
       
        callback(responseBuilder.buildResponse(constant.HOLIDAY_NAME, constant.APP_TYPE, 'template obj error', err.message, constant.HTTP_BAD_REQUEST), null);
    };
};

module.exports = HolidayBase;