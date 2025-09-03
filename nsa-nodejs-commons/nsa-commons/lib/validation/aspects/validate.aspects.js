/**
 * Created by Anjan on 4/3/2017.
 */
var check = require('../common/validation.chek'),
    message = require('../common/validation.message')


/*
exports.getSchoolAspectsById = function(req, res, next){
    req.assert('req.params.id', message.nsaErr201).notEmpty();
   /!* req.assert('aspect_name', message.nsaErr201).notEmpty().withMessage(message.nsaErr202).isAlpha().withMessage(message.nsaErr202);
    req.assert('aspect_code',message.nsaErr201).notEmpty();*!/
};
*/

exports.saveSchoolAspects = function(req, res, next){
    req.assert('aspectName', message.nsaErr201).notEmpty().withMessage(message.nsaErr201);
    req.assert('aspectCode',message.nsaErr203).notEmpty();
    check.checkResult(req, res, next);
};

exports.updateSchoolAspects = function(req, res, next){
    req.assert('aspectName', message.nsaErr201).notEmpty().withMessage(message.nsaErr201).isAlpha();
    req.assert('aspectCode',message.nsaErr203).notEmpty();
    check.checkResult(req, res, next);
};

/*exports.deleteSchoolAspects = function(req, res, next){
    /!*req.assert('aspectName', message.nsaErr201).notEmpty().withMessage(message.nsaErr201).isAlpha().withMessage(message.nsaErr202);
    req.assert('aspectCode',message.nsaErr201).notEmpty();*!/
    check.checkResult(req, res, next);
};*/
