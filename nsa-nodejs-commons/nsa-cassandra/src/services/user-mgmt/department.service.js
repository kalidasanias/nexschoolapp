/**
 * Created by bharatkumarr on 20/03/17.
 */

var baseService = require('../common/base.service')
    , models = require('../../models')
    , dateService = require('../../utils/date.service')
    ,_ = require('lodash')
    , message = require('@nsa/nsa-commons').messages
    , usermgmtConverter = require('../../converters/usermgmt.converter')
    , constant = require('@nsa/nsa-commons').constants
    , constants = require('../../common/constants/constants')
    , logger = require('../../../config/logger');


var Department = function f(options) {
    // var self = this;
};

Department.getAllDepartments = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.DEPARTMENT_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.DEPARTMENT_PERMISSIONS);
        models.instance.SchoolDepartment.find(findQuery, {allow_filtering: true}, function(err, result) {
            callback(err, usermgmtConverter.convertDeptObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

Department.getDepartment = function(req, callback) {
    var findQuery = getQuery(req);
    models.instance.SchoolDepartment.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, usermgmtConverter.convertDepartment(req, formattedResult));
    });
};

Department.fetchDepartment = function(req, dept_id, callback) {
    var findQuery = getBaseQuery(req);
    findQuery.dept_id = dept_id;
    models.instance.SchoolDepartment.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, usermgmtConverter.convertDepartment(req, formattedResult));
    });
};

Department.saveDepartment = function(req, callback) {
    try {
        var deptObj = req.body;
        var headers = baseService.getHeaders(req);
        var deptId = models.uuid();
        deptObj = baseService.updateIdsFromHeader(req, deptObj);
        deptObj.dept_id = deptId;
        deptObj.default_value = false;
        deptObj.status= true;
        deptObj.updated_by = headers.user_id;
        deptObj.updated_username = headers.user_name;
        deptObj.created_date = dateService.getCurrentDate();
        deptObj.created_by = headers.user_id;
        deptObj.created_firstname = headers.user_name;
        var department = new models.instance.SchoolDepartment(deptObj);
        var saveQuery = department.save({return_query: true});
        var data = {deptObj: department, batchObj: [saveQuery], dept_id: deptId};
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

Department.updateDepartment = function(req, callback) {
    try {
        req.body.updated_by = baseService.getHeaders(req).user_id;
        req.body.updated_username = baseService.getHeaders(req).user_name;
        req.body.updated_date = dateService.getCurrentDate();
        var queryObject = getQuery(req);
        delete req.body.dept_id;
        var updateQuery = models.instance.SchoolDepartment.update(queryObject, req.body, {return_query: true});
        var data = {batchObj: [updateQuery], dept_id: queryObject.dept_id};
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

Department.deleteDepartment = function(req, callback) {
    var queryObject = getQuery(req);
    models.instance.SchoolDepartment.findOne(queryObject, {allow_filtering: true}, function(err, result){
        if(_.isEmpty(result)) {
            logger.debug(err);
            callback(err, message.nsa4007);
        } else {
            var deleteQuery = models.instance.SchoolDepartment.delete(queryObject, {return_query: true});
            var data = {batchObj: [deleteQuery], dept_id: queryObject.dept_id};
            callback(null, data);
        }
    });
};

Department.getRootDeptTaxanomy = function (req, data, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var findQuery = { tenant_id: tenantId, school_id: schoolId,
        parent_category_id: models.uuidFromString(constants.DEPT_TAXANOMY_ID),
        academic_year: academicYear
    };
    baseService.getTaxonomyObj(findQuery, function(err, result){
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            data.taxanomy = result;
            callback(null, data);
        }
    })
};

Department.getDeptTaxonomy = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var findQuery = { tenant_id: tenantId,
        school_id: schoolId, id: data.dept_id,
        academic_year: headers.academic_year};
    baseService.getTaxonomyObj(findQuery, function(err, result){
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            data.taxanomy = result;
            callback(null, data);
        }
    })
};

Department.addDeptTaxonomy = function(req, data, callback) {
    try {
        var taxonomyObj = {};
        var array = data.batchObj || [];
        taxonomyObj.order_by = 0;
        taxonomyObj.id = data.deptObj.dept_id;
        taxonomyObj.name = data.deptObj.dept_name;
        taxonomyObj.category_id = models.uuid();
        taxonomyObj.tenant_id = data.taxanomy.tenant_id;
        taxonomyObj.school_id = data.taxanomy.school_id;
        taxonomyObj.parent_category_id = data.taxanomy.category_id;
        taxonomyObj.academic_year = data.taxanomy.academic_year;
        taxonomyObj.status = true;
        taxonomyObj.type = 'O';
        var taxonomy = new models.instance.Taxanomy(taxonomyObj);
        var taxonomyObject = taxonomy.save({return_query: true});
        array.push(taxonomyObject);
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
}

Department.updateDeptTaxonomy = function(req, data, callback) {
    try {
        var array = data.batchObj || [];
        var queryObj = { tenant_id:  data.taxanomy.tenant_id, school_id: data.taxanomy.school_id,
            academic_year: data.taxanomy.academic_year, category_id: data.taxanomy.category_id };
        var updateValues = {name: req.body.dept_name};
        var updateQuery = models.instance.Taxanomy.update(queryObj, updateValues, {return_query: true});
        array.push(updateQuery);
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
}

function getBaseQuery(req) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };
    return findQuery;
}

function getQuery(req) {
    var findQuery = getBaseQuery(req);
    if (req.body.dept_id !== undefined) {
        findQuery.dept_id = models.uuidFromString(req.body.dept_id);
    } else {
        findQuery.dept_id = models.uuidFromString(req.params.id);
    }
    return findQuery;
};

exports.getQuery = getQuery;
module.exports = Department;
