/**
 * Created by Kiranmai A on 3/4/2017.
 */


var subjectDomain = require('../common/domains/Subject'),
    subjectAllocationDomain = require('../common/domains/SubjectAllocationDomain'),
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    dataService = require('../utils/date.service'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../../../config/logger');

exports.schoolSubjectObjs = function(req, data) {
    var schoolSubjectObjs = [];
    try {
        _.forEach(data, function (value, key) {
            var updateDate = dataService.getFormattedDate(value['updated_date'])
            var schoolSubjectObj = Object.assign({}, subjectDomain);
                schoolSubjectObj.subjectId= value['subject_id'],
                schoolSubjectObj.tenantId= value['tenant_id'],
                schoolSubjectObj.schoolId= value['school_id'],
                schoolSubjectObj.deptId= value['dept_id'],
                schoolSubjectObj.academicYear= value['academic_year'],
                schoolSubjectObj.subName= value['sub_name'],
                schoolSubjectObj.subDesc= value['sub_desc'],
                schoolSubjectObj.subCode= value['sub_code'],
                schoolSubjectObj.subColour = value['sub_colour'],
                schoolSubjectObj.subAspects= baseService.getFormattedMap(value['sub_aspects']),
                schoolSubjectObj.updatedDate=updateDate,
                schoolSubjectObj.updatedUsername= value['updated_username'],
                schoolSubjectObj.updatedBy= value['updated_by'],
                schoolSubjectObj.defaultValue= value['default_value'],
                schoolSubjectObj.status= value['status'] ? constants.STATUS_ACTIVE : constants.STATUS_DEACTIVE,
                schoolSubjectObj.updateddateAndName =value['updated_username']+' - '+updateDate,
                schoolSubjectObj.editPermissions = baseService.havePermissionsToEdit(req, constant.SUBJECT_PERMISSIONS, value['created_by']);
                schoolSubjectObjs.push(schoolSubjectObj);
        });
    } catch (err) {
        return responseBuilder.buildResponse(constant.SUB_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
    }
    return schoolSubjectObjs;
};

exports.schoolSubjectObj = function(req, subjects) {
    var schoolSubjectObj = {};
    if(_.isEmpty(subjects)) {
        schoolSubjectObj = baseService.emptyResponse();
    } else {
        try {
            var updateDate = dataService.getFormattedDate(subjects['updated_date'])
            var schoolSubjectObj = Object.assign({}, subjectDomain);
                schoolSubjectObj.subjectId= subjects['subject_id'],
                schoolSubjectObj.tenantId= subjects['tenant_id'],
                schoolSubjectObj.schoolId= subjects['school_id'],
                schoolSubjectObj.deptId= subjects['dept_id'],
                schoolSubjectObj.academicYear= subjects['academic_year'],
                schoolSubjectObj.subName= subjects['sub_name'],
                schoolSubjectObj.subDesc= subjects['sub_desc'],
                schoolSubjectObj.subCode= subjects['sub_code'],
                schoolSubjectObj.subColour = subjects['sub_colour'],
                schoolSubjectObj.subAspects= baseService.getFormattedMap(subjects['sub_aspects']),
                schoolSubjectObj.updatedDate= updateDate,
                schoolSubjectObj.updatedUsername= subjects['updated_username'],
                schoolSubjectObj.updatedBy= subjects['updated_by'],
                schoolSubjectObj.defaultValue= subjects['default_value'],
                schoolSubjectObj.status= subjects['status'] ? constants.STATUS_ACTIVE : constants.STATUS_DEACTIVE,
                schoolSubjectObj.updateddateAndName =subjects['updated_username']+' - '+updateDate;
        }
        catch (err) {
            return responseBuilder.buildResponse(constant.SUB_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return schoolSubjectObj;
};


exports.subjectAllocationObjs = function (req, data) {
    var subjectAllocationObjs = [];
    if (!_.isEmpty(data)) {
        try {
            _.forEach(data, function (value, key) {
                var subjectAllocationObj = Object.assign({}, subjectAllocationDomain);
                var subjectType = constants.STATUS_NON_ACADEMIC;
                if(value['subject_type']) {
                    subjectType = constants.STATUS_ACADEMIC;
                }
                subjectAllocationObj.tenantId = value['tenant_id'],
                    subjectAllocationObj.schoolId = value['school_id'],
                    subjectAllocationObj.academicYear = value['academic_year'],
                    subjectAllocationObj.classId = value['class_id'],
                    subjectAllocationObj.subjectId = value['subject_id'],
                    subjectAllocationObj.sectionId = value['section_id'],
                    subjectAllocationObj.subjectType = subjectType,
                    subjectAllocationObj.editPermissions = baseService.havePermissionsToEdit(req, constant.SUBJECT_ALLOC_PERMISSIONS, value['created_by']);
                    subjectAllocationObjs.push(subjectAllocationObj);
            });
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.SUB_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return subjectAllocationObjs;
};