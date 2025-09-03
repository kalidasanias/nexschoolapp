/**
 * Created by kiranmai on 9/20/17.
 */

var express = require('express')
    , router = express.Router()
    , utils = require('../../utils/utils.service');


router.put('/notifications/update', utils.updateMediaUsageLog);
router.put('/assignments/update', utils.updateAssignmentDetails);

module.exports = router;
