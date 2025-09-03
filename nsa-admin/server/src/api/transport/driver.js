/**
 * Created by bharatkumarr on 20/03/17.
 */

var express = require('express')
    , router = express.Router()
    , driver = require('../../services/transport/driver.service')

router.get('/', driver.getAllDrivers);
router.get('/:id', driver.getDriver);
router.post('/', driver.saveDriver);
router.put('/:id', driver.updateDriver);
router.delete('/:id', driver.deleteDriver);

module.exports = router;