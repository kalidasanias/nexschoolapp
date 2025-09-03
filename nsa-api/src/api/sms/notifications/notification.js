/**
 * Created by Sai Deepak on 27-Dec-16.
 */

var express = require('express')
    , router = express.Router()
    , notification = require('../../../services/sms/notifications/notification.service.js')

router.get('/notifications', notification.getAllNotifications);
router.post('/notifications', notification.saveNotification);
router.delete('/notifications', notification.deleteNotifications);
router.get('/notification/:id', notification.notificationById);

//Draft
router.post('/notification/draft', notification.saveDraftNotification);
router.get('/notification/draft/:id', notification.draftNotificationById);
router.delete('/notification/draft/:id', notification.deleteDraftNotificationById);
router.put('/notification/draft/:id', notification.updateDraftNotificationById);

router.get('/notification/log/:id', notification.getNotificationlogsById);
router.get('/media/:id', notification.getMediaUsedCount);
router.get('/count/:id', notification.getSmsCountByType);


module.exports = router