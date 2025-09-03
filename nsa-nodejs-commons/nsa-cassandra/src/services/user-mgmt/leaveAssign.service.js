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
    , logger = require('../../../config/logger');


var LeaveAssign = function f(options) {
    // var self = this;
};

LeaveAssign.getAllLeaveAssign = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.LEAVE_ASSIGN_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.LEAVE_ASSIGN_PERMISSIONS);
        models.instance.SchoolLeaveAssign.find(findQuery, {allow_filtering: true}, function(err, result) {
            callback(err, usermgmtConverter.convertLeaveAsignObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

LeaveAssign.getLeaveAssign = function(req, callback) {
    var findQuery = getQuery(req);
    models.instance.SchoolLeaveAssign.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, usermgmtConverter.convertLeaveAssignObj(req, formattedResult));
    });
};

LeaveAssign.getLeaveAssignByName = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var employeeId= req.params.id;
    var findQuery = {
        emp_id: employeeId,
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
    };
    models.instance.SchoolLeaveAssign.find(findQuery, {allow_filtering: true}, function (err, result) {
        callback(err, usermgmtConverter.convertLeaveAsignObjs(req, result));
    });
};

LeaveAssign.getLeaveAssignByTypeName = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var employeeId= req.params.id;
    var typeId = models.uuidFromString(req.params.typeId);
    var findQuery = {
        emp_id: employeeId,
        leave_type_id: typeId,
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
    };
    models.instance.SchoolLeaveAssign.findOne(findQuery, {allow_filtering: true}, function (err, result) {
        var formattedResult = baseService.validateResult(result);
        callback(err, usermgmtConverter.convertLeaveAssignObj(req, formattedResult));
    });
};


LeaveAssign.saveLeave = function(req, callback) {
    var data = {};
    try {
        var array = [];
        var leaveAssignObjs = req.body;
        _.forEach(leaveAssignObjs, function(leaveObj, key){
            leaveObj.id = models.uuid();
            leaveObj.dept_id = leaveObj.dept_id ? models.uuidFromString(leaveObj.dept_id): null;
            leaveObj.desg_id = leaveObj.desg_id ? models.uuidFromString(leaveObj.desg_id): null;
            leaveObj.leave_type_id = models.uuidFromString(leaveObj.leave_type_id);
            leaveObj = baseService.updateIdsFromHeader(req, leaveObj, false);
            var leave = new models.instance.SchoolLeaveAssign(leaveObj);
            var saveQuery = leave.save({return_query: true});
            array.push(saveQuery);
        });
        data['batchObj'] = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

LeaveAssign.saveReportingEmp = function(req, data, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var array = data.batchObj || [];
        var leaveAssignObjs = req.body;
        _.forEach(leaveAssignObjs, function(leaveObj, key){
            var leave = new models.instance.SchoolEmpReportingManager({
                id: models.uuid(),
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id: models.uuidFromString(headers.school_id),
                reporting_emp_id: leaveObj.reporting_emp_id,
                emp_id: leaveObj.emp_id,
                updated_by: headers.user_id,
                updated_date: new Date()
            });
            var reportingObj = leave.save({return_query: true});
            array.push(reportingObj);
        });
        data['batchObj'] = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

LeaveAssign.findREmpForEmp = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var schoolId = models.uuidFromString(headers.school_id);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var body = req.body;
    var empIds = [];
    _.forEach(body, function(leaveObj, key){
        empIds.push(leaveObj.emp_id);
    });
    models.instance.SchoolLeaveAssign.find({school_id: schoolId, tenant_id: tenantId, emp_id: {'$in': empIds}},
        {allow_filtering: true}, function(err, result) {
            callback(err, result);
        });
};

LeaveAssign.updateReportingEmp = function(req, callback) {
    var data = {};
    try {
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var queryObj = { tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id), emp_id: body.emp_id };
        var updateValues = {
            reporting_emp_id: body.reporting_emp_id,
            updated_by: headers.user_id,
            updated_date: new Date()
        };
        var updateQuery = models.instance.SchoolEmpReportingManager.update(queryObj, updateValues, {return_query: true});
        data['batchObj'] = [updateQuery];
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

LeaveAssign.updateLeave = function(req, callback) {
    req.body.updated_by = baseService.getHeaders(req).user_name;
    req.body.updated_username = baseService.getHeaders(req).user_id;
    req.body.updated_date = dateService.getCurrentDate();
    var queryObject = getQuery(req);
    queryObject.emp_id = req.body.emp_id;
    queryObject.leave_type_id = models.uuidFromString(req.body.leave_type_id);

    if (req.body.dept_id != undefined && req.body.dept_id != null)
        req.body.dept_id = models.uuidFromString(req.body.dept_id);
    if (req.body.desg_id != undefined && req.body.desg_id != null)
        req.body.desg_id = models.uuidFromString(req.body.desg_id);

    delete queryObject.id;
    delete req.body.id;
    delete req.body.reporting_emp_id;
    delete req.body.emp_id;
    delete req.body.leave_type_id;
    delete req.body.department;
    req.body.no_of_leaves = parseInt(req.body.no_of_leaves);

    models.instance.SchoolLeaveAssign.update(queryObject, req.body, function (err, result) {
        callback(err, result);
    });
};

LeaveAssign.updateEmpLeaveAssign = function(req, data, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var array = data.batchObj || [];
        _.forEach(data.empObjs, function(value, key){
            var queryObject = {emp_id: value.emp_id, leave_type_id: value.leave_type_id,
                tenant_id: models.timeuuidFromString(headers.tenant_id), school_id: models.uuidFromString(headers.school_id)};
            var updateValues = { reporting_emp_id : body[0].reporting_emp_id, reporting_emp_username: body[0].reporting_emp_username };
            var updateQuery = models.instance.SchoolLeaveAssign.update(queryObject, updateValues, {return_query: true});
            array.push(updateQuery);
        })
        data['batchObj'] = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

LeaveAssign.deleteLeave = function(req, data, callback) {
    var queryObject = getQuery(req);
    models.instance.SchoolLeaveAssign.findOne(queryObject, {allow_filtering: true}, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, message.nsa6017);
        } else {
            var formattedResult = baseService.validateResult(result);
            delete queryObject.id;
            queryObject.emp_id = formattedResult['emp_id'];
            queryObject.leave_type_id = formattedResult['leave_type_id'];
            models.instance.SchoolLeaveAssign.delete(queryObject, function(err, result){
                result['message'] = message.nsa6005;
                callback(err, result);
            });
        }
    });
};

LeaveAssign.getLeaveAssignByTypeId = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var employeeId= headers.user_id;
    var typeId = models.uuidFromString(req.body.leaveTypeId);
    var findQuery = {
        emp_id: employeeId,
        leave_type_id: typeId,
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
    };
    models.instance.SchoolLeaveAssign.findOne(findQuery, {allow_filtering: true}, function (err, result) {
        var formattedResult = baseService.validateResult(result);
        callback(err, usermgmtConverter.convertLeaveAssignObj(req, formattedResult));
    });
};

function getQuery(req) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
    };

    findQuery.id = models.uuidFromString(req.params.id);
    return findQuery;
};

exports.getQuery = getQuery;
module.exports = LeaveAssign;
