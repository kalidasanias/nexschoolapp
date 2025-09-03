var check = require('../common/validation.chek'),
    message = require('../common/validation.message')

exports.saveSection = function(req, res, next) {
    req.assert('sectionName', message.nsaErr201).notEmpty().withMessage(message.nsaErr201);
    req.assert('sectionCode', message.nsaErr202).notEmpty().withMessage(message.nsaErr202);
    req.assert('status',message.nsaErr204).notEmpty().withMessage(message.nsaErr204).isBoolean().withMessage(message.nsaErr204);
    check.checkResult(req, res, next);
}

exports.saveClassSections = function(req, res, next) {
    req.assert('className', message.nsaErr801).notEmpty().withMessage(message.nsaErr801);
    req.assert('sectionName', message.nsaErr802).notEmpty().withMessage(message.nsaErr802);
    req.assert('studentIntake',message.nsaErr803).notEmpty().withMessage(message.nsaErr804);
    check.checkResult(req, res, next);
}

exports.updateSection = function(req, res, next) {
    req.assert('sectionName', message.nsaErr201).notEmpty().withMessage(message.nsaErr201);
    req.assert('sectionCode', message.nsaErr202).notEmpty().withMessage(message.nsaErr202);
    req.assert('status',message.nsaErr204).notEmpty().withMessage(message.nsaErr204).isBoolean().withMessage(message.nsaErr204);
    check.checkResult(req, res, next);
}

exports.updateSecByClassAndSec = function(req, res, next) {
    req.assert('studentIntake',message.nsaErr803).notEmpty().withMessage(message.nsaErr804);
    check.checkResult(req, res, next);
}