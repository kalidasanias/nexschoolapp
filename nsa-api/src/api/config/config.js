/**
 * Created by senthil on 27/01/17.
 */

var express = require('express')
    , router = express.Router()
    , configService = require('../../services/config/config.service.js')

router.get('/', configService.getConfig);
router.get('/home', configService.getHomeConfig);

module.exports = router;