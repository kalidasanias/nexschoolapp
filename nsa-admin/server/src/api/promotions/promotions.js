var express = require('express'),
    router = express.Router(),
    promotions = require('../../services/promotions/populate.service.js');

router.post('/populate/class/sections', promotions.populateAllClassesSections);
router.post('/class/assoc', promotions.populateAllClassAssoc);
router.post('/terms/assoc', promotions.populateAllTermsAssoc);
router.post('/subjects/assoc', promotions.populateAllSubjectsAssoc);
router.post('/populate/assoc', promotions.populateAll);
router.get('/class/details/:year', promotions.getAllClassDetails);
router.get('/class/sections/:classId/:year', promotions.getAllClassSecDetails);
router.post('/users/', promotions.getUsersByClassAndSections);
router.get('/users/:year', promotions.getUsersList);
router.put('/update/classes/:year', promotions.updateClasses);
router.post('/class/students/', promotions.promoteStudents);
router.post('/class/students/shuffle', promotions.shuffleStudents);
router.put('/class/students/promote/:userName', promotions.updatePromoteStudents);
router.get('/classes/:year/:academicYear', promotions.getPromotedClasses);
//router.get('/shuffle/classes/:year/:academicYear', promotions.getShuffledClasses);
router.get('/users/:year/:classId', promotions.getClassUsersList);
router.get('/users/depromote/:year/:classId', promotions.getDepromotedStudentsByClass);
router.post('/users/report/', promotions.getPromotedUsersByClsSec);
router.get('/academic/years', promotions.getAcademicYearDetails);
router.put('/academic/years/:year', promotions.updateAcademicYearDetails);

module.exports = router;