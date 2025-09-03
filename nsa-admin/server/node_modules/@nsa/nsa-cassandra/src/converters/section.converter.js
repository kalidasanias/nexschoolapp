/**
 * Created by Kiranmai A on 3/9/2017.
 */

var baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    dateService = require('../utils/date.service'),
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    SectionDetailsDomain = require('../common/domains/SectionDetails');
SchoolSectionsDomain = require('../common/domains/SchoolSections');

exports.sectionDetailsObjs = function (req, data) {
    var sectionDetailsObjs = [];
    if (_.isEmpty(data)) {
        sectionDetailsObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function (value, key) {
                var sectionDetailsObj = Object.assign({}, SectionDetailsDomain);
                    sectionDetailsObj.id = value['id'],
                    sectionDetailsObj.classId = value['class_id'],
                    sectionDetailsObj.className = value['class_name'],
                    sectionDetailsObj.tenantId = value['tenant_id'],
                    sectionDetailsObj.schoolId = value['school_id'],
                    sectionDetailsObj.academicYear = value['academic_year'],
                    sectionDetailsObj.sectionId = value['section_id'],
                    sectionDetailsObj.sectionName = value['section_name'],
                    sectionDetailsObj.status = value['status'],
                    sectionDetailsObj.studentIntake = value['student_intake'],
                    sectionDetailsObj.editPermissions = baseService.havePermissionsToEdit(req, constant.SECTION_ALLOC_PERMISSIONS, value['created_by']);
                    sectionDetailsObjs.push(sectionDetailsObj);
            });
        }
        catch (err) {
            throw new BaseError(responseBuilder.buildResponse(constant.SECTION_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST));
        }
    }
    
    return sectionDetailsObjs;
};


exports.sectionDetail = function (req, data) {
    var sectionDetailsObj = {};
    if (_.isEmpty(data)) {
        sectionDetailsObj = baseService.emptyResponse();
    } else {
        try {
            var sectionDetailsObj = Object.assign({}, SectionDetailsDomain);
                sectionDetailsObj.id = data['id'],
                sectionDetailsObj.classId = data['class_id'],
                sectionDetailsObj.className = data['class_name'],
                sectionDetailsObj.tenantId = data['tenant_id'],
                sectionDetailsObj.schoolId = data['school_id'],
                sectionDetailsObj.academicYear = data['academic_year'],
                sectionDetailsObj.sectionId = data['section_id'],
                sectionDetailsObj.sectionName = data['section_name'],
                sectionDetailsObj.status = data['status'],
                sectionDetailsObj.studentIntake = data['student_intake']
        }
        catch (err) {
            throw new BaseError(responseBuilder.buildResponse(constant.SECTION_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST));
        }
    }
    return sectionDetailsObj;
};

exports.SchoolSectionsDetail = function (req, data) {
    var SchoolSectionObjs = [];
    if (_.isEmpty(data)) {
        SchoolSectionObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function (value, key) {
                var SchoolSectionObj = Object.assign({}, SchoolSectionsDomain);
                var dueDate = dateService.getFormattedDate(value['updated_date']);
                var sectionStatus = value['status'] ? constants.STATUS_ACTIVE : constants.STATUS_DEACTIVE;
                SchoolSectionObj.tenantId = value['tenant_id'],
                    SchoolSectionObj.schoolId = value['school_id'],
                    SchoolSectionObj.academicYear = value['academic_year'],
                    SchoolSectionObj.sectionId = value['section_id'],
                    SchoolSectionObj.sectionCode = value['section_code'],
                    SchoolSectionObj.sectionName = value['section_name'],
                    SchoolSectionObj.status = sectionStatus,
                    SchoolSectionObj.updatedDate = dueDate,
                    SchoolSectionObj.updatedBy = value['updated_by'],
                    SchoolSectionObj.updatedUserName = value['updated_username'],
                    SchoolSectionObj.updatedDateAndName = value['updated_username'] + ' - ' + dueDate,
                    SchoolSectionObj.editPermissions = baseService.havePermissionsToEdit(req, constant.SECTION_PERMISSIONS, value['created_by']);
                    SchoolSectionObjs.push(SchoolSectionObj);
            });
        }
        catch (err) {
            throw new BaseError(responseBuilder.buildResponse(constant.SCHOOL_SECTION, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST));
        }
    }
    return SchoolSectionObjs;
};


exports.SchoolSectionDetail = function (req, data) {
    var SchoolSectionObj = {};
    if (_.isEmpty(data)) {
        SchoolSectionObj = baseService.emptyResponse();
    } else {
        try {
                var dueDate = dateService.getFormattedDate(data['updated_date']);
                var sectionStatus = data['status'] ? constants.STATUS_ACTIVE : constants.STATUS_DEACTIVE;

                var SchoolSectionObj = Object.assign({}, SchoolSectionsDomain);
                    SchoolSectionObj.tenantId = data['tenant_id'],
                    SchoolSectionObj.schoolId = data['school_id'],
                    SchoolSectionObj.academicYear = data['academic_year'],
                    SchoolSectionObj.sectionId = data['section_id'],
                    SchoolSectionObj.sectionCode = data['section_code'],
                    SchoolSectionObj.sectionName = data['section_name'],
                    SchoolSectionObj.status = sectionStatus,
                    SchoolSectionObj.updatedDate = dueDate,
                    SchoolSectionObj.updatedBy = data['updated_by'],
                    SchoolSectionObj.updatedUserName = data['updated_username'],
                    SchoolSectionObj.updatedDateAndName = data['updated_username'] + ' - ' + dueDate
        }
        catch (err) {
            throw new BaseError(responseBuilder.buildResponse(constant.SCHOOL_SECTION, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST));
        }
    }
    return SchoolSectionObj;
};

exports.SchoolPromotoionDetail = function (req, data) {
    var SchoolSectionObjs = [];
    if (_.isEmpty(data)) {
        SchoolSectionObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function (value, key) {
                var value = JSON.parse(JSON.stringify(value))
                value.editPermissions = baseService.havePermissionsToEdit(req, constant.STUDENT_PROMOTIONS_PERMISSIONS, value['updated_by']);
                if(value.promoted) {
                    SchoolSectionObjs.push(value);
                }

            });
        }
        catch (err) {
            throw new BaseError(responseBuilder.buildResponse(constant.SCHOOL_SECTION, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST));
        }
    }
    return SchoolSectionObjs;
};
