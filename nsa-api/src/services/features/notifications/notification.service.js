var fs = require('fs')
    , rem = require('../../../lib/events')
    , BaseError = require('nsa-commons').BaseError;

const allUserNotificationLogs = require('../../../test/json-data/features/notifcations/all-user-notification-logs.json');

//Get All User Notification Logs
exports.getAllUserNotificationLogs = function(req, res) {
    console.info("getAllUserNotificationLogs");
    rem.emit('JsonResponse', req, res, allUserNotificationLogs);
};