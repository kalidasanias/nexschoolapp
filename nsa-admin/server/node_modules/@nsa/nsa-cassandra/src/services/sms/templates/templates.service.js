/**
 * Created by Sai Deepak on 27-Dec-16.
 */
var express = require('express')
    , baseService = require('../../common/base.service')
    , message = require('@nsa/nsa-commons').messages
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , constant = require('@nsa/nsa-commons').constants
    , models = require("../../../models");

const dataBaseUrl = '../../../';

var Template = function f(options) {
    var self = this;
};

Template.getAllTemplates = function (req, callback) {
    var headers = baseService.getHeaders(req);
    models.instance.SchoolTemplate.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, {allow_filtering: true}, function (err, result) {
        callback(err, result);
    });
};

Template.saveTemplate = function (req, callback) {
    var templateName = req.body.template.templateName;
    var templateMessage = req.body.template.templateMessage;
    var headers = baseService.getHeaders(req);

    var schoolTemplate = new models.instance.SchoolTemplate({
        template_id: models.uuid(),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        template_title: templateName,
        template_message: templateMessage,
        created_date: new Date()
    });

    schoolTemplate.save(function (err, result) {
        callback(err, message.nsa1003);
    });

};

Template.templateById = function (req, callback) {
    var id = req.params.id;
    var headers = baseService.getHeaders(req);
    models.instance.SchoolTemplate.find({
        template_id: models.uuidFromString(id),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, function (err, result) {
        callback(err, result);
    });

};

Template.deleteTemplateById = function (req, callback) {

    var id = req.params.id;
    var headers = baseService.getHeaders(req);

    var queryObject = {
        template_id: models.uuidFromString(id),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };

    models.instance.SchoolTemplate.find(queryObject, function (err, result) {
        if (JSON.stringify(result) != '[]') {
            models.instance.SchoolTemplate.delete(queryObject, function (err, result) {
                callback(err, message.nsa1004);
            });
        } else {
            callback(null, constant.CONTACT_ADMIN);
        }
    });
};

Template.updateTemplateById = function (req, callback) {

    var templateId = req.body.template.templateId;
    var templateName = req.body.template.templateName;
    var templateMessage = req.body.template.templateMessage;

    var headers = baseService.getHeaders(req);

    var queryObject = {
        template_id: models.uuidFromString(templateId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };

    var updateValues = {template_title: templateName, template_message: templateMessage, updated_date: new Date()};
    models.instance.SchoolTemplate.update(queryObject, updateValues, function (err, result) {
        callback(err, message.nsa1005);
    });
};

Template.getAllSenderIds = function (req, mediaId, cb) {
    var headers = baseService.getHeaders(req);

    models.instance.SchoolSenderType.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        media_id : mediaId
    }, {allow_filtering: true}, function (err, result) {
        if (err) {
            cb(err, null);
        } else if (result.length === 0 || result[0].sender_name == null || result[0].sender_name == '') {
            cb(null, result);
        } else {
            cb(null, result);
        }
    });
};

module.exports = Template;