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
    logger = require('../../../../../config/logger');

exports.academicObjs = function(req, data) {
    var convertAcdemicObjs = [];
    if(_.isEmpty(data)) {
        convertAcdemicObjs = baseService.emptyResponse();
    } else {
        try {
            var data =  _.orderBy(data, ['created_date'], ['desc']);
            _.forEach(data, function(value, key) {
                var acdemicObj = {};
                var endDate = dateService.getFormattedDate(value['end_date']);
                acdemicObj.id= value['id'],
                    acdemicObj.tenantId= value['tenant_id'],
                    acdemicObj.schoolId= value['school_id'],
                    acdemicObj.createdDate = dateService.getFormattedDate(value['created_date']);
                    acdemicObj.startDate = dateService.getFormattedDate(value['start_date']);
                    acdemicObj.academicYear = value['ac_year'];
                    acdemicObj.endDate= endDate;
                    acdemicObj.isCurrentYear = (value['is_current_year']) ? value['is_current_year'] : false;
                    var terms = Object.keys(value['terms'] != null ? value['terms'] : {}).length;
                    acdemicObj.terms= terms;
                convertAcdemicObjs.push(acdemicObj);
            });
        }
        catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.ACADEMIC_NAME, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return convertAcdemicObjs;
};

