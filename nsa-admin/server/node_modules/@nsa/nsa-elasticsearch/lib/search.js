
/**
 * Created by senthil on 03/02/17.
 */
'use strict';

var client = require('./es/es.config');
var userConverter = require('./converters/user.converter');
var permission = require('./commons/permissions');
var calObjConverter = require('./converters/calendar.converter');
var assignmentDetailsConverter = require('./converters/assignment.converter');

var search = function f(options) {
    var self = this;
};

search.getUserById = function(searchParams, callback) {
    client.getMaster.get(searchParams, function (error, response, status) {
        callback(error, response, status);
    });
};

search.searchUsers = function(searchParams, callback) {
    client.getMaster.search(searchParams, function (error, response, status) {
        callback(error, response, status);
    });
};

search.searchParents = function(req , searchParams, callback) {
    client.getMaster.search(searchParams, function (error, response, status) {
        callback(error, userConverter.convertParents(req, response), status);
    });
};

search.getUsersByQuery = function(searchParams, callback) {
    client.getMaster.search(searchParams, function (error, response, status) {
        callback(error, userConverter.convertUsers(response), status);
    });
};

search.getESUsersByQuery = function(searchParams, callback) {
    client.getMaster.search(searchParams, function (error, response, status) {
        callback(error, userConverter.convertUsersObj(response), status);
    });
};

search.getUsersByMQuery = function(searchParams, callback) {
    client.getMaster.mget(searchParams, function (error, response, status) {
        callback(error, userConverter.convertUserData(response), status);
    });
};

search.getUsersByScroll= function(searchParams,  callback) {
    var allRecords = [];
    client.getMaster.search(searchParams, function getMoreUntilDone(error, response) {
            response.hits.hits.forEach(function (hit) {
                allRecords.push(hit);
            });
            if (response.hits.total !== allRecords.length) {
                client.getMaster.scroll({
                    scrollId: response._scroll_id,
                    scroll: '1m'
                }, getMoreUntilDone);
            } else {
                callback(null, allRecords);
            }
        });
};





search.searchDoc = function(req, searchParams, permissions, callback) {
    client.getMaster.search(searchParams, function (error, response, status) {
        callback(error,  permission.updateDateAndPermission(req, permissions, response), status);
    });
};

search.searchAssignments = function(req, searchParams, callback) {
    client.getMaster.search(searchParams, function (error, response, status) {
        callback(error,  assignmentDetailsConverter.assignmentObjs(req, response), status);
    });
};

search.searchAssignmentDetails = function(req, searchParams, callback) {
    client.getMaster.search(searchParams, function (error, response, status) {
        callback(error,  assignmentDetailsConverter.assignmentDetailObjs(req, response), status);
    });
};

search.getPermissionsUsersByQuery = function(req, data, callback) {
    client.getMaster.search(data.searchParams, function (error, response, status) {
        callback(error, userConverter.convertPermissionUsers(req, data.permissions, response), status);
    });
};

search.getUsersSuggestions = function(searchParams, callback) {
    client.getMaster.search(searchParams, function (error, response, status) {
        callback(error, userConverter.convertSuggestUsers(response), status);
    });
};

search.getStudentSuggestions = function(searchParams, callback) {
    client.getMaster.search(searchParams, function (error, response, status) {
        callback(error, userConverter.convertSuggestStudents(response), status);
    });
};


search.getCalendarObjs = function(searchParams, callback) {
    client.getMaster.search(searchParams, function (error, response, status) {
        callback(error, calObjConverter.convertCalObj(response), status);
    });
};

module.exports = search;
