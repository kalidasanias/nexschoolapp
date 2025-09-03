/**
 * Created by senthil on 08/02/17.
 */
var express = require('express')
    , router = express.Router()
    , elasticsearch = require('../../../src/services/search/elasticsearch/elasticsearch.service');

router.get('/employees', elasticsearch.getUsersByType);
router.get('/users', elasticsearch.getUserIndex);
router.get('/calendar', elasticsearch.getCalendarIndex);
router.get('/assessment', elasticsearch.getAssessmentIndex);
router.get('/notifications', elasticsearch.getNotificationIndex);
router.get('/assignments', elasticsearch.getAssignmentIndex);
router.get('/user/:userName', elasticsearch.getUserByUserName);
router.get('/student', elasticsearch.getStudents);
router.get('/student/all', elasticsearch.getEsAllStudents);
router.post('/student/class', elasticsearch.getStudentsByClass);
router.post('/student/classes', elasticsearch.getUsersByClassAndSections);

router.get('/search/:input', elasticsearch.getSuggestions);
router.get('/search/student/:input', elasticsearch.getSuggestionsWithStudentInfo);
router.get('/vehicle', elasticsearch.saveVehicleDetails);

module.exports = router;