var nsaCassandra = require('@nsa/nsa-cassandra'),
    smsService = require('@nsa/nsa-notification').SMSService,
    models = require('@nsa/nsa-cassandra').Models,
    serviceUtils = require('@nsa/nsa-commons').serviceUtils,
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    speakeasy = require("speakeasy"),
    passwordHash = require('password-hash'),
    async = require('async'),
    _ = require('lodash'),
    baseService = require('../common/base.service'),
    userService = require('../user/user.service'),
    logger = require('../../../config/logger'),
    es = require('../../../src/services/search/elasticsearch/elasticsearch.service');


exports.authenticate = function(req, res) {
    nsaCassandra.Authentication.authenticate(req, function(err, data) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, message.nsa003);
        } else if (!data){
            events.emit('ErrorJsonResponse', req, res, message.nsa003);
        } else {
            res.header('session-id', req.sessionID);
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.authenticateIOSStudent = function(req, res) {
    nsaCassandra.Authentication.authenticateIOSStudent(req, function(err, data) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, message.nsa003);
        } else if (!data){
            events.emit('ErrorJsonResponse', req, res, message.nsa003);
        } else {
            res.header('session-id', req.sessionID);
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.authenticateApp = function(req, res) {
    nsaCassandra.Authentication.authenticateApp(req, function(err, data) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, message.nsa003);
        } else if (!data){
            events.emit('ErrorJsonResponse', req, res, message.nsa003);
        } else {
            res.header('session-id', req.sessionID);
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.authenticateAppParent = function(req, res) {
    async.waterfall([
        getMemberXref.bind(null, req),
        getMember.bind(),
        validateMember.bind(),
    ], function(err, response){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa601});
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.authorizedUser = function(req, res) {
    authorizeUser(req, function(err, data) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, message.nsa003);
        } else if (!data){
            events.emit('ErrorJsonResponse', req, res, message.nsa003);
        } else {
            res.header('session-id', req.sessionID);
            events.emit('JsonResponse', req, res, data);
        }
    })
};

function authorizeUser(req, callback) {
    nsaCassandra.Authentication.authorizedUser(req, function(err, data) {
        callback(err, data)
    })
};
exports.authorizeUser = authorizeUser;

function getMemberXref(req, callback) {
    var obj = {}
    nsaCassandra.Authentication.getMemberXref(req, function(err, data) {
        obj.memberXref = data;
        callback(err, req, obj);
    })
};
exports.getMemberXref = getMemberXref;

function getMember(req, data, callback) {
    if(data['memberXref'].length) {
        nsaCassandra.Authentication.getMember(req, data['memberXref'], function(err, result) {
            data['member'] = result
            callback(null, req, data);
        })
    } else {
        callback(null, req, "User Not Found");
    }
};
exports.getMember = getMember;

function validateMember(req, data, callback) {
    if(data['member'] != undefined && data['member'] != null) {
        var body = req.body;
        var member = data['member'];
        if(passwordHash.verify(body.password, member.password)) {
            var xrefObjs = data['memberXref'];
            if(body.accessId)
            xrefObjs = baseService.filterObjByKeyValue(data['memberXref'], {tenant_id: models.timeuuidFromString(body.accessId)})
            if(xrefObjs.length == 1) {
                req.body.username = xrefObjs[0].user_name
                req.body.accessId = String(xrefObjs[0].tenant_id)
                authorizeUser(req, function (err, data) {
                    callback(err, data);
                })
            } else {
                callback(null, xrefObjs);
            }
        } else {
            callback(true, "Invalid Password");
        }
    } else {
        callback(true, "User Not Found");
    }
};
exports.validateMember = validateMember;

exports.validateSession = function(req, res) {
    nsaCassandra.Authentication.validateSession(req, function(err, data) {
        if(err) {
			logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, message.nsa003);
        } else if (!data){
            events.emit('ErrorJsonResponse', req, res, message.nsa003);
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.getSchoolCredentials = function(req, res) {
    nsaCassandra.Authentication.getSchoolCredentials(req, function(err, response) {
        events.emit('JsonResponse', req, res, response);
    })
};

exports.getUserCredentials = function(req, res) {
    nsaCassandra.Authentication.getUserCredentials(req, function(err, response) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.logout = function(req, res) {
    nsaCassandra.Authentication.logout(req, function(err, response) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, err);
        } else {
            async.waterfall([
                getUserDetails.bind(null,req),
                updateElasticSearchDoc.bind()
            ], function(err, response){
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa010});
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa009});
                }
            })
        }
    })
};

exports.parentLogout = function(req, res) {
    nsaCassandra.Authentication.parentLogout(req, function(err, response) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, err);
        } else {
            var body = req.body;
            var users = body.users
            req.body.username = _.map(users, "username")
            async.waterfall([
                userService.getUsersByUserIds.bind(null,req),
                userService.updateSiblingsElasticSearchDoc.bind()
            ], function(err, response){
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa010});
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa009});
                }
            })
        }
    })
};

function getUserDetails(req, callback) {
    nsaCassandra.User.getUser(req, function(err, response) {
        callback(err, req, response);
    })
};
exports.getUserDetails = getUserDetails;

function updateElasticSearchDoc(req, data, callback) {
    var userType = data.user_type;
    if (userType == 'Student') {
        es.updateStudent(req, data, function(err, response){
            callback(err, req, data);
        })
    } else {
        es.updateEmployee(req, data, function(err, response){
            callback(err, req, data);
        })
    }

};
exports.updateElasticSearchDoc = updateElasticSearchDoc;

exports.invalidateSession = function(req, res) {
    nsaCassandra.Authentication.invalidateSession(req, function(err, response) {
        events.emit('JsonResponse', req, res, response);
    })
};

exports.changePwd = function(req, res) {
    nsaCassandra.Authentication.changePwd(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa006});
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.changeParentPwd = function(req, res) {
    async.waterfall([
        getMemberXref.bind(null, req),
        getMember.bind(),
        finalData.bind(),
    ], function(err, response){
        if(response['member'] != undefined && response['member'] != null) {
            var member = response['member'];
            nsaCassandra.Authentication.changeParentPwd(req, member, function(err, response) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, message.nsa006);
                } else {
                    events.emit('JsonResponse', req, res, response);
                }
            })
        } else {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa604});
        }
    })

};

exports.sendOTP = function(req, res) {
    nsaCassandra.User.getUser(req, function(err, response) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, message.nsa601);
        } else {
            if(response.primary_phone) {
                sendOTPMSG(req, res, response.primary_phone)
            } else {
                events.emit('ErrorJsonResponse', req, res, message.nsa601);
            }
        }
    })

};

exports.sendParentOTP = function(req, res) {
    async.waterfall([
        getMemberXref.bind(null, req),
        getMember.bind(),
        finalData.bind(),
    ], function(err, response){
        if(response['member'] != undefined && response['member'] != null) {
            var member = response['member'];
            if(member.user_name) {
                sendOTPMSG(req, res, member.user_name)
            } else {
                events.emit('ErrorJsonResponse', req, res, message.nsa601);
            }
        } else {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa604});
        }
    })
};

function finalData(req, data, callback) {
    callback(null, data)
};
exports.finalData = finalData;

function sendOTPMSG(req, res, phoneNumber) {
    var secret = baseService.generateSecret(req);
    var token = baseService.generateToken(secret);
    async.waterfall(
        [
            serviceUtils.buildOTPSMSObj.bind(null, req, 'OTP for reset password is ' + token, phoneNumber),
            getSMSConfigObj.bind(),
            smsService.sendOTP.bind(),
        ],
        function (err,  data) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, message.nsa011);
            }
            events.emit('JsonResponse', req, res, {message: 'success', secret: secret});
        }
    );
}
exports.sendOTPMSG = sendOTPMSG;

function getSMSConfigObj(notificationObj, callback) {
    // TODO : below code method and contentType to be moved to common constants
    notificationObj.configObj = {smsUrl: global.config.sms.valueLeaf.url, method: 'POST', contentType: 'Application/json'}
    callback(null, notificationObj);
};
exports.getSMSConfigObj = getSMSConfigObj;

exports.resetPassword = function(req, res) {
    var verified = baseService.verifySecret(req)
    if (verified) {
        nsaCassandra.Authentication.resetPWD(req, function(err, response) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, {message: message.nsa007});
            } else {
                events.emit('JsonResponse', req, res, {message: message.nsa008});
            }
        })
    } else {
        events.emit('ErrorJsonResponse', req, res, {message: message.nsa007});
    }

};

exports.resetParentPassword = function(req, res) {
    var verified = baseService.verifySecret(req)
    if (verified) {
        async.waterfall([
            getMemberXref.bind(null, req),
            getMember.bind(),
            finalData.bind(),
        ], function(err, response){
            if(response['member'] != undefined && response['member'] != null) {
                var member = response['member'];
                nsaCassandra.Authentication.resetParentPWD(req, member, function(err, response) {
                    if(err) {
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, {message: message.nsa007});
                    } else {
                        events.emit('JsonResponse', req, res, {message: message.nsa008});
                    }
                })
            } else {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, {message: message.nsa604});
            }
        })
    } else {
        events.emit('ErrorJsonResponse', req, res, {message: message.nsa007});
    }

};

function throwAuthenticationErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.AUTH_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwAuthenticationErr = throwAuthenticationErr;
