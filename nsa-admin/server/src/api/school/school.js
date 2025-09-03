/**
 * Created by senthil-p on 12/06/17.
 */
var express = require('express')
    , router = express.Router()
    , school = require('../../services/school/school.service.js')
    , validator = require('@nsa/nsa-commons').validator;

router.get('/', school.getSchoolDetails);
router.get('/logo', school.getSchoolLogo);
router.put('/', school.updateSchoolImages);

module.exports = router;