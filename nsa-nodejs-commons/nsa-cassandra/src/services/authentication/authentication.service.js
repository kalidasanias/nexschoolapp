/**
 * Created by senthilPeriyasamy on 12/23/2016.
 */
var models = require('../../models/index'),
    jwt = require('jwt-simple'),
    baseService = require('../common/base.service'),
    passwordHash = require('password-hash'),
    env = process.env.NODE_ENV || "development",
    config = require('../../../config/config.json')[env],
    _ = require('lodash'),
    jwta = require('jsonwebtoken'),
    session = require('express-session'),
    CassandraStore = require("cassandra-store"),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    rolesService = require('../../services/roles/roles.service'),
    academicService = require('../../services/academics/academics.service'),
    logger = require('../../../config/logger');

var Authentication = function f(options) {
    var self = this;
};

var cassandraStore = new CassandraStore({
    "table": "sessions",
    "client": null,
    "clientOptions": {
        "contactPoints": global.config.cassandra.contactPoints,
        "keyspace": global.config.cassandra.keyspace,
        "queryOptions": {
            "prepare": true
        },
        authProvider: new models.driver.auth.DsePlainTextAuthProvider(global.config.cassandra.username, global.config.cassandra.password)
    },
    "saveUninitialized": false,
    "unset": "destroy"
});

Authentication.validateSession = function(req, callback) {
    cassandraStore.get(req.headers['session-id'], function(err, session) {
        var status = {};
        status.code = constants.HTTP_OK;
        status.session_id = req.headers['session-id'];
        if (session != null && session != undefined) {
            status.validSession = true;
        } else {
            status.validSession = false;
        }
        callback(null, {status: status});

    });
}

Authentication.authenticate = function(req, callback) {
    var username = req.body.username;
    models.instance.User.findOne({user_name: username},{allow_filtering: true} ,function(err, result){
        if(err) {
            callback(null, err);
        } else if (!result){
            callback(null, null);
        } else {
            if(result && passwordHash.verify(req.body.password, result.password) && result.active) {
                getPermissions(req, result, function(err, response){
                    if (err) {
                        callback(err, null);
                    } else {
                       /* var user = {user_id: result.id, roles: result.roles, user_name: result.user_name, first_name : result.first_name, school_id : result.school_id, school_name : result.school_name, tenant_id: result.tenant_id, user_type: result.user_type, permissions: _.flatten(response)}
                        var userSessionInfo = createToken(user);*/
                        checkSession(result.user_name, function(err, sessionUser) {
                            if (err) {
                                logger.debug('Unable to fetch sid from session_user ', err);
                            } else {
                                sessionStore(req, response, result, callback);
                            }

                            /*if (sessionUser) {
                             cassandraStore.get(sessionUser.sid, function(err, session) {
                             if (err) {
                             logger.debug('Unable to fetch session from cassandra ', err);
                             }
                             if (session) {
                             var currentExp = new Date();
                             currentExp.setDate(currentExp.getDate() + 10);
                             session.cookie.expires = currentExp;
                             session.cookie.maxAge = 10 * 24 * 60 * 60 * 1000;
                             cassandraStore.touch(sessionUser.sid, session, function (err) {
                             if (err) {
                             logger.debug('Unable to update expires ', err);
                             }
                             });
                             callback(err, {id_token: session.login});
                             } else {
                             sessionStore(req, response, result, callback);
                             }
                             });
                             } else {
                             sessionStore(req, response, result, callback);
                             }*/
                        });
                    }
                });
            } else {
                callback(null, err);
            }
        }
    });
};

function sessionStore(req, response, result, callback) {
    getAcademicYear(req, result, function(err, academicYears){
        var academicResult =  academicYears[academicYears.length - 1];
        var cyear = _.filter(academicYears, {"isCurrentYear": true})
        var userInfo = {session_id:req.sessionID, id: result.id, roles: result.roles, user_name: result.user_name, hp:result.password, first_name : result.first_name, school_id : result.school_id, school_name : result.school_name, tenant_id: result.tenant_id, user_type: result.user_type, academic_year : academicResult.academicYear, permissions: _.flatten(response), cyear: cyear}
        var userInfoToken = createToken(userInfo);
        createSessionUsers(req.sessionID, result.user_name, function (err, data) {
            if (err) {
                logger.debug('SID not stored in session_users ', err);
            }
            req.session.login = userInfoToken;
            req.session.cookie.expires = 10 * 24 * 60 * 60 * 1000;
            callback(err, { id_token: userInfoToken });
        });
    })

}

function getAcademicYear(req, user, callback){
    academicService.getAcademicYears(req, user, function(err, result){
        if(err){
            callback(err, null);
        }else {
            callback(null, result);
        }
    })
};
exports.getAcademicYear = getAcademicYear;

function getPermissions(req, user, callback) {
    rolesService.getAllPermissionsByRoles(req, user, function(err, result){
        if(err) {
            callback(err, null);
        } else {
            callback(null, getPermissionsObj(result, user));
        }
    })
};
exports.getPermissions = getPermissions;


Authentication.authenticateIOSStudent = function (req, callback) {
    var body = req.body;
    var username = body.username;
    models.instance.User.findOne({user_name: username}, {allow_filtering: true}, function (err, result) {
        if (err) {
            callback(true, err);
        } else if (!result) {
            callback(true, null);
        } else if (result.user_type === "Student") {
            if (result && passwordHash.verify(body.password, result.password) && _.isEqual(result.tenant_id, models.timeuuidFromString(body.accessId)) && result.active) {
                getPermissions(req, result, function (err, response) {
                    if (err) {
                        callback(err, null);
                    } else {
                        var user = {
                            user_id: result.id,
                            roles: result.roles,
                            user_name: result.user_name,
                            first_name: result.first_name,
                            school_id: result.school_id,
                            school_name: result.school_name,
                            tenant_id: result.tenant_id,
                            user_type: result.user_type,
                            permissions: _.flatten(response)
                        }
                        var userSessionInfo = createToken(user);
                        checkSession(result.user_name, function (err, sessionUser) {
                            if (err) {
                                logger.debug('Unable to fetch sid from session_user ', err);
                            } else {
                                sessionStore(req, response, result, callback);
                            }
                        });
                    }
                });
            } else {
                callback(true, err);
            }
        } else {
            callback(true, null);
        }
    });
};


function getPermissionsObj(result, user) {
    var permissionsObjs = [];
    var permissionsName = [];
    var roles = user.roles;
    _.forEach(roles, function(value, key){
        var permissionsInfo = filterPermissionDetails(result, models.uuidFromString(key));
        _.forEach(permissionsInfo, function(val1, key1){
            if(!_.isEmpty(val1)) {
                permissionsName.push(baseService.getArrayFromMap(val1['permission_id']));
            };
        })
        permissionsObjs.push(permissionsName);
    });
    return _.flatten(permissionsObjs);
};

function filterPermissionDetails(data, value) {
    var permissionsInfo  = _.filter(data, {'role_id': value});
    return permissionsInfo;
};
exports.filterPermissionDetails = filterPermissionDetails;

Authentication.authenticateApp = function(req, callback) {
    var body = req.body;
    var username = body.username;
    models.instance.User.findOne({user_name: username},{allow_filtering: true} ,function(err, result){
        if(err) {
            callback(null, err);
        } else if (!result){
            callback(null, null);
        } else {
            if(result && passwordHash.verify(body.password, result.password) && _.isEqual(result.tenant_id, models.timeuuidFromString(body.accessId)) && result.active) {
                getPermissions(req, result, function(err, response){
                    if (err) {
                        callback(err, null);
                    } else {
                        var user = {user_id: result.id, roles: result.roles, user_name: result.user_name, first_name : result.first_name, school_id : result.school_id, school_name : result.school_name, tenant_id: result.tenant_id, user_type: result.user_type, permissions: _.flatten(response)}
                        var userSessionInfo = createToken(user);
                        checkSession(result.user_name, function(err, sessionUser) {
                            if (err) {
                                logger.debug('Unable to fetch sid from session_user ', err);
                            } else {
                                sessionStore(req, response, result, callback);
                            }
                        });

                    }
                });
            } else {
                callback(null, err);
            }
        }
    });
};

Authentication.authorizedUser = function(req, callback) {
    var body = req.body;
    var username = body.username;
    models.instance.User.findOne({user_name: username},{allow_filtering: true} ,function(err, result){
        if(err) {
            callback(null, err);
        } else if (!result){
            callback(null, null);
        } else {
            if(result && _.isEqual(result.tenant_id, models.timeuuidFromString(body.accessId)) && result.active) {
                getPermissions(req, result, function(err, response){
                    if (err) {
                        callback(err, null);
                    } else {
                        var user = {user_id: result.id, roles: result.roles, user_name: result.user_name, first_name : result.first_name, school_id : result.school_id, school_name : result.school_name, tenant_id: result.tenant_id, user_type: result.user_type, permissions: _.flatten(response)}
                        var userSessionInfo = createToken(user);
                        checkSession(result.user_name, function(err, sessionUser) {
                            if (err) {
                                logger.debug('Unable to fetch sid from session_user ', err);
                            } else {
                                sessionStore(req, response, result, callback);
                            }
                        });

                    }
                });
            } else {
                callback(null, err);
            }
        }
    });
};

Authentication.getMemberXref = function(req, callback) {
    var body = req.body;
    var username = body.username;
    models.instance.SchoolMembersXref.find({member_user_name: username, tenant_id: models.timeuuidFromString(body.accessId)},{allow_filtering: true} ,function(err, result) {

        callback(err, result)
    });
};

Authentication.getMember = function(req, data, callback) {
    if(data.length) {
        var member_id = data[0].member_id
        models.instance.SchoolMembers.findOne({id: member_id} ,function(err, result) {
            callback(err, result)
        });
    } else {
        callback(null, null)
    }
};

function getCurrentSession(userId, callback) {
    cassandraStore.all(function (error, allSessions) {
        if (allSessions == null) return null;
        for (var i = 0; i < allSessions.length; i++) {
            if (allSessions[i].user_id != undefined && models.uuidFromString(allSessions[i].user_id.toString()).toString().trim() === userId) {
                callback(allSessions[i]);
                break;
            }
        }
    });
}

function createSessionUsers(sid, user_name, callback) {
    /*checkSession(user_name, function (err, data) {
        if(data) {
            cassandraStore.destroy(data.sid, function (err, sess) {
            });
        }*/
        var sessionUser = new models.instance.SessionUsers ({
            sid: sid,
            user_name: user_name
        });
        sessionUser.save(function (err, result) {
            callback(err, result)
        });
    // })
}

function checkSession(user_name, callback) {
    models.instance.SessionUsers.findOne({user_name: user_name}, function (err, result) {
        if (result) {
            models.instance.SessionUsers.delete({user_name: result.user_name}, function (err, result1) {
                cassandraStore.destroy(result.sid, function (err, session) {
                    callback(err, session)
                });
            });
        } else {
            callback(null, null);
        }


        //callback(err, result)
    });
}

Authentication.invalidateSession = function(req, callback) {
    var sessionId = req.headers['session-id'];
    var headers = baseService.getHeaders(req)
    models.instance.SessionUsers.delete({
        user_name: headers.user_id
    }, function (err, result) {
        cassandraStore.destroy(sessionId, function (err, session) {
            callback(err, session)
        });
    });

};

Authentication.invalidateSiblingsSession = function(req, callback) {
    var body = req.body;
    var users = body.users
    var updateObj = function(object, callback) {
        models.instance.SessionUsers.delete({user_name: object.username}, function (err, result) {
            cassandraStore.destroy(object.sessionId, function (err, session) {
                callback(err, session)
            });
        });
    };

    async.times(users.length, function(i, next) {
        var obj = users[i];
        updateObj(obj, function(err, data) {
            next(err, data);
        });
    }, function(err, objs) {
        callback(err, objs)
    });

};

Authentication.changePwd = function(req, callback) {
    var hashedPassword = passwordHash.generate(req.body.newPassword);
    var headers = baseService.getHeaders(req)
    models.instance.User.findOne({user_name: headers.user_id},{allow_filtering: true} ,function(err, result){
        if(err) {
            callback(null, err);
        } else if (!result){
            callback(null, null);
        } else {
            if(result && passwordHash.verify(req.body.oldPassword, result.password)) {
                var user = new models.instance.User ({
                    password: hashedPassword,
                    user_name: headers.user_id
                });
                user.save();
                callback(err, {message: message.nsa005});
            } else {
                callback(true, null);
            }
        }
    });

};

Authentication.changeParentPwd = function(req, member, callback) {
    var hashedPassword = passwordHash.generate(req.body.newPassword);
    models.instance.SchoolMembers.findOne({id: member.id}, function(err, result){
        if(err) {
            callback(null, err);
        } else if (!result){
            callback(null, null);
        } else {
            if(result && passwordHash.verify(req.body.oldPassword, result.password)) {
                var user = new models.instance.SchoolMembers ({
                    password: hashedPassword,
                    id: member.id
                });
                user.save(function (err, result) {
                    callback(err, {message: message.nsa005});
                });
            } else {
                callback(true, null);
            }
        }
    });

};

Authentication.resetPWD = function (req, callback) {
    var hashedPassword = passwordHash.generate(req.body.newPassword);
    var user = new models.instance.User ({
        password: hashedPassword,
        user_name: req.body.username
    });
    user.save(function (err, result) {
        callback(err, result);
    });

}

Authentication.resetParentPWD = function (req, member, callback) {
    var hashedPassword = passwordHash.generate(req.body.newPassword);
    var user = new models.instance.SchoolMembers ({
        password: hashedPassword,
        id: member.id
    });
    user.save(function (err, result) {
        callback(err, result);
    });

}

Authentication.getSchoolCredentials = function(req, callback) {

    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    models.instance.SchoolDetails.findOne({
        tenant_id: tenantId,
        school_id: schoolId
    }, {allow_filtering: true}, function (err, result) {
        if (err) {
            callback(null, err);
        } else {
            var user = {projectId: result.project_id, ServerApiKey: result.server_api_key, map_key: result.google_key, city: result.city};
            callback(null,  {success: true, schoolDetails: user});
        }
    });
};

Authentication.getUserCredentials = function(req, callback) {
    var userId = models.uuidFromString(req.params.id);
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);

    models.instance.User.findOne({
        id: userId,
        tenant_id: tenantId,
        school_id: schoolId
    }, {allow_filtering: true}, function (err, result) {
        if (err) {
            callback(null, err);
        }else {
            var user = {deviceToken : result.device_token};
            callback(null, {success: true, user: user});
        }
    });
};

Authentication.logout = function(req, callback){
    var user = req.body;
    var regId = user.registrationId;
    var headers = baseService.getHeaders(req);

    var query = "delete device_token [?] from user where user_name = ?";
    var params = [regId, user.username];
    models.instance.User.execute_query(query, params, function (err, result) {
        if(err){
            callback(null, err);
        } else {
            Authentication.invalidateSession(req, function (err, data) {
                callback(err, data);
            })
        }
    });
};

Authentication.parentLogout = function(req, callback){
    var body = req.body;
    var regId = body.registrationId;
    var query = "delete device_token [?] from user where user_name = ?";
    var users = body.users

    var updateObj = function(object, callback) {
        var params = [regId, object.username]
        models.instance.User.execute_query(query, params, function (err, result) {
            callback(err, result);
        });
    };

    async.times(users.length, function(i, next) {
        var obj = users[i];
        updateObj(obj, function(err, data) {
            next(err, data);
        });
    }, function(err, albumObjs) {
        Authentication.invalidateSiblingsSession(req, function (err, data) {
            callback(err, data)
        })
    });
};

function createToken(user) {
    return jwta.sign(_.omit(user, ''), global.config.cassandra.password, { expiresIn: 365 * 24 * 60 * 60 * 1000 });
}

module.exports = Authentication;

