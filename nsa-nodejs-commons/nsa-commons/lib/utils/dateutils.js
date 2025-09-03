/**
 * Created by senthil on 12/02/17.
 */

var moment = require('moment'),
    currentWeekNumber = require('current-week-number'),
    datesBetween = require('dates-between'),
    dateFormat = require('dateformat');

var DateUtils = function f(options) {
    var self = this;
};

DateUtils.getDateFormatted = function(inputDate, format) {
    if(inputDate != null && inputDate != undefined) {
        var formattedDate = dateFormat(inputDate, format);
        return formattedDate;
    } else {
        return inputDate;
    }
};

DateUtils.getFormattedDate = function(inputDate) {
    if(inputDate != null && inputDate != undefined) {
        /*var date = moment.tz(inputDate, global.config.zone).format();*/
        var formattedDate = dateFormat(inputDate, "mmm d yyyy h:MM TT");
        return formattedDate;
    } else {
        return inputDate;
    }
};

DateUtils.getNoOfDays = function(startDate, endDate) {
    var a = moment(startDate);
    var b = moment(endDate);
    var noOfDays = b.diff(a, 'days')+1;  // +1 to include the startDate
    return noOfDays;
};

DateUtils.calculateWeekendDays = function (fromDate, toDate){
    var weekendDayCount = 0;

    while(fromDate < toDate){
        fromDate.setDate(fromDate.getDate() + 1);
        if(fromDate.getDay() === 0){
            ++weekendDayCount ;
        }
    }
    return weekendDayCount ;
};

DateUtils.checkSatAndSunWeek = function(startDate) {
    var startDate = moment(startDate); //saturday
    var day = startDate.day(); //6 = saturday
    var nthOfMoth = 0;
    var haveDay = false;

    if(day == 6 || day == 0) {
        nthOfMoth = Math.ceil(startDate.date() / 7);
        haveDay = true;
    }

    return {weekNo: nthOfMoth, haveDay: haveDay, day: day}
}

DateUtils.checkDateInRange = function(startDate, endDate, date) {
    var check = false;
    if(moment(date).isBetween(startDate, endDate) || moment(date).isSame(startDate) || moment(date).isSame(endDate)) {
        check = true;
    }

    return check;
};

DateUtils.getCurrentWeekNo = function(date) {
    var weekNo = currentWeekNumber(date);
    return weekNo;
};

DateUtils.getDatesBetweenTwoDates = function(fromDate, toDate) {
    var dates = Array.from(datesBetween(fromDate, toDate));
    return dates;
};

DateUtils.getCountOfDates = function( date1, date2, dayToSearch ) {
    var dateObj1 = parseDate(date1);
    var dateObj2 = parseDate(date2);
    var count = 0;
    var dates = [];
    while ( dateObj1.getTime() <= dateObj2.getTime() ) {
        if (dateObj1.getDay() == dayToSearch) {
            dates.push(formatDate(dateObj1));
            count++
        }
        dateObj1.setDate(dateObj1.getDate() + 1);
    }
    return dates;
};

function parseDate(date) {
    var parts = date.split('/');
    return new Date(parts[0], parts[1]-1, parts[2]);
};
exports.parseDate = parseDate;

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};
exports.formatDate = formatDate;

DateUtils.convertTo24Hour = function (time) {
    var hours = parseInt(time.substr(0, 2));
    if(time.indexOf('am') != -1 && hours == 12) {
        time = time.replace('12', '0');
    }
    if(time.indexOf('pm')  != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
    }
    return time.replace(/(am|pm)/, '');
}

DateUtils.convertTo12Hour = function (time) {
    var time_part_array = time.split(":");
    var ampm = 'AM';
    if (time_part_array[0] >= 12) {
        ampm = 'PM';
    }
    if (time_part_array[0] > 12) {
        time_part_array[0] = time_part_array[0] - 12;
    }
    var formatted_time = time_part_array[0] + ':' + time_part_array[1] + ' ' + ampm;
    return formatted_time;
}

DateUtils.getDatesFromWeekNum = function (weekNum, dayId, startTime) {
    var startTime = startTime.split(':')
    var endOfWeek = moment().week(weekNum).startOf('week').add(dayId, 'days').set({hour:startTime[0],minute:startTime[1],second:startTime[2],millisecond:0});
    var date = endOfWeek.format();

    return date;
};

DateUtils.getDatesByMonthOfYear = function (monthNo, year) {
    var dates = {};
    try{
        var startDate = moment([year]).month(monthNo).startOf('month').format();
        var endDate = moment(startDate).endOf('month').format();
        dates.startDate = new Date(startDate.toString());
        dates.endDate = new Date(endDate.toString());

    } catch (err) {
        return;
    }
    return dates;
};

DateUtils.getStartEndDatesOfYearOfWeek = function (weekNo, year) {
    var dates = {};
    try{
        var startDate = moment([year]).week(weekNo).startOf('week').format();
        var endDate = moment(startDate).endOf('week').format();
        dates.startDate = new Date(startDate.toString());
        dates.endDate = new Date(endDate.toString());

    } catch (err) {
        return;
    }
    return dates;
};

DateUtils.getDatesByYearOfWeek = function (weekNo, year) {
    try{
        var oneDay = 24*60*60*1000;
        var startDate = moment([year]).week(weekNo).startOf('week').format();
        var endDate = moment(startDate).endOf('week').format();
        var dates = [] ;
        var fromDate = new Date(startDate.toString())
        var toDate = new Date(endDate.toString())
        var diffDays = Math.round(Math.abs((toDate.getTime() - fromDate.getTime())/(oneDay)));
        for(var i =0; i <= diffDays; i++ ) {
            var fromDate = new Date(startDate.toString())
            fromDate.setDate(fromDate.getDate() + i)
            dates.push(fromDate);
        }
    } catch (err) {
        return;
    }
    return dates;
};


DateUtils.setTimeToDate = function(date, time) {
    var startTime = time.split(':');
    var sDate = moment(date).set({hour:startTime[0],minute:startTime[1],second:0,millisecond:0});
    return sDate.format();
}

module.exports = DateUtils;
