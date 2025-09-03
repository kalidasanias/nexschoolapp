var express = require('express')
    , router = express.Router()
    , ping = require('../../services/ping/ping.service');

router.get('/', ping.ping);

module.exports = router;