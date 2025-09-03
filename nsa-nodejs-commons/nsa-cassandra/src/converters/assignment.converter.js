/**
 * Created by Kiranmai A on 3/3/2017.
 */

var baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    dateService = require('../utils/date.service'),
    _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    AssignmentTypeDomain = require('../common/domains/AssignmentType'),
    AssignmentDomain = require('../common/domains/Assignment'),
    AssignmentDetailsDomain = require('../common/domains/AssignmentDetails'),
    logger = require('../../../../../config/logger');

exports.assignmentTypeObjs = function(req, data) {
    var convertAssignmentTypeObjs = [];
    if(_.isEmpty(data)) {
        convertAssignmentTypeObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function(value, key) {
                var assignmentTypeObj = Object.assign({}, AssignmentTypeDomain);
                var updatedDate = dateService.getFormattedDate(value['updated_date']);
                var createdDate = dateService.getFormattedDate(value['created_date']);
                assignmentTypeObj.id= value['assignment_type_id'],
                assignmentTypeObj.tenantId= value['tenant_id'],
                assignmentTypeObj.schoolId= value['school_id'],
                assignmentTypeObj.name= value['assignment_type_name'],
                assignmentTypeObj.desc= value['assignment_desc'],
                assignmentTypeObj.updatedDate= updatedDate,
                assignmentTypeObj.updatedBy= value['updated_by'],
                assignmentTypeObj.updatedUserName= value['updated_username'] + '-' + updatedDate,
                assignmentTypeObj.createdBy = value['created_by'],
                assignmentTypeObj.createdFirstName = value['created_firstname'],
                assignmentTypeObj.createdDate = createdDate,
                assignmentTypeObj.defaultValue= value['default_value'],
                assignmentTypeObj.status= value['status'],
                assignmentTypeObj.editPermissions = baseService.havePermissionsToEdit(req, constant.ASSIGNMENT_TYPE_PERMISSIONS, value['created_by']);
                convertAssignmentTypeObjs.push(assignmentTypeObj);
            });
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.ASSIGNMENT_NAME, constant.APP_TYPE, message.nsa1201, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return convertAssignmentTypeObjs;
};

exports.assignmentTypeObj = function(req, data) {

    var assignmentTypeObj = {};
    if(_.isEmpty(data)) {
        assignmentTypeObj = baseService.emptyResponse();
    } else {
        assignmentTypeObj = Object.assign({}, AssignmentTypeDomain);
        try {
            var updatedDate = dateService.getFormattedDate(data['updated_date']);
                assignmentTypeObj.id= data['assignment_type_id'],
                assignmentTypeObj.tenantId= data['tenant_id'],
                assignmentTypeObj.schoolId= data['school_id'],
                assignmentTypeObj.name= data['assignment_type_name'],
                assignmentTypeObj.desc= data['assignment_desc'],
                assignmentTypeObj.updatedDate= updatedDate,
                assignmentTypeObj.updatedBy= data['updated_by'],
                assignmentTypeObj.updatedUserName= data['updated_username'],
                assignmentTypeObj.defaultValue= data['default_value'],
                assignmentTypeObj.status= data['status']
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.ASSIGNMENT_NAME, constant.APP_TYPE, message.nsa1201, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return assignmentTypeObj;
};

exports.assignmentObjs = function(req, data) {
    var convertAssignmentObjs = [];
    if(_.isEmpty(data)) {
        convertAssignmentObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function(value, key) {
                var assignmentObj = Object.assign({}, AssignmentDomain);
                    var updatedDate = dateService.getFormattedDate(value['updated_date']);
                    var createdDate = dateService.getFormattedDate(value['created_date']);
                    var dueDate = dateService.getFormattedDate(value['due_date']);
                    var dueDateFormatted = dateService.getDateFormatted(value['due_date'], "dddd, mmm d yyyy");  //for showing week assignments in mobile
                    var assignmentStatus = value['status'] ? constants.STATUS_PUBLISH : constants.STATUS_DRAFT;
                    var attachmentsObj = baseService.getFormattedMap(value['attachments']);
                    if(!_.isEmpty(attachmentsObj)) {
                        _.forEach(attachmentsObj, function(val){
                            var fileName = val.id.split('/');
                            val['fileName'] = fileName[2];
                        })
                    }
                    var subNames = []
                    var subjects = baseService.getFormattedMap(value['subjects']);
                    if(!_.isEmpty(subjects)) {
                        _.forEach(subjects, function(val){
                            subNames.push(val.name)
                        })
                    }
                    assignmentObj.id= value['assignment_id'],
                    assignmentObj.tenantId= value['tenant_id'],
                    assignmentObj.schoolId= value['school_id'],
                    assignmentObj.academicYear= value['academic_year'],
                    assignmentObj.assignmentName= value['assignment_name'],
                    assignmentObj.assignmentTypeId= value['assignment_type_id'],
                    assignmentObj.assignmentTypeName= value['assignment_type_name'],
                    assignmentObj.assignmentDesc= value['assignment_desc'],
                    assignmentObj.notifiedCategories= value['notified_categories'],
                    /*assignmentObj.subjectId= value['subject_id'],*/
                    assignmentObj.subjectName= subNames.toString(),
                    assignmentObj.subjects= subjects,
                    assignmentObj.dueDate= dueDate,
                    assignmentObj.dueDateFormatted = dueDateFormatted,
                    assignmentObj.repeatOptionId= value['repeat_option_id'],
                    assignmentObj.repeatOption= value['repeat_option'],
                    assignmentObj.priority= value['priority'],
                    assignmentObj.notifyTo= value['notify_to'],
                    assignmentObj.attachments= attachmentsObj,
                    assignmentObj.updatedBy= value['updated_by'],
                    assignmentObj.updatedDate= updatedDate,
                    assignmentObj.updatedUserName= value['updated_username'],
                    assignmentObj.createdBy = value['created_by'],
                    assignmentObj.createdFirstName = value['created_firstname'],
                    assignmentObj.createdDate = createdDate,
                    assignmentObj.status= assignmentStatus,
                    assignmentObj.editPermissions = baseService.havePermissionsToEdit(req, constant.ASSIGNMENT_PERMISSIONS, value['created_by']);
                convertAssignmentObjs.push(assignmentObj);
            });
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.ASSIGNMENT_NAME, constant.APP_TYPE, message.nsa1208, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return convertAssignmentObjs;
};

exports.assignmentObj = function(req, data) {
    var assignmentObj = {};
    if(_.isEmpty(data)) {
        assignmentObj = baseService.emptyResponse();
    } else {
        try {
            var assignmentObj = Object.assign({}, AssignmentDomain);
            var updatedDate = dateService.getFormattedDate(data['updated_date']);
            var dueDate = dateService.getFormattedDate(data['due_date']);
            var assignmentStatus =  data['status'] ? constants.STATUS_PUBLISH : constants.STATUS_DRAFT;
            var attachmentsObj = baseService.getFormattedMap(data['attachments']);
            if(!_.isEmpty(attachmentsObj)) {
                _.forEach(attachmentsObj, function(val){
                    var fileName = val.id.split('/');
                    val['fileName'] = fileName[2];
                })
            }
            var subjects = baseService.getFormattedMap(data['subjects']);
                assignmentObj.id= data['assignment_id'],
                assignmentObj.tenantId= data['tenant_id'],
                assignmentObj.schoolId= data['school_id'],
                assignmentObj.academicYear= data['academic_year'],
                assignmentObj.assignmentName= data['assignment_name'],
                assignmentObj.assignmentTypeId= data['assignment_type_id'],
                assignmentObj.assignmentTypeName= data['assignment_type_name'],
                assignmentObj.assignmentDesc= data['assignment_desc'],
                assignmentObj.notifiedCategories= data['notified_categories'],
                /*assignmentObj.subjectId= data['subject_id'],
                assignmentObj.subjectName= data['subject_name'],*/
                assignmentObj.subjects= subjects,
                assignmentObj.dueDate= dueDate,
                assignmentObj.repeatOptionId= data['repeat_option_id'],
                assignmentObj.repeatOption= data['repeat_option'],
                assignmentObj.priority= data['priority'],
                assignmentObj.notifyTo= data['notify_to'],
                assignmentObj.attachments= attachmentsObj,
                assignmentObj.updatedBy= data['updated_by'],
                assignmentObj.updatedDate= updatedDate,
                assignmentObj.updatedUserName= data['updated_username'],
                assignmentObj.status= assignmentStatus
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.ASSIGNMENT_NAME, constant.APP_TYPE, message.nsa1208, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return assignmentObj;
};

exports.assignmentDetailObjs = function(req, data) {
    var assignmentDetailObjs = [];
    try {
        if(!_.isEmpty(data)) {
            _.forEach(data, function(value, key) {
                var assignmentDetailObj = Object.assign({}, AssignmentDetailsDomain);
                var updatedDate = dateService.getFormattedDate(value['updated_date']);
                var createdDate = dateService.getFormattedDate(value['created_date']);
                var submittedDate = dateService.getFormattedDate(value['submitted_date']);
                var dueDate = dateService.getFormattedDate(value['due_date']);
                var dueDateFormatted = dateService.getDateFormatted(value['due_date'], "dddd, mmm d yyyy");  //for showing week assignments in mobile
                var assignmentStatus =  value['status'] ? constants.STATUS_PUBLISH : constants.STATUS_DRAFT;
                var submitStatus =  value['is_submitted'] ? constants.STATUS_SUBMIT : constants.STATUS_NOT_SUBMIT;
                var attachmentsObj = baseService.getFormattedMap(value['attachments']);
                if(!_.isEmpty(attachmentsObj)) {
                    _.forEach(attachmentsObj, function(val){
                        var fileName = val.id.split('/');
                        val['fileName'] = fileName[2];
                    })
                }
                var subNames = []
                var subjects = baseService.getFormattedMap(value['subjects']);
                if(!_.isEmpty(subjects)) {
                    _.forEach(subjects, function(val){
                        subNames.push(val.name)
                    })
                }
                var subjects = baseService.getFormattedMap(value['subjects']);
                    assignmentDetailObj.id= value['assignment_detail_id'],
                    assignmentDetailObj.tenantId= value['tenant_id'],
                    assignmentDetailObj.schoolId= value['school_id'],
                    assignmentDetailObj.academicYear= value['academic_year'],
                    assignmentDetailObj.assignmentId= value['assignment_id'],
                    assignmentDetailObj.assignmentName= value['assignment_name'],
                    assignmentDetailObj.assignmentTypeId= value['assignment_type_id'],
                    assignmentDetailObj.assignmentTypeName= value['assignment_type_name'],
                    assignmentDetailObj.assignmentDesc= value['assignment_desc'],
                    assignmentDetailObj.userName= value['user_name'],
                    assignmentDetailObj.firstName= value['first_name'],
                    assignmentDetailObj.classId= value['class_id'],
                    assignmentDetailObj.className= value['class_name'],
                    assignmentDetailObj.sectionId= value['section_id'],
                    assignmentDetailObj.sectionName= value['section_name'],
                    assignmentDetailObj.subjectName= subNames.toString(),
                /*assignmentDetailObj.subjectId= value['subject_id'],
                    assignmentDetailObj.subjectName= value['subject_name'],*/
                        assignmentDetailObj.subjects = subjects,
                    assignmentDetailObj.dueDate= dueDate,
                    assignmentDetailObj.dueDateFormatted = dueDateFormatted,
                    assignmentDetailObj.repeatOptionId= value['repeat_option_id'],
                    assignmentDetailObj.repeatOption= value['repeat_option'],
                    assignmentDetailObj.priority= value['priority'],
                    assignmentDetailObj.attachments= attachmentsObj,
                    assignmentDetailObj.updatedBy= value['updated_by'],
                    assignmentDetailObj.updatedDate= updatedDate,
                    assignmentDetailObj.updatedUserName= value['updated_username'],
                    assignmentDetailObj.createdBy= value['created_by'],
                    assignmentDetailObj.createdDate= createdDate,
                    assignmentDetailObj.createdFirstName= value['created_firstname'],
                    assignmentDetailObj.status= assignmentStatus,
                    assignmentDetailObj.submittedDate= submittedDate,
                    assignmentDetailObj.isSubmitted= submitStatus,
                    assignmentDetailObjs.push(assignmentDetailObj);
            });
        }
    }
    catch (err) {
        logger.debug(err);
        return responseBuilder.buildResponse(constant.ASSIGNMENT_NAME, constant.APP_TYPE, message.nsa1208, err.message, constant.HTTP_BAD_REQUEST);
    }
    return assignmentDetailObjs;
};
