// Promise Version
import {Injectable}     from '@angular/core';
declare var moment: any;
declare var Date: any;

@Injectable()
export class DateService {

    getWeekNumber(d: any): any {
        d = new Date(+d);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart: any = new Date(d.getFullYear(), 0, 1);
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1) / 7);

        return [d.getFullYear(), weekNo];
    }

    /* Example date Formats */

    /* stringToDate("17/9/2014","dd/MM/yyyy","/");
     stringToDate("9/17/2014","mm/dd/yyyy","/")
     stringToDate("9-17-2014","mm-dd-yyyy","-") */

    stringToDate(date: any, format: any, delimiter: any) {
        var formatLowerCase = format.toLowerCase();
        var formatItems = formatLowerCase.split(delimiter);
        var dateItems = date.split(delimiter);
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy");
        var month = parseInt(dateItems[monthIndex]);
        month -= 1;
        var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
        return formatedDate;
    }

    getCurrentWeek(): any {
        var firstday = moment().startOf('week').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        var lastday = moment().endOf('week').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        return [firstday, lastday];
    }

    getStartTime(date: any): any {
        date = new Date(date)
        date.setHours(0,0,0,0);
        //var start = moment(date).startOf('day').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        return date.toISOString();
    }

    getEndTime(date: any): any {
        date = new Date(date)
        date.setHours(23,59,59,999);
        return date.toISOString();
    }

    getCurrentMonth(): any {
        var date = new Date();
        var monthStartDay = new Date(date.getFullYear(), date.getMonth(), 2).toISOString();
        var endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59);
        var monthEndDay = endDate.toISOString();

        return [monthStartDay, monthEndDay];
    }

    getToday(): any {
        var start = new Date();
        start.setHours(0,0,0,0);

        var end = new Date();
        end.setHours(23,59,59,999);

        return [new Date(start).toISOString(), new Date(end).toISOString()];
    }

    getLastMonth(): any {
        var date = new Date();
        var monthStartDay = new Date(date.getFullYear(), date.getMonth() - 1, 2).toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var endDate = new Date(date.getFullYear(), date.getMonth(), 0);
        endDate.setHours(23, 59, 59);
        var monthEndDay = endDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');

        return monthStartDay + ' - ' + monthEndDay;
    }

    getSelectedMonth(value: any): any {
        var date = new Date();
        var monthStartDay = new Date(date.getFullYear(), value - 1, 2).toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var endDate = new Date(date.getFullYear(), value, 0);
        endDate.setHours(23, 59, 59);
        var monthEndDay = endDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');

        return monthStartDay + ' - ' + monthEndDay;
    }

    getNoOfDays = function (startDate: any, endDate: any): any {
        var a = moment(startDate);
        var b = moment(endDate);
        var noOfDays = 1;
        if (a != b) {
            noOfDays = b.diff(a, 'days') + 1;  // +1 to include the startDate
        }

        return noOfDays;
    };

    checkDateInRange = function (startDate: any, endDate: any, date: any): any {
        var check = false;
        if (moment(date).isBetween(startDate, endDate) || moment(date).isSame(startDate) || moment(date).isSame(endDate)) {
            check = true;
        }

        return check;
    };

    getDates = function (startDate: any, endDate: any): any[] {
        try {
            var oneDay = 24 * 60 * 60 * 1000;
            var startDate = moment(startDate);
            var endDate = moment(endDate);
            var dates = [];
            var fromDate = new Date(startDate.toString())
            var toDate = new Date(endDate.toString())
            var diffDays = Math.round(Math.abs((toDate.getTime() - fromDate.getTime()) / (oneDay)));
            for (var i = 0; i <= diffDays; i++) {
                var fromDate = new Date(startDate.toString())
                fromDate.setDate(fromDate.getDate() + i)
                dates.push(fromDate);
            }
        } catch (err) {
            return;
        }
        return dates;
    };

    checkSatAndSunWeek(startDate: any): any {
        var startDate = moment(startDate); //saturday
        var day = startDate.day(); //6 = saturday
        var nthOfMoth = 0;
        var haveDay = false;

        if (day == 6 || day == 0) {
            nthOfMoth = Math.ceil(startDate.date() / 7);
            haveDay = true;
        }

        return {weekNo: nthOfMoth, haveDay: haveDay, day: day}
    }


}
