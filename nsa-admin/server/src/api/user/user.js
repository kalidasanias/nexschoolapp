/**
 * Created by karthik on 05-01-2017.
 */

var express = require('express')
            , router = express.Router()
            , user = require('../../services/user/user.service.js')
            , userDetails = require('../../services/user/createJson.service.js');

router.get('/:id', user.getUserDetail);
router.post('/', user.saveUser);
router.put('/', user.updateUser);
router.put('/siblings', user.updateSiblings);
router.get('/student/create/json', userDetails.getStudentJson);
router.get('/employee/create/json', userDetails.getEmployeeJson);
router.get('/assessment/update', userDetails.updateAssessmentDetails);
router.get('/notifications/update', userDetails.updateNotifications);
router.get('/notifications/details/update', userDetails.updateNotificationDetails);
router.get('/assignments/update', userDetails.updateAssignments);
router.get('/assignments/details/update', userDetails.updateAssignmentDetails);
router.get('/contact/details', user.getUserContactDetails);
router.put('/contact/details', user.updateUserContactDetails);

router.get('/users/all', user.getAllUsers);
router.get('/users/classification', user.getUserClassification);
router.get('/employees/details', user.getAllEmployees);

router.put('/attachments/:id', user.updateUserAttachments);
router.delete('/attachments/:id', user.deleteUserAttachments);

router.get('/calendar/events/json/', userDetails.buildEventsCalendarJson);

module.exports = router;