/**
 * Created by karthik on 05-01-2017.
 */

var express = require('express')
            , router = express.Router()
            , user = require('../../services/user-mgmt/users.service.js')

router.get('/', user.getAllUsers);

module.exports = router;