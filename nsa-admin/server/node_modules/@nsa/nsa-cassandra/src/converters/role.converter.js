/**
 * Created by icomputers on 23/11/17.
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

exports.roleObjects = function (data) {
    var roleObjs = [];
    if (!_.isEmpty(data)) {
        try {
            _.forEach(data, function (val, index) {
                var roleObj = {};
                roleObj.tenant_id = val.tenant_id,
                roleObj.school_id = val.school_id,
                roleObj.id = val.id,
                roleObj.name = val.name,
                roleObj.description = val.description,
                roleObj.updated_by = val.updated_by,
                roleObj.updatedDate =  val.updated_date,
                roleObj.updated_username = val.updated_username,
                roleObj.updated_date = dateService.getFormattedDate(val.updated_date),
                roleObj.created_by = val.created_by,
                roleObj.created_date = dateService.getFormattedDate(val.created_date),
                roleObj.created_firstname = val.created_firstname,
                roleObj.default_value = val.default_value,
                roleObj.is_enable = val.is_enable,
                roleObj.status = val.status
                roleObjs.push(roleObj)
                if(index == (data.length -1)) {
                    roleObjs = _.orderBy(roleObjs, ['updatedDate'], ['desc'])
                }

            })

        } catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.ROLES_DETAILS, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return roleObjs;
};

