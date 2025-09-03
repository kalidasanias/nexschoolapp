/**
 * Created by Anjan on 4/3/2017.
 */

var check = require('../common/validation.chek'),
    message = require('../common/validation.message');

exports.saveSchoolSubjects = function(req, res, next){

    req.assert('subName',  message.nsaErr301).notEmpty().withMessage(message.nsaErr301);
    req.assert('status', message.nsaErr303).notEmpty().withMessage(message.nsaErr302).isBoolean().withMessage(message.nsaErr304);
    check.checkResult(req, res, next);
};