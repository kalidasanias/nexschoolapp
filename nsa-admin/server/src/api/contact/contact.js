/**
 * Created by Sai Deepak on 27-Dec-16.
 */

var express = require('express')
    , router = express.Router()
    , contact = require('../../services/contact/contact.service')

router.get('/suggestions',contact.suggestions);
router.get('/roles',contact.roles);

module.exports = router