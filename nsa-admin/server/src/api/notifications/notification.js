var express = require('express')
    , router = express.Router()
    , notification = require('../../services/notifications/notification.service');

router.get('/log/:id', notification.getAllUserNotificationLogs);
router.put('/:id',  notification.updateNotificationLogs);
//For IOS Start
router.put('/read/:id',  notification.updateUserReadStatus);  //for updating is_read field for the implementation of read and unread
router.get('/overview/:id',  notification.getNotificationOverview); //for notification list with today and total and subject count
router.get('/unread/:id', notification.getUserUnReadNotifications);
//For IOS End
module.exports = router;