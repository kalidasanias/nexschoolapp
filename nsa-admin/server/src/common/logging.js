/**
 * Created by bharatkumarr on 05/07/17.
 */

var logger = require('../../config/logger');

exports.debugLog = function(req, message, err) {
    var logMsg = { 'Operation Failed': message, user_name: req.headers.userInfo.user_name,
        user_type: req.headers.userInfo.user_type,
        tenant_id: req.headers.userInfo.tenant_id,
        school_id: req.headers.userInfo.school_id,
        school_name: req.headers.userInfo.school_name, error_message: err.message, error_stack: err.stack };

    logger.debug(logMsg);
}
