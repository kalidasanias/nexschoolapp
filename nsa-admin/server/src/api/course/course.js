/**
 * Created by Cyril on 4/25/2017.
 */

var express = require('express')
    , router = express.Router()
    ,course =require('../../services/course/course.service')

router.get('/', course.getAllCourseDepartments);

module.exports = router;