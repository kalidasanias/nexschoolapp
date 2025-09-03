/**
 * Created by senthil on 2/24/2017.
 */
var userDomain = require('../domain/User')
    , constant = require('@nsa/nsa-commons').constants
    , baseService = require('../../../nsa-cassandra/src/services/common/base.service')
    , serviceUtils = require('@nsa/nsa-commons').serviceUtils
    , _ = require('lodash')
    , dateService = require('../../../../@nsa/nsa-cassandra/src/utils/date.service');

exports.convertUsers = function(data) {
    var users = [];
    try {
        var myarr = data.hits.hits;
        if(myarr.length > 0) {
            myarr.forEach(function (user) {
                var newUser = Object.assign({}, userDomain);
                newUser = userObj(user, newUser);
                users.push(newUser);
            });
        }
    }
    catch (err) {
        return err;
    }
    return users;
};

exports.convertUserData = function(data) {
    var users = [];
    try {
        var myarr = data.docs;
        if(myarr.length > 0) {
            myarr.forEach(function (user) {
                users.push(user._source);
            });
        }
    }
    catch (err) {
        return err;
    }
    return users;
};

exports.convertUsersObj = function(data) {
    var users = [];
    try {
        var myarr = data.hits.hits;
        if(myarr.length > 0) {
            myarr.forEach(function (user) {
                user._source._id = user._id;
                users.push(user._source);
            });
        }
    }
    catch (err) {
        return err;
    }
    return users;
};

function userObj(user, newUser) {
    newUser._id = user['_id'];
    user = user._source;
    var roleNames = serviceUtils.getNamesFromArray(user['roles'], 'role_name')
    newUser.id = user['id'];
    newUser.userName = user['user_name'];
    newUser.user_name = user['user_name'];
    newUser.roleNames = roleNames;
    newUser.roles = user['roles'];
    newUser.academicYear = user['academic_year'];
    newUser.tenantId = user['tenant_id'];
    newUser.schoolId = user['school_id'];
    newUser.schoolName = user['school_name'];
    newUser.userType = user['user_type'];
    newUser.userCode = user['user_code'];
    newUser.shortName = user['short_name'];
    newUser.dateOfJoining = user['date_of_joining'];
    newUser.deviceToken = user['device_token'];
    newUser.firstName = user['first_name'];
    newUser.primaryPhone = user['primary_phone'];
    newUser.emailAddress = user['email'];
    newUser.classes = user['classes'];
    newUser.languages = user['languages'];
    newUser.subjects = user['subjects'];
    newUser.dept = user['dept'];
    newUser.desg = user['desg'];
    newUser.active = user['active'];
    newUser.isHostel=user['is_hostel'];
    newUser.profile_picture=user['profile_picture'];
    newUser.parentInfo = ( user['parent_info'] != undefined && !_.isEmpty(user['parent_info']) ) ? (user['parent_info']) : {};


    return newUser;
};
exports.userObj = userObj;


exports.convertPermissionUsers = function(req, permissions, data) {
    var users = [];
    try {
        var myarr = data.hits.hits;
        if(myarr.length > 0) {
            myarr.forEach(function (user) {
                var newUser = Object.assign({}, userDomain);
                newUser = userObj(user, newUser);
                newUser.editPermissions = serviceUtils.havePermissionsToEdit(req, permissions, user['user_name']);
                users.push(newUser);
            });
        }
    }
    catch (err) {
        return err;
    }
    var returnData = {};
    returnData.draw = req.query.draw;
    returnData.recordsTotal = data.hits.total;
    returnData.recordsFiltered = data.hits.total;
    returnData.data = users;
    return returnData;
};


exports.convertSuggestUsers = function(data) {
    var users = [];
    try {
        var suggestions = data.suggest.docsuggest;
        suggestions.forEach(function (myarr){
            var opts = myarr.options;
            opts.forEach(function (user) {
                var newUser = Object.assign({}, userDomain);
                user = user._source;
                var classes = user['classes'];
                newUser.id = user['id'];
                newUser.userName = user['user_name'];
                newUser.tenantId = user['tenant_id'];
                newUser.schoolId = user['school_id'];
                newUser.schoolName = user['school_name'];
                newUser.academicYear = user['academic_year'];
                newUser.roles = user['roles'];
                newUser.userType = user['user_type'];
                newUser.userCode = user['user_code'];
                newUser.shortName = user['short_name'];
                newUser.dateOfJoining = user['date_of_joining'];
                newUser.deviceToken = user['device_token'];
                newUser.firstName = user['first_name'];
                newUser.primaryPhone = user['primary_phone'];
                newUser.emailAddress = user['email'];
                newUser.classes = classes;
                newUser.languages = user['languages'];
                newUser.subjects = user['subjects'];
                newUser.dept = user['dept'];
                newUser.desg = user['desg'];
                newUser.active = user['active'];
                newUser.suggestStudent = classes.length > 0 ? user['first_name'] + ' (' + user['classes'][0].class_name + '-' + user['classes'][0].section_name + ')' : user['first_name'];

                users.push(newUser);
            });
        })
    }
    catch (err) {
        return err;
    }
    return users;
};


exports.convertSuggestStudents = function(data) {
    var users = [];
    try {
        var suggestions = data.suggest.docsuggest;
        suggestions.forEach(function (myarr){
            var opts = myarr.options;
            opts.forEach(function (user) {
                var newUser = Object.assign({}, userDomain);
                user._source._id = user._id;
                user = user._source;
                var classes = user['classes'];
                newUser.id = user['id'];
                newUser._id = user['_id'];
                newUser.userName = user['user_name'];
                newUser.tenantId = user['tenant_id'];
                newUser.schoolId = user['school_id'];
                newUser.academicYear = user['academic_year'];
                newUser.schoolName = user['school_name'];
                newUser.roles = user['roles'];
                newUser.userType = user['user_type'];
                newUser.userCode = user['user_code'];
                newUser.shortName = user['short_name'];
                newUser.dateOfJoining = user['date_of_joining'];
                newUser.deviceToken = user['device_token'];
                newUser.firstName = user['first_name'];
                newUser.primaryPhone = user['primary_phone'];
                newUser.emailAddress = user['email'];
                newUser.classes = classes;
                newUser.languages = user['languages'];
                newUser.subjects = user['subjects'];
                newUser.dept = user['dept'];
                newUser.desg = user['desg'];
                newUser.active = user['active'];
                newUser.suggestStudent = classes.length > 0 ? user['first_name'] + ' - ' + user['user_code'] + ' (' + user['classes'][0].class_name + '-' + user['classes'][0].section_name + ')' : user['first_name'];

                users.push(newUser);
            });
        })
    }
    catch (err) {
        return err;
    }
    return users;
};


exports.convertParents = function(req, data) {
    var parents = [];
    var headers = baseService.getHeaders(req);
    try {
        var myarr = data.hits.hits;
        if(myarr.length > 0) {
            myarr.forEach(function (user) {
                user = user._source;
                user.childs = _.filter(user.childs, {'school_id': headers.school_id})
                if(!_.isEmpty(user.childs)){
                    parents.push(parentObj(user));
                }
            });
        }
    }
    catch (err) {
        return err;
    }
    return parents;
};

function parentObj(parent) {
    var update_date = parent.updated_date ? dateService.formatDate(parent.updated_date) : null;
    parent.noOfWards = parent.childs.length;
    parent.updatedUserName = parent.updated_by + ' - ' + update_date;

    return parent;
};
exports.parentObj = parentObj;
