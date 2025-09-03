/**
 * Created by Cyril on 4/11/2017.
 */
var express = require('express')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , models = require('../../models')
    , message = require('@nsa/nsa-commons').messages
    , schoolHolidaysConverter   = require('../../converters/holidays.converter')
    , logger = require('../../../config/logger')
    , dateUtils = require('@nsa/nsa-commons').dateUtils
    , constant = require('@nsa/nsa-commons').constants;

var SchoolHolidays = function f(options){
    var self = this
};

SchoolHolidays.getHolidaysTypes = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.HOLIDAY_TYPE_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.HOLIDAY_TYPE_PERMISSIONS);

        models.instance.SchoolHolidayTypes.find(findQuery, {allow_filtering: true}, function (err, result) {
            callback(err, schoolHolidaysConverter.holidaysObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

SchoolHolidays.getHolidayTypeById = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var holidayTypeId = models.uuidFromString(req.params.id);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var findQuery = {
        holiday_type_id: holidayTypeId,
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: headers.academic_year
    };
    models.instance.SchoolHolidayTypes.findOne(findQuery, function (err, result) {
        callback(err, schoolHolidaysConverter.holidaysObj(req, result));
    });
};

SchoolHolidays.saveHolidayType = function (req, callback) {
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var currentDate = new Date();
    var Holidays = new models.instance.SchoolHolidayTypes({
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: headers.academic_year,
        updated_by: headers.user_id,
        updated_username: headers.user_name,
        updated_date: currentDate,
        created_by: headers.user_id,
        created_firstname: headers.user_name,
        created_date: currentDate,
        holiday_type_id: models.uuid(),
        holiday_type: body.holidayType,
        description: body.description,
    });
    Holidays.save(function (err, result) {
        callback(err, result)
    });
};

SchoolHolidays.updateHolidayType = function (req, callback) {
    var body = req.body;
    var holidayTypeId = models.uuidFromString(req.params.id);
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var currentDate = new Date();
    var queryObject = {
        holiday_type_id: holidayTypeId,
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: headers.academic_year
    };
    var updateValues = {
        holiday_type: body.holidayType,
        description: body.description,
        updated_by: headers.user_id,
        updated_username: headers.user_name,
        updated_date: currentDate
    };
    models.instance.SchoolHolidayTypes.update(queryObject, updateValues, function (err, result) {
        callback(err, result);
    });
};

SchoolHolidays.deleteHolidayType = function (req, callback) {
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var holidayTypeId = models.uuidFromString(req.params.id);
    var academicYear = headers.academic_year;

    var queryObject = {
        holiday_type_id: holidayTypeId,
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: academicYear
    };
    models.instance.SchoolHolidayTypes.delete(queryObject, function (err, result) {
        callback(err, result);
    });
};

SchoolHolidays.findHolidayTypeInHolidays = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var holidayTypeId = req.params.id;
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        holiday_type_id: models.uuidFromString(holidayTypeId),
        academic_year: headers.academic_year
    };
    models.instance.SchoolHolidays.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

/* schoolHolidays*/

SchoolHolidays.getSchoolHolidaysByMonth = function (req, callback) {
    var userType = req.headers.userInfo.user_type;
    var havePermissions = baseService.haveAnyPermissions(req, constant.HOLIDAY_PERMISSIONS);
    if(havePermissions || userType == constant.STUDENT) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.HOLIDAY_PERMISSIONS);
        var queryParams = req.query;
        var monthNo = queryParams.monthNo;  // Ex: 11
        var year = queryParams.year;   //Ex: 2017
        var dates = dateUtils.getDatesByMonthOfYear(monthNo, year);
        //findQuery.start_date = {'$gte' : dates.startDate};
        //findQuery.end_date = {'$lte': dates.endDate};
        models.instance.SchoolHolidays.find(findQuery, {allow_filtering: true}, function (err, result) {
            callback(err, schoolHolidaysConverter.schoolHolidayObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

SchoolHolidays.getAllSchoolHolidays = function (req, callback) {
    var userType = req.headers.userInfo.user_type;
    var havePermissions = baseService.haveAnyPermissions(req, constant.HOLIDAY_PERMISSIONS);
    if(havePermissions || userType == constant.STUDENT) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.HOLIDAY_PERMISSIONS);
        models.instance.SchoolHolidays.find(findQuery, {allow_filtering: true}, function (err, result) {
            callback(err, schoolHolidaysConverter.schoolHolidaysObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

SchoolHolidays.getSchoolHolidayById = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var holidayId = models.uuidFromString(req.params.id);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var findQuery = {
        holiday_id: holidayId,
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: headers.academic_year
    };
    models.instance.SchoolHolidays.findOne(findQuery, function (err, result) {
        callback(err, schoolHolidaysConverter.schoolholidaysObj(req, result));
    });
};


SchoolHolidays.saveSchoolHoliday = function (req, callback) {
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var fulldate = body.fullDate;
        var date = fulldate.split('-');
        var sdate = date[0];
        var edate = date[1];
        var startDate = baseService.getFormattedDate(sdate);
        var endDate = baseService.getFormattedDate(edate);
        var currentDate = new Date();
        var holidayId = models.uuid();

        var schoolHolidays = new models.instance.SchoolHolidays({
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year: headers.academic_year,
            updated_by: headers.user_id,
            updated_username: headers.user_name,
            updated_date: currentDate,
            created_date: currentDate,
            created_by : headers.user_id,
            created_firstname : headers.user_name,
            holiday_type_id: models.uuidFromString(body.holidayTypeId),
            holiday_id: holidayId,
            start_date: startDate,
            end_date: endDate,
            holiday_type:body.holidayType,
            holiday_name: body.holidayName
        });
        var saveObj = schoolHolidays.save({return_query: true});
        var array = [saveObj];
        data = {holiday_id: holidayId, batchObj: array};
        callback(null, data);

    } catch(err) {
        callback(err, null);
    }
};

SchoolHolidays.updateSchoolHoliday = function (req, callback) {
    try {
        var body = req.body;
        var holidayId = models.uuidFromString(req.params.id);
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var holidayTypeId = models.uuidFromString(body.holidayTypeId);
        var fulldate = body.fullDate;
        var date = fulldate.split('-');
        var sdate = date[0];
        var edate = date[1];
        var startDate = baseService.getFormattedDate(sdate);
        var endDate = baseService.getFormattedDate(edate);
        var currentDate = new Date();
        var queryObject = {
            holiday_id: holidayId,
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year: headers.academic_year
        };
        var updateValues = {
            holiday_name: body.holidayName,
            holiday_type_id: holidayTypeId,
            start_date: startDate,
            end_date: endDate,
            holiday_type:body.holidayType,
            updated_by: headers.user_id,
            updated_username: headers.user_name,
            updated_date: currentDate
        };

        var updateObj = models.instance.SchoolHolidays.update(queryObject, updateValues,{return_query: true});
        var array = [updateObj];
        data = {holiday_id: holidayId, batchObj: array};
        callback(null, data);

    } catch (err){
        callback(err, null);
    }

};

SchoolHolidays.deleteSchoolHoliday = function (req, callback) {
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var holidayId = models.uuidFromString(req.params.id);
    var academicYear = headers.academic_year;

    var queryObject = {
        holiday_id: holidayId,
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: academicYear
    };
    models.instance.SchoolHolidays.delete(queryObject, function (err, result) {
        callback(err, result);
    });
};

SchoolHolidays.getSchoolWeekOff = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var findQuery = { tenant_id: tenantId, school_id: schoolId };
    models.instance.SchoolWeekOffDetails.findOne(findQuery, function (err, result) {
        callback(err, result);
    });
};

SchoolHolidays.saveSchoolWeekOff = function (req, callback) {
    try {
        var data = [];
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var id = models.uuid();
        var Holidays = new models.instance.SchoolWeekOffDetails ({
            id: id,
            tenant_id: tenantId,
            school_id: schoolId,
            updated_by: headers.user_id,
            updated_first_name: headers.user_name,
            updated_date: currentDate,
            saturday: body.saturdays,  // week no's for saturday as holiday
            sunday: body.sundays  //  week no's for sunday as holiday
        });
        var saveQuery = Holidays.save({return_query: true});
        data = {batchObj: [saveQuery], id: id};
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

SchoolHolidays.updateSchoolWeekOff = function (req, callback) {
    try {
        var data = [];
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var weekOffId = req.params.id;
        var id = models.uuidFromString(weekOffId);

        var queryObj = {id: id,  tenant_id: tenantId, school_id: schoolId};
        var updateValues = {
            updated_by: headers.user_id,
            updated_first_name: headers.user_name,
            updated_date: currentDate,
            saturday: body.saturdays,  // week no's for saturday as holiday
            sunday: body.sundays
        };
        var updateQuery = models.instance.SchoolWeekOffDetails.update(queryObj, updateValues, {return_query: true});
        data = {batchObj: [updateQuery], id: id};
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

//For IOS Start
SchoolHolidays.getSchoolHolidays = function (req, callback) {
    var userType = req.headers.userInfo.user_type;
    var havePermissions = baseService.haveAnyPermissions(req, constant.HOLIDAY_PERMISSIONS);
    if(havePermissions || userType == constant.STUDENT) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.HOLIDAY_PERMISSIONS);
        models.instance.SchoolHolidays.find(findQuery, {allow_filtering: true}, function (err, result) {
            callback(err, schoolHolidaysConverter.schoolHolidayObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

SchoolHolidays.getSchoolHolidaysByMonthOfYear = function (req, callback) {
    var userType = req.headers.userInfo.user_type;
    var havePermissions = baseService.haveAnyPermissions(req, constant.HOLIDAY_PERMISSIONS);
    if(havePermissions || userType == constant.STUDENT) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.HOLIDAY_PERMISSIONS);
        var queryParams = req.query;
        var monthNo = queryParams.monthNo;  // Ex: 11
        var year = queryParams.year;   //Ex: 2017
        var dates = dateUtils.getDatesByMonthOfYear(monthNo, year);
        findQuery.start_date = {'$gte' : dates.startDate};
        findQuery.start_date = {'$lte': dates.endDate};
        findQuery.end_date = {'$gte' : dates.startDate};
        models.instance.SchoolHolidays.find(findQuery, {allow_filtering: true}, function (err, result) {
            callback(err, schoolHolidaysConverter.schoolHolidayObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};
//For IOS End

module.exports = SchoolHolidays;