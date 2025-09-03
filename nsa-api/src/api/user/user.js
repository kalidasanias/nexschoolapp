/**
 * Created by karthik on 05-01-2017.
 */

var express = require('express')
            , router = express.Router()
            , user = require('../../services/user/user.service.js')

router.get('/:id', user.getUserDetails);
router.post('/', user.saveUser);
router.put('/update', user.updateUser);

module.exports = router;