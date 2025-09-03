/**
 * Created by senthil on 3/30/2017.
 */
var models = require('../../models/index'),
    baseService = require('./base.service'),
    dateService = require('../../utils/date.service.js'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    _ = require('lodash'),
    dateUtils = require('@nsa/nsa-commons').dateUtils,
    constants = require('../../common/constants/constants'),
    templateConverter = require('../../converters/template.converter');

var TimetableBase = function f(options) {
    var self = this;
};

TimetableBase.buildTimetableConfig = function(req, data) {
    var batchObj = data.batchObj || [];
    var classPeriods = data.classPeriods || {};
    var breaks = data.breaks || {};
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var classes = body.classes;
        var date = new Date();
        var time1 = req.body.schoolHours.from;
        var time2 = req.body.schoolHours.to;
        req.body.schoolHours.from = dateUtils.convertTo24Hour(time1.toLowerCase());
        req.body.schoolHours.to = dateUtils.convertTo24Hour(time2.toLowerCase());
        var days = _.map(body.days, function(item) {
            return parseInt(item);
        });
        _.forEach(classes, function(value, key) {
            var classId = models.uuidFromString(value.id);
            var configObj = new models.instance.SchoolTimetableConfiguration ({
                timetable_config_id: models.uuid(),
                tenant_id: tenantId,
                school_id: schoolId,
                applicable_class: classId,
                school_periods: classPeriods[classId],
                school_breaks: breaks[classId],
                working_days: days,
                school_hours: req.body.schoolHours,
                updated_date: date,
                updated_by: headers.user_id,
                updated_username: headers.user_name,
                created_date: date,
                academic_year: headers.academic_year,
                created_by: headers.user_id,
                created_firstname: headers.user_name
            });
            configObj = configObj.save({return_query: true});
            batchObj.push(configObj);
        })

    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4603);
    }
    data.batchObj = batchObj;
    return data;
};

TimetableBase.buildUpdateTimetableConfigObj = function(req, data) {
    var batchObj = data.batchObj || [];
    var breaks = data.breaks || [];
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var timetableConfigId = req.params.id;
        var date = new Date();
        var days = _.map(body.days, function(item) {
            return parseInt(item);
        });
        var time1 = req.body.schoolHours.from;
        var time2 = req.body.schoolHours.to;
        req.body.schoolHours.from = dateUtils.convertTo24Hour(time1.toLowerCase());
        req.body.schoolHours.to = dateUtils.convertTo24Hour(time2.toLowerCase());
        var queryObj = { timetable_config_id: models.uuidFromString(timetableConfigId), tenant_id: tenantId, school_id: schoolId, academic_year: headers.academic_year };
        var updateValues = {
            school_periods: data.schoolPeriodsIds,
            working_days: days,
            school_hours: req.body.schoolHours,
            updated_date: date,
            school_breaks: breaks,
            updated_by: headers.user_id,
            updated_username: headers.user_name
        };
        var configUpdateObj = models.instance.SchoolTimetableConfiguration.update(queryObj, updateValues, {return_query: true});
        batchObj.push(configUpdateObj);
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4601);
    }
    data.batchObj = batchObj;
    return data;
}

TimetableBase.buildDeleteTimetableConfigObj = function(req, data) {
    var batchObj = data.batchObj || [];
    try {
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var timetableConfigId = req.params.id;

        var queryObj = { timetable_config_id: models.uuidFromString(timetableConfigId), tenant_id: tenantId, school_id: schoolId };
        var configDeleteObj = models.instance.SchoolTimetableConfiguration.delete(queryObj, {return_query: true});
        batchObj.push(configDeleteObj);
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4605);
    }
    data.batchObj = batchObj;
    return data;
}

TimetableBase.buildSchoolTimetable = function(req) {
    var data;
    var schoolTimetableObj;
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var date = new Date();
        var timetableId = models.uuid();
        var subId = body.subjectId != null ? models.uuidFromString(body.subjectId) : null;
        var empId = body.empId;
        var subEmpAssociation = {};
        subEmpAssociation[subId] = empId;

        schoolTimetableObj = new models.instance.SchoolTimetable ({
            timetable_id: timetableId,
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year: headers.academic_year,
            class_id: models.uuidFromString(body.classId),
            section_id: models.uuidFromString(body.sectionId),
            period_id: parseInt(body.periodId),
            day_id: parseInt(body.dayId),
            // emp_id: empId,
            sub_emp_association: subEmpAssociation,
            // subject_id: subId,
            updated_date: date,
            updated_by: headers.user_id,
            updated_username: headers.user_name,
            created_date: date,
            created_by: headers.user_id,
            created_firstname: headers.user_name
        });
        schoolTimetableObj = schoolTimetableObj.save({return_query: true});
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4610);
    }
    data = {batchObj : schoolTimetableObj, backupObj: timetableId};
    return data;
};

TimetableBase.buildClassTimetable = function(req) {
    var array = [];
    var classTimetableObj;
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var date = new Date();
        classTimetableObj = new models.instance.ClassTimetable ({
            id: models.uuid(),
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year: headers.academic_year,
            class_id: models.uuidFromString(body.classId),
            class_teacher_id: body.classTeacherUserName,
            section_id: models.uuidFromString(body.sectionId),
            updated_date: date,
            updated_by: headers.user_id,
            updated_username: headers.user_name
        });
        classTimetableObj = classTimetableObj.save({return_query: true});
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4610);
    }
    array.push(classTimetableObj)
    data = { batchObj: array };
    return data;
};

TimetableBase.addClassTimetable = function(req) {
    var classTimetableObj;
    try {
        var body = req.body;
        var timetableId = req.params.id;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var subId = body.subjectId != null ? models.uuidFromString(body.subjectId) : null;
        var empId = body.empId;
        var subEmpAssociation = {};
        subEmpAssociation[subId] = empId;

        var queryObj = {
            timetable_id: models.uuidFromString(timetableId),
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year: headers.academic_year,
            class_id: models.uuidFromString(body.classId),
            section_id: models.uuidFromString(body.sectionId)
        };
        var updateValues = {
            sub_emp_association: {'$add': subEmpAssociation},
            updated_date: currentDate,
            updated_by: headers.user_id,
            updated_username: headers.user_name
        };

        classTimetableObj = models.instance.SchoolTimetable.update(queryObj, updateValues);

    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4613);
    }
    return classTimetableObj;
};

TimetableBase.updateSchoolTimetable = function(req) {
    var swapTimetableObj;
    try {
        var body = req.body;
        var timetableId = req.params.id;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var subEmpAssociation = baseService.getMapFromFormattedMap(body.subEmpAssociation);

        var queryObj = {
            timetable_id: models.uuidFromString(timetableId),
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year: headers.academic_year,
            class_id: models.uuidFromString(body.classId),
            section_id: models.uuidFromString(body.sectionId)
        };
        var updateValues = {
           /* emp_id: body.empId,*/
            sub_emp_association: subEmpAssociation || null,
            /*subject_id: body.subjectId ? models.uuidFromString(body.subjectId) : null,*/
            updated_date: currentDate,
            updated_by: headers.user_id,
            updated_username: headers.user_name
        };

        swapTimetableObj = models.instance.SchoolTimetable.update(queryObj, updateValues);

    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4613);
    }
    return swapTimetableObj;
};

TimetableBase.deleteSchoolTimetable = function(req) {
    var schoolTimetableObj;
    try {
        var body = req.body;
        var timetableId = req.params.id;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();

        var queryObj = {
            timetable_id: models.uuidFromString(timetableId),
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year: headers.academic_year,
            class_id: models.uuidFromString(body.classId),
            section_id: models.uuidFromString(body.sectionId)
        };
        schoolTimetableObj = models.instance.SchoolTimetable.delete(queryObj);
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4607);
    }
    return schoolTimetableObj;
};

TimetableBase.deleteMultiSchoolTimetable = function(req, data) {
    var schoolTimetableObj;
    var batchObj = [];
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        _.forEach(data.swapTimetable, function(val){
            var queryObj = {
                timetable_id: val.timetable_id,
                tenant_id: tenantId,
                school_id: schoolId,
                academic_year: headers.academic_year,
                class_id: models.uuidFromString(body.classId),
                section_id: models.uuidFromString(body.sectionId)
            };
            schoolTimetableObj = models.instance.SwapTimetable.delete(queryObj, {return_query: true});
            batchObj.push(schoolTimetableObj);
        })
        data.batchObj = batchObj;
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4619);
    }
    return data;
};

TimetableBase.buildSwapTimetableObj = function(req) {
    var swapTimetableObjs = [];
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var duration = body.validUpto;
        var dates = duration.split('-');
        var totalDays = dateUtils.getCountOfDates(dates[0], dates[1], parseInt(body.dayId));

        _.forEach(totalDays, function(value, key){
            var weekNo = dateUtils.getCurrentWeekNo(value);
            var swapTimetableObj = new models.instance.SwapTimetable ({
                timetable_id: models.uuid(),
                tenant_id: tenantId,
                school_id: schoolId,
                academic_year: headers.academic_year,
                class_id: models.uuidFromString(body.classId),
                section_id: models.uuidFromString(body.sectionId),
                period_id: parseInt(body.periodId),
                day_id: parseInt(body.dayId),
                day_date: models.datatypes.LocalDate.fromString(value),
                week_no: parseInt(weekNo),
                emp_id: body.empId,
                subject_id: models.uuidFromString(body.subjectId),
                updated_date: currentDate,
                updated_by: headers.user_id,
                updated_username: headers.user_name,
                is_special_day: false
            });
            var swapTimetable = swapTimetableObj.save({return_query: true});
            swapTimetableObjs.push(swapTimetable);
        });
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4611);
    }
    var data = { batchObj: swapTimetableObjs };
    return data;
};


TimetableBase.buildSpecialDayTimetableObj = function(req, data) {
    var specialDayTimetableObjs = [];
    var batchObj = data.batchObj || [];
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var date = baseService.getFormattedDate(data.date);
        var weekNo = dateUtils.getCurrentWeekNo(date);

        _.forEach(data.schoolTimetable, function(value, key){

            var specialDayTimetableObj = new models.instance.SwapTimetable ({
                timetable_id: models.uuid(),
                tenant_id: tenantId,
                school_id: schoolId,
                academic_year: headers.academic_year,
                class_id: value.class_id,
                section_id: value.section_id,
                period_id: value.period_id,
                day_id: value.day_id,
                day_date: models.datatypes.LocalDate.fromDate(date),
                week_no: parseInt(weekNo),
                /*emp_id: value.emp_id,
                subject_id: value.subject_id,*/
                sub_emp_association: value.sub_emp_association,
                updated_date: new Date(),
                updated_by: headers.user_id,
                updated_username: headers.user_name,
                created_by: headers.user_id,
                created_firstname: headers.user_name,
                created_date: new Date(),
                is_special_day: true
            });
            var specialDayTimetable = specialDayTimetableObj.save({return_query: true});
            batchObj.push(specialDayTimetable);
        });
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4615);
    }
    data.batchObj = batchObj ;
    return data;
};


TimetableBase.buildOverAllSwapObjs = function(req, data) {
    var swapTimetableObjs = [];
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        _.forEach(data, function(value, key){
            var dayId = value.day_id;
            var duration = body.validUpto;
            var dates = duration.split('-');
            var totalDays = dateUtils.getCountOfDates(dates[0], dates[1], parseInt(dayId));
            _.forEach(totalDays, function(dateValue, dateKey){
                var weekNo = dateUtils.getCurrentWeekNo(dateValue);
                var swapTimetableObj = new models.instance.SwapTimetable ({
                    timetable_id: models.uuid(),
                    tenant_id: tenantId,
                    school_id: schoolId,
                    academic_year: headers.academic_year,
                    class_id: models.uuidFromString(body.classId),
                    section_id: models.uuidFromString(body.sectionId),
                    period_id: parseInt(value.period_id),
                    day_id: parseInt(dayId),
                    day_date: models.datatypes.LocalDate.fromString(dateValue),
                    week_no: parseInt(weekNo),
                    emp_id: body.empId,
                    subject_id: models.uuidFromString(body.subjectId),
                    updated_date: currentDate,
                    updated_by: headers.user_id,
                    updated_username: headers.user_name
                });
                var swapTimetable = swapTimetableObj.save({return_query: true});
                swapTimetableObjs.push(swapTimetable);
            });
        });
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4607);
    }
    var data = { batchObj: swapTimetableObjs };
    return data;
};

TimetableBase.buildNotesObj = function(req) {
    try {
        var body = req.body;
        var notesObj = {};
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var weekNo = dateUtils.getCurrentWeekNo(parseInt(body.dayId));
        var date = new Date(body.start);
        var files = req.files;
        _.forEach(files, function(value, key){
            var tagName = value.originalname.split('.')[0];
            notesObj[value.key] = tagName;
        });
        var attachmentTypeObj = {
            attachment: notesObj,
            description: body.desc,
            updated_by: headers.user_id,
            updated_username: headers.user_name
        };
        var attachmentObj = new models.instance.CalendarData ({
            id: models.uuid(),
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year: headers.academic_year,
            class_id: models.uuidFromString(body.classId),
            section_id: models.uuidFromString(body.sectionId),
            day_id: parseInt(body.dayId),
            day_date: models.datatypes.LocalDate.fromString(body.start),
            week_no: weekNo,
            month_no : date.getMonth(),
            year_no: date.getFullYear(),
            period_id: parseInt(body.periodId),
            attachments: attachmentTypeObj,
            created_date: currentDate,
            updated_date: currentDate,
            updated_by: headers.user_id,
            updated_username: headers.user_name
        });
        attachmentObj.save();

    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4607);
    }
};

TimetableBase.updateNotesObj = function(req, data) {
    try {
        var body = req.body;
        var notesObj = {};
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var weekNo = dateUtils.getCurrentWeekNo(parseInt(body.dayId));
        var files = req.files;
        _.forEach(files, function(value, key){
            var tagName = value.originalname.split('.')[0];
            notesObj[value.key] = tagName;
        });
        _.forEach(data.notesUrl, function(value, key){
            notesObj[value.id] = value.name;
        });
        var attachmentTypeObj = {
            attachment: notesObj,
            description: body.desc,
            updated_by: headers.user_id,
            updated_username: headers.user_name
        };

        var queryObj = {
            id : data.id,
            created_date: data.createdDate
        }
        var updateValues = {
            attachments: attachmentTypeObj
        };

        models.instance.CalendarData.update(queryObj, updateValues);

    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4702);
    }
};

TimetableBase.getTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var params = {subject_name: _.map(body.subEmpAssociation, function(value){return value.subName;}), class_hour_name: body.period.period_name};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

TimetableBase.getSpecialDayTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    models.instance.Days.findOne({id: JSON.parse(body.dayId)}, function(err, data){
        var params = {Date: dateService.getFormattedDateWithoutTime(body.date) , Day: data.name};
        templateConverter.buildTemplateObj(templates, params, function(err, result) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
            }
        })
    });
};

TimetableBase.getTimetableTemplateObj = function(req, templates, callback) {
    var headers = baseService.getHeaders(req);
    var body =  req.body;
    var params = { class_name: body.className,
        section_name: body.sectionName,
        academic_year: headers.academic_year };
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

function filterClassDetails(data, value) {
    var classInfo  = _.filter(data, {'id': value});
    return classInfo;
}

function filterSectionDetails(data, value) {
    var sectionInfo  = _.filter(data, {'sectionId': value});
    return sectionInfo;
}

TimetableBase.updateAllClassTimetable = function(req, data, callback) {
    try {
        var array = data.batchObj || [];
        if(!_.isEmpty(data)) {
            _.forEach(data, function(value, key){
                if(!_.isEmpty(value.subject_id) && !_.isEmpty(value.emp_id)) {
                    var queryObject = { timetable_id: value.timetable_id, tenant_id: value.tenant_id,
                        school_id:  value.school_id, academic_year: value.academic_year, class_id: value.class_id,  section_id: value.section_id};
                    var subjmap = {};
                    subjmap[value.subject_id] = value.emp_id;
                    var updateValues = { sub_emp_association:  subjmap};

                    var updateQuery = models.instance.SchoolTimetable.update(queryObject, updateValues, {return_query: true});
                    array.push(updateQuery);
                }
            });
        }
        data.batchObj = array;
        callback(null, req, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.TIME_TABLE, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

module.exports = TimetableBase;

