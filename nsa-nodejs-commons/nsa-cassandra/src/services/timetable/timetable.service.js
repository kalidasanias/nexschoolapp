/**
 * Created by senthil on 3/30/2017.
 */

var express = require('express'),
    models = require('../../models/index'),
    baseService = require('../common/base.service'),
    constant = require('@nsa/nsa-commons').constants,
    timetableBase = require('../common/timetablebase.service.js'),
    timetableConverter = require('../../converters/timetable.converter'),
    constants = require('../../common/constants/constants'),
    _ = require('lodash'),
    logger = require('../../../config/logger');

var Timetable = function f(options) {
    var self = this;
};

Timetable.getAllClassTimetable = function(req, callback) {
    var data = {};
    var array = [];
    models.instance.SchoolTimetable.eachRow({}, {fetchSize : 5000}, function(n, value){
        // invoked per each row in all the pages , here value is row
        var queryObject = { timetable_id: value.timetable_id, tenant_id: value.tenant_id,
            school_id:  value.school_id, academic_year: value.academic_year, class_id: value.class_id,  section_id: value.section_id};
        var subjmap = {};
        subjmap[value.subject_id] = value.emp_id;
        var updateValues = { sub_emp_association:  subjmap };

        var updateQuery = models.instance.SchoolTimetable.update(queryObject, updateValues, {return_query: true});
        array.push(updateQuery);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            data['batchObj'] = array;
            callback(err, req, data);
        }
    });
};

Timetable.saveTimetableConfig = function(req, data, callback) {
    callback(null, timetableBase.buildTimetableConfig(req, data));
};

Timetable.updateTimetableConfig = function(req, data, callback) {
    callback(null, timetableBase.buildUpdateTimetableConfigObj(req, data));
};

Timetable.deleteTimetableConfig = function(req, data, callback) {
    callback(null, timetableBase.buildDeleteTimetableConfigObj(req, data));
};

Timetable.findTimetableConfigInTimetable = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var body = req.body;
    var classId = body.applicable_class;
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        class_id: models.uuidFromString(classId)
    };
    models.instance.SchoolTimetable.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Timetable.getTimetableByClssAndSec = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        class_id : models.uuidFromString(req.params.classId),
        section_id : models.uuidFromString(req.params.sectionId),
        academic_year: headers.academic_year
    }
    models.instance.SchoolTimetable.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.contructSchoolTimetable = function(req, subjectId, empId, periodId, dayId) {
    var schoolTimetableObj;
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var date = new Date();
        var timetableId = models.uuid();
        var subId = models.uuidFromString(subjectId);
        var subEmpAssociation = {};
        subEmpAssociation[subId] = empId;

        schoolTimetableObj = new models.instance.SchoolTimetable ({
            timetable_id: timetableId,
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year: headers.academic_year,
            class_id: models.uuidFromString(body.classId),
            section_id: models.uuidFromString(body.sectionId),
            period_id: parseInt(periodId),
            day_id: parseInt(dayId),
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
    return schoolTimetableObj;
};


Timetable.saveSchoolTimetable = function(req, callback) {
    callback(null, timetableBase.buildSchoolTimetable(req));
};

Timetable.addClassTimetable = function(req, callback) {
    callback(null, timetableBase.addClassTimetable(req));
};

Timetable.updateSchoolTimetable = function(req, callback) {
    callback(null, timetableBase.updateSchoolTimetable(req));
};

Timetable.deleteSchoolTimetable = function(req, callback) {
    callback(null, timetableBase.deleteSchoolTimetable(req));
};

Timetable.deleteMultiSchoolTimetable = function(req, data, callback) {
    callback(null, timetableBase.deleteMultiSchoolTimetable(req, data));
};

Timetable.saveSwapTimetable = function(req, callback) {
    callback(null, timetableBase.buildSwapTimetableObj(req));
};

Timetable.saveSpecialDayTimetable = function(req, data, callback) {
    callback(null, timetableBase.buildSpecialDayTimetableObj(req, data));
};

Timetable.getOverallSwapObj = function(req, data, callback) {
    callback(null, timetableBase.buildOverAllSwapObjs(req, data));
};

Timetable.getTimetableByEmpClassAndSec = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var body = req.body;
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        /*emp_id: body.empId,*/
        sub_emp_association: {'$contains': body.empId},
        class_id: models.uuidFromString(body.classId),
        section_id: models.uuidFromString(body.sectionId)
    };
    models.instance.SchoolTimetable.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Timetable.getSchoolTimetable = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.TIMETABLE_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.TIMETABLE_PERMISSIONS);
        models.instance.SchoolTimetable.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, []);
    }
};

Timetable.getSpecialDayTimetable = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var havePermissions = baseService.haveAnyPermissions(req, constant.SPECIAL_TIMETABLE_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.SPECIAL_TIMETABLE_PERMISSIONS);
        models.instance.SwapTimetable.find(findQuery, {allow_filtering: true}, function (err, result) {
            callback(err, result);
        });
    } else {
        callback(null, []);
    }
};

Timetable.getTimetableConfigByClass = function(req, data, callback) {
    var resultSet = [];
    var error;
    _.forEach(data, function(value, key) {
        var headers = baseService.getHeaders(req);
        models.instance.SchoolTimetableConfiguration.findOne({
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id),
            applicable_class: value.class_id
        }, {allow_filtering: true}, function(err, result){
            error = err;
            resultSet.push(result);
        });
    });
    callback(error, resultSet);
};

Timetable.updateEmpClassification = function(req, data, callback) {
    try {
        var array = data.batchObj || [];
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var classId = models.uuidFromString(body.classId);
        var sectionId = models.uuidFromString(body.sectionId);
        var classAssociation = {};
        classAssociation[classId] = sectionId;
        var queryObj = {
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id),
            user_name: body.classTeacherUserName
        };
        var updateValues = {
            class_associations: {'$add':classAssociation},
            class_teacher: true
        };
        var obj = models.instance.EmployeeClassification.update(queryObj, updateValues, {return_query: true});
        array.push(obj)
        data.batchObj = array;
        callback(null, data)

    } catch (err) {
        callback(err, null)
    }
};

Timetable.saveClassTimetable = function(req, callback) {
    callback(null, timetableBase.buildClassTimetable(req));
};

Timetable.getAllTimetableConfig = function(req, permissions, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, permissions);
    if(havePermissions) {

        var findQuery = baseService.getFindAllQuery(req, true, permissions);
        models.instance.SchoolTimetableConfiguration.find(findQuery, {allow_filtering: true}, function(err, result){
            if (err) {
                callback(err, null)
            } else {
                callback(null, timetableConverter.timetableConfigObjs(req, result));
            }
        });
    } else {
        callback(null, []);
    }
};

Timetable.getAllTimeTableConfigWithoutPer = function(req, callback) {
        var headers = baseService.getHeaders(req);
        var findQuery = baseService.getFindQuery(req);
            findQuery.academic_year = headers.academic_year;
        models.instance.SchoolTimetableConfiguration.find(findQuery, {allow_filtering: true}, function(err, result){
            if (err) {
                callback(err, null)
            } else {
                callback(null, timetableConverter.timetableConfigObjs(req, result));
            }
        });
};

Timetable.getTimetableConfigById = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var configId = req.params.id;
    models.instance.SchoolTimetableConfiguration.findOne({
        timetable_config_id: models.uuidFromString(configId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year
    }, {allow_filtering: true}, function(err, result){
        if (err) {
            callback(err, null)
        } else {
            callback(null, timetableConverter.timetableConfigObj(req, result));
        }
    });
};

Timetable.getClassTimetableConfig = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var classId = req.params.id;
    models.instance.SchoolTimetableConfiguration.findOne({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        applicable_class: models.uuidFromString(classId),
        academic_year: headers.academic_year
    }, {allow_filtering: true}, function(err, result){
        if (err) {
            callback(err, null)
        } else {
            callback(null, (result ? timetableConverter.timetableConfigObj(req, result) : []));
        }
    });
};

Timetable.getTimetableByClssAndSecAndDay = function(req, callback) {
    var headers = baseService.getHeaders(req);

    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        class_id : models.uuidFromString(req.params.classId),
        section_id : models.uuidFromString(req.params.sectionId),
        day_id : parseInt(req.params.dayId)
    }
    models.instance.SchoolTimetable.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getTimetableByClSecDay = function(req, callback) {
    var headers = baseService.getHeaders(req);

    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        class_id : models.uuidFromString(req.body.classId),
        section_id : models.uuidFromString(req.body.sectionId),
        day_id : parseInt(req.body.dayId)
    }
    models.instance.SchoolTimetable.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getTimetableByEmp = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        /*emp_id : req.params.id*/
        sub_emp_association: {'$contains': req.params.id}
    }
    models.instance.SchoolTimetable.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getTimetableByEmpId = function(req, empId, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        /*emp_id : req.params.id*/
        sub_emp_association: {'$contains': empId}
    }
    models.instance.SchoolTimetable.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getTimetableByEmpByDayId = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        /*emp_id : req.params.id,*/
        sub_emp_association: {'$contains': req.params.id},
        day_id : parseInt(req.params.dayId)
    }
    models.instance.SchoolTimetable.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getClassesByEmp = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        class_teacher_id : req.params.id
    }
    models.instance.ClassTimetable.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

//Swap Details
Timetable.getSwapDetailsByCSWeekNo = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        week_no : parseInt(req.query.weekNo),
        class_id : models.uuidFromString(req.params.classId),
        section_id: models.uuidFromString(req.params.sectionId)
    }
    models.instance.SwapTimetable.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getSwapDetailsByCSDate = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        day_date : models.datatypes.LocalDate.fromString(req.query.date),
        class_id : models.uuidFromString(req.params.classId),
        section_id: models.uuidFromString(req.params.sectionId),
        day_id: parseInt(req.params.dayId)
    }
    models.instance.SwapTimetable.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getSwapDetailsByWeekNoAndEmpId = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        week_no : parseInt(req.query.weekNo),
        emp_id : req.params.id,
        academic_year: headers.academic_year
    }
    models.instance.SwapTimetable.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getSwapDetailsByDateDayAndEmpId = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        day_date : models.datatypes.LocalDate.fromString(req.query.date),
        emp_id : req.params.id,
        day_id : parseInt(req.params.dayId)
    }
    models.instance.SwapTimetable.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

//Attachments

Timetable.saveNotes = function(req, callback) {
    callback(null, timetableBase.buildNotesObj(req))
};

Timetable.updateNotes = function(req, data, callback) {
    callback(null, timetableBase.updateNotesObj(req, data))
};

Timetable.getAttachmentsByCSDayDate = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var body = req.body;
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        day_date : models.datatypes.LocalDate.fromString(body.start),
        class_id : models.uuidFromString(body.classId),
        section_id: models.uuidFromString(body.sectionId),
        day_id: parseInt(body.dayId),
        period_id : parseInt(body.periodId),
        academic_year: headers.academic_year
    }
    models.instance.CalendarData.findOne(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, timetableConverter.notesObj(req, result));
    })
};

Timetable.deleteAttachment = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var body = req.body, timetableAttach = {};
    var queryObject = {
        id: models.uuidFromString(req.params.id),
        created_date: body.createdDate
    };
    var files = req.body.notesUrl;
    if (files && files.length > 0) {
        body.attachments = files;
        var existingFiles = baseService.getExistingFiles(body);
        _.forEach(existingFiles, function (value, key) {
            timetableAttach[value.id] = value.name;
        });
        var attachmentTypeObj = {
            attachment :  timetableAttach,
            description: null,
            updated_by: headers.user_id,
            updated_username: headers.user_name
        };
    }

    req.body.notesUrl = existingFiles;
    var updateValues = { updated_by : headers.user_id, updated_username : headers.user_name, attachments: attachmentTypeObj};
    console.info('updateValues..',updateValues);

    models.instance.CalendarData.update(queryObject, updateValues, function(err, result){
        callback(err,  result);
    })
};

Timetable.getNotesByMonthAndYear = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var body = req.body;
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        class_id : models.uuidFromString(body.classId),
        section_id: models.uuidFromString(body.sectionId),
        month_no : parseInt(body.monthNo),
        year_no: parseInt(body.yearNo)
    }
    models.instance.CalendarData.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, timetableConverter.notesObjArray(req, result));
    })
};

Timetable.getAttachmentsByCSWeekNo = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        class_id : models.uuidFromString(req.params.classId),
        section_id: models.uuidFromString(req.params.sectionId),
        week_no : parseInt(req.query.weekNo)
    }
    models.instance.CalendarData.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getAttachmentsByCSDate = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        day_date : models.datatypes.LocalDate.fromString(req.query.date),
        class_id : models.uuidFromString(req.params.classId),
        section_id: models.uuidFromString(req.params.sectionId),
        day_id: parseInt(req.params.dayId)
    }
    models.instance.CalendarData.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getAttachmentsByWeekNoAndEmpId = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        week_no : parseInt(req.query.weekNo),
        updated_by :  req.params.id
    };
    models.instance.CalendarData.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getAttachmentsByDateDayAndEmpId = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        day_date : models.datatypes.LocalDate.fromString(req.query.date),
        updated_by : req.params.id,
        day_id : parseInt(req.params.dayId)
    }
    models.instance.CalendarData.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getTimetableByClSecDate = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var date = baseService.getFormattedDate(req.body.date);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        class_id : models.uuidFromString(req.body.classId),
        section_id : models.uuidFromString(req.body.sectionId),
        day_date : models.datatypes.LocalDate.fromDate(date),
        is_special_day: true
    }
    models.instance.SwapTimetable.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getTodayUploadedNotesByEmpId = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var start = moment().startOf('day').toDate(); // set to 12:00 am today
    var end = moment().endOf('day').toDate(); // set to 23:59 pm today
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        academic_year : headers.academic_year,
        updated_by :  req.params.id,
        updated_date : {'$gte': start, '$lte': end}
    };
    models.instance.CalendarData.find(queryObject,{allow_filtering : true}, function(err, result){
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

Timetable.getClassTeacherByClsSec = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        class_id : models.uuidFromString(req.params.classId),
        section_id : models.uuidFromString(req.params.sectionId)
    }
    models.instance.ClassTimetable.findOne(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.getEmpTimetableDetails = function(req, callback) {

    var havePermissions = baseService.haveAnyPermissions(req, constant.EMP_TIMETABLE_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getUserFindAllQuery(req, false, constant.EMP_TIMETABLE_PERMISSIONS);

        models.instance.EmployeeClassification.find(findQuery, {allow_filtering : true}, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, []);
    }
};


Timetable.getEmpPeriods = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var queryObject = {
        tenant_id : models.timeuuidFromString(headers.tenant_id),
        school_id : models.uuidFromString(headers.school_id),
        academic_year : headers.academic_year
    }
    models.instance.SchoolTimetable.find(queryObject,{allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.findEmpInClassTimetable = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
        findQuery.academic_year = headers.academic_year;
     findQuery.class_teacher_id = req.params.id;
    models.instance.ClassTimetable.find(findQuery, {allow_filtering : true}, function(err, result){
        callback(err, result);
    })
};

Timetable.findSubjectIdInTimetable = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
        findQuery.academic_year = headers.academic_year;
        findQuery.sub_emp_association = {'$contains_key': models.uuidFromString(req.params.id)};
    models.instance.SchoolTimetable.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

module.exports = Timetable;
