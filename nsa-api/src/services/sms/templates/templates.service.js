/**
 * Created by Sai Deepak on 27-Dec-16.
 */
var express = require('express')
    , baseService = require('../../common/base.service')
    , constants = require('../../../common/constants/constants')
    , models = require("../../../models");

const dataBaseUrl = '../../../test/json-data/';

exports.getAllTemplates = function (req, res) {
    var headers = baseService.getHeaders(req);
    models.instance.SchoolTemplate.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, {allow_filtering: true}, function (err, result) {
        if (err) {
            res.status(constants.HTTP_BAD_REQUEST).send({success: false, data: err});
        } else if (JSON.stringify(result) != '[]') {
            res.status(constants.HTTP_CREATED).send({success: true, data: result});
        } else {
            res.status(constants.HTTP_FORBIDDEN).send(require(dataBaseUrl + 'failure/failure.json'));
        }
    });
};

exports.saveTemplate = function (req, res) {
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
        if (err) {
            res.status(constants.HTTP_BAD_REQUEST).send({success: false, data: err});
        } else if (JSON.stringify(result) != '[]') {
            res.status(constants.HTTP_CREATED).send({success: true, message: 'Template successfully saved'});
        } else {
            res.status(constants.HTTP_FORBIDDEN).send(require(dataBaseUrl + 'failure/failure.json'));
        }
    });

};

exports.templateById = function (req, res) {
    var id = req.params.id;
    var headers = baseService.getHeaders(req);
    models.instance.SchoolTemplate.find({
        template_id: models.uuidFromString(id),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, function (err, result) {
        if (err) {
            res.status(constants.HTTP_BAD_REQUEST).send({success: false, data: err});
        } else if (JSON.stringify(result) != '[]') {
            res.status(constants.HTTP_CREATED).send({success: true, data: result});
        } else {
            res.status(constants.HTTP_FORBIDDEN).send(require(dataBaseUrl + 'failure/failure.json'));
        }
    });

};

exports.deleteTemplateById = function (req, res) {

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
                if (err) {
                    res.status(constants.HTTP_BAD_REQUEST).send({success: false, data: err});
                } else {
                    res.status(constants.HTTP_CREATED).send({success: true, data: 'Template deleted successsfully'});
                }
            });
        } else {
            res.status(constants.HTTP_FORBIDDEN).send(require(dataBaseUrl + 'failure/failure.json'));
        }
    });
};

exports.updateTemplateById = function (req, res) {

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
        if (err) {
            res.status(constants.HTTP_BAD_REQUEST).send({success: false, data: err});
        } else if (JSON.stringify(result) != '[]') {
            res.status(constants.HTTP_CREATED).send({success: true, data: 'Template updated successfully'});
        } else {
            res.status(constants.HTTP_FORBIDDEN).send(require(dataBaseUrl + 'failure/failure.json'));
        }
    });
};

exports.getAllSenderIds = function (req, res, mediaId, cb) {
    var headers = baseService.getHeaders(req);

    models.instance.SchoolSenderType.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        media_id : mediaId
    }, {allow_filtering: true}, function (err, result) {
        if (err) {
            res.status(constants.HTTP_BAD_REQUEST).send({success: false, data: err});
        } else if (result.length === 0 || result[0].sender_name == null || result[0].sender_name == '') {
            res.status(constants.HTTP_FORBIDDEN).send({success: false, data: 'SenderId not configured'});
        } else {
            cb(result);
        }
    });
};

