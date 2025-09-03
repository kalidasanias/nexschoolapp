/**
 * Created by senthilPeriyasamy on 12/23/2016.
 */
var express = require('express')
    , router = express.Router();

global.ping = require('./ping/ping');
global.constants = require('../common/constants/constants');

var apiVersionOne = '/rest/api/v1/nsa/app/';

//router.all(apiVersionOne + '*', initFilter.initValidation);

router.use(apiVersionOne + 'ping', global.ping);

module.exports = router;