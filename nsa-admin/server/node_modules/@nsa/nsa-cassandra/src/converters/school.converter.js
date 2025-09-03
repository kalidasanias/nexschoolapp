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

exports.schoolObject = function(data) {
    var schoolObj = {};
    if(!_.isEmpty(data)) {
        try {
            schoolObj.tenant_id = data.tenant_id
            schoolObj.school_id = data.school_id
            schoolObj.created_date =data.created_date
            schoolObj.school_code = data.school_code
            schoolObj.project_id = data.project_id
            schoolObj.merchant_id = data.merchant_id
            schoolObj.sub_merchant_id = data.sub_merchant_id
            schoolObj.server_api_key = data.server_api_key
            schoolObj.app_key = data.app_key
            schoolObj.app_link = data.app_link;
            schoolObj.password = data.password;
            schoolObj.google_key = data.google_key
            schoolObj.package_name = data.package_name
            schoolObj.city = data.city
            schoolObj.email = data.email
            schoolObj.fax = data.fax
            schoolObj.phone_number = data.phone_number
            schoolObj.pincode = data.pincode
            schoolObj.school_name =data.school_name
            schoolObj.about_us = data.about_us
            schoolObj.contact_us =data.contact_us
            schoolObj.latitude =data.latitude
            schoolObj.longitude = data.longitude
            schoolObj.state = data.state
            schoolObj.street_address_1 = data.street_address_1
            schoolObj.street_address_2 = data.street_address_2
            schoolObj.total_employee_strength = data.total_employee_strength
            schoolObj.total_student_strength = data.total_student_strength
            schoolObj.updated_date = data.updated_date
            schoolObj.image_url = baseService.getFormattedMap(data.image_url)
            schoolObj.logo = data.logo
            schoolObj.raw_aboutus = data.raw_aboutus
            schoolObj.website_url = data.website_url;
        } catch (err) {
            logger.debug(err);
            return responseBuilder.buildResponse(constant.SCHOOL, constant.APP_TYPE, message.nsa436, err.message, constant.HTTP_BAD_REQUEST);
        }
    }
    return schoolObj;
};

