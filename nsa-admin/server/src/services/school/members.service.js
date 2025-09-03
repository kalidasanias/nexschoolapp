
/**
 * Created by senthil on 22/09/17.
 */
var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    userService = require('../user/user.service'),
    nsaElasticSearch = require('@nsa/nsa-elasticsearch'),
    nsacu = require('@nsa/nsa-bodybuilder').calendarUtil,
    nsabb = require('@nsa/nsa-bodybuilder').builderutil,
    es = require('../search/elasticsearch/elasticsearch.service'),
    loggerDetails = require('../../common/logging'),
    userService = require('../user-mgmt/user.service')
    logger = require('../../../config/logger');

exports.createSchoolMembers = function (req, res) {
//    setTimeout(function (args) { events.emit('JsonResponse', req, res, 'success'); }, 1000);
    async.waterfall([
        getAllStudentUsers.bind(null, req),
        getSchoolDetails.bind(),
        createSchoolMembersObjs.bind(),
        executeBatch.bind()
    ], function(err, response){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa604});
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

function getAllStudentUsers(req, callback) {
    var userType = constant.STUDENT;
    userService.getAllUsersInUser(req,userType, function (err, data) {
        callback(err, req, data)
    })
};
exports.getAllStudentUsers = getAllStudentUsers;

function createSchoolMembersObjs(req, data, callback) {
    nsaCassandra.Base.schoolbase.constructSchoolmembersObj(req, data, function(err, result) {
        callback(err, req, data);
    })
};
exports.createSchoolMembersObjs = createSchoolMembersObjs;

function getSchoolDetails(req, data, callback){
    nsaCassandra.School.getSchoolDetailsForProcessor(function(err, result){
        data.schoolDetails = result;
        callback(err, req, data)
    })
};
exports.getSchoolDetails = getSchoolDetails;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, data) {
        callback(err, data);
    })
}
exports.executeBatch = executeBatch;

exports.createOnboardSchoolMembers = function (req, res) {
    async.parallel({
        users: getSchoolStudents.bind(null, req),
        schoolDetails: getSchoolDetail.bind(null, req)
    }, function (err, data) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa604});
        } else {

            async.waterfall([
                createOnboardSchoolMembersObjs.bind(null, req, data),
                executeBatch.bind()
            ], function (err1, response) {
                if(err1) {
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa604});
                } else {
                   events.emit('JsonResponse', req, res, response);
                }
            })
        }
    });
};

exports.createOnboardEsSchoolMembers = function (req, res) {
    setTimeout(function (args) { events.emit('JsonResponse', req, res, 'success'); }, 1000);
    async.parallel({
        Logins: nsaCassandra.Member.getSchoolChild.bind(null, req),
        AllStudent: es.getAllStudents.bind(null, req),
    }, function(err, result){
        if(err){
            console.info('err',err);
        }else {
            buildOnboardParentLoginObjs(req, result, function (err, bulkParams) {
                if (err) {
                    console.info('err', err);
                } else {
                    var array = _.chunk(bulkParams, constant.ES_CHUNK_SIZE);
                    async.times(array.length, function (i, next) {
                        var obj = array[i];
                        updateBulkObjs(obj, function (err, data) {
                            next(err, data);
                        });
                    }, function (err, objs) {
                        if (err) {
                            console.info('err', err);
                        } else {
                            console.info('done', objs.length);
                        }
                    });
                }
            })
        }
    })
};


exports.getAllParentChilds = function (req, res) {
    try{
        setTimeout(function (args) { events.emit('JsonResponse', req, res, 'success'); }, 1000);
        async.parallel({
                childs : getAllParentChild.bind(null, req),
                contactInfo : getAllContactinfo.bind(null, req),
            },
            function(err, result){
                if(err){
                    console.info('err..',err);
                }else {
                    nsaCassandra.Member.updateFatherName(req, result, function(err, data) {
                        if(err){
                            console.info('err',err);
                        }else {
                            console.info('done', data);
                        }
                    })
                }
            })
    }catch (err){
        console.log('expe', err);
    }

};

function getAllParentChild(req, callback) {
    nsaCassandra.Member.getAllParentChaild(req, function(err, data) {
        callback(err, data);
    })
};
exports.getAllParentChild = getAllParentChild;

function getAllContactinfo(req, callback) {
    nsaCassandra.UserContact.getAllContactinfomation(req, function(err, data) {
        callback(err, data);
    })
};
exports.getAllContactinfo = getAllContactinfo;

exports.updateParentDetailsInEs = function (req, res) {
    setTimeout(function (args) { events.emit('JsonResponse', req, res, 'success'); }, 1000);
    async.parallel({
        Logins: nsaCassandra.Member.getAllParentChaild.bind(null, req),
        AllStudent: getAllStudentsDocumets.bind(null, req),
    }, function(err, result){
        if(err){
            console.info('err',err);
        }else {
            buildParentLoginObjs(req, result, function (err, bulkParams) {
                if (err) {
                    console.info('err', err);
                } else {
                    var array = _.chunk(bulkParams, constant.ES_100_CHUNK_SIZE);
                    async.times(array.length, function (i, next) {
                        var obj = array[i];
                        updateBulkObjs(obj, function (err, data) {
                            next(err, data);
                        });
                    }, function (err, objs) {
                        if (err) {
                            console.info('err', err);
                        } else {
                            console.info('done', objs.length);
                        }
                    });
                }
            })
        }
    })
};

function getAllStudentsDocumets(req, callback){
    var searchParams = nsabb.AllSchoolStudentSearchQuery(req);
    nsaElasticSearch.search.getUsersByScroll(searchParams, function(err, result){
        callback(err, result)
    })
}

exports.updateTanentIdInMembers = function(req, res) {
    setTimeout(function (args) { events.emit('JsonResponse', req, res, 'success'); }, 1000);
    async.parallel({
            Members: nsaCassandra.Member.getAllMembers.bind(null, req),
            MembersXref: nsaCassandra.Member.getAllParentChaild.bind(null, req),
            schoolDetails: nsaCassandra.School.getSchoolDetailsForProcessor.bind(null),
        }, function (err, result) {
           if (err) {
                console.info('err While updating', req, res);
            } else {
                updateTanentId(result, function(err, data){
                  if(err){
                      console.info('err While updating', req, res);
                  }else {
                      console.info('Done', data.length);
                  }
                })
            }
        }
    );
};

function updateTanentId(data, callback){
    nsaCassandra.School.updateTanentId(data, function(err, result){
        callback(err, result);
    })
}

exports.getAllParents = function (req, res) {
    var havePermission = nsaCassandra.BaseService.haveAnyPermissions(req, constant.PARENT_INFORMATION_PERMISSIONS);
    if(havePermission){
        var searchParams = nsabb.getParentSearchQueryParam(req);
        nsaElasticSearch.search.searchParents(req, searchParams, function (err, data, status) {
            if(err) {
                loggerDetails.debugLog(req, 'Get Parent Details', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5004));
            } else {
                events.emit('JsonResponse', req, res, data);
            }
        })
    }else {
        events.emit('JsonResponse', req, res, []);
    }
};

exports.changeParentNumber = function(req, res) {
    var data = {};
    async.waterfall(
        [
            getTenantIdChilds.bind(null, req, data),
            UpdateNumberInStudents.bind(),
            getUsersContanctDetails.bind(),
            UpdateNumberInStudentContact.bind(),
            UpdateNumberInParentLogin.bind(),
            UpdateNumberInEsParentLogin.bind(),
            getCurrentYearESIds.bind(),
            UpdateNumberInStudentESObj.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                loggerDetails.debugLog(req, 'Update Parent Phone number', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5020));
            } else {
                var results = {};
                results.childs = req.body.childs;
                results.id = req.body.id;
                results.message = message.nsa5021;
                events.emit('JsonResponse', req, res, results);
            }
        }
    );
};

function getTenantIdChilds(req, data, callback){
    nsaCassandra.Member.getTenantIdChilds(req, data, function(err, result) {
        callback(err, req, result);
    })
};

function getCurrentYearESIds(req, data, callback){
    nsaCassandra.Member.getCurrentYearESIds(req, data, function(err, result) {
        callback(err, req, result);
    })
};

function UpdateNumberInStudents(req, data, callback) {
    nsaCassandra.UserMgmt.UpdateNumberInStudents(req, data, function(err, result) {
        callback(err, req, result);
    })
}
exports.UpdateNumberInStudents = UpdateNumberInStudents;


function getUserContactInfo(req, data, callback){
    nsaCassandra.UserContact.getUserContactInformation(req, data, function(err, result) {
        callback(err, req, result);
    })
}

function getUsersContanctDetails(req, data, callback){
    var body = req.body;
    data.userIds = _.map(body.childs, 'user_name');
    nsaCassandra.User.getUsersContactInfo(req, data, function(err, result) {
        data.userContacts = result;
        callback(err, req, data);
    })
}
exports.getUsersContanctDetails = getUsersContanctDetails;

function UpdateNumberInStudentContact(req, data, callback) {
    nsaCassandra.UserContact.UpdateNumberInStudentContact(req, data, function(err, result) {
        callback(err, req, result);
    })
}
exports.UpdateNumberInStudentContact = UpdateNumberInStudentContact;

function UpdateNumberInParentLogin(req, data, callback) {
    nsaCassandra.Member.UpdateNumberInParentLogin(req, data, function(err, result) {
        callback(err, req, result);
    })
}
exports.UpdateNumberInParentLogin = UpdateNumberInParentLogin;

function UpdateNumberInStudentESObj(req, data, callback) {
    nsaCassandra.Member.UpdateNumberInStudentESObj(req, data, function(err, result) {
        callback(err, req, data);
    })
}
exports.UpdateNumberInStudentESObj = UpdateNumberInStudentESObj;

function UpdateNumberInEsParentLogin(req, data, callback) {
    nsaCassandra.Member.UpdateNumberInEsParentLogin(req, data, function(err, result) {
        callback(err, req, data);
    })
}
exports.UpdateNumberInEsParentLogin = UpdateNumberInEsParentLogin;

function buildParentLoginObjs(req, data, callback) {
    nsaCassandra.Member.buildParentLoginObj(req, data, function(err, result){
        callback(err, result);
    })
};
exports.buildParentLoginObjs = buildParentLoginObjs;

function buildOnboardParentLoginObjs(req, data, callback) {
    nsaCassandra.Member.buildOnboardParentLoginObjs(req, data, function(err, result){
        callback(err, result);
    })
};
exports.buildOnboardParentLoginObjs = buildOnboardParentLoginObjs;

function updateBulkObjs(bulkParams, callback) {
    nsaElasticSearch.index.bulkDoc({body: bulkParams}, function (err, result) {
        callback(err, result);
    });
};

function getSchoolStudents(req, callback) {
    nsaCassandra.User.getSchoolStudents(req, function(err, data) {
        callback(err, data);
    })
};
exports.getSchoolStudents = getSchoolStudents;

function getAllMembersUserNames(req, callback) {
    nsaCassandra.User.getAllMembersUserNames(req, function (err, data) {
        callback(err, data);
    });
};
exports.getAllMembersUserNames = getAllMembersUserNames;

function getSchoolDetail(req, callback){
    nsaCassandra.School.getSchoolDetails(req, function(err, result){
        callback(err, result)
    })
};
exports.getSchoolDetail = getSchoolDetail;

function createOnboardSchoolMembersObjs(req, data, callback) {
    nsaCassandra.Base.schoolbase.constructOnboardSchoolmembersObj(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.createOnboardSchoolMembersObjs = createOnboardSchoolMembersObjs;

exports.addWardToParent = function(req, res){
    var data =  {};
    async.waterfall(
        [
            updateWardInStudent.bind(null, req, data),
            getUserContactInfo.bind(),
            updateWardInStudentContact.bind(),
            updateWardInParentLogin.bind(),
            UpdateWardInEsParentLogin.bind(),
            UpdateWardInStudentESObj.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                loggerDetails.debugLog(req, 'Add Ward to existing Parent', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5020));
            } else {
                var result = req.body;
                result.message =  message.nsa5022;
                events.emit('JsonResponse', req, res, result);
            }
        }
    );
};

function updateWardInStudent(req, data, callback) {
    nsaCassandra.UserMgmt.updateWardInStudent(req, data, function(err, result) {
        callback(err, req, data);
    })
};
exports.updateWardInStudent = updateWardInStudent;

function updateWardInStudentContact(req, data, callback) {
    nsaCassandra.UserContact.updateWardInStudentContact(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.updateWardInStudent = updateWardInStudent;

function updateWardInParentLogin(req, data, callback) {
    nsaCassandra.Member.updateWardInParentLogin(req, data, function(err, result) {
        callback(err, req, result);
    })
}
exports.updateWardInParentLogin = updateWardInParentLogin;

function UpdateWardInEsParentLogin(req, data, callback) {
    nsaCassandra.Member.UpdateWardInEsParentLogin(req, data, function(err, result) {
        callback(err, req, data);
    })
}
exports.UpdateWardInEsParentLogin = UpdateWardInEsParentLogin;

function UpdateWardInStudentESObj(req, data, callback) {
    nsaCassandra.Member.UpdateWardInStudentESObj(req, data, function(err, result) {
        callback(err, req, data);
    })
}
exports.UpdateWardInStudentESObj = UpdateWardInStudentESObj;

exports.findNumberInParentLogins = function(req, res) {
    userService.getNewPhoneNumberInMemberXref(req, function(err, result){
        if (err) {
            loggerDetails.debugLog(req, 'Update Parent Phone number', err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5020));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.insertLogins = function(req, res){
    setTimeout(function (args) { events.emit('JsonResponse', req, res, 'success'); }, 1000);
    var data ={};
    async.waterfall([
        getAllMembers.bind(null, req, data),
        insertMembersObjs.bind()
    ], function(err, response){
        if(err) {
            console.info('err', err)
        } else {
            console.info('done', response.length);
        }
    })
};

function getAllMembers(req, data, callback){
    nsaCassandra.Member.getAllMembers(req, function(err, result){
        data.Members = result;
        callback(err, req, data)
    })
}

function insertMembersObjs(req, data, callback){
    nsaCassandra.Member.insertLogin(req, data, function(err, result){
       callback(err, result)
    })
};

exports.getUsersByUsernames  = function(req, res){
   try {
       var users = _.map(req.body.childs, function(value){return value.user_name;});
       var searchParams = nsabb.getUsersByAcademic(req, users);
       nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, response, status) {
           if (err) {
               loggerDetails.debugLog(req, 'Unable get username in ElasticSearch', err);
               events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa5004));
           } else {
               events.emit('JsonResponse', req, res, response);
           }
       });
   }catch (err){
       loggerDetails.debugLog(req, 'Unable get username in ElasticSearch', err);
   }
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.SCHOOL, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;
