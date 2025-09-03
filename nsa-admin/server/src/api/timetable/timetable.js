/**
 * Created by Sai Deepak on 28-Mar-17.
 */

var express = require('express')
    , router = express.Router()
    , s3 = require('@nsa/nsa-asset').s3
    , timetable = require('../../services/timetable/timetable.service')
    , baseService = require('../../services/common/base.service');

router.get('/details/class/update', timetable.updateSubEmpInfo); //for updating subEmpAssociation(map) field for the implementation of multi select

router.get('/config', timetable.getAllTimetableConfig);
router.get('/allconfigClass', timetable.getAllTimetableConfigClass);
router.get('/config/class/:id', timetable.getClassTimetableConfig);
router.get('/config/:id', timetable.getTimetableConfigById);
router.post('/config', timetable.saveTimetableConfig);
router.put('/config/:id', timetable.updateTimetableConfig);
router.delete('/config/:id', timetable.deleteTimetableConfig);

router.get('/class', timetable.getTimetableByClass);
router.post('/class', timetable.saveTimetable);
router.post('/generate/:id/:sectionId', timetable.generateTimetable);
router.post('/publish', timetable.publishTimetable);
router.put('/class/:id', timetable.updateTimetable);
router.put('/class/add/:id', timetable.addClassTimetable);
router.put('/:id', timetable.updateClassTimetable);
router.delete('/:id', timetable.deleteClassTimetable);
router.get('/class/teacher/:id', timetable.getClassesByEmp);
router.get('/class/:classId/section/:sectionId', timetable.getTimetableByClssAndSec);
router.get('/class/:classId/:sectionId', timetable.getCalendarByClsAndSec);
router.get('/class/:classId/section/:sectionId/:dayId', timetable.getTimetableByClssSecAndday);

/*special day timetable*/
router.post('/special/day/', timetable.saveSpecialDay);
router.get('/special/day/', timetable.getSpecialDay);
router.put('/special/day/', timetable.updateSpecialDay);
router.delete('/special/day/', timetable.deleteSpecialDay);

/*Employee */
router.get('/emp/:id', timetable.getTimetablebyEmpId);
router.get('/emp/cal/:id', timetable.getCalendarByEmpId);
router.get('/emp/', timetable.getTimetableSlots);
router.get('/emp/:id/:dayId', timetable.getTimetableByEmpByDay);


/*router.post('/notes', timetable.saveNotes);*/
router.post('/notes', baseService.getAssetUrl, s3.upload, timetable.saveTimetableNotes);
router.post('/notes/notify', timetable.sendNotification);
router.post('/view/notes', timetable.getNotes);
router.post('/notes/month', timetable.getNotesByMonthAndYear);
router.get('/notes/:classId/:sectionId/:dayId', timetable.getNotesByCSDate);
router.delete('/notes/:id', timetable.deleteAttachments);

router.get('/class/teacher/:classId/:sectionId', timetable.getClassTeacherByClsSec);

router.get('/employee/details', timetable.getEmpTimetableDetails);

/*class timetable*/

module.exports = router;