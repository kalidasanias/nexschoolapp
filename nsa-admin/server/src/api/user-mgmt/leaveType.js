/**
 * Created by bharatkumarr on 20/03/17.
 */

var express = require('express')
    , router = express.Router()
    , leaveType = require('../../services/user-mgmt/leaveType.service')
    , validate = require('express-validation')
    , validation = require('@nsa/nsa-commons').validation;

router.get('/', leaveType.getAllLeaveTypes);
router.get('/:id', leaveType.getLeaveType);
router.post('/', leaveType.saveLeaveType);
router.put('/:id', leaveType.updateLeaveType);
router.delete('/:id', leaveType.deleteLeaveType);

module.exports = router;