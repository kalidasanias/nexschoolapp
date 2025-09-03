/**
 * Created by bharatkumarr on 20/03/17.
 */

var express = require('express')
    , router = express.Router()
    , user = require('../../services/user-mgmt/user.service')
    , validate = require('express-validation')
    , validation = require('@nsa/nsa-commons').validation;

router.get('/', user.getAllStudents);
router.get('/all', user.getAllStudentsWithPermissions);
router.get('/class/:classId/section/:sectionId', user.getUsersByClassSection);
router.get('/:id', user.getStudent);
router.post('/', user.saveStudent);
router.put('/:id', user.updateStudent);
router.put('/member/user/:id', user.findStudentInSchoolMembers);
router.delete('/:id', user.deleteStudent);
router.get('/report/:id', user.getStudentReport);
router.post('/report/', user.getStudentsReport);
router.post('/report/class', user.getClassStudentReport);

module.exports = router;