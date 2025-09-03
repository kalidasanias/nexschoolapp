/**
 * Created by kiranmai on 9/5/17.
 */

var express = require('express')
    , router = express.Router()
    , grades = require('../../services/grades/grades.service.js');

router.get('/school', grades.getSchoolGradeDetails);

module.exports = router;