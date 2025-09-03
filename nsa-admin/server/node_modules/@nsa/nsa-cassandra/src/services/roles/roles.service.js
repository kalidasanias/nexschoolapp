/**
 * Created by Kiran on 6/13/2017.
 */

var baseService = require('../common/base.service')
    , models = require('../../models')
    , message = require('@nsa/nsa-commons').messages
    , constant = require('@nsa/nsa-commons').constants
    , logger = require('../../../config/logger')
    , _ = require('lodash')
    , rolesBase = require('../../services/common/rolesbase.service')
    , rolesConverter = require('../../converters/role.converter');


var Roles = function f(options) {
    var self = this;
};

Roles.getSchoolRoleTypes = function(req, callback) {
    var findQuery = baseService.getFindQuery(req);
    if(req.query.q != undefined) {
        findQuery.name = { '$like': "" + req.query.q + "%" };
    }
    models.instance.SchoolRoleType.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, rolesConverter.roleObjects(result));
    });
};

Roles.getSchoolRoleTypeById = function(req, callback) {
    var findQuery = baseService.getFindQuery(req);
        findQuery.id = models.uuidFromString(req.params.id);
    models.instance.SchoolRoleType.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Roles.saveSchoolRoleTypes = function(req, callback) {
    var data = {};
    try {
        var schoolRoleType  = rolesBase.constructRoleTypeObj(req);
        var schoolRoleTypeObj = schoolRoleType.save({return_query: true});
        var array = [schoolRoleTypeObj];
        data.role_id = schoolRoleType.id;
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, data);
    }
};

Roles.updateRoleTypes = function(req, callback) {
    var data = {};
    try {
        var schoolRoleType  = rolesBase.updateRoleTypeObj(req);
        var schoolRoleTypeObj = models.instance.SchoolRoleType.update(schoolRoleType.findQuery, schoolRoleType.updateValues, {return_query: true});
        var array = [schoolRoleTypeObj];
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, data);
    }
};

Roles.deleteRoleTypes = function(req, callback) {
    var data = {};
    try {
        var findQuery  = baseService.getFindQuery(req);
        findQuery.id = models.uuidFromString(req.params.id);
        var schoolRoleTypeObj = models.instance.SchoolRoleType.delete(findQuery, {return_query: true});
        var array = [schoolRoleTypeObj];
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, data);
    }
};

Roles.saveRoleByPermissions = function(req, data, callback) {
    try {
        var array = data.batchObj || [];
        var schoolRoleType  = rolesBase.constructRolePermissionObj(req, data);
        var schoolRoleTypeObj = schoolRoleType.save({return_query: true});
        array.push(schoolRoleTypeObj);
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, data);
    }
};

Roles.getAllPermissions = function(req, callback) {
    models.instance.Permissions.find({}, function(err, result){
        callback(err, result);
    });
};

Roles.getAllRolePermissions = function(req, callback) {
    var findQuery = baseService.getFindQuery(req);
    models.instance.SchoolRolePermissions.find(findQuery, function(err, result){
        if(!_.isEmpty(result)) {
            var permissions = baseService.getArrayFromMap(result['permission_id']);
            result['permissions'] = permissions;
        }

        callback(err, result);
    });
};

Roles.getRolePermission = function(req, callback) {
    var findQuery = baseService.getFindQuery(req);
    findQuery.role_id = models.uuidFromString(req.params.id);
    models.instance.SchoolRolePermissions.findOne(findQuery, function(err, result){
        if(!_.isEmpty(result)) {
            var permissions = baseService.getFormattedMap(result['permission_id']);
            result['permission_id'] = permissions;
        }

        callback(err, result);
    });
};

Roles.getAllPermissionsByRoles = function(req, user, callback) {
    var findQuery = { tenant_id: user.tenant_id, school_id: user.school_id };
    models.instance.SchoolRolePermissions.find(findQuery, function(err, result){
        callback(err, result);
    });
};

Roles.getPermissionsByRoles = function(req, user, callback) {
    var findQuery = { tenant_id: user.tenant_id, school_id: user.school_id };
    var roles = user.roles;
    var permissions = [];
    _.forEach(roles, function(value, key){
        findQuery.role_id = value;
        models.instance.SchoolRolePermissions.findOne(findQuery, function(err, result){
            if(!_.isEmpty(result)) {
                permissions.push(result);
            }
        });
    });
    callback(null, permissions);
};

Roles.getRolePermissionByName = function(req, callback) {
    var findQuery = baseService.getFindQuery(req);
    findQuery.role_name = req.params.name;
    models.instance.SchoolRolePermissions.findOne(findQuery, {allow_filtering: true}, function(err, result){
        if(!_.isEmpty(result)) {
            var permissions = baseService.getFormattedMap(result['permission_id']);
            result['permission_id'] = permissions;
        } else {
            result = {};
        }
        callback(err, result);
    });
};

Roles.updatePermissionsByRole = function(req, data, callback) {
    try {
        var array = data.batchObj || [];
        var schoolRolePermissions  = rolesBase.updateRolePermissionObj(req);
        var updateQuery = models.instance.SchoolRolePermissions.update(schoolRolePermissions.findQuery, schoolRolePermissions.updateValues , {return_query: true});
        array.push(updateQuery);
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, data);
    }
};

Roles.deletePermissionsByRole = function(req , data, callback){
    try {
        var array = data.batchObj || [];
        var queryObject  = baseService.getFindQuery(req);
        queryObject.role_id =  models.uuidFromString(req.params.id);
        var PermissionsByRole = models.instance.SchoolRolePermissions.delete(queryObject, {return_query: true})
        array.push(PermissionsByRole);
        data.batchObj == array;
        callback(null, data);
    } catch(err) {
        logger.debug(err);
        callback(err, data);
    }
}

module.exports = Roles;