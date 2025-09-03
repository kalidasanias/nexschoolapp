/**
 * Created by Kiranmai A on 2/9/2017.
 */


var express = require('express')
    , router = express.Router()
    , terms = require('../../services/terms/terms.service.js');

router.get('/', terms.getSchoolTerms);

module.exports = router;