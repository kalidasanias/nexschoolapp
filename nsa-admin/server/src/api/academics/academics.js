/**
 * Created by Kiranmai A on 3/17/2017.
 */

var express = require('express'),
    router = express.Router(),
    academics = require('../../services/academics/academics.service');

router.get('/', academics.getAcademicYearDetails);

module.exports = router;