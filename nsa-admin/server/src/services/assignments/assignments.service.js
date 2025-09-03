/**
 * Created by Kiranmai A on 3/3/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    taxanomyUtils = require('@nsa/nsa-commons').taxanomyUtils,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    dateUtils = require('@nsa/nsa-commons').dateUtils,
    notificationService = require('../sms/notifications/notification.service'),
    logger = require('../../../config/logger'),
    nsaau = require('@nsa/nsa-bodybuilder').assignmentUtil,
    nsaElasticSearch = require('@nsa/nsa-elasticsearch'),
    _ = require('lodash'),
    gallary = require('../../services/gallery/gallery.service'),
    es = require('../../services/search/elasticsearch/elasticsearch.service'),
    moment = require('moment');

/*exports.getAllAssignments = function(req, res) {
    nsaCassandra.Assignments.getAllAssignments(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};*/


exports.getAllAssignments = function(req, res) {
    try {
        var assignmentQuery, viewPermission, headers = nsaCassandra.BaseService.getHeaders(req);
        viewPermission = nsaCassandra.BaseService.checkPermissionsToQuery(req, constant.ASSIGNMENT_PERMISSIONS);

        if (req.query.search) {
            req.query.keyword = req.query.search['value'];
        }

        var sortParam = { key: constant.ES_UPDATED_DATE, order: constant.ES_ORDER_DSC };
        assignmentQuery = nsaau.getAssignmentQuery(req, headers, viewPermission, sortParam);
        nsaElasticSearch.search.searchAssignments(req, assignmentQuery, function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
            } else {
                events.emit('SearchResponse', req, res, result);
            }
        })
    } catch (cerr) {
        logger.debug(cerr);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(cerr, message.nsa1208));
    }
};


exports.getAssignmentListsByUser = function(req, res) {
    nsaCassandra.Assignments.getAssignmentListsByUser(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getAssignment = function (req, res) {
    nsaCassandra.Assignments.getAssignment(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveAssignment = function (req, res) {
    var data = [];
    async.waterfall([
            buildTaxanomyObj.bind(null, req, data),
            constructAssignmentObj.bind(),
            constructAssignmentDetailObj.bind(),
            insertAuditLog.bind(),
            executeBatch.bind()
        ], function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1210));
            } else {
                async.parallel({
                    assignmentObjs : updateAssignmentsInES.bind(null, req, result),
                    notificationObj : sendNotification.bind(null, req)
                }, function (err1, output) {
                    if(err1) {
                        logger.debug(err1);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa1210));
                    } else {
                        var data = {};
                        data['message'] = req.body.status ? message.nsa1209 : message.nsa1217;
                        data['assignment_id'] = result.assignment_id;
                        events.emit('JsonResponse', req, res, data);
                    }
                });
            }
        }
    );
};

function updateAssignmentsInES(req, data, callback) {
    var objs = data.esAssignmentsObj;
    var detailObjs = data.esAssignmentsDetailObj;
    var deleteObjs = data.result || null;
    async.parallel({
        assignmentObjs : nsaCassandra.UserJson.buildAssignmentObj.bind(null, req, objs),
        assignmentDetailsObjs : nsaCassandra.UserJson.buildAssignmentDetailObjs.bind(null, req, detailObjs),
        assignmentDeleteObjs : es.assignmentDetailsDeleteQuery.bind(null, req, deleteObjs)
    }, function (err, result) {
        var bulkParams = _.concat(result.assignmentObjs, result.assignmentDetailsObjs, result.assignmentDeleteObjs);
        var array = _.chunk(bulkParams, constant.ES_CHUNK_SIZE);
        async.times(array.length, function(i, next) {
            var objs = array[i];
            es.updateBulkObjs(objs, function(err, result) {
                next(err, result);
            });
        }, function(err, objs) {
            callback(err, data);
        });
    })
};
exports.updateAssignmentsInES = updateAssignmentsInES;

function sendNotification(req, callback) {
    if(req.body.status) {
        var data = [];
        async.waterfall([
                buildTaxanomyObj.bind(null, req, data),
                buildUsers.bind(),
                getAssignmentCreateTemplate.bind(),
                getTemplateObj.bind(),
                buildFeatureNotificationObj.bind(),
                notificationService.sendAllNotification.bind(),
                notificationService.saveNotificationInfo.bind()
            ],
            function (err, data) {
                callback(err, data)
            }
        )
    } else {
        callback(null, null)
    }
};
exports.sendNotification = sendNotification;

function buildUsers(req, data, callback) {
    var users = req.body.users;
    try {
        data['users'] = users;
        data['students'] = users || null;
        callback(null, req, data);
    } catch(err) {
        logger.debug(err);
        callback(err, null, null);
    }
};
exports.buildUsers = buildUsers;

function getAssignmentCreateTemplate(req, users, callback) {
    var data = {featureId : constant.ASSIGNMENT, subFeatureId: constant.CREATE_ASSIGNMENT, action: constant.CREATE_ACTION, userType: constant.STUDENT};
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getAssignmentCreateTemplate = getAssignmentCreateTemplate;

function getTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.assignmentbase.getTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getTemplateObj = getTemplateObj;

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        notificationObj.isDetailedNotification = true,
        notificationObj.replacementKeys = [constant.FIRST_NAME]
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;

function constructAssignmentObj(req, data, callback) {
    nsaCassandra.Base.assignmentbase.constructAssignmentObj(req, data, function(err, data) {
        data.features = {featureId : constant.ASSIGNMENT, actions : constant.CREATE, featureTypeId : data.assignment_id};
        callback(err, req, data);
    })
};
exports.constructAssignmentObj = constructAssignmentObj;

function constructAssignmentDetailObj(req, data, callback) {
    nsaCassandra.Base.assignmentbase.constructAssignmentDetailsObj(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.constructAssignmentDetailObj = constructAssignmentDetailObj;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
};
exports.executeBatch = executeBatch;

exports.updateAssignment = function (req, res) {
    var data = [];
    async.waterfall(
        [
            buildTaxanomyObj.bind(null, req, data),
            updateAssignmentObj.bind(),
            findAssignmentDetailsObj.bind(),
            deleteAssignmentDetails.bind(),
            constructAssignmentDetailObj.bind(),
            insertAuditLog.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1212));
            } else {
                async.parallel({
                    assignmentObjs : updateAssignmentsInES.bind(null, req, result),
                    notificationObj : sendUpdateNotification.bind(null, req)
                }, function (err1, output) {
                    if(err1) {
                        logger.debug(err1);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa1212));
                    } else {
                        var data = {};
                        data['message'] = req.body.status ? message.nsa1211 : message.nsa1217;
                        data['assignment_id'] = result.assignment_id;
                        events.emit('JsonResponse', req, res, data);
                    }
                });
            }
        }
    );
};

exports.updateAttachments = function (req, res) {
    var data = [];
    async.waterfall(
        [
            updateAttachmentsObj.bind(null, req, data),
            findAssignmentDetailsObj.bind(),
            updateAssignmentDetails.bind(),
            insertAuditLog.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4702));
            } else {
                updateAttachmentsInES(req, result, function (err1, output) {
                    if(err1) {
                        logger.debug(err1);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4702));
                    } else {
                        var output = {message: message.nsa4701};
                        events.emit('JsonResponse', req, res, output);
                    }
                });
            }
        }
    );
};


function updateAttachmentsInES(req, data, callback) {
    async.parallel({
        assignmentObjs : es.attachmentsUpdateQuery.bind(null, req, data),
        assignmentDetailsObjs : es.attachmentsDetailsUpdateQuery.bind(null, req, data)
    }, function (err, result) {
        var bulkParams = _.concat(result.assignmentObjs, result.assignmentDetailsObjs);
        var array = _.chunk(bulkParams, constant.ES_CHUNK_SIZE);
        async.times(array.length, function(i, next) {
            var objs = array[i];
            es.updateBulkObjs(objs, function(err, result) {
                next(err, result);
            });
        }, function(err, objs) {
            callback(err, data);
        });
    })
}
exports.updateAttachmentsInES = updateAttachmentsInES;

function updateAssignmentDetails(req, data, callback) {
    nsaCassandra.Base.assignmentbase.updateAssignmentDetails(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.updateAssignmentDetails = updateAssignmentDetails;

function updateAttachmentsObj(req, data, callback) {
    nsaCassandra.Base.assignmentbase.updateAttachmentsObj(req, data, function(err, data) {
        data.features = {featureId : constant.ASSIGNMENT, actions : constant.UPDATE, featureTypeId : data.assignment_id};
        callback(err, req, data);
    })
};
exports.updateAttachmentsObj = updateAttachmentsObj;

function sendUpdateNotification(req, callback) {
    if(req.body.status) {
        var data = [];
        async.waterfall([
                buildUsers.bind(null, req, data),
                getAssignmentCreateTemplate.bind(),
                getTemplateObj.bind(),
                buildFeatureNotificationObj.bind(),
                notificationService.sendAllNotification.bind(),
                notificationService.saveNotificationInfo.bind()
            ],
            function (err, data) {
                callback(err, data)
            }
        )
    } else {
        callback(null, null)
    }
};
exports.sendUpdateNotification = sendUpdateNotification;

function getAssignmentUpdateTemplate(req, users, callback) {
    var data = { featureId: constant.ASSIGNMENT, subFeatureId: constant.UPDATE_ASSIGNMENT,
        action: constant.UPDATE_ACTION, userType: constant.STUDENT };
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getAssignmentUpdateTemplate = getAssignmentUpdateTemplate;

function updateAssignmentObj(req, data, callback) {
    nsaCassandra.Base.assignmentbase.updateAssignmentObj(req, data, function(err, data) {
        data.features = {featureId : constant.ASSIGNMENT, actions : constant.UPDATE, featureTypeId : data.assignment_id};
        callback(err, req, data);
    })
};
exports.updateAssignmentObj = updateAssignmentObj;

function findAssignmentDetailsObj(req, data, callback) {
    nsaCassandra.Base.assignmentbase.findAssignmentDetailsObj(req, data, function(err, data) {
        callback(err, req, data);
    })
};
exports.findAssignmentDetailsObj = findAssignmentDetailsObj;

function deleteAssignmentDetails(req, data, callback) {
    nsaCassandra.Base.assignmentbase.deleteAssignmentDetails(req, data, function(err, data) {
        callback(err, req, data);
    })
};
exports.deleteAssignmentDetails = deleteAssignmentDetails;

exports.deleteAssignment = function(req, res) {
    nsaCassandra.Base.assignmentbase.findAssignmentDetailsObj(req, {}, function(err, data) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa1214});
        } else {
            async.parallel([
                assignmentDelete.bind(null, req, data),
                assignmentDeleteInES.bind(null, req, data)
            ], function (err, result) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, {message: message.nsa1214});
                } else {

                    if(!_.isEmpty(req.body.attachments)){
                        req.body.seletedImageIds  = req.body.attachments.map(function(a) {return a.id;});
                        gallary.deleteS3Src(req, function(err1, result1){
                            if(err1){
                                logger.debug(err1);
                                events.emit('ErrorJsonResponse', req, res, {message: message.nsa1214});
                            }else{
                                events.emit('JsonResponse', req, res, {message: message.nsa1213});
                            }
                        })
                    }else {
                        events.emit('JsonResponse', req, res, {message: message.nsa1213});
                    }
                }
            });
        }
    });
};

function assignmentDeleteInES(req, data, callback) {
    async.parallel({
        assignmentObjs : es.assignmentDeleteQuery.bind(null, req),
        assignmentDetailObjs : es.assignmentDetailsDeleteQuery.bind(null, req, data.result)
    }, function (err, result) {
        var bulkParams = _.concat(result.assignmentObjs, result.assignmentDetailObjs);
        var array = _.chunk(bulkParams, constant.ES_CHUNK_SIZE);
        async.times(array.length, function(i, next) {
            var objs = array[i];
            es.updateBulkObjs(objs, function(err, result) {
                next(err, result);
            });
        }, function(err, objs) {
            callback(err, data);
        });
    })
};

function assignmentDelete(req, data, callback) {
    async.waterfall([
        deleteAssignmentObj.bind(null, req, data),
        deleteAssignmentDetails.bind(),
        executeBatch.bind()
    ], function (err, result) {
        callback(err, result);
    })
};

function deleteAssignmentObj(req, data, callback) {
    nsaCassandra.Assignments.deleteAssignment(req, function(err, result) {
      callback(err, req, data);
    })
};
exports.deleteAssignmentObj = deleteAssignmentObj;

exports.getDetailsByAssignmentId = function (req, res) {
    nsaCassandra.Assignments.getDetailsByAssignmentId(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.updateAssignmentDetailsStatus = function (req, res) {
    async.parallel([
        nsaCassandra.Assignments.updateAssignmentDetailsStatus.bind(null, req),
        es.updateAssignmentDetailsStatusInES.bind(null, req)
    ], function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1218));
        } else {
            events.emit('JsonResponse', req, res, {message : message.nsa1219});
        }
    });
};

// get all assignments based on selected filter
exports.getAssignmentLists = function (req, res) {
    var assignmentQuery, viewPermission, headers = nsaCassandra.BaseService.getHeaders(req);
    viewPermission = nsaCassandra.BaseService.checkPermissionsToQuery(req, constant.ASSIGNMENT_PERMISSIONS);

    if (req.body.search) {
        req.query.keyword = req.body.search['value'];
    } else if (req.query.search) {
        req.query.keyword = req.query.search['value'];
    }

    if (req.body.length) {
        req.query.length = req.body.length;
    }

    if (req.body.start) {
        req.query.start = req.body.start;
    }

    if (req.body.order) {
        req.query.order = req.body.order;
    }

    if (req.body.columns) {
        req.query.columns = req.body.columns;
    }

    if (req.body.order) {
        req.query.order = req.body.order;
    }

    req.query.startDate = req.body.startDate;
    req.query.endDate = req.body.endDate;

    req.query.dateParam = 'due_date';
    var sortParam = { key: 'due_date', order: constant.ES_ORDER_DSC };
        assignmentQuery = nsaau.getAssignmentDetailsQuery(req, headers, viewPermission, sortParam);
    nsaElasticSearch.search.searchAssignments(req, assignmentQuery, function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
        } else {
            events.emit('SearchResponse', req, res, result);
        }
    });
    /*nsaCassandra.Assignments.getAssignmentLists(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })*/
};

//Assignment Details lists for logged in user : Student.
exports.getAssignmentAssignedUsers = function (req, res) {


    var assignmentQuery, viewPermission, headers = nsaCassandra.BaseService.getHeaders(req);
    viewPermission = nsaCassandra.BaseService.checkPermissionsToQuery(req, constant.ASSIGNMENT_PERMISSIONS);

    if (req.query.search) {
        req.query.keyword = req.query.search['value'];
    }

    var sortParam = { key: 'due_date', order: constant.ES_ORDER_DSC };
    assignmentQuery = nsaau.getAssignmentDetailsQueryByUserName(req, headers, null, sortParam);
    nsaElasticSearch.search.searchAssignmentDetails(req, assignmentQuery, function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
        } else {
            events.emit('SearchResponse', req, res, result);
        }
    });

    /*nsaCassandra.Assignments.getAssignmentAssignedUsers(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })*/
};

exports.getAssignmentsByMonthOfYear = function(req, res) {
    nsaCassandra.Assignments.getAssignmentsByMonthOfYear(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
        } else {
            events.emit('JsonResponse', req, res, buildCalendarObj(result));
        }
    })
};

exports.getAssignmentsByWeekOfYear = function(req, res) {
    try {
        var assignmentQuery, headers = nsaCassandra.BaseService.getHeaders(req);

        if (req.query.search) {
            req.query.keyword = req.query.search['value'];
        }

        var queryParams = req.query;
        var weekNo = queryParams.weekNo;  // Ex: 26
        var year = queryParams.year;   //Ex: 2017
        if(weekNo != null && year != null && !_.isEmpty(weekNo) && !_.isEmpty(year)) {
            var dates = dateUtils.getStartEndDatesOfYearOfWeek(weekNo, year);
            queryParams.dateParam = 'due_date';
            queryParams.startDate = dates.startDate;
            queryParams.endDate = dates.endDate;
        }
        var sortParam = { key: constant.ES_UPDATED_DATE, order: constant.ES_ORDER_ASC };
        assignmentQuery = nsaau.getAssignmentDetailsQueryByUserName(req, headers, null, sortParam);

        nsaElasticSearch.search.searchAssignmentDetails(req, assignmentQuery, function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
            } else {
                var grouped = _.groupBy(result.data, 'dueDateFormatted');
                result.data = grouped;
                events.emit('SearchResponse', req, res, result);
            }
        })
    } catch (cerr) {
        logger.debug(cerr);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(cerr, message.nsa1208));
    }

};

exports.getAssignmentsByWeekOfYearIos = function (req, res) {
    try {
        var assignmentQuery, headers = nsaCassandra.BaseService.getHeaders(req);

        if (req.query.search) {
            req.query.keyword = req.query.search['value'];
        }

        var queryParams = req.query;
        var weekNo = queryParams.weekNo;  // Ex: 26
        var year = queryParams.year;   //Ex: 2017
        if (weekNo != null && year != null && !_.isEmpty(weekNo) && !_.isEmpty(year)) {
            var dates = dateUtils.getStartEndDatesOfYearOfWeek(weekNo, year);
            queryParams.dateParam = 'due_date';
            queryParams.startDate = dates.startDate;
            queryParams.endDate = dates.endDate;
        }
        var sortParam = {key: constant.ES_UPDATED_DATE, order: constant.ES_ORDER_ASC};
        assignmentQuery = nsaau.getAssignmentDetailsQueryByUserName(req, headers, null, sortParam);

        nsaElasticSearch.search.searchAssignmentDetails(req, assignmentQuery, function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
            } else {
                var grouped = convertWeekAssignment(result.data);
                result.data = grouped;
                events.emit('SearchResponse', req, res, result);
            }
        })
    } catch (cerr) {
        logger.debug(cerr);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(cerr, message.nsa1208));
    }

};
function convertWeekAssignment(assignment) {
    var obj = _.groupBy(assignment, 'dueDateFormatted');
    var result = _.map(_.toPairs(obj), function (value) {
        return _.fromPairs([value]);
    });
    return result;
}

exports.getEmpAssignmentsByWeekOfYearIos = function (req, res) {
    try {
        var assignmentQuery, viewPermission, headers = nsaCassandra.BaseService.getHeaders(req);
        viewPermission = nsaCassandra.BaseService.checkPermissionsToQuery(req, constant.ASSIGNMENT_PERMISSIONS);

        if (req.query.search) {
            req.query.keyword = req.query.search['value'];
        }

        var queryParams = req.query;
        var weekNo = queryParams.weekNo;  // Ex: 26
        var year = queryParams.year;   //Ex: 201    7
        if (weekNo != null && year != null && !_.isEmpty(weekNo) && !_.isEmpty(year)) {
            var dates = dateUtils.getStartEndDatesOfYearOfWeek(weekNo, year);
            queryParams.dateParam = 'due_date';
            queryParams.startDate = dates.startDate;
            queryParams.endDate = dates.endDate;
            // findQuery.due_date = { '$gte': dates.startDate, '$lte': dates.endDate };
        }

        var sortParam = {key: constant.ES_UPDATED_DATE, order: constant.ES_ORDER_ASC};
        assignmentQuery = nsaau.getAssignmentQuery(req, headers, viewPermission, sortParam);

        nsaElasticSearch.search.searchAssignments(req, assignmentQuery, function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
            } else {
                var grouped = convertWeekAssignment(result.data);
                result.data = grouped;
                events.emit('SearchResponse', req, res, result);
            }
        })
    } catch (cerr) {
        logger.debug(cerr);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(cerr, message.nsa1208));
    }

};

exports.getEmpAssignmentsByWeekOfYear = function (req, res) {
    try {
        var assignmentQuery, viewPermission, headers = nsaCassandra.BaseService.getHeaders(req);
        viewPermission = nsaCassandra.BaseService.checkPermissionsToQuery(req, constant.ASSIGNMENT_PERMISSIONS);

        if (req.query.search) {
            req.query.keyword = req.query.search['value'];
        }

        var queryParams = req.query;
        var weekNo = queryParams.weekNo;  // Ex: 26
        var year = queryParams.year;   //Ex: 2017
        if(weekNo != null && year != null && !_.isEmpty(weekNo) && !_.isEmpty(year)) {
            var dates = dateUtils.getStartEndDatesOfYearOfWeek(weekNo, year);
            queryParams.dateParam = 'due_date';
            queryParams.startDate = dates.startDate;
            queryParams.endDate = dates.endDate;
            // findQuery.due_date = { '$gte': dates.startDate, '$lte': dates.endDate };
        }

        var sortParam = { key: constant.ES_UPDATED_DATE, order: constant.ES_ORDER_ASC };
        assignmentQuery = nsaau.getAssignmentQuery(req, headers, viewPermission, sortParam);

        nsaElasticSearch.search.searchAssignments(req, assignmentQuery, function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
            } else {
                var grouped = _.groupBy(result.data, 'dueDateFormatted');
                result.data = grouped;
                events.emit('SearchResponse', req, res, result);
            }
        })
    } catch (cerr) {
        logger.debug(cerr);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(cerr, message.nsa1208));
    }

};

function convertAssignmentObjByWeek(result) {
    var assignmentObjs = {};
    try {
        if(!_.isEmpty(result)) {
            assignmentObjs = _.groupBy(result, 'dueDateFormatted');
        }
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa1208);
    }
    return assignmentObjs;
};

function buildCalendarObj(result) {
    var calendarObjs = [];
    try{
        if(!_.isEmpty(result)) {
            _.forEach(result, function(value, key){
                var startDate = value.dueDate;
                var endDate = value.dueDate;
                var calendarObj = {};
                calendarObj['title'] = value.assignmentName + ':' + value.isSubmitted;
                calendarObj['start'] = startDate;
                calendarObj['end'] = endDate;
                calendarObjs.push(calendarObj);
            });
        }
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa1208);
    }
    return calendarObjs;
};
exports.buildCalendarObj = buildCalendarObj;


function saveAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveAuditLog(req, data, function(err, result) {
        callback(err, req, data);
    })
};
exports.saveAuditLog = saveAuditLog;

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.insertAuditLog = insertAuditLog;

function buildTaxanomyObj(req, data, callback) {
    taxanomyUtils.buildTaxanomyObj(req, function(err, result){
        data['taxanomy'] = result;
        callback(err, req, data)
    })
}
exports.buildTaxanomyObj = buildTaxanomyObj;

exports.updateSubjects = function(req, res) {
    async.parallel({
        assignments : nsaCassandra.Assignments.getAssignments.bind(null, req),
        assignmentDetails : nsaCassandra.Assignments.getAssignmentDetails.bind(null, req)
    }, function (err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1212));
        } else {
            async.waterfall([
                nsaCassandra.Base.assignmentbase.updateAssignmentAndDetails.bind(null, req, result),
                executeBatch.bind()
            ], function (err, result) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1212));
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa1211});
                }
            })
        }
    });
};

exports.deleteAttachments = function (req, res) {
    var data = [];
    async.waterfall(
        [
            deleteAttachmentsObjs.bind(null, req, data),
            deleteAttachmentsDetailsObjs.bind(),
            insertAuditLog.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4704));
            } else {
                req.body.seletedImageIds = result.s3DeleteIds;
                /*gallary.deleteS3Src(req, function(err, result1){
                    if(err){
                        logger.debug(err);
                    }else {
                        var output = { message: message.nsa4703, data: req.body}
                        events.emit('JsonResponse', req, res, output);
                    }
                });*/
               /* async.parallel([
                    gallary.deleteS3Src.bind(null, req),
                    updateAttachmentsInES.bind(null, req, result)
                ], function (err, result) {
                    if(err){
                        logger.debug(err);
                    }else {
                        var output = { message: message.nsa4703, data: req.body}
                        events.emit('JsonResponse', req, res, output);
                    }
                })*/
                getAttachmentsByKey(req, result, function (err, data) {
                    if(_.isEmpty(data)) {
                        async.parallel([
                            gallary.deleteS3Src.bind(null, req),
                            updateAttachmentsInES.bind(null, req, result)
                        ], function (err, result) {
                            if(err){
                                logger.debug(err);
                            }else {
                                var output = { message: message.nsa4703, data: req.body}
                                events.emit('JsonResponse', req, res, output);
                            }
                        })
                    } else {
                        async.parallel([
                            updateAttachmentsInES.bind(null, req, result)
                        ], function (err, result) {
                            if(err){
                                logger.debug(err);
                            }else {
                                var output = { message: message.nsa4703, data: req.body}
                                events.emit('JsonResponse', req, res, output);
                            }
                        })
                    }
                })
            }
        }
    );
};

function getAttachmentsByKey(req, data, callback) {
    nsaCassandra.Base.assignmentbase.deleteAttachmentByKey(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.getAttachmentsByKey = getAttachmentsByKey;

//For IOS Start
exports.updateUserAssignmentDetails = function(req, res){
    async.parallel([
        nsaCassandra.Assignments.updateUserAssignmentDetail.bind(null, req),
        es.updateAssignmentDeactiveStatusInES.bind(null, req)
    ], function (err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err,message.nsa1603));
        } else {
            events.emit('JsonResponse', req, res, {message:message.nsa1604});
        }
    });
};

exports.updateUserReadStatus = function(req, res){
    async.parallel([
        nsaCassandra.Assignments.updateUserReadStatus.bind(null, req),
        es.updateUserReadStatusInES.bind(null, req)
    ], function (err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err,message.nsa1603));
        } else {
            events.emit('JsonResponse', req, res, {message:message.nsa1604});
        }
    });
};

exports.getAssigmentsOverview = function (req, res) {
    async.parallel({
        list: getListofAssignments.bind(null, req)
    }, function (err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err,message.nsa1603));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.getAssigmentsOverviewCount = function (req, res) {
    async.parallel({
        subDetails: getAssignmentSubCount.bind(null, req),
        count: getTodayAssignments.bind(null, req)
    }, function (err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err,message.nsa1603));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

function getListofAssignments(req, callback) {
    var assignmentQuery, viewPermission, headers = nsaCassandra.BaseService.getHeaders(req);
    viewPermission = nsaCassandra.BaseService.checkPermissionsToQuery(req, constant.ASSIGNMENT_PERMISSIONS);

    if (req.query.search) {
        req.query.keyword = req.query.search['value'];
    }

    var sortParam = { key: 'due_date', order: constant.ES_ORDER_DSC };
    assignmentQuery = nsaau.getAssignmentDetailsQueryByUserName(req, headers, null, sortParam);
    nsaElasticSearch.search.searchAssignmentDetails(req, assignmentQuery, function (err, result) {
        callback(err, result);
    });
};
exports.getListofAssignments = getListofAssignments;

function getAssignmentSubCount(req, callback) {
    es.getAssignmentSubCount(req, function (err, result) {
        callback(err, result.aggregations.nestedDocs.subDetails.buckets);
    })
};
exports.getAssignmentSubCount = getAssignmentSubCount;

function getTodayAssignments(req, callback) {
    req.query.startDate= moment().startOf('day');
    req.query.endDate= moment().endOf('day');
    var searchParams = nsaau.getUserAssignmentsByDate(req, 'due_date');
    nsaElasticSearch.search.searchUsers(searchParams, function (err, data) {
        if(err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
};
exports.getTodayAssignments = getTodayAssignments;
//For IOS End

function deleteAttachmentsObjs(req, data, callback) {
    nsaCassandra.Base.assignmentbase.deleteAttachmentsObj(req, data, function(err, result) {
        data.features = {featureId : constant.ASSIGNMENT, actions : constant.UPDATE, featureTypeId : data.id};
        callback(err, req, result);
    })
};
exports.deleteAttachmentsObjs = deleteAttachmentsObjs;

function deleteAttachmentsDetailsObjs(req, data, callback) {
    nsaCassandra.Base.assignmentbase.deleteAttachmentsDetailsObj(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.deleteAttachmentsDetailsObjs = deleteAttachmentsDetailsObjs;



function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.ASSIGNMENT_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;

function throwAssignmentErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.ASSIGNMENT_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwAssignmentErr = throwAssignmentErr;