/**
 * Created by admin on 25/04/17.
 */
var express = require('express')
    , router = express.Router()
    , s3 = require('../../services/s3/s3.service')

router.post('/list', s3.listBuckets);
router.post('/create', s3.createBuckets);

module.exports = router;