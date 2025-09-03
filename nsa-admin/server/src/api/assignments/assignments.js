/**
 * Created by Kiranmai A on 3/3/2017.
 */

var express = require('express'),
    router = express.Router(),
    assignmentTypes = require('../../services/assignments/assignmentTypes.service.js'),
    assignments = require('../../services/assignments/assignments.service.js');

router.get('/details/subjects/update', assignments.updateSubjects); //for updating subjects(map) field for the implementation of multi select

router.get('/types', assignmentTypes.getAssignmentTypes);
router.get('/type/:id', assignmentTypes.getAssignmentType);
router.put('/type/:id', assignmentTypes.updateAssignmentType);
router.post('/type', assignmentTypes.saveAssignmentType);
router.delete('/type/:id', assignmentTypes.deleteAssignmentType);

router.get('/', assignments.getAllAssignments);
router.get('/user/:id', assignments.getAssignmentListsByUser);
router.get('/:id', assignments.getAssignment);
router.post('/', assignments.saveAssignment);
router.put('/:id', assignments.updateAssignment);
router.put('/attachments/:id', assignments.updateAttachments);
router.delete('/:id', assignments.deleteAssignment);

router.get('/details/:id', assignments.getDetailsByAssignmentId);
router.put('/details/status/:id', assignments.updateAssignmentDetailsStatus);
router.post('/details', assignments.getAssignmentLists);
router.get('/user/details/:id', assignments.getAssignmentAssignedUsers);

router.get('/month/year', assignments.getAssignmentsByMonthOfYear);  //assignments assigned to student
router.get('/week/year', assignments.getAssignmentsByWeekOfYear);  //assignments assigned to student
router.get('/emp/week/year', assignments.getEmpAssignmentsByWeekOfYear); //created assignments by emp

router.delete('/attachments/:id', assignments.deleteAttachments); //delete attachments

//For IOS Start
router.put('/user/log/:id',  assignments.updateUserAssignmentDetails);  //for updating deactivated field for the implementation of delete
router.put('/user/read/:id',  assignments.updateUserReadStatus);  //for updating is_read field for the implementation of read and unread
router.get('/overview/:id',  assignments.getAssigmentsOverview); //for assignment list with today and total and subject count
router.get('/user/week/year', assignments.getAssignmentsByWeekOfYearIos);//assignments assigned to student
router.get('/employee/week/year', assignments.getEmpAssignmentsByWeekOfYearIos);//weekly Assignment Created by Employees
router.get('/overview/count/:id',  assignments.getAssigmentsOverviewCount); //for assignment today and total and subject count without data
//For IOS End
module.exports = router;