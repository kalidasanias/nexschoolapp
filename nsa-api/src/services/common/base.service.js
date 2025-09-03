/**
 * Created by senthil on 13/01/17.
 */

var express = require('express')
    , request = require('request')
    , session = require('express-session');

var constants = require('../../common/constants/constants');
var status = require('../../common/domains/Status');
var requestParam = require('../../common/domains/RequestParam');
var models = require('../../models')
    , baseService = require('../common/base.service')
    , dateService = require('../../utils/date.service');


/*exports.validateHeaders = function(req, res) {
    var isHeaderParamAvailable = false;
    console.info('req.headers.tenant_id = ', req.headers.tenant_id);
    console.info('req.headers.school_id = ', req.headers.school_id);
    if (req.headers.tenant_id == undefined && req.headers.school_id == undefined) {
        res.send({status: baseService.getFailureStatus(req, res, constants.HTTP_UNAUTHORIZED, "Header Parameters are not provided")});
    }
};*/

exports.getHeaders = function(req, res) {
    var headers = {user_id: req.headers.user_id, tenant_id: req.headers.tenant_id, school_id: req.headers.school_id /*,academic_year : req.headers.academic_year*/}
    return headers;
};

exports.getStatus = function(req, res, statusCode, statusMessage) {
    status.code = statusCode;
    status.message = statusMessage;

    return status;
}

exports.getSuccessStatus = function(req, res, statusMessage) {
    return this.getStatus(req, res, constants.HTTP_OK, statusMessage);
}

exports.getFailureStatus = function(req, res, statusCode, statusMessage) {
    return this.getStatus(req, res, statusCode, statusMessage);
}

exports.getRequestParam = function(req, res, param) {
    requestParam.totalRecords = 100;
    return requestParam;
}

exports.sendDateFormatedResult = function(result, key, res) {
    if (result.length > 0) {
        for (i = 0; result.length > i; i++) {
            var obj = result[i];
            if (obj[key]) {
                obj[key] = dateService.getFormattedDate(obj[key]);
            }
            if (i == result.length -1) {
                res.status(constants.HTTP_CREATED).send({success: true, data: result});
            }
        }
    } else {
        res.status(constants.HTTP_CREATED).send({success: true, data: result});
    }

};

/** User related methods **/

exports.getUserFromRequestBody = function(req, res) {

    var body = req.body;
    console.info('body userId = ', body.userId);
    var headers = this.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var dob = body.dob;
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    var dt = new Date(dob.replace(pattern,'$1-$2-$3'));
    var currentDate = new Date();

    var userDetails = new models.instance.UserDetails( {
        user_id: body.userId,
        academic_year: body.academicYear,
        birthday: dt,
        blood_group: "A+",
        email: body.emailAddress,
        first_name: body.firstName,
        gender: body.gender,
        last_name: body.lastName,
        middle_name: body.middleName,
        nationality: body.nationality,
        password: body.password,
        primary_phone: body.primaryPhone,
        profile_picture: null,
        role_id: body.roleId,
        role_name: body.roleName,
        school_id: schoolId,
        school_name: "PSBB",
        tenant_id: tenantId,
        title: body.title,
        user_name: body.userName,
        created_date : currentDate,
        updated_date : currentDate,
        active: true
    });

    return userDetails;
}

exports.getSessionUser = function(req, res) {
    session = req.session;

    console.info('session user = ', session.user);
    if (session.user) {
        return session.user;
    }
}