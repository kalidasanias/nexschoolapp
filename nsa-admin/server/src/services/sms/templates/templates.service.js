var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    BaseError = require('@nsa/nsa-commons').BaseError;

exports.getAllTemplates = function(req, res) {
    nsaCassandra.Template.getAllTemplates(req, function(err, response) {
        if(err) {
            throwTemplateErr(err, message.nsa1001)
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.saveTemplate = function(req, res) {
    nsaCassandra.Template.saveTemplate(req, function(err, response) {
        if(err) {
            throwTemplateErr(err, message.nsa1002)
        } else {
            response['message'] = message.nsa1003;
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.templateById = function(req, res) {
    nsaCassandra.Template.templateById(req, function(err, response) {
        if(err) {
            throwTemplateErr(err, message.nsa1001)
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.deleteTemplateById = function(req, res) {
    nsaCassandra.Template.deleteTemplateById(req, function(err, response) {
        if(err) {
            throwTemplateErr(err, message.nsa1006)
        } else {
            response['message'] = message.nsa1004;
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.updateTemplateById = function(req, res) {
    nsaCassandra.Template.updateTemplateById(req, function(err, response) {
        if(err) {
            throwTemplateErr(err, message.nsa1007)
        } else {
            response['message'] = message.nsa1005;
            events.emit('JsonResponse', req, res, response);
        }
    })
};

function throwTemplateErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.TEMPLATE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwTemplateErr = throwTemplateErr;


