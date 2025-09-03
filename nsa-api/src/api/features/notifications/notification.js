var express = require('express')
    , router = express.Router()
    , notification = require('../../../services/features/notifications/notification.service');

router.get('/log/:userId', notification.getAllUserNotificationLogs);

module.exports = router