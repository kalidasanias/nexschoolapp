/**
 * Created by senthil on 3/21/2017.
 */

var check = require('../common/validation.chek'),
    message = require('../common/validation.message');

exports.sendNotification = function(req, res, next) {
    req.assert('notifyTo.status', message.nsaErr001).notEmpty().withMessage(message.nsaErr001).isAlpha().withMessage(message.nsaErr002);
    req.assert('notify', message.nsaErr003).notEmpty();
    check.checkResult(req, res, next);
};

exports.updateNotification = function(req, res, next) {
    req.assert('notifyTo.status', message.nsaErr001).notEmpty().withMessage(message.nsaErr001).isAlpha().withMessage(message.nsaErr002);
    req.assert('notificationId', message.nsaErr005).notEmpty();
    req.assert('notify', message.nsaErr003).notEmpty();
    check.checkResult(req, res, next);
};