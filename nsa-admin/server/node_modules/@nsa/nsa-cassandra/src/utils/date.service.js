/**
 * Created by senthilPeriyasamy on 12/27/2016.
 */
var dateFormat = require('dateformat'),
    baseService = require('../services/common/base.service')
    moment = require('moment-timezone');

exports.getDateFormatted = function(inputDate, format) {
    if(inputDate != null && inputDate != undefined) {
        var formattedDate = dateFormat(inputDate, format);
        return formattedDate;
    } else {
        return inputDate;
    }
};

exports.getFormattedDate = function(inputDate) {
    if(inputDate != null && inputDate != undefined) {
        /*var date = moment.tz(inputDate, global.config.zone).format();*/
        var formattedDate = dateFormat(inputDate, "mmm d yyyy h:MM TT");
        return formattedDate;
    } else {
        return inputDate;
    }
};

exports.formatDate =  function (date) {
    if(date != null && date != undefined) {
        var formattedDate = dateFormat(date.toString(), "mmm d yyyy h:MM TT");
        return formattedDate;
    } else {
        return date;
    }

}

exports.getFormattedDateWithoutTime = function(inputDate) {
    if(inputDate != null && inputDate != undefined) {
        /*var date = moment.tz(inputDate, global.config.zone).format();*/
        var formattedDate = dateFormat(inputDate, "mmm d yyyy");
        return formattedDate;
    } else {
        return inputDate;
    }
};

exports.getCurrentDate = function() {
    return this.formatDate(new Date());
};

exports.getMonthAndDate = function(date) {
    if(date != null && date != undefined) {
        var month = dateFormat(date, "mmm");
        var day = dateFormat(date, "d");
        return {month:month, day:day};
    } else {
        return date;
    }
}
