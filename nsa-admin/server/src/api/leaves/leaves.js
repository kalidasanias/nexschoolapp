/**
 * Created by Kiranmai A on 5/25/2017.
 */

var express = require('express'),
    router = express.Router(),
    leaves = require('../../services/leaves/leaves.service');

router.post('/emp', leaves.applyEmpLeave);
router.put('/emp/:id', leaves.editEmpLeave);
router.get('/emp/taken/:id', leaves.leavesTakenByEmp);  // total approvedleaves past and Feature
router.get('/emp/past/taken/:id', leaves.getTakenLeavesByEmp);
router.get('/emp/apply/:id', leaves.getEmpAppliedLeaves);   //all the leaves applied by emp
router.get('/emp/reason/:id/:status', leaves.getEmpLeavebyStatus);   //leave detail obj based on status for emp
router.get('/emp/remaining/:id', leaves.getRemainingLeaves);  // not done
router.get('/emp/:id', leaves.getAppliedLeaveDetailsById); //get call for editing leave applied by emp
router.get('/emp/requested/:id', leaves.getReqLeavesByRempId);  //get leaves requested by reporting employee
router.get('/approval/history/:id', leaves.getApprovalHistory);  //get all leaves approved by reporting employee
router.get('/emp/type/:typeId/:id', leaves.getLeaveByTypeAndName);
router.get('/employees/list/:id', leaves.getEmpByRempId);
router.get('/emp/cal/:id', leaves.getCalendarObj);

module.exports = router;