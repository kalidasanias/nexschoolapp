/**
 * Created by Kiran on 6/13/2017.
 */


var models = require('../../models/index'),
    baseService = require('./base.service'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger');

var RoleBase = function f(options) {
    var self = this;
};

RoleBase.constructRoleTypeObj = function(req) {
    var roleTypeObj;
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();

        roleTypeObj = new models.instance.SchoolRoleType  ({
            id: models.uuid(),
            tenant_id: tenantId,
            school_id: schoolId,
            name: body.roleName,
            description: body.roleDesc,
            updated_date: currentDate,
            updated_by: headers.user_id,
            updated_username: headers.user_name,
            created_date: currentDate,
            created_by: headers.user_id,
            created_firstname: headers.user_name,
            default_value: false,
            is_enable: true
        });
    } catch (err) {
        logger.debug(err);
        return err;
    }
    return roleTypeObj;
};

RoleBase.updateRoleTypeObj = function(req) {
    var findQuery = {};
    var updateValues = {};
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();

        findQuery = {
            id: models.uuidFromString(req.params.id),
            tenant_id: tenantId,
            school_id: schoolId
        }


        updateValues = {
            name: body.roleName,
            description: body.roleDesc,
            updated_date: currentDate,
            updated_by: headers.user_id,
            updated_username: headers.user_name,
        };
    } catch (err) {
        logger.debug(err);
        return err;
    }
    return { findQuery: findQuery, updateValues: updateValues };
};

RoleBase.constructRolePermissionObj = function(req, data) {
    var rolePermissionObj;
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var permisssionObj = baseService.getMapFromFormattedMap(body.permissions);

        rolePermissionObj = new models.instance.SchoolRolePermissions({
            id: models.uuid(),
            tenant_id: tenantId,
            school_id: schoolId,
            role_id: data.role_id,
            role_name: body.roleName,
            permission_id: permisssionObj,
            updated_date: currentDate,
            updated_by: headers.user_id,
            updated_username: headers.user_name,
            created_date: currentDate,
            created_by: headers.user_id,
            created_firstname: headers.user_name
        });
    } catch (err) {
        logger.debug(err);
        return err;
    }
    return rolePermissionObj;
};

RoleBase.updateRolePermissionObj = function(req) {
    var updateValues = {};
    var findQuery = {};
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var permisssionObj = baseService.getMapFromFormattedMap(body.permissions);

        findQuery = {
            role_id: models.uuidFromString(req.params.id),
            tenant_id: tenantId,
            school_id: schoolId
        }

        updateValues = {
            role_name: body.roleName,
            permission_id: permisssionObj,
            updated_date: currentDate,
            updated_by: headers.user_id,
            updated_username: headers.user_name
        };
    } catch (err) {
        logger.debug(err);
        return err;
    }
    return {updateValues: updateValues, findQuery: findQuery};
};

module.exports = RoleBase;