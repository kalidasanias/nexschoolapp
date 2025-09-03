/**
 * Created by senthil on 08/02/17.
 */

var express = require('express')
    , router = express.Router()
    , commons = require('@nsa/nsa-commons')
    , nsaElasticSearch = require('@nsa/nsa-elasticsearch')
    , nsabb = require('@nsa/nsa-bodybuilder').builderutil
    , nsacu = require('@nsa/nsa-bodybuilder').calendarUtil
    , nsaau = require('@nsa/nsa-bodybuilder').assessmentUtil
    , nsanu = require('@nsa/nsa-bodybuilder').notificationUtil
    , nsaasu = require('@nsa/nsa-bodybuilder').assignmentUtil
    , events = require('@nsa/nsa-commons').events
    , async = require('async')
    , _ = require('lodash')
    , logger = require('../../../../config/logger')
    , nsaCassandra = require('@nsa/nsa-cassandra');

exports.getUserIndex = function(req, res) {
    async.waterfall(
        [
            indexExists.bind(null, req),
            deleteIndex.bind(),
            createIndexWithMappings.bind()
        ],
        function (err,  data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, err);
            } else {
                events.emit('JsonResponse', req, res, data);
            }
        }
    );
};

exports.getCalendarIndex = function(req, res) {
    async.waterfall(
        [
            calendarIndexExists.bind(null, req),
            deleteCalendarIndex.bind(),
            createCalendarIndexMappings.bind()
        ],
        function (err,  data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, err);
            } else {
                events.emit('JsonResponse', req, res, data);
            }
        }
    );
};

exports.getAssessmentIndex = function(req, res) {
    async.waterfall(
        [
            assessmentIndexExists.bind(null, req),
            deleteAssessmentIndex.bind(),
            createAssessmentIndexMappings.bind()
        ],
        function (err,  data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, err);
            } else {
                events.emit('JsonResponse', req, res, data);
            }
        }
    );
};

exports.getNotificationIndex = function(req, res) {
    async.waterfall(
        [
            notificationIndexExists.bind(null, req),
            deleteNotificationIndex.bind(),
            createNotificationIndexMappings.bind()
        ],
        function (err,  data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, err);
            } else {
                events.emit('JsonResponse', req, res, data);
            }
        }
    );
};

exports.getAssignmentIndex = function(req, res) {
    async.waterfall(
        [
            assignmentIndexExists.bind(null, req),
            deleteAssignmentIndex.bind(),
            createAssignmentIndexMappings.bind()
        ],
        function (err,  data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, err);
            } else {
                events.emit('JsonResponse', req, res, data);
            }
        }
    );
};

function assignmentIndexExists(req, callback) {
    var params = nsaasu.constructAssignmentsIndex(req);
    nsaElasticSearch.index.indexExists(params, function(err, result) {
        callback(null, req, result);
    })
};
exports.assignmentIndexExists = assignmentIndexExists;


function deleteAssignmentIndex(req, result, callback) {
    var params = nsaasu.constructAssignmentsIndex(req);
    if(result) {
        nsaElasticSearch.delete.delete(params, function(err, data) {
            callback(null, req);
        })
    } else {
        callback(null, req);
    }
};
exports.deleteAssignmentIndex = deleteAssignmentIndex;

function createAssignmentIndexMappings(req, callback) {
    var params = nsaasu.createAssignmentIndexWithMappings(req);
    nsaElasticSearch.index.createIndex(params, function(err, data) {
        callback(null, data);
    })
};
exports.createAssignmentIndexMappings = createAssignmentIndexMappings;

function notificationIndexExists(req, callback) {
    var params = nsanu.constructNotificationsIndex(req);
    nsaElasticSearch.index.indexExists(params, function(err, result) {
        callback(null, req, result);
    })
};
exports.notificationIndexExists = notificationIndexExists;


function deleteNotificationIndex(req, result, callback) {
    var params = nsanu.constructNotificationsIndex(req);
    if(result) {
        nsaElasticSearch.delete.delete(params, function(err, data) {
            callback(null, req);
        })
    } else {
        callback(null, req);
    }
};
exports.deleteNotificationIndex = deleteNotificationIndex;

function createNotificationIndexMappings(req, callback) {
    var params = nsanu.createNotificationsIndexWithMappings(req);
    nsaElasticSearch.index.createIndex(params, function(err, data) {
        callback(null, data);
    })
};
exports.createNotificationIndexMappings = createNotificationIndexMappings;

function assessmentIndexExists(req, callback) {
    var params = nsaau.constructAssessmentIndex(req);
    nsaElasticSearch.index.indexExists(params, function(err, result) {
        callback(null, req, result);
    })
};
exports.assessmentIndexExists = assessmentIndexExists;

function deleteAssessmentIndex(req, result, callback) {
    var params = nsaau.constructAssessmentIndex(req);
    if(result) {
        nsaElasticSearch.delete.delete(params, function(err, data) {
            callback(null, req);
        })
    } else {
        callback(null, req);
    }
};
exports.deleteAssessmentIndex = deleteAssessmentIndex;

function createAssessmentIndexMappings(req, callback) {
    var params = nsaau.createAssessmentIndexWithMappings(req);
    nsaElasticSearch.index.createIndex(params, function(err, data) {
        callback(null, data);
    })
};
exports.createAssessmentIndexMappings = createAssessmentIndexMappings;

function calendarIndexExists(req, callback) {
    var params = nsacu.constructCalendarIndex(req);
    nsaElasticSearch.index.indexExists(params, function(err, result) {
        callback(null, req, result);
    })
};
exports.calendarIndexExists = calendarIndexExists;

function deleteCalendarIndex(req, result, callback) {
    var params = nsacu.constructCalendarIndex(req);
    if(result) {
        nsaElasticSearch.delete.delete(params, function(err, data) {
            callback(null, req);
        })
    } else {
        callback(null, req);
    }
};
exports.deleteCalendarIndex = deleteCalendarIndex;

function createCalendarIndexMappings(req, callback) {
    var params = nsacu.constructMappings(req);
    nsaElasticSearch.index.createIndex(params, function(err, data) {
        callback(null, data);
    })
};
exports.createCalendarIndexMappings = createCalendarIndexMappings;

function indexExists(req, callback) {
    var params = nsabb.constructIndex(req);
    nsaElasticSearch.index.indexExists(params, function(err, result) {
        callback(null, req, result);
    })
};
exports.indexExists = indexExists;

function deleteIndex(req, result, callback) {
    var params = nsabb.constructIndex(req);
    if(result) {
        nsaElasticSearch.delete.delete(params, function(err, data) {
            callback(null, req);
        })
    } else {
        callback(null, req);
    }
};
exports.deleteIndex = deleteIndex;

function createIndexWithMappings(req, callback) {
    var params = nsabb.createIndexWithMappings(req);
    nsaElasticSearch.index.createIndex(params, function(err, data) {
        callback(err, data);
    })
};
exports.createIndexWithMappings = createIndexWithMappings;

exports.getUserByUserName = function(req, res) {
    var searchParams = nsabb.getUserSearchQueryParam(req);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        if (err) {
            logger.debug(err);
            events.emit('JsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.getUserObj = function(req, data, callback) {
    var params = {size: commons.constants.DEFAULT_PARAM_SIZE, userName: data.empUserName};
    var searchParams = nsabb.getUserByUserNameQuery(req, params);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, result, status) {
        callback(err, result);
    })
};

exports.getUsersByUniqueIds = function (req, data, callback) {
    var searchParams = nsabb.getUsersByUniqueIdsQuery(req, data);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, result, status) {
        callback(err, result);
    })
};

exports.getUsersByLists = function(req, data, callback) {
    var searchParams = nsabb.getUsersByListsQuery(req, data);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, result, status) {
       callback(err, result);
    })
};

exports.getStudents = function(req, res) {
    var searchParams = nsabb.getStudentSearchQueryParam(req);
    nsaElasticSearch.search.searchUsers(searchParams, function (err, data, status) {
        if (err) {
            logger.debug(err);
            events.emit('JsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.getActiveEmployees = function(req, callback) {
    var searchParams = nsabb.getActiveEmployeesParam(req);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        callback(err, data);
    })
};

exports.getUsersByType = function(req, callback) {
    var searchParams = nsabb.getEmpTypeQueryParam(req);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        callback(err, data);
    })
};

exports.getStudentsByClass = function(req, res) {
    var searchParams = nsabb.getStudentsByClassQueryParam(req, res);
    nsaElasticSearch.search.searchUsers(searchParams, function (err, data, status) {
        if (err) {
            logger.debug(err);
            events.emit('JsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.getUsersByClassSection = function(req, callback) {
    var searchParams = nsabb.getStudentsClassSectionQueryParam(req);
    nsaElasticSearch.search.searchUsers(searchParams, function (err, data, status) {
        callback(err, data);
     })
};

exports.getUsersByClassSec = function(req, params, callback) {
    var searchParams = nsabb.getStudentsByClassSectionQuery(req, params);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        callback(err, data);
    })
};

exports.getUsersByClassSections = function(req, callback) {
    var searchParams = nsabb.getUsersByClassSectionsQueryParam(req);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        callback(err, data);
    })
};

exports.getUsersByClassAndSections = function(req, res) {
    var searchParams = nsabb.getUsersByClassSectionsQueryParam(req);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        if (err) {
            logger.debug(err);
            events.emit('JsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.getUsersByLanguages = function(req, callback) {
    var searchParams = nsabb.getUsersByLanguagesQueryParam(req);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        callback(err, data);
    })
};

exports.updateStudent = function(req, data, callback) {
    var updateParams = nsabb.updateStudentQueryParam(req, data);
    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

exports.updateSiblings = function(req, data, callback) {
    var updateParams = nsabb.updateSiblingsQueryParam(req, data);
    nsaElasticSearch.index.bulkDoc(updateParams, function (err, result) {
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

exports.updateEmployee = function(req, data, callback) {
    var updateParams = nsabb.updateEmpQueryParam(req, data);
    
    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

exports.updateStudentObj = function(req, data, callback) {
    var updateParams = nsabb.updateStudentQuery(data);
    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
        callback(err, data);
    })
};

exports.updateEmpObj = function(req, data, callback) {
    var updateParams = nsabb.updateEmpQuery(data);
    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
        callback(err, data);
    })
};

exports.getAllStudents = function (req, callback) {
    getEsStudents(req, function (err, data) {
        callback(err, data)
    });
};

exports.getActiveStudents = function (req, callback) {
    getEsActiveStudents(req, function (err, data) {
        callback(err, data)
    });
};

exports.getEsAllStudents = function(req, res) {
    getEsStudents(req, function (err, data) {
        if (err) {
            logger.debug(err);
            events.emit('JsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.getAllEmployees = function (req, callback) {
    var searchParams = nsabb.getEmpSearchQueryParam(req);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        callback(err, data)
    })
};

function getEsStudents(req, callback) {
    var searchParams = nsabb.getStudentSearchQueryParam(req);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        callback(err, data)
    })
};

function getEsActiveStudents(req, callback) {
    var searchParams = nsabb.getActiveStudentsParam(req);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        callback(err, data)
    })
};

exports.getSuggestions = function(req, res) {
    var input = req.params.input;
    var searchParams = nsabb.getSuggestions(req, input);
    nsaElasticSearch.search.getUsersSuggestions(searchParams, function (err, data, status) {
        if (err) {
            logger.debug(err);
            events.emit('JsonResponse', req, res, err);
        } else {

            var suggestions = _.filter(data, { schoolId: req.headers.userInfo.school_id, academicYear: req.headers.academicyear, active: true, userType: commons.constants.STUDENT});
            events.emit('JsonResponse', req, res, suggestions);
        }
    })
};

exports.getSuggestionsWithStudentInfo = function(req, res) {
    var input = req.params.input;
    var searchParams = nsabb.getSuggestions(req, input);
    nsaElasticSearch.search.getStudentSuggestions(searchParams, function (err, data, status) {
        if (err) {
            logger.debug(err);
            events.emit('JsonResponse', req, res, err);
        } else {
            var suggestions = _.filter(data, { schoolId: req.headers.userInfo.school_id, academicYear: req.headers.academicyear, active: true, userType: commons.constants.STUDENT});
            events.emit('JsonResponse', req, res, suggestions);
        }
    })
};

exports.saveVehicleDetails = function(req, res) {
        var doc = {
        route_name: "1",
        stops: [
            {
                location: "Breeze, 8, Gangaiamman Nagar, Jayalalitha Nagar, Chennai, Tamil Nadu 600037, India",
                geopoints: {
                    lat: 13.074010848999023,
                    lon: 80.19068145751953
                },
                radius: 1200,
                user_name: ["123221102S"]
            },
            {
                location: "65/4, Poonamallee High Rd, Mettukulam, Sathya Sai Nagar, Koyambedu, Chennai, Tamil Nadu 600107, India",
                geopoints: {
                    lat: 13.07468032836914,
                    lon: 80.17420196533203
                },
                radius: 1200,
                user_name: ["20223102S"]
            },
            {
                location: "16, Chennai - Villupuram - Trichy - Kanyakumari Rd, Amaravathi Nagar, Arumbakkam, Chennai, Tamil Nadu 600106, India",
                geopoints: {
                    lat: 13.07685375213623,
                    lon: 80.20603942871094
                },
                radius: 1200,
                user_name: ["demo2"]
            }
        ],
        vehicle_no: "TN14E1869"
    };
    var inputDoc = nsabb.buildVehicleDoc(doc);
    nsaElasticSearch.index.indexDoc(inputDoc, function (err, data, status) {
        if (err) {
            logger.debug(err);
            events.emit('JsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.createVehicleDetails = function(doc, callback) {
    var inputDoc = nsabb.buildVehicleDoc(doc);
    nsaElasticSearch.index.indexDoc(inputDoc, function (err, data, status) {
        callback(err, data);
    })
};

exports.getEsVehilces = function(reg, callback) {
    var searchParams = nsabb.getVehiclesQuery(reg);
    nsaElasticSearch.search.searchUsers(searchParams, function (err, data, status) {
        callback(err, data);
    })
};

exports.updateEsVehicle = function (stops, id, callback) {
    var updateParams = nsabb.updateVehicleQueryParam(stops, id);
    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

exports.getUsersByRole = function(req, callback) {
    var searchParams = nsabb.getUsersByRoleQuery(req);
    nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, data, status) {
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, data);
        }
    })
};


exports.updateEmpsRoles = function(req, data, rolesObj, callback) {
    var bulkParams = nsabb.updateEmpsRolesQueryParam(req, data, rolesObj);
    nsaElasticSearch.index.bulkDoc(bulkParams, function (err, result) {
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

exports.delEmpsRoles = function(req, data, rolesObj, callback) {
    var bulkParams = nsabb.updateEmpsRolesQueryParam(req, data, rolesObj);
    nsaElasticSearch.index.bulkDoc(bulkParams, function (err, result) {
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

exports.updateEmpRoles = function(req, rolesObj, callback) {
    var bulkParams = nsabb.updateEmpRolesQueryParam(req, rolesObj);
    nsaElasticSearch.index.bulkDoc(bulkParams, function (err, result) {
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

exports.getTotalMarksStatistics = function (req, data, callback) {
    var searchParams = nsaau.getMarksStatisticsQueryParam(req, data);
    nsaElasticSearch.search.searchUsers(searchParams, function (err, result, status) {
        callback(err, result);
    })
};

exports.getRankDetailObjs = function (req, callback) {
    var grade = req.query.grade;
    var params = {};
    if(grade != null && !(_.isEmpty(grade))) {
        var split = grade.split('-');
        params = {startRange: split[0], endRange: split[1]};
    }
    var searchParams = nsaau.getRankDetailQueryParam(req, params);
    nsaElasticSearch.search.searchUsers(searchParams, function (err, result, status) {
        callback(err, result);
    })
};

exports.getMarksStatisticsBySub = function (req, callback) {
    var searchParams = nsaau.getMarksStatsBySubQueryParam(req);
    nsaElasticSearch.search.searchUsers(searchParams, function (err, result, status) {
        callback(err, result);
    })
};

exports.getRankDetailBySubObjs = function (req, callback) {
    var searchParams = nsaau.getRankDetailBySubQueryParam(req);
    nsaElasticSearch.search.searchUsers(searchParams, function (err, result, status) {
        callback(err, result);
    })
};

exports.getMarksDeleteQuery = function (req, ids, callback) {
    var bulkParams = nsaau.buildMarksDeleteQueryParams(req, ids);
    nsaElasticSearch.index.bulkDoc(bulkParams, function (err, result) {
        callback(err, result);
    })
};

exports.updateDeactiveStatusInES = function (req, callback) {
    var updateParams = nsanu.deactiveStatusUpdateQuery(req);
    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
        callback(err, result);
    })
};

exports.updateAssignmentDetailsStatusInES = function (req, callback) {
    var updateValues = nsaCassandra.Base.assignmentbase.assignmentDetailUpdateValues(req);
    var updateParams = nsaasu.updateAssignmentDetailsStatusQuery(req, updateValues);
    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
        callback(err, result);
    })
};

exports.updateBulkObjs = function(bulkParams, callback) {
    nsaElasticSearch.index.bulkDoc({body: bulkParams}, function (err, result) {
        callback(err, result);
    });
};

exports.assignmentDeleteQuery = function(req, callback) {
    callback(null, nsaasu.assignmentDeleteQuery(req));
};

exports.assignmentDetailsDeleteQuery = function(req, data, callback) {
    if(data != null && !_.isEmpty(data)) {
        callback(null, nsaasu.assignmentDetailsDeleteQuery(req, data));
    } else {
        callback(null, []);
    }
};

exports.attachmentsUpdateQuery = function(req, data, callback) {
    callback(null, nsaasu.attachmentsUpdateQuery(req, data));
};

exports.attachmentsDetailsUpdateQuery = function(req, data, callback) {
    callback(null, nsaasu.attachmentsDetailsUpdateQuery(req, data));
};

exports.attachmentsNotifUpdateQuery = function(req, data, callback) {
    callback(null, nsanu.attachmentsUpdateQuery(req, data));
};

exports.attachmentsNotifDetailsUpdateQuery = function(req, data, callback) {
    callback(null, nsanu.attachmentsDetailsUpdateQuery(req, data));
};

exports.statusUpdateQuery = function(req, data, callback) {
    callback(null, nsanu.statusUpdateQuery(req, data));
};

//For IOS Start
exports.updateAssignmentDeactiveStatusInES = function (req, callback) {
    var updateParams = nsaasu.deactiveStatusUpdateQuery(req);
    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
        callback(err, result);
    })
};

exports.updateNotificationReadStatusInES = function (req, callback) {
    var updateParams = nsanu.readStatusUpdateQuery(req);
    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
        callback(err, result);
    })
};

exports.updateUserReadStatusInES = function (req, callback) {
    var updateParams = nsaasu.readStatusUpdateQuery(req);
    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
        callback(err, result);
    })
};

exports.getAssignmentSubCount = function (req, callback) {
    var searchParams = nsaasu.assignmentSubCountQuery(req);
    nsaElasticSearch.search.searchUsers(searchParams, function (err, result) {
        callback(err, result);
    })
};
//For IOS End
