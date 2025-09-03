/**
 * Created by Cyril on 1/4/2018.
 */
var models = require('../../models/index'),
    baseService = require('./base.service'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    _ = require('lodash'),
    dateUtils = require('@nsa/nsa-commons').dateUtils,
    constants = require('../../common/constants/constants')
    templateConverter = require('../../converters/template.converter'),
    userDomain =  require('../../common/domains/User')
    logger = require('../../../config/logger');

var PromotionBase = function f(options){
    var self = this
};


PromotionBase.getTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var params = {class_name: body.existingClass[0].name, promoted_class: body.promotedClasses[0].name};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

PromotionBase.getDePromoteTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var headers = baseService.getHeaders(req);
    var params = {class_name: body.existingClass[0].name};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

PromotionBase.getShuffleTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var headers = baseService.getHeaders(req);
    var params = {class_name: body.promotedClasses[0].name, section_name: body.promotedClasses[0].sections[0].name};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

PromotionBase.notificationUserObj = function(allUser, callback) {
    var users = [];
    try {
        allUser.forEach(function (user) {
            var newUser = {};
            newUser.id = user['id'];
            newUser.userName = user['user_name'];
            newUser.roles = user['roles'];
            newUser.tenantId = user['tenant_id'];
            newUser.academicYear = user['academic_year'];
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
            newUser.isHostel = user['is_hostel'];
            newUser._id =user['_id'];
            newUser.newClassId = user['newClassId'];
            newUser.newSectionId = user['newSectionId'];
            newUser.preclasses = user['preclasses'];
            newUser.languages = user['languages'];
            newUser.parentInfo = ( user['parent_info'] != undefined && !_.isEmpty(user['parent_info']) ) ? (user['parent_info']) : {};
            users.push(newUser);
        });

        callback(null, users)
    }catch (err){
     callback(err, null)
    }
};

module.exports = PromotionBase;