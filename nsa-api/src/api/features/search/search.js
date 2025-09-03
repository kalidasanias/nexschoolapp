/**
 * Created by senthil on 08/02/17.
 */
var express = require('express')
    , router = express.Router()
    , elasticsearch = require('../../../services/features/search/elasticsearch.service');


router.get('/users', elasticsearch.searchUsers);

module.exports = router;