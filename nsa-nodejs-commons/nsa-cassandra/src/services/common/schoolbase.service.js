/**
 * Created by senthil on 22/09/17.
 */

var models = require('../../models/index'),
    baseService = require('./base.service'),
    passwordHash = require('password-hash'),
    async = require('async'),
     _ = require('lodash'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger');

var SchoolBase = function f(options) {
    var self = this;
};

SchoolBase.constructSchoolmembersObj = function(req, data, callback) {
    var schoolMembers = [];
    var userObjs = {};
    var schoolDetails = data.schoolDetails;
    _.forEach(data, function(value, key) {
        if(!_.isEmpty(value.primary_phone)) {
            if(!isNaN(value.primary_phone))
                userObjs[value.primary_phone] = value.id
        }
    });
    try {
        var createObj = function(object, callback) {
            if (object.primary_phone in userObjs) {
               var userSchoolDetails =  _.find(schoolDetails, {'school_id': object.school_id});
                var password =  userSchoolDetails ? userSchoolDetails.password : '1234';
                var obj = new models.instance.SchoolMembers  ({
                    id: userObjs[object.primary_phone],
                    user_name: object.primary_phone,
                    first_name: object.first_name,
                    password:   passwordHash.generate(password),
                    user_type: "Parent",
                    created_date: new Date(),
                    updated_date: new Date(),
                });
                obj = obj.save({return_query: true});
                schoolMembers.push(obj)
                var objXref = new models.instance.SchoolMembersXref  ({
                    id: models.uuid(),
                    member_id: userObjs[object.primary_phone],
                    tenant_id: object.tenant_id,
                    school_id: object.school_id,
                    school_name: object.school_name,
                    user_name: object.user_name,
                    user_id: object.id,
                    member_user_name: object.primary_phone,
                    first_name: object.first_name,
                    father_name: object.contactInfo ? object.contactInfo.father_name : null,
                    updated_date: new Date(),
                    updated_by: "Admin",
                    created_date: new Date(),
                    created_by: "Admin"
                });
                objXref = objXref.save({return_query: true});
                schoolMembers.push(objXref)
            }
            callback(null, obj);
        };

        async.times(data.length, function(i, next) {
            var obj = data[i];
            createObj(obj, function(err, data) {
                next(err, data);
            });
        }, function(err, albumObjs) {
            data.batchObj = schoolMembers
            callback(err, data)
        });


    } catch (err) {
        logger.debug(err);
        callback(err, null)
    }
};

SchoolBase.constructOnboardSchoolmembersObj = function(req, data, callback) {
    var schoolMembers = [];
    var userObjs = {};
    var users = data.users;
    var schoolDetails = data.schoolDetails;

    var headers = baseService.getHeaders(req);
    _.forEach(users, function(value, key) {
        if(!_.isEmpty(value.primary_phone)) {
            if(!isNaN(value.primary_phone))
                userObjs[value.primary_phone] = value.id
        }
    });
    try {
        var createObj = function(object, callback) {
            if (object.primary_phone in userObjs) {
                findExistingLogins(req, object, function(err, existingLogin){
                    if(!existingLogin) {
                        var password =  schoolDetails ? schoolDetails.password : '1234';
                        var obj = new models.instance.SchoolMembers  ({
                            id: userObjs[object.primary_phone],
                            user_name: object.primary_phone,
                            first_name: object.first_name,
                            tenant_id: models.timeuuidFromString(headers.tenant_id),
                            password: passwordHash.generate(password),
                            user_type: "Parent",
                            created_date: new Date(),
                            updated_date: new Date(),
                        });
                        var insertObj = new models.instance.SchoolParentLogins({
                            tenant_id: models.timeuuidFromString(headers.tenant_id),
                            user_name: object.primary_phone,
                            id: userObjs[object.primary_phone]
                        });
                        insertObj = insertObj.save({return_query: true});
                        schoolMembers.push(insertObj);
                        obj = obj.save({return_query: true});
                        schoolMembers.push(obj)
                    }
                    var objXref = new models.instance.SchoolMembersXref ({
                        id: models.uuid(),
                        member_id: existingLogin ? existingLogin.id : userObjs[object.primary_phone],
                        tenant_id: object.tenant_id,
                        school_id: object.school_id,
                        school_name: object.school_name,
                        user_name: object.user_name,
                        user_id: object.id,
                        member_user_name: object.primary_phone,
                        first_name: object.first_name,
                        father_name: object.contactInfo ? object.contactInfo.father_name : null,
                        updated_date: new Date(),
                        updated_by: "Admin",
                        created_date: new Date(),
                        created_by: "Admin"
                    });
                    objXref = objXref.save({return_query: true});
                    schoolMembers.push(objXref);
                    callback(null, objXref);
                })
            }else {
                callback(null, null);
            }
        };

        async.times(users.length, function(i, next) {
            var obj = users[i];
            console.info('i',i);
            getStudentContactInfo(obj, function(err, contactInfo){
                    obj.contactInfo = contactInfo;
                    createObj(obj, function(err, data) {
                        next(err, data);
                    });
            })

        }, function(err, Objs) {
            data.batchObj = schoolMembers;
            callback(err, data)
        });


    } catch (err) {
        logger.debug(err);
        callback(err, null)
    }
};

function findExistingLogins(req, data, callback){
    var headers = baseService.getHeaders(req);
    models.instance.SchoolParentLogins.findOne({user_name: data.primary_phone,
        tenant_id: models.timeuuidFromString(headers.tenant_id)}, function (err, result) {
        if(err){
            callback(err, null)
        }else {
            callback(null, result);
        }
    })
}

function findNumberInMembers(req, data, callback){
    var headers = baseService.getHeaders(req);
    models.instance.SchoolMembers.findOne({user_name: data.primary_phone,
        tenant_id: models.timeuuidFromString(headers.tenant_id)}, {allow_filtering: true}, function (err, result) {
        if(err){
            callback(err, null)
        }else {
            callback(null, result);
        }
    })
}

function getStudentContactInfo(obj, callback){
    try{
        models.instance.UserContactInfo.findOne({user_name: obj.user_name}, {allow_filtering: true}, function(err, result){
            if(err){
                callback(err, null)
            }else {
                callback(null, result);
            }
        })

    }catch (err){
        callback(err, null)
    }
}


module.exports = SchoolBase;