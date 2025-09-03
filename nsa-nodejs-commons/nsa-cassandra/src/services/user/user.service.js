/**
 * Created by karthik on 05-01-2017.
 */

var express = require('express')
    , baseService = require('../common/base.service')
    , models = require('../../models')
    , userConverter = require('../../converters/user.converter')
    , async = require('async')
    , _ = require('lodash')
    , message = require('@nsa/nsa-commons').messages
    , passwordHash = require('password-hash')
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , constant = require('@nsa/nsa-commons').constants
    , nsaElasticSearch = require('@nsa/nsa-elasticsearch')
    , nsabb = require('@nsa/nsa-bodybuilder').builderutil
    , memberService = require('./../school/members.service')
    , constants = require('../../common/constants/constants');

var User = function f(options) {
    var self = this;
};

User.getUserDetail = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var user_name = req.params.id;
    models.instance.User.find({ user_name: user_name, tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)},{allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

User.findUsername = function(req, data, callback){
    var findQuery = baseService.getFindQuery(req);
    findQuery.user_name = data.user_name;
    models.instance.User.findOne(findQuery ,{allow_filtering: true}, function(err, result){
        callback(err, result);
    })

}

User.saveUser = function(req, callback) {
    var user = baseService.getUserFromRequestBody(req);
    user.save(function (err, result) {
        callback(err, message.nsa603);
    });
};

User.updateUserLoginDetails = function(req, data, callback) {
    try {
        var arr = [];
        var body = req.body;
        var regisId = body.registrationId || '';
        var endpointARN = body.endpointARN;
        var map = {};
        map[regisId] = endpointARN;
        /*var deviceToken = data.device_token;
        _.mapKeys(deviceToken, function(value1, key1) {
            map[key1] = deviceToken[key1]
        });*/
        var queryObject = {user_name: body.username};
        var updateValue = {device_token: map};
        var userObj = models.instance.User.update(queryObject, updateValue, {return_query: true});
        arr.push(userObj);
        data['batchObj'] = arr;
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }

};

User.updateSiblingsLoginDetails = function(req, data, callback) {
    try {

        var arr = [];
        var body = req.body;
        var regisId = body.registrationId || '';
        var endpointARN = body.endpointARN;
        var map = {};
        map[regisId] = endpointARN;

        var createObj = function(object, callback) {
            var tockenMap = map
            /*var deviceToken = object.device_token;
            _.mapKeys(deviceToken, function(value1, key1) {
                tockenMap[key1] = deviceToken[key1]
            });*/
            var queryObject = {user_name: object.user_name};
            var updateValue = {device_token: tockenMap};
            var userObj = models.instance.User.update(queryObject, updateValue, {return_query: true});

            callback(null, userObj);
        };
        async.times(data.length, function(i, next) {
            var obj = data[i];
            createObj(obj, function(err, data) {
                next(err, data);
            });
        }, function(err, albumObjs) {
            data.batchObj = albumObjs
            callback(err, data)
        });
    } catch (err) {
        callback(err, null);
    }

};

User.getUserById = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var userfindQuery = {
        user_name : headers.user_id
    };
    models.instance.User.findOne(userfindQuery, function(err, result){
        if (result) {
            callback(null, result)
        } else {
            callback(err, null)
        }
    });
};

User.getUser = function(req, callback) {
    var userfindQuery = {
        user_name : req.body.username
    };
    models.instance.User.findOne(userfindQuery, function(err, result){
        if (result) {
            callback(null, result)
        } else {
            callback(err, null)
        }
    });
};

User.getUsersByUserIds = function(req, callback) {
    var userfindQuery = {
        user_name : {'$in': req.body.username}
    };
    models.instance.User.find(userfindQuery, function(err, result){
        if (result) {
            callback(null, result)
        } else {
            callback(err, null)
        }
    });
};

/*User.getUserDetails = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findUserContactQuery = { user_name : headers.user_id };
    models.instance.UserDetails.find(findUserContactQuery, function(err, result){
        if (result) {
            callback(null, result)
        } else {
            callback(null, {success: false, data: responseBuilder.buildResponse(constant.USER_NAME, constant.APP_TYPE, message.nsa601, err, '400')})
        }
    });
}*/

User.getUserContactInfo = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findUserContactQuery = { user_name : headers.user_id };
    models.instance.UserContactInfo.find(findUserContactQuery, function(err, result){
        if (result) {
            callback(null, result)
        } else {
            callback(null, {success: false, data: responseBuilder.buildResponse(constant.USER_NAME, constant.APP_TYPE, message.nsa601, err, '400')})
        }
    })
}

User.getUserContactDetails = function(req, callback) {
    async.parallel({
        user: User.getUserById.bind(null, req),
        userContactInfo: User.getUserContactInfo.bind(null, req)
    }, function(err, result) {
        callback(err, userConverter.convertUserDetails(req, result));
    });
};

User.updateUser = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var body = req.body;
    var currentDate = new Date();

    var userQueryObject = { user_name : headers.user_id };
    var userUpdateValues = { primary_phone: body.primaryPhone, email: body.emailAddress, updated_date: currentDate,
        first_name : body.firstName, last_name : body.lastName, date_of_birth : baseService.getFormattedDate(body.dob)};

    var user = models.instance.User.update(userQueryObject, userUpdateValues, {return_query: true});
    callback(null, user);

};

User.getUsersByRole = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };

    if(req.params.id != undefined) {
        findQuery.roles = {'$contains_key' :models.uuidFromString(req.params.id)}
    } else {
        findQuery.roles = {'$contains_key' :models.uuidFromString(req.body.id)}
        findQuery.user_type = constant.EMPLOYEE
    }

    models.instance.User.find(findQuery, {allow_filtering: true}, function(err, result){
        if (result) {
            callback(null, userConverter.convertUsers(req, result))
        } else {
            callback(err, null)
        }
    });
};

User.updateUsersRole = function(req, data, callback) {
    var array = [];
    var body = req.body;
   try {
       var currentDate = new Date();
       if(!_.isEmpty(data.upObj)) {
           _.forEach(data.upObj, function(val) {
               var roleValues = body.roles;
               var userQueryObject = { user_name : val.userName };
               var roles = baseService.getMapFromFormattedMap(roleValues);
               var userUpdateValues = { roles: {'$add': roles}, updated_date: currentDate};
               var user = models.instance.User.update(userQueryObject, userUpdateValues, {return_query: true});
               array.push(user);
           });
       }
       data.batchObj = array;
       callback(null, data);

   } catch (err) {
       logger.debug(err);
       callback(err, null);
   }
};

User.delUsersRole = function(req, data, callback) {
    var array = data.batchObj || [];

    try {
        var currentDate = new Date();
        if(!_.isEmpty(data.delObj)) {
            var roleValues = req.body.roles;
            _.forEach(data.delObj, function(val) {
                var userQueryObject = { user_name : val.userName };
                var roles = baseService.getMapFromFormattedMap(roleValues);
                var userUpdateValues = { roles: {'$remove': roles}, updated_date: currentDate};
                var user = models.instance.User.update(userQueryObject, userUpdateValues, {return_query: true});
                array.push(user);
            });
        }

        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

User.updateUserRole = function(req, callback) {
    var array = [];
    var data = {};
    var body = req.body;
    var userName = req.params.id;
    var roleValues = body.roles;
    try {
        var currentDate = new Date();
        var userQueryObject = { user_name : userName };
        var roles = baseService.getMapFromFormattedMap(roleValues);
        var userUpdateValues = { roles: roles, updated_date: currentDate};
        var user = models.instance.User.update(userQueryObject, userUpdateValues, {return_query: true});
        array.push(user);
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

/*User.updateUserDetails = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var body = req.body;
    var currentDate = new Date();

    var queryObject = { user_name : headers.user_id };
    var userDetailUpdateValues = {first_name : body.firstName, last_name : body.lastName, date_of_birth : baseService.getFormattedDate(body.dob)};
    var userDetails = models.instance.UserDetails.update(queryObject, userDetailUpdateValues, {return_query: true});

    callback(null, userDetails);

}*/

User.updateUserContactInfo = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var body = req.body;
    var currentDate = new Date();

    var queryObject = { user_name : headers.user_id };
    var userInfoUpdateValues = {
        street_address1 : body.addressLine1, street_address2: body.addressLine2, city : body.city,
        state : body.state, country: body.country, pincode: body.pincode};
    var userContactInfo = models.instance.UserContactInfo.update(queryObject, userInfoUpdateValues, {return_query: true});

    callback(null, userContactInfo);
}

User.updateUserContactDetails = function(req, callback) {
    async.parallel([
        User.updateUser.bind(null, req),
        User.updateUserContactInfo.bind(null, req)
    ], function(err, result) {
        if (err) {
            callback(err, result)
        } else {
            User.updateUserInformations(result, function(err, res){
                callback(err, res)
            })
        }
    });
};

User.getAllUsers =function(req, callback){
    var headers = baseService.getHeaders(req);
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id) };
    models.instance.User.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

User.getSchoolStudents =function(req, callback){
    var headers = baseService.getHeaders(req);
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        user_type: 'Student' };
    models.instance.User.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

User.getAllUsersInUser = function(req, userType, callback){
    /* models.instance.User.find({user_type: 'Student'}, {allow_filtering: true}, function(err, result){
     callback(err, result);
     });*/
    var array = [];
    models.instance.User.eachRow({user_type: userType}, {allow_filtering: true}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            callback(err, array);
        }
    });
};

User.getUserClassification =function(req, callback){
    var headers = baseService.getHeaders(req);
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year };
    models.instance.UserClassification.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

User.getUsersContactInfo =function(req, data, callback){
    var headers = baseService.getHeaders(req);
    var findQuery = { "user_name": { '$in':  data.userIds} };
    models.instance.UserContactInfo.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

User.getAllEmployees =function(req, callback){
    var headers = baseService.getHeaders(req);
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
        //academic_year: headers.academic_year
    };
    models.instance.EmployeeClassification.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

User.updateUserInformations = function(queries, callback) {
    models.doBatch(queries, function(err, result) {
        if(err) {
            callback(null, err)
        } else {
            callback(null, result)
        }
    })
};

User.updateUserAttachments = function(req, callback) {
    try {
        var body = req.body;
        var attachmentsObj = baseService.getMapFromFormattedMap(body.attachments);
        var profileObj = _.isEmpty(body.profile) ? null : body.profile[0].id;
        var queryObject = { user_name : req.params.id };
        var updateValues = {};
        if (attachmentsObj != null && attachmentsObj != undefined) {
            updateValues.attachments = {'$add' : attachmentsObj}
        }
        if(profileObj != null && profileObj != undefined) {
            updateValues.profile_picture =  profileObj
        }
        var user = models.instance.User.update(queryObject, updateValues);
        callback(null, user);
    } catch (err) {
        callback(err, null);
    }
};


User.deleteUserAttachment = function(req, callback) {
    try {
        var body = req.body;

        var existingFiles = baseService.getExistingFiles(body);
        var queryObject = { user_name : req.params.id };
        req.body.attachments = existingFiles;
         models.instance.User.update(queryObject, {attachments: baseService.getMapFromFormattedMap(existingFiles)}, function(err, result){
             callback(null, result);
         });
    } catch (err) {
        callback(err, null);
    }
};

function getArrayFromArray(input, array) {
    // it will unwrap as [{ "id" : "1" , "name" : "name1"}, {"id" : "2", "name" : "name2"}] to {"1" : "name1" , "2" : "name2"}
    var output = [];
    if (input != null && input != undefined) {
        var map = {};
        input.forEach(function (item){
            map['id'] = item['role_id'];
            map['name'] = item['role_name'];
            output.push(map);
        });
        return _.concat(output, array);
    }
    return _.concat(output, array);
};

User.getAllMembersUserNames = function(req, callback){
    var array = [];
    var headers = baseService.getHeaders(req);
    models.instance.SchoolMembers.eachRow({tenant_id: models.timeuuidFromString(headers.tenant_id)}, {allow_filtering: true}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            callback(err, array);
        }
    });
};

User.studentInSchoolMemberXref = function(findQuery, callback){
    models.instance.SchoolMembersXref.find(findQuery, {allow_filtering: true}, function(err, result){
        if(err){
            callback(err, null);
        }else {
            callback(null, result);
        }
    })
};

User.updateContactInParentLogin = function(req, data, callback){
    try {
        var body = req.body, array = data.batchObj, logins = body.ParentLoginObjs;
        var headers = baseService.getHeaders(req);
        var checkNumbers = (_.isEmpty(logins.newPhoneNumber) && _.isEmpty(logins.oldPhoneNumber));
        if(!_.isEmpty(logins) && !checkNumbers){
            if(logins.oldPhoneNumber.length <= 1 && body.old_primary_phone != body.primary_phone){
                getAllQuerys(req, data, function(err, result){
                    callback(null, result)
                })
            } else if(logins.oldPhoneNumber.length > 1){
                var findQuery = baseService.getFindQuery(req);
                findQuery.user_name = req.params.id;
                findQuery.member_user_name = body.old_primary_phone;
                models.instance.SchoolMembersXref.findOne(findQuery, {allow_filtering: true}, function(err, result){
                    var results = JSON.parse(JSON.stringify(result));
                    findQuery.member_id = models.uuidFromString(results.member_id);
                    findQuery.user_id = models.uuidFromString(results.user_id);
                    findMembers(req, function(err, memberResult) {
                        if(!memberResult){
                                var schoolDetails = data.schoolInfo;
                                var password = schoolDetails.password ? schoolDetails.password : '1234';
                                 data.newId = models.uuid();
                                var insertMemberQuery = new models.instance.SchoolMembers({
                                    id: data.newId,
                                    user_name: body.primary_phone,
                                    first_name: body.first_name,
                                    tenant_id: models.timeuuidFromString(headers.tenant_id),
                                    password: passwordHash.generate(password),
                                    user_type: "Parent",
                                    created_date: new Date(),
                                    updated_date: new Date(),
                                });
                                var parentLoigns = new models.instance.SchoolParentLogins({
                                id: data.newId,
                                user_name: body.primary_phone,
                                tenant_id: models.timeuuidFromString(headers.tenant_id),
                                });
                                array.push(parentLoigns.save({return_query: true}));
                                insertMemberQuery = insertMemberQuery.save({return_query: true});
                                array.push(insertMemberQuery);
                        }
                        var deleteQuery = (new models.instance.SchoolMembersXref(findQuery)).delete({return_query: true});
                        array.push(deleteQuery);
                        var insertobjXref = new models.instance.SchoolMembersXref({
                            id: models.uuid(),
                            member_id: memberResult ? memberResult.id : data.newId,
                            tenant_id: models.timeuuidFromString(headers.tenant_id),
                            school_id: models.uuidFromString(headers.school_id),
                            school_name: headers.school_name,
                            user_name: body.user_name,
                            father_name: body.father_name || body.mother_name || null,
                            user_id: models.uuidFromString(body.id),
                            member_user_name: body.primary_phone,
                            first_name: body.first_name,
                            updated_date: new Date(),
                            updated_by: headers.user_id,
                            updated_first_name: headers.user_name
                        });
                        array.push(insertobjXref.save({return_query: true}));
                        insertParentLoginInEs(req, data, memberResult, results, function (err, result) {
                            if (err) {
                                callback(err, null)
                            } else {
                                data.batchObj = array;
                                callback(null, data);
                            }

                        })
                    })
                })
            }
        } else {
            updateStudentFieldsInSchoolmembers(req, data, function(err, result){
                callback(null, result)
            })
       }

    }catch (err){
        callback(err, null);
    }
};

function updateStudentFieldsInSchoolmembers(req, data, callback){
   try{
       var body = req.body, array = data.batchObj, headers = baseService.getHeaders(req);
       var findQuery = baseService.getFindQuery(req);
           findQuery.user_name = req.params.id;
           findQuery.member_user_name = body.primary_phone;
       models.instance.SchoolMembersXref.findOne(findQuery, {allow_filtering: true}, function(err, result){
           if(result){
               result.first_name = body.first_name;
               result.father_name = body.father_name || body.mother_name || null;
               var XrefUpdateQuery = new models.instance.SchoolMembersXref(result);
               array.push(XrefUpdateQuery.save({return_query: true}));
               var searchParams = nsabb.getParentById(result.member_id);
               nsaElasticSearch.search.getUserById(searchParams, function (err, response, status) {
                   if(err){
                       callback(err, null)
                   }else {
                       response = response._source;
                       data.esParentLogin = response;
                       updateStudentDetailsInEsParentInfo(req, data, function(err, esResult){
                           if(err){
                               callback(err, null)
                           }else {
                               data.batchObj = array;
                               callback(null, data)
                           }
                       })
                   }
               });
           } else {
               noParentloginsStudents(req, data, function(err, result){
                  callback(err, result);
               })
           }
       })
   }catch (err){
       callback(err, null)
   }
}


function noParentloginsStudents(req, data, callback){
    try {
        var body = req.body, array = data.batchObj, headers = baseService.getHeaders(req), schoolDetails = data.schoolInfo;
        var query = {tenant_id: models.timeuuidFromString(headers.tenant_id), user_name: body.primary_phone}
        models.instance.SchoolMembers.findOne(query, {allow_filtering: true}, function(err, memberResult) {
            if(!memberResult){
                var password = schoolDetails.password ? schoolDetails.password : '1234';
                data.newId = models.uuid();
                var insertMemberQuery = new models.instance.SchoolMembers({
                    id: data.newId,
                    user_name: body.primary_phone,
                    first_name: body.first_name,
                    tenant_id: models.timeuuidFromString(headers.tenant_id),
                    password: passwordHash.generate(password),
                    user_type: "Parent",
                    created_date: new Date(),
                    updated_date: new Date(),
                });
                var parentLoigns = new models.instance.SchoolParentLogins({
                    id: data.newId,
                    user_name: body.primary_phone,
                    tenant_id: models.timeuuidFromString(headers.tenant_id),
                });
                array.push(parentLoigns.save({return_query: true}));
                insertMemberQuery = insertMemberQuery.save({return_query: true});
                array.push(insertMemberQuery);
            }
            var insertobjXref = new models.instance.SchoolMembersXref({
                id: models.uuid(),
                member_id: memberResult ? memberResult.id : data.newId,
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id: models.uuidFromString(headers.school_id),
                school_name: headers.school_name,
                user_name: body.user_name,
                father_name: body.father_name || body.mother_name || null,
                user_id: models.uuidFromString(body.id),
                member_user_name: body.primary_phone,
                first_name: body.first_name,
                updated_date: new Date(),
                updated_by: headers.user_id,
                updated_first_name: headers.user_name
            });
            array.push(insertobjXref.save({return_query: true}));
            data.newId = memberResult ? memberResult.id : data.newId;
            insertParentLoginStudentsInEs(req, data, function (err, result1) {
                if (err) {
                    callback(err, null)
                } else {
                    data.batchObj = array;
                    callback(null, data);
                }
            })
        })
    }catch (err){
        callback(err, [])
    }
};

function insertParentLoginStudentsInEs(req, data, callback){
    try {
        var body = req.body, headers = baseService.getHeaders(req),
            searchParams = nsabb.getParentById(data.newId);
        nsaElasticSearch.search.getUserById(searchParams, function (err, esData, status) {
                esData = (status === 404) ? null : esData.found ? esData._source : null;
                if (esData) {
                    var newChild = getChildObj(req, body, body);
                    esData.childs.push(newChild);
                    var updateParams = nsabb.updateParentParams(esData);
                    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
                        if (err) {
                            callback(err, null)
                        } else {
                            callback(null, data);
                        }
                    })
                } else {
                    var doc = baseService.getFindQuery(req);
                    doc['id'] = data.newId.toString();
                    doc['father_name'] = body.father_name || body.mother_name || null;
                    doc['user_name'] = body.primary_phone;
                    doc['tenant_id'] = headers.tenant_id;
                    doc['childs'] = [getChildObj(req, body, body)];
                    doc['updated_date'] = new Date();
                    doc['updated_by'] = headers.user_id;
                    doc['created_by'] = headers.user_id;
                    doc['created_date'] = new Date();
                    var updateParams = nsabb.updateParentParams(doc);
                    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
                        if (err) {
                            callback(err, null)
                        } else {
                            callback(null, data);
                        }
                    })
                }
        })

    }catch (err){
        callback(err, null)
    }
}

function updateStudentDetailsInEsParentInfo(req, data, callback) {
    try {
        var esObj = data.esParentLogin, body = req.body;
        var childs = _.forEach(esObj.childs, function (value) {
            if (value.user_name == req.params.id) {
                value.section_id = body.section_id;
                value.section_name = body.section_name;
                value.first_name = body.first_name;
                value.admission_no = body.user_code;
                value.first_name = body.first_name;
            }
            return value;
        })
        var updateParams = {
            index: global.config.elasticSearch.index.userIndex,
            type: global.config.elasticSearch.index.parentType,
            id: esObj.id.toString(),
            body: {doc: {father_name: body.father_name || body.mother_name, childs: childs}}
        };
        nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, result);
            }
        })
    } catch (err) {

    }
}

function getAllQuerys(req, data,  cb){
    try {
        var array = data.batchObj, body = req.body, headers= baseService.getHeaders(req);
        var findQuery = baseService.getFindQuery(req);
        findQuery.user_name = req.params.id;
        findQuery.member_user_name = body.old_primary_phone;
        models.instance.SchoolMembersXref.findOne(findQuery, {allow_filtering: true}, function(err, result){
            var results = JSON.parse(JSON.stringify(result));
            findMembers(req, function(err, memberResult) {
                if (memberResult) {
                    var deleteParentLoings = models.instance.SchoolParentLogins.delete({tenant_id: models.timeuuidFromString(headers.tenant_id), user_name: body.old_primary_phone},{return_query: true})
                    var deleteMemberQuery = models.instance.SchoolMembers.delete({id: models.uuidFromString(results.member_id)}, {return_query: true});
                    array.push(deleteParentLoings);
                    array.push(deleteMemberQuery);
                } else {

                    var deleteParentLoings = models.instance.SchoolParentLogins.delete({tenant_id: models.timeuuidFromString(headers.tenant_id), user_name: body.old_primary_phone}, {return_query: true});
                    array.push(deleteParentLoings);
                    var parentLoigns = new models.instance.SchoolParentLogins({
                        id: models.uuidFromString(results.member_id),
                        user_name: body.primary_phone,
                        tenant_id: models.timeuuidFromString(headers.tenant_id),
                    });
                    array.push(parentLoigns.save({return_query: true}));
                    var updateQuery = models.instance.SchoolMembers.update({id: models.uuidFromString(results.member_id)},{
                        user_name: body.primary_phone,
                        first_name: results.first_name
                    }, {return_query: true});
                    array.push(updateQuery);
                }
                result.member_user_name = body.primary_phone;
                result.id = models.uuid();
                findQuery.member_id = models.uuidFromString(results.member_id);
                findQuery.user_id = models.uuidFromString(results.user_id);
                result.member_id = memberResult ? memberResult.id : models.uuidFromString(results.member_id)
                result.father_name = body.father_name || body.mother_name || null;
                result.first_name = body.first_name;
                result.created_by = headers.user_id;
                result.created_date = new Date();
                result.updated_first_name = headers.user_name;
                result.updated_by = headers.user_id;
                result.updated_date = new Date();
                var deleteQuery = (new models.instance.SchoolMembersXref(findQuery)).delete({return_query: true});
                array.push(deleteQuery);
                var insertQuery = (new models.instance.SchoolMembersXref(result)).save({return_query: true});
                updateParentLoginInEs(req, memberResult, results, function (err, esResponse) {
                    if (err) {
                        cb(err, null)
                    } else {
                        array.push(insertQuery);
                        data.batchObj = array;
                        cb(null, data);
                    }
                });
            })
          })
    }catch (err){
        cb(err, null)
    }
};

function findMembers(req, callback){
    var data = {};
    memberService.findNumberInSchoolMember(req, data, function(err, result){
        if(err){
            callback(err, null)
        }else {
            callback(null, result.parentLogin)
        }
    })
}

function insertParentLoginInEs(req, data, memberResult, result, callback){
    var body = req.body, headers = baseService.getHeaders(req),
        searchParams = nsabb.getParentById(result.member_id), bulkObj =[];
    nsaElasticSearch.search.getUserById(searchParams, function (err, esData, status) {
        if (err) {
            callback(err, null)
        } else {
            esData = esData._source;
            esData.childs = _.filter(esData.childs, function(val){ return val.user_name !== req.params.id});
            bulkObj.push(nsabb.updateParentDoc(esData));
            bulkObj.push(esData);
            if(memberResult){
                var getParams = nsabb.getParentById(memberResult.id);
                nsaElasticSearch.search.getUserById(getParams, function (err, tenantData, status) {
                    tenantData = tenantData._source;
                    var newChild = getChildObj(req, body, body);
                    tenantData.childs.push(newChild);
                    bulkObj.push(nsabb.updateParentDoc(tenantData));
                    bulkObj.push(tenantData);
                    nsaElasticSearch.index.bulkDoc({body: bulkObj}, function (err, result) {
                        callback(err, result);
                    });
                })
            }else {
                var doc = baseService.getFindQuery(req);
                doc['id'] =  data.newId.toString();
                doc['father_name'] = body.father_name || body.mother_name || null;
                doc['user_name'] = body.primary_phone;
                doc['tenant_id'] = headers.tenant_id;
                doc['childs'] =  [getChildObj(req, body, body)];
                doc['updated_date'] = new Date();
                doc['updated_by'] = headers.user_id;
                doc['created_by'] = headers.user_id;
                doc['created_date'] = new Date();
                bulkObj.push(nsabb.updateParentDoc(doc));
                bulkObj.push(doc);
                nsaElasticSearch.index.bulkDoc({body: bulkObj}, function (err, result) {
                    callback(err, result);
                });
            }
        }
    })
}


function updateParentLoginInEs(req, tenantResult, result, callback){
    try {
        var body = req.body;
        if(tenantResult){
            var searchParams = nsabb.getParentById(tenantResult.id), bulkObj = [];
            nsaElasticSearch.search.getUserById(searchParams, function (err, response, status) {
                response = response._source;
                var child = getChildObj(req, result, body);
                response.childs.push(child);
                bulkObj.push(nsabb.updateParentDoc(response));
                bulkObj.push(response);
                bulkObj.push(memberService.getdeleteBulkDoc(result.member_id));
                nsaElasticSearch.index.bulkDoc({body: bulkObj}, function (err, result) {
                    callback(err, result);
                });
            });
        }else {
            var child = getChildObj(req, result, body);
            var updateParams = {
                index: global.config.elasticSearch.index.userIndex, type: global.config.elasticSearch.index.parentType, id: result.member_id.toString(),
                body: {
                    doc: {user_name: body.primary_phone, childs : [child]}
                }
            };
            nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
                callback(err, result);
            })
        }
    }catch (err){
        callback(err, null)
    }
}

function getChildObj(req, value, body){
    var child ={}, headers = baseService.getHeaders(req);
    child.member_user_name = body.primary_phone;
    child.user_name = value.user_name;
    child.first_name = body.first_name;
    child.admission_no = body.user_code;
    child.user_id = body.id;
    child.class_id = body.class_id;
    child.section_id = body.section_id;
    child.class_name = body.class_name;
    child.section_name = body.section_name;
    child.tenant_id = headers.tenant_id;
    child.school_id = headers.school_id;
    child.school_name = headers.school_name;
    child.active = true;

    return child;
}

module.exports = User;