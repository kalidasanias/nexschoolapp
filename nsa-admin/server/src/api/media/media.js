/**
 * Created by Kiranmai A on 2/14/2017.
 */

var express = require('express')
    , router = express.Router()
    , media = require('../../services/media/media.service.js')

router.get('/types', media.getMediaTypes);

module.exports = router;
