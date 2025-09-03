var express = require('express')
    , router = express.Router()
    , ping = require('../../services/ping/ping.service')

router.get('/', ping.ping);

router.get('/get', ping.ping);
router.get('/heading', ping.heading);
router.get('/data', ping.data);
router.delete('/', ping.deleteObj);

module.exports = router;