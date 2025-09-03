/**
 * Created by bharatkumarr on 20/03/17.
 */

var baseService = require('../common/base.service')
    , models = require('../../models')
    , dateService = require('../../utils/date.service')
    , _ = require('lodash')
    , message = require('@nsa/nsa-commons').messages
    , usermgmtConverter = require('../../converters/usermgmt.converter')
    , constant = require('@nsa/nsa-commons').constants;


var LeaveType = function f(options) {
    // var self = this;
};

LeaveType.getAllLeaveTypes = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.LEAVE_TYPE_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.LEAVE_TYPE_PERMISSIONS);

        models.instance.SchoolLeaveType.find(findQuery, {allow_filtering: true}, function(err, result) {
            callback(err, usermgmtConverter.convertLeaveTypeObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

LeaveType.getLeaveType = function(req, callback) {
    var findQuery = getQuery(req);
    models.instance.SchoolLeaveType.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, usermgmtConverter.convertLeaveTypeObj(req, formattedResult));
    });
};

LeaveType.getLeaveTypeById = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };

    findQuery.leave_type_id = data.leaveTypeId;
    models.instance.SchoolLeaveType.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, usermgmtConverter.convertLeaveTypeObj(req, formattedResult));
    });
};

LeaveType.saveLeaveType = function(req, callback) {
    var leaveTypeObj = req.body;
    leaveTypeObj = baseService.updateIdsFromHeader(req, leaveTypeObj);
    leaveTypeObj.leave_type_id = models.uuid();
    var leaveType = new models.instance.SchoolLeaveType(leaveTypeObj);
    leaveType.save(function (err, result) {
        result['message'] = message.nsa6001;
        callback(err, result);
    });
};

LeaveType.updateLeaveType = function(req, callback) {
    req.body.updated_by = baseService.getHeaders(req).user_id;
    req.body.updated_username = baseService.getHeaders(req).user_name;
    req.body.updated_date = dateService.getCurrentDate();
    var queryObject = getQuery(req);
    delete req.body.leave_type_id;
    models.instance.SchoolLeaveType.update(queryObject, req.body, function(err, result){
        result['message'] = message.nsa6003;
        callback(err, result);
    });
};

LeaveType.deleteLeaveType = function(req, callback) {
    var queryObject = getQuery(req);
    models.instance.SchoolLeaveType.findOne(queryObject, {allow_filtering: true}, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, message.nsa6007);
        } else {
            models.instance.SchoolLeaveType.delete(queryObject, function(err, result){
                result['message'] = message.nsa6005;
                callback(err, result);
            });
        }
    });
};

LeaveType.findLeaveTypeInAssignLeave = function(req, callback) {
    var queryObject = getQuery(req);
    models.instance.SchoolLeaveAssign.find(queryObject, { allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

function getQuery(req) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };

    findQuery.leave_type_id = models.uuidFromString(req.params.id);
    return findQuery;
};
exports.getQuery = getQuery;

module.exports = LeaveType;
