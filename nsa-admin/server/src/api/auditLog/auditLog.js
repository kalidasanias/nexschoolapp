/**
 * Created by Kiranmai A on 3/8/2017.
 */

var express = require('express'),
    router = express.Router(),
    auditLog = require('../../services/auditLog/auditLog.service');

router.get('/:id', auditLog.getLogs);
router.post('/', auditLog.saveLogs);

module.exports = router;