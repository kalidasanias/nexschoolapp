/**
 * Created by kiranmai on 7/11/17.
 */


var express = require('express')
    , router = express.Router()
    , marks = require('../../services/marks/marks.service');

router.get('/details/:id/:classId/:sectionId', marks.getMarkSheet);
router.get('/generate/:id/:classId/:sectionId', marks.generateMarkSheet);
router.post('/uploadsheet/:id/:classId/:sectionId', marks.uploadMarkSheet);
router.get('/:id/:classId/:sectionId', marks.getMarkSheetByClassAndSec);
router.get('/list', marks.getMarklist);
router.get('/list/:id', marks.getMarklistDetailsById);
router.post('/upload', marks.saveUploadedMarks);
router.put('/update/:id', marks.updateMarks);
router.put('/publish/:id', marks.publishUploadedMarks);
router.put('/upload', marks.updateUploadedMarks);
router.delete('/list/:id', marks.deleteMarklist);
router.get('/user/details/:id/:examScheduleId', marks.getUserMarksDetails); //get student marks list details for published marks sheet

router.get('/statistics/:id', marks.getMarksStatistics);
router.get('/ranks/:id', marks.getRankDetails);
router.get('/grade/sub/:id/:subId', marks.getGradeStatsBySub);
router.get('/ranks/sub/:id/:subId', marks.getRankDetailsBySub);
router.post('/print/:id/:classId/:sectionId', marks.getPrintProgressCardReport);

module.exports = router;