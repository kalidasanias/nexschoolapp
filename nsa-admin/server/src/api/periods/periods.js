/**
 * Created by Kiranmai A on 3/29/2017.
 */

var express = require('express')
    , router = express.Router()
    , periods = require('../../services/periods/periods.service');

router.get('/', periods.getAllPeriods);
router.get('/class/:id', periods.getAllClassTimings);

module.exports = router;
