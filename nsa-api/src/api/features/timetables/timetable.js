var express = require('express')
    , router = express.Router()
    , timetables = require('../../../services/features/timetables/timetables.service');

router.get('/', timetables.getAllTimetables);
router.get('/class/:classId', timetables.getClassTimetable);

router.put('/class/hour/change', timetables.changeSubjectTeacherHour);

router.get('/class/exams/:classId', timetables.getClassExamTimetable);
router.get('/class/events/:classId', timetables.getClassEventsTimetable);
router.get('/class/holidays/:classId', timetables.getClassHolidaysTimetable);

router.post('/class/upload', timetables.uploadClassNotes);

router.get('/teacher/:teacherId', timetables.getTeacherTimetable);
router.get('/teacher/exams/:teacherId', timetables.getTeacherExamTimetable);

router.get('/class/:classId/section/:sectionId', timetables.getClassSectionTimetable);
router.get('/class/exam/:examId', timetables.getClassExamScheduleTimetable);

router.post('/class/exam/portion', timetables.uploadClassExamSectionPortion);
router.get('/class/event/:eventId', timetables.getClassEvent);

module.exports = router