/**
 * Created by magesh on 1/13/17.
 */

var express = require('express')
    , router = express.Router()
    , assignments = require('../../../services/features/assignments/assignments.service.js');

router.get('/', assignments.getAllAssignments);
router.get('/:id', assignments.getAssignment);
router.get('/status/:id', assignments.getAssignmentStatus);
router.get('/user/:userId/comments/:id', assignments.getUserComments);
router.get('/comments/:id', assignments.getAssignmentComments);
router.post('/', assignments.createAssignment);
router.put('/', assignments.editAssignment);
router.delete('/', assignments.deleteAssignment);

module.exports = router