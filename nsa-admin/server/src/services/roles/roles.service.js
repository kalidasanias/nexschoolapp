/**
 * Created by Kiran on 6/13/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    constant = require('@nsa/nsa-commons').constants,
    message = require('@nsa/nsa-commons').messages,
    baseService = require('../common/base.service'),
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    logger = require('../../../config/logger'),
    es = require('../../services/search/elasticsearch/elasticsearch.service'),
    _ = require('lodash');


exports.getSchoolRoleTypes = function(req, res) {
    nsaCassandra.Roles.getSchoolRoleTypes(req, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14001));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

exports.getSchoolRoleTypesById = function(req, res) {
    nsaCassandra.Roles.getSchoolRoleTypeById(req, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14001));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

exports.getAllPermissions = function(req, res) {
    nsaCassandra.Roles.getAllPermissions(req, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14002));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

exports.getAllRolePermissions = function(req, res) {
    nsaCassandra.Roles.getAllRolePermissions(req, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14002));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

exports.getRolePermission = function(req, res) {
    nsaCassandra.Roles.getRolePermission(req, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14002));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

exports.getRolePermissionByName = function(req, res) {
    nsaCassandra.Roles.getRolePermissionByName(req, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14002));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

exports.savePermissionsByRole = function(req, res) {
    async.waterfall([
        saveRoleTypes.bind(null, req),
        saveRoleByPermissions.bind(),
        executeBatch.bind()
    ], function(err, result){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14003));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa14010});
        }
    });
};

exports.updateRoleToUsers = function(req, res) {
    async.waterfall([
        getUseByRole.bind(null, req),
        getUpdatedUsers.bind(),
        updateUsersRole.bind(),
        delUsersRole.bind(),
        executeBatch.bind()
    ], function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14004));
        } else {
            updateESRoleObj(req, result, function(err, response){
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14004));
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa14005});
                }
            });

        }
    });
};

function getUpdatedUsers(req, data, callback) {
   try {
       var selectedData = req.body.users;
       var delObj = _.differenceBy(data, selectedData, 'userName');
       var upObj = _.differenceBy(selectedData, data, 'userName');
       data['delObj'] = delObj;
       data['upObj'] = upObj;
       callback(null, req, data);
   } catch (err) {
       callback(err, null);
   }

}
exports.getUpdatedUsers = getUpdatedUsers;

exports.updateRoleToUser = function(req, res) {
    async.waterfall([
        updateUserRole.bind(null, req),
        executeBatch.bind()
    ], function(err, result){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err,  message.nsa14004));
        } else {
            updateEmpESRoleObj(req, function(err, response){
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err,  message.nsa14004));
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa14005});
                }
            });
        }
    });
};

exports.getUsersByRoleId = function(req, res) {
    req.body.roleId = req.params.id
    es.getUsersByRole(req, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14002));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

/*function updateESRoleObj(req, callback) {
    var rolesObj = nsaCassandra.Base;
    es.updateEmpsRoles(req, rolesObj, function (err, res) {
        callback(err, res);
    })
};
exports.updateESRoleObj = updateESRoleObj;*/

function updateESRoleObj(req, data, callback) {
    async.parallel( {
        updROle: updateEmpsRoleObj.bind(null, req, data),
        delRole: delEmpsRoleObj.bind(null, req, data)
    }
     ,function(err, result) {
            callback(err, result)
    });


};
exports.updateESRoleObj = updateESRoleObj;

function delEmpsRoleObj(req, data, callback) {
    if(!_.isEmpty(data.delObj)) {
        es.delEmpsRoles(req, data.delObj, 'delete', function (err, res) {
            callback(err, res);
        })
    } else {
        callback(null, data);
    }
}
exports.delEmpsRoleObj = delEmpsRoleObj;

function updateEmpsRoleObj(req, data, callback) {
    if(!_.isEmpty(data.upObj)) {
        es.updateEmpsRoles(req, data.upObj, 'update', function (err, res) {
            callback(err, res);
        })
    } else {
        callback(null, data);
    }
}
exports.updateEmpsRoleObj = updateEmpsRoleObj;

function updateEmpESRoleObj(req, callback) {
    var rolesObj = nsaCassandra.Base.baseService.changeArrayKeyWithKey(req.body.roles, 'role_id', 'role_name');
    es.updateEmpRoles(req, rolesObj, function (err, res) {
        callback(err, res);
    })
};
exports.updateEmpESRoleObj = updateEmpESRoleObj;

exports.updatePermissionsByRole = function(req, res) {
    async.waterfall([
        updateRoleTypes.bind(null, req),
        updateRoleByPermissions.bind(),
        executeBatch.bind()
    ], function(err, result){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14006));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa14007});
        }
    });
};

exports.deletePermissionsByRole = function(req, res) {
    getUsersByRole(req, function(err, result){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14008));
        } else if (_.isEmpty(result)) {
            async.waterfall([
                deleteRoleTypes.bind(null, req),
                deletePermissions.bind(),
                executeBatch.bind()
            ], function(err, result){
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa14008));
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa14009});
                }
            });
        } else {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        }
    });
};

function getUsersByRole(req, callback) {
    nsaCassandra.User.getUsersByRole(req, function(err, result) {
        callback(err, result);
    });
};
exports.getUsersByRole = getUsersByRole;

function getUseByRole(req, callback) {
    nsaCassandra.User.getUsersByRole(req, function(err, result) {
        callback(err, req, result);
    });
};
exports.getUseByRole = getUseByRole;

function saveRoleTypes(req, callback) {
    nsaCassandra.Roles.saveSchoolRoleTypes(req, function(err, data) {
        callback(err, req, data);
    });
};
exports.saveRoleTypes = saveRoleTypes;

function updateRoleTypes(req, callback) {
    nsaCassandra.Roles.updateRoleTypes(req, function(err, data) {
        callback(err, req, data);
    });
};
exports.updateRoleTypes = updateRoleTypes;

function deleteRoleTypes(req, callback) {
    nsaCassandra.Roles.deleteRoleTypes(req, function(err, data) {
        callback(err, req, data);
    });
};
exports.deleteRoleTypes = deleteRoleTypes;

function saveRoleByPermissions(req, data, callback) {
    nsaCassandra.Roles.saveRoleByPermissions(req, data, function(err, result) {
        callback(err, req, result);
    });
};
exports.saveRoleByPermissions = saveRoleByPermissions;

function updateRoleByPermissions(req, data, callback) {
    nsaCassandra.Roles.updatePermissionsByRole(req, data, function(err, result){
        callback(err, req, result);
    });
};
exports.updateRoleByPermissions = updateRoleByPermissions;

function updateUsersRole(req, data, callback) {
    nsaCassandra.User.updateUsersRole(req, data, function(err, result){
        callback(err, req, result);
    });
};
exports.updateUsersRole = updateUsersRole;

function delUsersRole(req, data, callback) {
    nsaCassandra.User.delUsersRole(req, data, function(err, result){
        callback(err, req, result);
    });
};
exports.delUsersRole = delUsersRole;

function updateUserRole(req, callback) {
    nsaCassandra.User.updateUserRole(req, function(err, result){
        callback(err, req, result);
    });
};
exports.updateUserRole = updateUserRole;

function deletePermissions(req, data, callback) {
    nsaCassandra.Roles.deletePermissionsByRole(req, data, function(err, result){
        callback(err, req, result);
    });
};
exports.updateRoleByPermissions = updateRoleByPermissions;

function executeBatch(req, data, callback) {
        nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
            callback(err, data);
        })

};
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.ROLES_DETAILS, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;