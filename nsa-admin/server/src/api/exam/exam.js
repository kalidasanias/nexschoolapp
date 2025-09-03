/**
 * Created by bharatkumarr on 02/07/17.
 */


var express = require('express')
    , router = express.Router()
    , examType = require('../../services/exam/exam.service');

router.get('/type/', examType.getAllExamTypes);
router.get('/type/:id', examType.getExamType);
router.post('/type/', examType.saveExamType);
router.put('/type/:id', examType.updateExamType);
router.delete('/type/:id', examType.deleteExamType);

router.get('/schedule/class/:classId/section/:sectionId', examType.getAllExamSchedulesByClassSec);
router.post('/schedule/type/:typeId/', examType.getExamScheduleByType);

router.get('/schedule/', examType.getAllExamSchedules);
router.get('/schedule/:id', examType.getExamSchedule);
router.post('/schedule/', examType.saveExamSchedule);
router.put('/schedule/:id', examType.updateExamSchedule);
router.delete('/schedule/:id', examType.deleteExamSchedule);

router.get('/portion/:id', examType.getPortionById);
router.delete('/attachemnet/:id', examType.deleteAttachments);

router.get('/schedule/details/:classId/:sectionId', examType.getExamScheduleByClassAndSec); //get scheduled exam details by class and section for marks upload filter

//For IOS Start
router.get('/details/schedule/:id', examType.getExamScheduleDetails); //For IOS Exam Schedule timeline we can get this method by reusing the getExamScheduleByClassAndSec method
//For IOS End
module.exports = router;
