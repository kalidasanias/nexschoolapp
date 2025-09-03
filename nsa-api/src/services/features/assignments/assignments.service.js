var fs = require('fs')
    , rem = require('../../../lib/events');

//const cassandra = require('cassandra-driver');

const allAssignmentsJson = require('../../../test/json-data/features/assignments/get-all-assignments.json');
const assignmentJson = require('../../../test/json-data/features/assignments/get-assignment.json');
const assignmentStatusJson = require('../../../test/json-data/features/assignments/get-assignment-status.json');

const assignmentUserCommentsJson = require('../../../test/json-data/features/assignments/get-assignment-user-comments.json');
const assignmentCommentsJson = require('../../../test/json-data/features/assignments/get-assignment-comments.json');
const createAssignmentJson = require('../../../test/json-data/features/assignments/create-assignment.json');
const editAssignmentJson = require('../../../test/json-data/features/assignments/edit-assignment.json');
const deleteAssignmentJson = require('../../../test/json-data/features/assignments/delete-assignment.json');


//Get All Assignments
exports.getAllAssignments = function(req, res) {
    console.info("getAllAssignments");
    rem.emit('JsonResponse', req, res, allAssignmentsJson);
};

exports.getAssignment = function (req, res) {
    console.info("getAssignment = ", req.params.id);
    rem.emit('JsonResponse', req, res, assignmentJson);
};

exports.getAssignmentStatus = function (req, res) {
    console.info("getAssignmentStatus = ", req.params.id);
    rem.emit('JsonResponse', req, res, assignmentStatusJson);
};

exports.getUserComments = function (req, res) {
    console.info("getUserComments");
    console.info("UserId = ", req.params.userId);
    console.info("Id = ", req.params.id);
    rem.emit('JsonResponse', req, res, assignmentUserCommentsJson);
}

exports.getAssignmentComments = function (req, res) {
    console.info("getAssignmentComments = ", req.params.id);
    rem.emit('JsonResponse', req, res, assignmentCommentsJson);
}

exports.createAssignment = function (req, res) {
    console.info("createAssignment = ", req.body);
    rem.emit('JsonResponse', req, res, createAssignmentJson);
}

exports.editAssignment = function (req, res) {
    console.info("editAssignment = ", req.body);
    rem.emit('JsonResponse', req, res, editAssignmentJson);
}

exports.deleteAssignment = function (req, res) {
    console.info("deleteAssignment = ", req.body);
    rem.emit('JsonResponse', req, res, deleteAssignmentJson);
}
