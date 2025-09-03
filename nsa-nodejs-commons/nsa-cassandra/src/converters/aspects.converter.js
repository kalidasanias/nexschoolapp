/**
 * Created by Cyril on 4/3/2017.
 */
var baseService = require('../services/common/base.service'),
    constants = require('../common/constants/constants'),
    dateService = require('../utils/date.service'),
     _ = require('lodash'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    AspectsDomain = require('../common/domains/Aspects');

exports.aspectsObjs = function(req, data) {
    var convertaspectsObjs = [];
    if(_.isEmpty(data)) {
        convertaspectsObjs = baseService.emptyResponse();
    } else {
        try {
            _.forEach(data, function(value, key) {
                var aspectsObj = Object.assign({}, AspectsDomain);
                var updatedDate = dateService.getFormattedDate(value['updated_date']);
                aspectsObj.aspectId= value['aspect_id'],
                    aspectsObj.tenantId= value['tenant_id'],
                    aspectsObj.schoolId= value['school_id'],
                    aspectsObj.aspectCode = value['aspect_code'],
                    aspectsObj.aspectName = value['aspect_name'],
                    aspectsObj.academicYear =value['academic_year'],
                    aspectsObj.updatedDate= updatedDate,
                    aspectsObj.updatedBy= value['updated_by'],
                    aspectsObj.updatedUsername= value['updated_username'],
                    aspectsObj.updateddateAndName =value['updated_username']+' - '+ updatedDate;
                    convertaspectsObjs.push(aspectsObj);
            });
        }
        catch (err) {
            throw new BaseError(responseBuilder.buildResponse(constant.ASPECTS, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST));
        }
    }
    return convertaspectsObjs;
};

exports.aspectsObj = function(req, aspects) {
    var aspectsObj = {};
    if(_.isEmpty(aspects)) {
        aspectsObj = baseService.emptyResponse();
    } else {
        try {
                var aspectsObj = Object.assign({}, AspectsDomain);
                var updatedDate = dateService.getFormattedDate(aspects['updated_date']);
                    aspectsObj.aspectId= aspects['aspect_id'],
                    aspectsObj.tenantId= aspects['tenant_id'],
                    aspectsObj.schoolId= aspects['school_id'],
                    aspectsObj.academicYear= aspects['academic_year'],
                    aspectsObj.aspectCode = aspects['aspect_code'],
                    aspectsObj.aspectName = aspects['aspect_name'],
                    aspectsObj.updatedDate= updatedDate,
                    aspectsObj.updatedBy= aspects['updated_by'],
                    aspectsObj.updatedUsername= aspects['updated_username'];
                    aspectsObj.updateddateAndName =aspects['updated_username']+' - '+ updatedDate;
        }
        catch (err) {
            throw new BaseError(responseBuilder.buildResponse(constant.ASPECTS, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST));
        }
    }
    return aspectsObj;
};