/**
 * Created by Kiranmai A on 3/4/2017.
 */

var express = require('express'),
    router = express.Router(),
    scheduler = require('../../services/scheduler/scheduler.service');

router.get('/options', scheduler.getRepeatOptions);

module.exports = router;