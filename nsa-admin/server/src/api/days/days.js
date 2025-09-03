/**
 * Created by Anjan on 3/30/2017.
 */
var express = require('express')
    ,router = express.Router()
    ,days = require('../../services/days/days.service');

router.get('/', days.getAllDays);

module.exports = router;