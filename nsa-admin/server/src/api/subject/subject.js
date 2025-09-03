/**
 * Created by Kiranmai A on 3/4/2017.
 */


var express = require('express'),
    router = express.Router(),
    validator = require('@nsa/nsa-commons').validator,
    subject = require('../../services/subject/subject.service'),
    validation = require('@nsa/nsa-commons').validator;


router.get('/', subject.getSchoolSubjects);
router.get('/active', subject.getSchoolActiveSubjects);
router.get('/:id', subject.getSchoolSubjectsById);
router.post('/', validation.subjectList.saveSchoolSubjects , subject.saveSchoolSubjects);
router.put('/:id', subject.updateSchoolSubjects);
router.delete('/:id', subject.deleteSchoolSubjects);

router.post('/dept/all', subject.getSubjectsByDepts);

/* Subject Allocation*/
router.get('/allocations/all', subject.getSchoolClassSubjects);
router.get('/allocation/:id', subject.getSchoolClassSubjectsById);
router.post('/section', subject.getSubjectsbyClassSection);
router.post('/sections', subject.getSubjectsbyClassSections);
router.post('/allocation',subject.saveSchoolClassSubjects);
router.put('/allocation/:id', subject.updateSchoolClassSubjects);
router.delete('/allocation/:id', subject.deleteSchoolClassSubjects);

module.exports = router;