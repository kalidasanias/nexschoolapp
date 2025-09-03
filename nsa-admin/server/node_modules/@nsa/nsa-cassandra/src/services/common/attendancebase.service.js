/**
 * Created by Kiranmai A on 3/14/2017.
 */

var models = require('../../models/index'),
    baseService = require('./base.service'),
    dateService = require('../../utils/date.service.js'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    templateConverter = require('../../converters/template.converter'),
    _ = require('lodash');

var AttendanceBase = function f(options) {
    var self = this;
};

AttendanceBase.constructAttendanceObj = function(req, data, callback) {
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var academicYear = headers.academic_year;
        var attendanceId = models.uuid();
        body.object_id = attendanceId;
        var users = body.users;
        var presenties = _.filter(users, ['isPresent', true]);
        var totalStrength = users.length;
        var noOfPresent = presenties.length;
        var noOfAbsent = totalStrength - noOfPresent;
        var presentPercent = (noOfPresent / totalStrength) * 100;
        var currentDate = new Date();
        var media = baseService.getMedia(req);

        var attendanceObj = new models.instance.SchoolAttendance  ({
            attendance_id: attendanceId,
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year : academicYear,
            media_name: media,
            class_id: models.uuidFromString(body.classId),
            class_name: body.className,
            section_id: models.uuidFromString(body.sectionId),
            section_name: body.sectionName,
            total_strength: totalStrength,
            no_of_present: noOfPresent,
            no_of_absent: noOfAbsent,
            present_percent: parseInt(presentPercent),
            attendance_date: body.attendanceDate,
            recorded_date: currentDate,
            recorded_by: headers.user_id,
            recorded_username: headers.user_name,
            updated_by: headers.user_id,
            updated_date : currentDate,
            updated_username: headers.user_name,
            created_date: currentDate,
            created_by: headers.user_id,
            created_firstname: headers.user_name
        });
        var attendanceObject = attendanceObj.save({return_query: true});
        var array = [attendanceObject];
        data.attendance_id = attendanceId;
        data.batchObj = array;

        callback(null, data)
    } catch (err) {
        
        callback(err, null)
    }
};


AttendanceBase.constructAttendanceDetailsObj = function(req, data, callback) {
    var users = req.body.users;
    var array;
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var academicYear = headers.academic_year;
        var currentDate = new Date();
        array = data.batchObj;
        var media = baseService.getMedia(req);

        _.forEach(users, function(value, key){
            var attendanceDetails = new models.instance.SchoolAttendanceDetails ({
                attendance_detail_id: models.uuid(),
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id: models.uuidFromString(headers.school_id),
                academic_year: academicYear,
                attendance_id: data.attendance_id,
                media_name: media,
                user_name: value.userName,
                admission_no: value.admissionNo,
                first_name: value.firstName,
                class_id: models.uuidFromString(body.classId),
                class_name: body.className,
                section_id: models.uuidFromString(body.sectionId),
                section_name: body.sectionName,
                is_present: value.isPresent,
                is_hostel: value.isHostel,
                attendance_date: body.attendanceDate,
                recorded_date: currentDate,
                recorded_by: body.recordedBy,
                recorded_username: headers.user_name,
                updated_by: headers.user_id,
                updated_date : currentDate,
                updated_username: headers.user_name,
                created_by: headers.user_id,
                created_date: currentDate,
                created_firstname: headers.user_name,
                remarks: value.remarks
            });
            var attendanceDetailsObj = attendanceDetails.save({return_query: true});
            array.push(attendanceDetailsObj);
        });
        data.batchObj = array;
        callback(null, data)
    } catch (err) {
        
        callback(err, null)
    }
};

AttendanceBase.updateAttendanceObj = function(req, data, callback) {
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var academicYear = headers.academic_year;
        var attendanceId = models.uuidFromString(req.params.id);
        var users = body.users;
        var presenties = _.filter(users, ['isPresent', true]);
        var totalStrength = users.length;
        var noOfPresent = presenties.length;
        var noOfAbsent = totalStrength - noOfPresent;
        var presentPercent = (noOfPresent / totalStrength) * 100;
        var currentDate = new Date();
        var media = baseService.getMedia(req);
        body.object_id = attendanceId;

        var queryObject = {attendance_id: attendanceId, tenant_id: tenantId, school_id: schoolId, academic_year: academicYear};

        var updateValues = {
            media_name: media,
            class_id: models.uuidFromString(body.classId),
            class_name: body.className,
            section_id: models.uuidFromString(body.sectionId),
            section_name: body.sectionName,
            total_strength: totalStrength,
            no_of_present: noOfPresent,
            no_of_absent: noOfAbsent,
            present_percent: parseInt(presentPercent),
            updated_by: headers.user_id,
            updated_date: currentDate,
            updated_username: headers.user_name
        };
        var updateQuery = models.instance.SchoolAttendance.update(queryObject, updateValues, {return_query: true});
        var array = [updateQuery];
        data.attendance_id = attendanceId;
        data.batchObj = array;

        callback(null, data)
    } catch (err) {
        callback(err, data);
    }
};


AttendanceBase.updateAttendanceDetailObjs = function(req, data, callback) {
    var users = req.body.users;
    var array;
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var academicYear = headers.academic_year;
        var currentDate = new Date();
        array = data.batchObj;
        var media = baseService.getMedia(req);

        _.forEach(users, function(value, key){
            var detailId = models.uuidFromString(value.id);
            var queryObject = {attendance_detail_id: detailId, tenant_id: tenantId, school_id: schoolId, academic_year: academicYear};

            var updateValues = {
                media_name: media,
                user_name: value.userName,
                admission_no: value.admissionNo,
                first_name: value.firstName,
                class_id: models.uuidFromString(body.classId),
                class_name: body.className,
                section_id: models.uuidFromString(body.sectionId),
                section_name: body.sectionName,
                is_present: value.isPresent,
                is_hostel: value.isHostel,
                updated_by: headers.user_id,
                updated_date : currentDate,
                updated_username: headers.user_name,
                remarks: value.remarks
            };
            var updateQuery = models.instance.SchoolAttendanceDetails.update(queryObject, updateValues, {return_query: true});
            array.push(updateQuery);
        });
        data.batchObj = array;
        callback(null, data)
    } catch (err) {
        callback(err, data)
    }
};

AttendanceBase.getTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var params = {class: body.className, section: body.sectionName};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        callback(err, result);
    })
};

function throwConverterErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.ATTENDANCE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwConverterErr = throwConverterErr;

module.exports = AttendanceBase;