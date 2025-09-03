/**
 * Created by magesh on 1/13/17.
 */

var express = require('express'),
    router = express.Router(),
    dashboard = require('../../services/dashboard/dashboard.service');

router.get('/info', dashboard.getDashboardInfo);
router.get('/notifications', dashboard.getDashboardNotifications);
router.get('/attendance', dashboard.getDashboardAttendance);
router.get('/timetable', dashboard.getDashboardTimetable);
router.get('/notes', dashboard.getDashboardNotes);
router.get('/events/:id', dashboard.getDashboardEvents);
router.get('/exams', dashboard.getDashboardExams);
router.get('/assignments', dashboard.getDashboardAssignments);
router.get('/calendar', dashboard.getDashboardCalendar);
router.get('/calendar/student/', dashboard.getStudentDashboardDetails);

router.get('/student/:id', dashboard.getStudentDetails);
router.get('/employee/:id/:dayId', dashboard.getEmployeeDashboardDetails);

router.get('/student/details/:id/:classId/:sectionId/:dayId', dashboard.getStudentDashboardInfo);

module.exports = router;