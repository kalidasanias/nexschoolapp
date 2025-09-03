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
    ClassDetailsDomain = require('../common/domains/ClassDetails'),
    logger = require('../../config/logger');

exports.classObjs = function(req, data) {
    var convertClassObjs = [];
    if(_.isEmpty(data)) {
        convertClassObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function(value, key) {
                var convertClassObj = Object.assign({}, ClassDetailsDomain);
                var updatedDate = dateService.getFormattedDate(value['updated_date']);
                    convertClassObj.classId= value['class_id'],
                    convertClassObj.className= value['class_name'],
                    convertClassObj.tenantId= value['tenant_id'],
                    convertClassObj.schoolId= value['school_id'],
                    convertClassObj.academicYear= value['academic_year'],
                    convertClassObj.course= value['course'],
                    convertClassObj.updatedDate= updatedDate,
                    convertClassObj.updatedBy= value['updated_by'],
                    convertClassObj.updatedUsername= value['updated_username'],
                    convertClassObj.updateddateAndName =value['updated_username']+' - '+ updatedDate;
                    convertClassObj.status =value['status']
                    convertClassObj.orderBy =value['order_by']
,
                    convertClassObj.editPermissions = baseService.havePermissionsToEdit(req, constant.CLASS_PERMISSIONS, value['created_by']);
                    convertClassObjs.push(convertClassObj);
            });
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.CLASS_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return convertClassObjs;
};

exports.ClassObj = function(req, value) {
    var ClassObj = {};
    if(_.isEmpty(value)) {
        ClassObj = baseService.emptyResponse();
    } else {
        try {
            var ClassObj = Object.assign({}, ClassDetailsDomain);
            var updatedDate = dateService.getFormattedDate(value['updated_date']);
                ClassObj.classId= value['class_id'],
                ClassObj.className= value['class_name'],
                ClassObj.tenantId= value['tenant_id'],
                ClassObj.schoolId= value['school_id'],
                ClassObj.academicYear= value['academic_year'],
                ClassObj.course= value['course'],
                ClassObj.updatedDate= updatedDate,
                ClassObj.updatedBy= value['updated_by'],
                ClassObj.updatedUsername= value['updated_username'],
                ClassObj.updateddateAndName =value['updated_username']+' - '+ updatedDate;
                ClassObj.status =value['status']
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.ASPECTS, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return ClassObj;
};

exports.classSection = function (req, data) {
    var classSectionObjs = [];
    if (_.isEmpty(data)) {
        classSectionObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function (value, key) {
                var classSectionObj = {};
                classSectionObj.classId = value['class_id'];
                classSectionObj.className = value['class_name'];
                classSectionObj.academicYear = value['academic_year'];
                classSectionObj.status = value['status'];

                var sectionId = value['section_id'];
                var sectionName = value['section_name'];
                var sectionObj = {sectionId: sectionId,sectionName: sectionName};


                var classSectionObj =  _.find(classSectionObjs, { classId: classSectionObj.classId });
                if (classSectionObj == undefined) {
                    classSectionObj = {};
                    classSectionObj.classId = value['class_id'];
                    classSectionObj.className = value['class_name'];
                    classSectionObj.academicYear = value['academic_year'];
                    classSectionObj.status = value['status'];
                    classSectionObj.sections = [];
                    classSectionObj.sections.push(sectionObj);
                    classSectionObjs.push(classSectionObj);
                } else {
                    classSectionObj.sections.push(sectionObj);
                }
                if(!_.isEmpty(classSectionObj.sections)){
                    classSectionObj.sections = _.sortBy(classSectionObj.sections, 'sectionName');
                }
            });

        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.SECTION_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return classSectionObjs;
};