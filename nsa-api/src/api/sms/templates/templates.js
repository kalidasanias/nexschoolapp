/**
 * Created by Sai Deepak on 27-Dec-16.
 */

var express = require('express')
    , router = express.Router()
    , templates = require('../../../services/sms/templates/templates.service')

router.get('/templates', templates.getAllTemplates);
router.post('/template', templates.saveTemplate);
router.get('/template/:id', templates.templateById);
router.delete('/template/:id', templates.deleteTemplateById);
router.put('/template', templates.updateTemplateById);

//senderids
router.get('/senderids', templates.getAllSenderIds);

module.exports = router