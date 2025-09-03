/**
 * Created by Karthik on 30-01-2017.
 */
var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    _ = require('lodash'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger'),
    nsaElasticSearch = require('@nsa/nsa-elasticsearch');

exports.getStudentJson = function(req, res) {
    async.parallel({
            classes : getClasses.bind(null, req),
            sections : getSections.bind(null, req),
            languages : getLanguages.bind(null, req),
            user: getUsers.bind(null, req),
            userClassification : getUserClassification.bind(null, req),
        }, function (err, data) {
            if(err) {
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
            } else {
                async.waterfall([
                    getUserContactInfo.bind(null, req, data),
                    buildStudentObj.bind()
                ], function (err1, result) {
                    if(err1) {
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa601));
                    } else {
                        events.emit('JsonResponse', req, res, result);
                    }
                })
            }
        }
    );
};

function getUsers(req, callback) {
    nsaCassandra.User.getAllUsers(req, function(err, data) {
        callback(err, data);
    })
};
exports.getUsers = getUsers;

function getUserClassification(req, callback) {
    nsaCassandra.User.getUserClassification(req, function(err, data) {
        callback(err, data);
    })
};
exports.getUserClassification = getUserClassification;

function getUserContactInfo(req, data, callback) {
    data.userIds = _.map(data.user, 'user_name');
    nsaCassandra.User.getUsersContactInfo(req, data, function(err, result) {
        data.userContactInfo = result;
        callback(err, req, data);
    })
};
exports.getUserContactInfo = getUserContactInfo;

function buildStudentObj(req, data, callback) {
    nsaCassandra.UserJson.buildStudentObj(req, data, function(err, result) {
        callback(err, result);
    });
};
exports.buildStudentObj = buildStudentObj;

function getClasses(req, callback) {
    nsaCassandra.Classes.getAllClasses(req, function(err, result) {
        callback(err, result);
    });
};
exports.getClasses = getClasses;

function getSections(req, callback) {
    nsaCassandra.Section.getAllSections(req, function (err, result) {
        callback(err, result);
    });
};
exports.getSections = getSections;

function getLanguages(req, callback) {
    nsaCassandra.Languages.getSchoolLanguages(req, function (err, result) {
        callback(err, result);
    });
};
exports.getLanguages = getLanguages;

function getSubjects(req, callback) {
    nsaCassandra.Subject.getSchoolSubjects(req, function (err, result) {
        callback(err, result);
    });
};
exports.getSubjects = getSubjects;

function getDepartment(req, callback) {
    nsaCassandra.Department.getAllDepartments(req, function (err, result) {
        callback(err, result);
    });
};
exports.getDepartment = getDepartment;

function getDesignation(req, callback) {
    nsaCassandra.Designation.getAllDesignations(req, function (err, result) {
        callback(err, result);
    });
};
exports.getDesignation = getDesignation;

exports.getEmployeeJson = function(req, res) {
    async.parallel({
            classes : getClasses.bind(null, req),
            sections : getSections.bind(null, req),
            subjects : getSubjects.bind(null, req),
            dept : getDepartment.bind(null, req),
            desg : getDesignation.bind(null, req),
            user: getUsers.bind(null, req),
            employeeClassification : getAllEmployees.bind(null, req)
        }, function (err, data) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
        } else {
            buildEmployeeObj(req, data, function(err, result){
                if(err) {
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            });
        }
        }
    );
};

function buildEmployeeObj(req, data, callback) {
    nsaCassandra.UserJson.buildEmployeeObj(req, data, function(err, result) {
        callback(err, result);
    });
};
exports.buildEmployeeObj = buildEmployeeObj;

function getAllEmployees(req, callback) {
    nsaCassandra.User.getAllEmployees(req, function(err, data) {
        callback(err, data);
    })
};
exports.getAllEmployees = getAllEmployees;


exports.buildEventsCalendarJson = function(req, res) {
    async.waterfall([
        findCalendarData.bind(null, req),
        buildCalendarJson.bind()
    ], function (err, data) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, err);
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};

function findCalendarData(req, callback) {
    nsaCassandra.Events.getCalendarData(req, function (err, result) {
        callback(err, req, result);
    })
};

function buildCalendarJson(req, data, callback) {
    nsaCassandra.UserJson.buildCalendarJson(req, data, function (err, result) {
        callback(err, result);
    })
};

exports.updateAssessmentDetails = function(req, res) {
    nsaCassandra.Marks.getAllMarkListDetails(req, function (err, result) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
        } else {
            buildAssessmentObjs(req, result, function(err, bulkParams){
                if(err) {
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
                } else {
                    nsaElasticSearch.index.bulkDoc({body: bulkParams}, function (err, result) {
                        if(err) {
                            logger.debug(err);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
                        } else {
                            events.emit('JsonResponse', req, res, result);
                        }
                    })
                }
            });
        }
    });
};

exports.updateNotifications = function(req, res) {
    nsaCassandra.Notification.getNotifications(req, function (err, result) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
        } else {
            buildNotificationObjs(req, result, function(err, bulkParams){
                if(err) {
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
                } else {
                    var array = _.chunk(bulkParams, constant.ES_CHUNK_SIZE);
                    async.times(array.length, function(i, next) {
                        var objs = array[i];
                        updateBulkObjs(objs, function(err, data) {
                            next(err, data);
                        });
                    }, function(err, objs) {
                        if(err) {
                            logger.debug(err);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
                        } else {
                            events.emit('JsonResponse', req, res, objs);
                        }
                    });
                }
            });
        }
    });
};

exports.updateAssignments = function(req, res) {
    nsaCassandra.Assignments.getAssignments(req, function (err, result) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
        } else {
            buildAssignmentObjs(req, result, function(err, bulkParams){
                if(err) {
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
                } else {
                    var array = _.chunk(bulkParams, constant.ES_CHUNK_SIZE);
                    async.times(array.length, function(i, next) {
                        var objs = array[i];
                        updateBulkObjs(objs, function(err, data) {
                            next(err, data);
                        });
                    }, function(err, objs) {
                        if(err) {
                            logger.debug(err);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
                        } else {
                            events.emit('JsonResponse', req, res, objs);
                        }
                    });
                }
            });
        }
    });
};

function buildAssignmentObjs(req, data, callback) {
    nsaCassandra.UserJson.buildAssignmentObjs(req, data, function(err, result) {
        callback(err, result);
    });
};
exports.buildAssignmentObjs = buildAssignmentObjs;

exports.updateNotificationDetails = function(req, res) {
    nsaCassandra.Notification.nsa.school_notifications(req, function (err, result) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
        } else {
            buildNotificationDetailObjs(req, result, function(err, objs){
                if(err) {
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
                } else {
                    var array = _.chunk(objs, constant.ES_CHUNK_SIZE);
                    async.times(array.length, function(i, next) {
                        var objs = array[i];
                        updateBulkObjs(objs, function(err, data) {
                            next(err, data);
                        });
                    }, function(err, objs) {
                        if(err) {
                            logger.debug(err);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
                        } else {
                            events.emit('JsonResponse', req, res, objs);
                        }
                    });
                }
            });
        }
    });
};

exports.updateAssignmentDetails = function(req, res) {
    nsaCassandra.Assignments.getAssignmentDetails(req, function (err, result) {
        if(err) {
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
        } else {
            buildAssignmentDetailObjs(req, result, function(err, objs){
                if(err) {
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
                } else {
                    var array = _.chunk(objs, constant.ES_CHUNK_SIZE);
                    async.times(array.length, function(i, next) {
                        var objs = array[i];
                        updateBulkObjs(objs, function(err, data) {
                            next(err, data);
                        });
                    }, function(err, objs) {
                        if(err) {
                            logger.debug(err);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa601));
                        } else {
                            events.emit('JsonResponse', req, res, objs);
                        }
                    });
                }
            });
        }
    });
};

function buildAssignmentDetailObjs(req, data, callback) {
    nsaCassandra.UserJson.buildAssignmentDetailObjs(req, data, function(err, result) {
        callback(err, result);
    });
};

function updateBulkObjs(bulkParams, callback) {
    nsaElasticSearch.index.bulkDoc({body: bulkParams}, function (err, result) {
        callback(err, result);
    });
};

function buildNotificationDetailObjs(req, data, callback) {
    nsaCassandra.UserJson.buildNotificationDetailObjs(req, data, function(err, result) {
        callback(err, result);
    });
};
exports.buildNotificationDetailObjs = buildNotificationDetailObjs;

function buildNotificationObjs(req, data, callback) {
    nsaCassandra.UserJson.buildNotificationObjs(req, data, function(err, result) {
        callback(err, result);
    });
};
exports.buildNotificationObjs = buildNotificationObjs;

function buildAssessmentObjs(req, data, callback) {
    nsaCassandra.UserJson.buildAssessmentObjs(req, data, function(err, result) {
        callback(err, result);
    });
};
exports.buildAssessmentObjs = buildAssessmentObjs;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.USER_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};

function throwUserErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.USER_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwUserErr = throwUserErr;
