/**
 * Created by Sai Deepak on 27-Dec-16.
 */

var express = require('express')
    , router = express.Router()
    , validator = require('@nsa/nsa-commons').validator
    , notification = require('../../../services/sms/notifications/notification.service.js');


router.get('/logs/update', notification.updateDeactiveStatus); //for updating deactivated field for the implementation of delete

router.get('/notifications', notification.getAllNotifications);
router.post('/notifications', validator.notification.sendNotification, notification.sendNotification);
router.get('/notification/:id', notification.notificationById);

//Draft
router.post('/notification/draft', notification.saveDraftNotification);
router.post('/notification/sent', notification.saveNotificationWithoutMedia);
router.get('/notification/draft/:id', notification.draftNotificationById);
router.delete('/notification/draft/:id', notification.deleteDraftNotificationById);
router.put('/notification/draft/:id', validator.notification.updateNotification, notification.updateDraftNotificationById);

router.get('/notification/logs/:id', notification.getNotificationlogsById);
router.get('/media/:id', notification.getMediaUsedCount);
router.get('/object/:id', notification.getMediaLogByObjectId);
router.get('/status/:id', notification.checkStatus);
router.get('/notification/user/:id', notification.getNotificationByUser);
router.put('/notification/attachments/:id', notification.updateAttachmentsById);
router.put('/notification/send/:id', notification.sendOnlyNotifications);

router.delete('/notification/attachments/:id', notification.deleteAttachments);


module.exports = router;