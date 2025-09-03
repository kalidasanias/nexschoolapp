/**
 * Created by bharatkumarr on 20/03/17.
 */

var express = require('express')
    , router = express.Router()
    , leaveAssign = require('../../services/user-mgmt/leaveAssign.service');

router.get('/', leaveAssign.getAllLeaveAssign);
router.get('/:id', leaveAssign.getLeaveAssign);
router.get('/employee/:id', leaveAssign.getLeaveAssignByName);
router.post('/', leaveAssign.saveLeave);
router.put('/:id', leaveAssign.updateLeaveAssign);
router.delete('/:id', leaveAssign.deleteLeaveAssign);

module.exports = router;