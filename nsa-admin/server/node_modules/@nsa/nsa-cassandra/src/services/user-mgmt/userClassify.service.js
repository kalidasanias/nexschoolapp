/**
 * Created by bharatkumarr on 20/03/17.
 */

var baseService = require('../common/base.service')
    , models = require('../../models')
    ,_ = require('lodash')
    , BaseError = require('@nsa/nsa-commons').BaseError
    , message = require('@nsa/nsa-commons').messages
    . responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , usermgmtConverter = require('../../converters/usermgmt.converter')
    , dateService = require('../../utils/date.service')
    , constant = require('@nsa/nsa-commons').constants
    , taxanomyUtils = require('@nsa/nsa-commons').taxanomyUtils
    , logger = require('../../../config/logger');

var UserClassification = function f(options) {
    // var self = this;
};

UserClassification.getEmployee = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var schoolId = models.uuidFromString(headers.school_id),
        tenantId = models.timeuuidFromString(headers.tenant_id);
    var findQuery = {
        tenant_id: tenantId,
        school_id: schoolId,
        user_name: req.params.id,
        //academic_year: headers.academic_year
    };
    models.instance.EmployeeClassification.findOne(findQuery, {allow_filtering: true}, function(err, result){
        if (err) {
            callback(err, null);
        } else {
            callback(null, deptObj(data, result));
        }
    });
};

function deptObj(data, result) {
    try {
        if(result != null && result != undefined) {
            var formattedResult = JSON.parse(JSON.stringify(result));
            var taxanomy_departments = formattedResult['taxanomy_departments'];
            var taxanomy = data['taxanomy'];
            var taxanomyObj = []
            data.user['dept_id'] = formattedResult['dept_id'];
            data.user['desg_id'] = formattedResult['desg_id'];
            data.user['subjects'] = formattedResult['subjects'];
            data.user['class_associations'] = formattedResult['class_associations'];
            data.user['academic_year'] = formattedResult['academic_year'];
            data.user['name'] = formattedResult['name'];
            data.user['short_name'] = formattedResult['short_name'];
            data.user['selected_categories'] = formattedResult['selected_categories'];

            if(taxanomy != undefined && taxanomy != null) {
                if(taxanomy_departments != undefined && taxanomy_departments != null) {
                    taxanomyUtils.mergeTaxanomyObj(taxanomy, taxanomy_departments, function (err, taxanomy) {
                        data.user['selected_categories'] = taxanomy
                    })
                } else if(formattedResult['selected_categories'] != null) {
                    taxanomyUtils.extractAndMergeTaxanomyObj(taxanomy, JSON.parse(formattedResult['selected_categories']), function (err, taxanomy) {
                        data.user['selected_categories'] = taxanomy
                    })
                }

            }
            return data;
        } else {
            return data;
        }
    } catch (err) {
        logger.debug(err);
        return err;
    }
};
exports.deptObj = deptObj;

UserClassification.getEmployeeClasses = function(req, callback) {
    var headers = baseService.getHeaders(req);
    try {
        var schoolId = models.uuidFromString(headers.school_id),
            tenantId = models.timeuuidFromString(headers.tenant_id);
        var findQuery = {
            tenant_id: tenantId,
            school_id: schoolId,
            user_name: req.params.id,
            academic_year: headers.academic_year
        };
        models.instance.EmployeeClassification.findOne(findQuery, {allow_filtering: true}, function(err, result){
            if(result != undefined) {
                result.class_associations = baseService.getFormattedMap(result.class_associations);
                callback(err, result);
            } else {
                callback(null, null);
            }
        });
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

UserClassification.getStudent = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var schoolId = models.uuidFromString(headers.school_id),
        tenantId = models.timeuuidFromString(headers.tenant_id);
    var findQuery = {
        tenant_id: tenantId,
        school_id: schoolId,
        user_name: req.params.id,
        academic_year: headers.academic_year
    };
    models.instance.UserClassification.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        data.user['class_id'] = formattedResult['class_id'];
        data.user['class_name'] = formattedResult['class_name'];
        data.user['section_id'] = formattedResult['section_id'];
        data.user['section_name'] = formattedResult['section_name'];
        data.user['languages'] = formattedResult['languages'];
        data.user['academic_year'] = formattedResult['academic_year'];
        callback(err, data);
    });
};

/*function fetchStudentClassification(req, modelObj, userObj, index, data, callback) {
    var headers = baseService.getHeaders(req);
    var schoolId = models.uuidFromString(headers.school_id);
    var tenantId = models.timeuuidFromString(headers.tenant_id);

    modelObj.findOne(baseService.getQuery(), {allow_filtering: true}, function(err, result){
        if (result != undefined && result != null) {
            var formattedResult = baseService.validateResult(result);
            userObj['dept_id'] = formattedResult['dept_id'];
            userObj['desg_id'] = formattedResult['desg_id'];
            userObj['subjects'] = formattedResult['subjects'];
            userObj['class_associations'] = formattedResult['class_associations'];
            userObj['academic_year'] = formattedResult['academic_year'];
            data.users[index] = userObj;
        }

        if (index == (data.users.length-1)) {
            callback(null, data);
        }
    });
}*/

UserClassification.saveEmployee = function(req, data, callback) {
    getEmpClassifyObj(req, function(err, result) {
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            var array = data.batchObj, headers = baseService.getHeaders(req);
            result.user_name = data.user_name;
            result.academic_year = headers.academic_year; //data.academic_year.ac_year;
            result.school_id = models.uuidFromString(req.headers.userInfo.school_id);
            result.tenant_id = models.timeuuidFromString(req.headers.userInfo.tenant_id);
            var UserDetails = new models.instance.EmployeeClassification(result);
            var UserDetailsQuery = UserDetails.save({return_query: true});
            array.push(UserDetailsQuery);
            data.batchObj = array;
            callback(null, data);
        }
    });
};

UserClassification.updateEmployee = function(req, data, callback) {
    getEmpClassifyObj(req, function(err, result){
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            var array = data.batchObj;
            var updateQuery = models.instance.EmployeeClassification.update(getQuery(req, data, false), result, {return_query: true});
            array.push(updateQuery);
            data.batchObj = array;
            callback(null, data);
        }
    })
};

function getEmpClassifyObj(req, callback) {
    var userClassifyObj = {};
    try{
        taxanomyUtils.buildTaxanomyObj(req, function(err, result){
            userClassifyObj.dept_id = baseService.getListOfUuid(req.body.dept_id);
            userClassifyObj.desg_id = models.uuidFromString(req.body.desg_id);
            userClassifyObj.subjects = baseService.getListOfUuid(req.body.subjects) || null;
            userClassifyObj.first_name = req.body.first_name;
            userClassifyObj.user_code = req.body.user_code;
            userClassifyObj.short_name = req.body.short_name || null;
            userClassifyObj.class_associations = req.body.class_associations || null;
            userClassifyObj.selected_categories = JSON.stringify(result) || null;
            userClassifyObj.taxanomy_departments = req.body.selectedNodes || null;
            callback(err, userClassifyObj);
        });
    } catch(err) {
        logger.debug(err);
        callback(responseBuilder.buildResponse(constant.USER_NAME, constant.APP_TYPE, 'object conversion err', err.message, constant.HTTP_BAD_REQUEST), null);
    }
}

UserClassification.deleteEmployee = function(req, data, callback) {
    try {
        var array = [];
        fetchUserClassification(req, models.instance.EmployeeClassification, req.params.id, function(err, result) {
            if (result != null) {
                var deleteQuery = models.instance.EmployeeClassification.delete(getQuery(req, data, false), {return_query: true});
                array.push(deleteQuery);
                data.batchObj = array;
                callback(null, data);
            }
        });
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

UserClassification.deleteStudent = function(req, data, callback) {
    try {
        var array = [];
        fetchUserClassification(req, models.instance.UserClassification, req.params.id, function(err, result) {
            if (result != null) {
                var queryObj = getQuery(req, data, true);
                queryObject.class_id = result.class_id;
                var deleteQuery = models.instance.UserClassification.delete(queryObj, {return_query: true});
                array.push(deleteQuery);
                data.batchObj = array;
                callback(null, data);
            }
        });
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

UserClassification.updateStudent = function(req, data, callback) {
    try {
        var array = data.batchObj,  userClassifyObj = getStudentClassifyObj(req),
            queryObject = getQuery(req, data, true);
        queryObject.class_id = models.uuidFromString(req.body.class_id)
        var updateQuery = models.instance.UserClassification.update(queryObject, userClassifyObj, {return_query: true});
        array.push(updateQuery);
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        callback(err, data);
    }
};

UserClassification.saveStudent = function(req, data, callback) {
    try {
        var array = data.batchObj, userClassifyObj = getStudentClassifyObj(req), headers = baseService.getHeaders(req);
        userClassifyObj.user_name = data.user_name;
        userClassifyObj.academic_year = headers.academic_year; //data.academic_year.ac_year;
        userClassifyObj.school_id = models.uuidFromString(req.headers.userInfo.school_id);
        userClassifyObj.tenant_id = models.timeuuidFromString(req.headers.userInfo.tenant_id);
        var UserClassify = new models.instance.UserClassification(userClassifyObj);
        var UserClassifyQuery = UserClassify.save({return_query: true});
        array.push(UserClassifyQuery);
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};


UserClassification.findDeptIdInEmpClassification = function(req, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var findQuery = baseService.getFindQuery(req);
            findQuery.academic_year = headers.academic_year;
             findQuery.dept_id = {'$contains': req.params.id};
        models.instance.EmployeeClassification.find(findQuery, {allow_filtering: true},function(err, result){
            callback(err, result);
        });

    } catch (err) {
        callback(err, null);
    }
};

UserClassification.findDesgIdInEmpClassification = function(req, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var findQuery = baseService.getFindQuery(req);
        findQuery.academic_year = headers.academic_year;
        findQuery.desg_id = models.uuidFromString(req.params.id);
        models.instance.EmployeeClassification.find(findQuery, {allow_filtering: true},function(err, result){
            callback(err, result);
        });

    } catch (err) {
        callback(err, null);
    }
};

function getStudentClassifyObj(req) {
    var userClassifyObj = {};
    if (req.method == 'POST') {
        userClassifyObj.class_id = models.uuidFromString(req.body.class_id);
        userClassifyObj.class_name = req.body.class_name;
    }
    userClassifyObj.section_id = models.uuidFromString(req.body.section_id);
    userClassifyObj.languages = req.body.languages;
    // userClassifyObj.language_name = req.body.language_name;
    userClassifyObj.section_name = req.body.section_name;
    return userClassifyObj;
}



function throwUserErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.USER_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwUserErr = throwUserErr;

function getQuery(req, data, is_acYear) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };
    findQuery.user_name = req.params.id;
    if(is_acYear){
        findQuery.academic_year = headers.academic_year; //data.academic_year.ac_year;
    }
    return findQuery;
};

exports.getQuery = getQuery;

module.exports = UserClassification;
