/**
 * Created by Kiranmai A on 2/8/2017.
 */

var express = require('express')
    , router = express.Router()
    , languages = require('../../services/language/language.service.js');

router.get('/', languages.getSchoolLanguages);

module.exports = router;
