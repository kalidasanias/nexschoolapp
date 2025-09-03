var fs = require('fs')
    , rem = require('../../../lib/events')
    , BaseError = require('nsa-commons').BaseError;

const allTimetablesJson = require('../../../test/json-data/features/timetables/get-all-timetables.json');
const classTimetableJson = require('../../../test/json-data/features/timetables/get-class-timetable.json');
const changeSubjectTeacherHourJson = require('../../../test/json-data/features/timetables/change-subject-teacher-hour.json');

const classExamTimetableJson = require('../../../test/json-data/features/timetables/get-class-exam-timetable.json');

const classEventsTimetableJson = require('../../../test/json-data/features/timetables/get-class-events-timetable.json');
const classHolidaysTimetableJson = require('../../../test/json-data/features/timetables/get-holidays-timetable.json');
const classNotesUploadJson = require('../../../test/json-data/features/timetables/upload-class-notes.json');
const teacherTimetableJson = require('../../../test/json-data/features/timetables/get-teacher-timetable.json');
const teacherExamTimetableJson = require('../../../test/json-data/features/timetables/get-teacher-exam-timetable.json');
const classSectionTimetableJson = require('../../../test/json-data/features/timetables/get-class-section-timetable.json');

const classExamScheduleTimetableJson = require('../../../test/json-data/features/timetables/get-class-exam-schedule-timetable.json');
const classExamSectionPortionUploadJson = require('../../../test/json-data/features/timetables/upload-class-exam-section-portion.json');
const classEventJson = require('../../../test/json-data/features/timetables/get-class-event.json');

//Get All Timetables
exports.getAllTimetables = function(req, res) {
    console.info("getAllTimetables");
    //throw new BaseError({"message" : "Processing Timetable Error", "detail" : "Timetable Parameter missing", "errorCode" : 500});
    rem.emit('JsonResponse', req, res, allTimetablesJson);
};

//Get Class Timetable
exports.getClassTimetable = function(req, res) {
    console.info("getClassTimetable");
    rem.emit('JsonResponse', req, res, classTimetableJson);
};

//Change Subject or Teacher
exports.changeSubjectTeacherHour = function(req, res) {
    console.info("changeSubjectTeacherHour");
    rem.emit('JsonResponse', req, res, changeSubjectTeacherHourJson);
};

//Get Class Timetable
exports.getClassExamTimetable = function(req, res) {
    console.info("getClassExamTimetable");
    rem.emit('JsonResponse', req, res, classExamTimetableJson);
};

//Get Class Events Timetable
exports.getClassEventsTimetable = function(req, res) {
    console.info("getClassEventsTimetable");
    rem.emit('JsonResponse', req, res, classEventsTimetableJson);
};

//Get Class Holidays Timetable
exports.getClassHolidaysTimetable = function(req, res) {
    console.info("getClassHolidaysTimetable");
    rem.emit('JsonResponse', req, res, classHolidaysTimetableJson);
};

//Upload Class Notes Timetable
exports.uploadClassNotes = function(req, res) {
    console.info("uploadClassNotes");
    rem.emit('JsonResponse', req, res, classNotesUploadJson);
};

//Get Class Teacher Timetable
exports.getTeacherTimetable = function(req, res) {
    console.info("getTeacherTimetable");
    rem.emit('JsonResponse', req, res, teacherTimetableJson);
};

//Get Teacher Exam Timetable
exports.getTeacherExamTimetable = function(req, res) {
    console.info("getTeacherExamTimetable");
    rem.emit('JsonResponse', req, res, teacherExamTimetableJson);
};

//Get Class Section Timetable
exports.getClassSectionTimetable = function(req, res) {
    console.info("getTeacherExamTimetable");
    rem.emit('JsonResponse', req, res, classSectionTimetableJson);
};

//Get Class Exam Schedule Timetable
exports.getClassExamScheduleTimetable = function(req, res) {
    console.info("getTeacherExamTimetable");
    rem.emit('JsonResponse', req, res, classExamScheduleTimetableJson);
};

//Upload Class Exam Section Portion Timetable
exports.uploadClassExamSectionPortion = function(req, res) {
    console.info("uploadClassExamSectionPortion");
    rem.emit('JsonResponse', req, res, classExamSectionPortionUploadJson);
};

//Get Class Event Timetable
exports.getClassEvent = function(req, res) {
    console.info("getClassEvent");
    rem.emit('JsonResponse', req, res, classEventJson);
};