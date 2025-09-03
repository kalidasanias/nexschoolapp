/**
 * Created by bharatkumarr on 06/09/17.
 */

var express = require('express')
    , router = express.Router()
    , s3 = require('@nsa/nsa-asset').s3
    , baseService = require('../../services/common/base.service')
    , voice = require('../../services/voice/sendVoice.service.js');

router.get('/audio', voice.getAudios);
router.get('/audios', voice.getAllAudios);
router.get('/device/audios', voice.getAllDeviceAudios);
router.post('/audio/upload', voice.uploadAudio);
router.post('/audio', voice.updateCassandra);
router.get('/messages', voice.getAllNotifications);
router.get('/messages/:id', voice.getAllNotificationsByCreatedById);
router.get('/log/:id', voice.getAllVoiceNotificationLogsById);
router.post('/now', voice.sendNotification);
router.get('/now/:id', voice.getVoiceNotificationById)
router.put('/now/:id', voice.sendNotification);
router.delete('/now/:id', voice.deleteNotificationById);

module.exports = router;