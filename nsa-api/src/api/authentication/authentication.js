/**
 * Created by senthilPeriyasamy on 12/23/2016.
 */
var express = require('express')
    , router = express.Router()
    , authenticate = require('../../services/authentication/authentication.service')

router.post('/', authenticate.authenticate);

module.exports = router