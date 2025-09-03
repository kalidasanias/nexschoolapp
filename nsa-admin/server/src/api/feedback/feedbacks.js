/**
 * Created by praga on 7/26/2017.
 */

var express = require('express'),
    router = express.Router(),
    feedBackDetails = require('../../services/feedback/feedback.service.js');

router.post('/', feedBackDetails.saveFeedBackDetails);
router.get('/',feedBackDetails.getFeedBackDetails);


module.exports = router;