/**
 * Created by kiranmai on 7/12/17.
 */


var baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    dateService = require('../utils/date.service'),
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../config/logger');

exports.marklistObjs = function (req, data) {
    var marklistObjs = [];
    try {
        _.forEach(data, function (value, key) {
            marklistObjs.push(marklistObj(req, value));
        });
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return marklistObjs;
};

function marklistObj(req, value) {
    var obj;
    try {
        if(!_.isEmpty(value)) {
            var updatedDate = dateService.getFormattedDate(value['updated_date']);

            obj = {}; //Object.assign({}, Domain)
            obj.marklistId = value.mark_list_id || null;
            obj.tenantId = value.tenant_id || null;
            obj.schoolId = value.school_id || null;
            obj.academicYear = value.academic_year || null;
            obj.examScheduleId = value.exam_schedule_id || null;
            obj.writtenExamId = value.written_exam_id || null;
            obj.writtenExamName = value.written_exam_name || null;
            obj.classId = value.class_id || null;
            obj.className = value.class_name || null;
            obj.sectionId = value.section_id || null;
            obj.sectionName = value.section_name || null;
            obj.clssec = value.class_name + ' - ' + value.section_name;
            obj.subjects = value.subjects || null;
            obj.updatedBy = value.updated_by || null;
            obj.updatedDate = updatedDate || null;
            obj.updatedDateAndName = value['updated_firstname']+' - '+updatedDate;
            obj.createdBy = value.created_by || null;
            obj.createdDate = value.created_date || null;
            obj.status = value.status || false;
            obj.generated_marklist = value.generated_marklist || null;
            obj.uploaded_marklist = value.uploaded_marklist || null;
            obj.editPermissions = baseService.havePermissionsToEdit(req, constant.MARKS_UPLOAD_PERMISSIONS, value['created_by']);
        }
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return obj;
};
exports.marklistObj = marklistObj;

exports.marklistDetailsObjs = function (req, data) {
    var marklistDetailObjs = [];
    try {
        _.forEach(data, function (value, key) {
            marklistDetailObjs.push(marklistDetailObj(req, value));
        });
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return marklistDetailObjs;
};

function marklistDetailObj(req, value) {
    var obj;
    try {
        if(!_.isEmpty(value)) {
            var updatedDate = dateService.getFormattedDate(value['updated_date']);

            obj = {}; //Object.assign({}, Domain)
            obj.marklistDetailId = value.mark_list_detail_id || null;
            obj.marklistId = value.mark_list_id || null;
            obj.tenantId = value.tenant_id || null;
            obj.schoolId = value.school_id || null;
            obj.academicYear = value.academic_year || null;
            obj.examScheduleId = value.exam_schedule_id || null;
            obj.writtenExamId = value.written_exam_id || null;
            obj.writtenExamName = value.written_exam_name || null;
            obj.classId = value.class_id || null;
            obj.className = value.class_name || null;
            obj.sectionId = value.section_id || null;
            obj.sectionName = value.section_name || null;
            obj.clssec = value.class_name + ' - ' + value.section_name;
            obj.userName = value.user_name || null;
            obj.userCode = value.user_code || null;
            obj.firstName = value.first_name || null;
            obj.primaryPhone = value.primary_phone || null;
            obj.subjectMarkDetails = value.subject_mark_details || null;
            obj.totalMarks = value.total_marks || null;
            obj.examDate = value.examination_date || null;
            obj.mediaName = value.media_name || null;
            obj.updatedBy = value.updated_by || null;
            obj.updatedDate = updatedDate || null;
            obj.updatedDateAndName = value['updated_firstname']+' - '+updatedDate;
            obj.createdBy = value.created_by || null;
            obj.createdDate = value.created_date || null;
            obj.status = value.status || false;
            obj.remarks = value.remarks || null;
        }
    }
    catch (err) {
        logger.debug(err);
        return err;
    }
    return obj;
};
exports.marklistDetailObj = marklistDetailObj;

