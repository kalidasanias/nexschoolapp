/**
 * Created by Kiranmai A on 3/13/2017.
 */


var express = require('express'),
    router = express.Router(),
    attendance = require('../../services/attendance/attendance.service');

router.get('/class/:classId/section/:sectionId/:date', attendance.getUsersByClassAndSection);
router.get('/', attendance.getAttendanceLists);
router.post('/', attendance.saveAttendance);
router.put('/:id', attendance.updateAttendance);
router.get('/leave/history/class/:classId/section/:sectionId', attendance.getAllStudentLeaveHistory); // No Need
router.get('/leave/history/overall', attendance.getOverallLeaveHistory); // No Need
router.get('/leave/history/:id', attendance.getUserLeaveHistory);  // get user leave history till date
router.get('/details/:id', attendance.getDetailsByAttendanceId);
router.get('/details/user/:id', attendance.getDetailsByUserId); // get no of leaves taken by user from details table
router.get('/details/mobile/user/:id', attendance.getDetailsMobileByUserId); // get no of leaves taken by user from details table
router.post('/leave', attendance.saveLeaveDetails);
router.put('/leave/:id', attendance.updateLeaveDetails);

router.get('/user/overview/:id', attendance.getAttendanceOverviewByUser);
router.get('/details/month/:id', attendance.getMonthlyAttendanceByUser);
router.get('/overall/history', attendance.getOverallAttendanceHistory); // No Need
router.get('/history', attendance.getAttendanceHistory);
router.get('/history/overview', attendance.getAttendanceHistoryOverview);

router.get('/month/year', attendance.getAttendanceByMonthOfYear);

module.exports = router;