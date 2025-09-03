/**
 * Created by Kiranmai A on 3/13/2017.
 */

var events = require('@nsa/nsa-commons').events,
    nsaCassandra = require('@nsa/nsa-cassandra'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    es = require('../../services/search/elasticsearch/elasticsearch.service'),
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    _= require('lodash'),
    constant = require('@nsa/nsa-commons').constants,
    notificationService = require('../sms/notifications/notification.service'),
    logger = require('../../../config/logger');

const allstudentLeaveHistoryJson = require('../../test/json-data/attendance/all-student-leave-history.json');
const overallLeaveHistoryJson = require('../../test/json-data/attendance/overall-leave-history.json');
const overallattendanceHistoryJson = require('../../test/json-data/attendance/overall-attendance-history.json');

exports.getUsersByClassAndSection = function(req, res) {
    nsaCassandra.Attendance.getAttendanceForClsByDate(req, function(err, result){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2801));
        } else if(!_.isEmpty(result)) {
            events.emit('JsonResponse', req, res, {message: message.nsa2815,data :result});
        } else {
            async.waterfall([
                getUsers.bind(null, req),
                getLeaveHistoryByDate.bind(),
                constructStudentInfoListsObj.bind()
            ], function(err1, data) {
                if (err1) {
                    logger.debug(err1);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa2801));
                } else {
                    events.emit('JsonResponse', req, res, data);
                }
            });
        }
    });
};

function getUsers(req, callback) {
    async.parallel({
        usersByClassAndSection: es.getUsersByClassSection.bind(null, req)
    }, function(err, result) {
        callback(err, req, result);
    });
};
exports.getUsers = getUsers;

function getUpdatedUsers(req, data, callback) {
    if (data.userNames.length > 0) {
        async.parallel({
            usersByUsername: es.getUsersByLists.bind(null, req, data)
        }, function (err, result) {
            data['users'] = result.usersByUsername
            data['students'] = result.usersByUsername || null;
            callback(err, req, data);
        });
    } else {
        data['users'] =[];
        data['students'] = null;
        callback(null, req, data);
    }
};
exports.getUpdatedUsers = getUpdatedUsers

function getLeaveHistoryByDate(req, data, callback) {
    nsaCassandra.Attendance.getLeaveHistoryByDate(req, function(err, result) {
        data.leaveHistoryByDate = result;
        callback(err, req, data);
    })
};
exports.getLeaveHistoryByDate = getLeaveHistoryByDate;

function constructStudentInfoListsObj(req, data, callback) {
    nsaCassandra.Attendance.constructStudentInfoListsObj(req, data, function(err, result) {
        callback(err, result);
    })
};
exports.constructStudentInfoListsObj = constructStudentInfoListsObj;

exports.getAttendanceLists = function(req, res) {
    nsaCassandra.Attendance.getAttendanceLists(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2801));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })

};

exports.getDetailsByAttendanceId = function(req, res) {
    nsaCassandra.Attendance.getDetailsByAttendanceId(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2801));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.getDetailsByUserId = function(req, res) {
    nsaCassandra.Attendance.getDetailsByUserId(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2801));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.getDetailsMobileByUserId = function(req, res) {
    nsaCassandra.Attendance.getDetailsMobileByUserId(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2801));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.saveLeaveDetails = function(req, res) {
    var data = [];
    async.waterfall([
        saveLeaveDetailsData.bind(null, req, data),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2807));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa2816});
        }
    });
};


exports.updateLeaveDetails = function(req, res) {
    nsaCassandra.Attendance.updateLeaveDetails(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2807));
        } else {
            data.features = {featureId : constant.ASSIGNMENT, actions : constant.UPDATE, featureTypeId : req.params.id};
            saveAuditLog(req, data, function(err1, result){
                if(err1) {
                    logger.debug(err1);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4018));
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa2806});
                }
            })
        }
    });
};


//for mobile, to show attendance overview for particular user
exports.getAttendanceOverviewByUser = function(req, res) {
    var data = [];
    async.waterfall([
        getAcademicYearDetails.bind(null, req, data),
        getAttendanceDetails.bind(),
        getUser.bind()
    ], function(err, data) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2801));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

exports.getMonthlyAttendanceByUser = function(req, res) {
    var data = [];
    async.parallel({
        attendance: nsaCassandra.Attendance.getAttendanceByMonthOfYear.bind(null, req),
        holidays: nsaCassandra.Holiday.getSchoolHolidaysByMonthOfYear.bind(null, req)
    }, function(err, data) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2801));
        } else {
            if(data.holidays.message) {
                data.holidays = [];
            }
            events.emit('JsonResponse', req, res, data);
        }
    });
}

function getUser(data, callback) {
   try {
       var user = {};
       if(data.users.length > 0) {
           user = data.users[0];
           var present = _.filter(data.users, ['isPresent', true]);
           var absent = _.filter(data.users, ['isPresent', false]);
           var totalDays = present.length + absent.length;
           user['isPresent'] = present.length;
           user['isAbsent'] = absent.length;
           user['totalDays'] = totalDays;
           user['percent'] = (present.length/totalDays) * 100;
           callback(null, user);
       }
   } catch(err) {
       logger.debug(err);
       callback(err, null);
   }
};

function getAcademicYearDetails(req, data, callback) {
    nsaCassandra.Academics.getAcademicYear(req, function(err, result) {
        data.academicYear = result;
        callback(err, req, data);
    })
};

function getAttendanceDetails(req, data, callback) {
    nsaCassandra.Attendance.getAttendanceDetailsByUserId(req, data, function(err, result) {
        data.users = result;
        callback(err, data);
    })
};

exports.saveAttendance = function(req, res) {
    var data = [];
    async.waterfall(
        [
            constructAttendanceObj.bind(null, req, data),
            constructAttendanceDetailsObj.bind(),
            insertAuditLog.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2803));
            } else {
                var notify = (req.body.notify.sms || req.body.notify.push) ? true : false;
                if(!_.isEmpty(req.body.notifiedTo) && notify) {
                    sendNotification(req, function(err1, result1){
                        if(err1) {
                            logger.debug(err1);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa2803));
                        } else {
                            var output = {};
                            output['message'] = message.nsa2802;
                            output['data'] = result1;
                            events.emit('JsonResponse', req, res, output);
                        }
                    })
                } else {
                    result['message'] = message.nsa2802;
                    events.emit('JsonResponse', req, res, result);
                }
            }
        }
    );
};

function sendNotification(req, callback) {
       async.parallel({
           present: sendPresentNotification.bind(null, req),
           absent : sendAbsendNotification.bind(null, req)
       }, function(err, result){
           if(err) {
               callback(err, null)
           } else {
               callback(null, result)
           }
       })
};
exports.sendNotification = sendNotification;



function sendPresentNotification(req, callback){
    var notifiedTo = req.body.notifiedTo;
    var data = {};
    if(_.includes(notifiedTo, 'Present')) {
        async.waterfall([
                buildPresentUsers.bind(null, req, data),
                getPresentAttendanceTemplate.bind(),
                getTemplateObj.bind(),
                buildFeatureNotificationObj.bind(),
                notificationService.sendAllNotification.bind(),
                notificationService.saveNotificationInfo.bind()
            ],
            function (err, data) {
                if(err) {
                    callback(err, null)
                } else {
                    callback(null, data)
                }
            }
        )
    }else {
        callback(null, data)
    }
}

function sendAbsendNotification(req, callback){
    var notifiedTo = req.body.notifiedTo;
    var data = {};
    if(_.includes(notifiedTo, 'Absent')) {
        async.waterfall([
                buildAbsentUsers.bind(null, req, data),
                getAbsentAttendanceTemplate.bind(),
                getTemplateObj.bind(),
                buildFeatureNotificationObj.bind(),
                notificationService.sendAllNotification.bind(),
                notificationService.saveNotificationInfo.bind()
            ],
            function (err, data) {
                if(err) {
                    callback(err, null)
                } else {
                    callback(null, data)
                }
            }
        )
    }else {
        callback(null, data)
    }
}

function sendPresentUpdateNotification(req, callback){
    var notifiedTo = req.body.notifiedTo;
    var data = {};
    if(_.includes(notifiedTo, 'Present')) {
        async.waterfall([
                buildPresentUsers.bind(null, req, data),
                buildUsernames.bind(),
                getUpdatedUsers.bind(),
                getPresentAttendanceTemplate.bind(),
                getTemplateObj.bind(),
                buildFeatureNotificationObj.bind(),
                notificationService.sendAllNotification.bind(),
                notificationService.saveNotificationInfo.bind()
            ],
            function (err, data) {
                if(err) {
                    callback(err, null)
                } else {
                    callback(null, data)
                }
            }
        )
    }else {
        callback(null, data)
    }
}

function sendAbsendNUpdateNotification(req, callback){
    var notifiedTo = req.body.notifiedTo;
    var data = {};
    if(_.includes(notifiedTo, 'Absent')) {
        async.waterfall([
                buildAbsentUsers.bind(null, req, data),
                buildUsernames.bind(),
                getUpdatedUsers.bind(),
                getAbsentAttendanceTemplate.bind(),
                getTemplateObj.bind(),
                buildFeatureNotificationObj.bind(),
                notificationService.sendAllNotification.bind(),
                notificationService.saveNotificationInfo.bind()
            ],
            function (err, data) {
                if(err) {
                    callback(err, null)
                } else {
                    callback(null, data)
                }
            }
        )
    }else {
        callback(null, data)
    }
}

function sendUpdateNotification(req, callback) {

    async.parallel({
        present: sendPresentUpdateNotification.bind(null, req),
        absent : sendAbsendNUpdateNotification.bind(null, req)
    }, function(err, result){
        console.info('err',err);
        if(err) {
            callback(err, null)
        } else {
            callback(null, result)
        }
    })
};
exports.sendUpdateNotification = sendUpdateNotification;


function getTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.attendancebase.getTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getTemplateObj = getTemplateObj;

function buildPresentUsers(req, data, callback) {
    var users = req.body.users;
    try {
        var notifiedTo = req.body.notifiedTo;
        var notify = req.body.notify;
        if(_.includes(notifiedTo, 'Present')) {
            if(notify.notifyHostelers) {
                users = _.filter(users, ['isPresent', true]);
            } else {
                users = _.filter(users, { isPresent: true, isHostel: false });
            }
        }
        data['users'] = users;
        data['students'] = users || null;
        callback(null, req,  data);
    } catch(err) {
        callback(err, req, []);
    }
};
exports.buildPresentUsers = buildPresentUsers;

function buildAbsentUsers(req, data, callback) {
    var users = req.body.users;
    try {
        var notifiedTo = req.body.notifiedTo;
        var notify = req.body.notify;
        if(_.includes(notifiedTo, 'Absent')) {
            if(notify.notifyHostelers) {
                users = _.filter(users, ['isPresent', false]);
            } else {
                users = _.filter(users, { isPresent: false, isHostel: false });
            }
        };
        data['users'] = users;
        data['students'] = users || null;
        callback(null, req,  data);
    } catch(err) {
        callback(err, req, []);
    }
};
exports.buildAbsentUsers = buildAbsentUsers;

function buildUsernames(req, data, callback) {
    var users = data.users;
    var userNames = [];
    try {
       if(!_.isEmpty(users)) {
           _.forEach(users, function(val) {
               userNames.push(val.userName)
           })
       }
        data['userNames'] = userNames;
        callback(null, req, data);
    } catch(err) {
        callback(err, req, null);
    }
};
exports.buildUsernames = buildUsernames;


function getPresentAttendanceTemplate(req, users, callback) {
    var notifiedTo = req.body.notifiedTo;
    if(_.includes(notifiedTo, 'Present')) {
        var data = { featureId: constant.ATTENDANCE, subFeatureId: constant.PRESENT_ATTENDANCE, action: constant.CREATE_ACTION, userType: constant.STUDENT };
        nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
            callback(err, req, users, result);
        })
    };
};
exports.getPresentAttendanceTemplate = getPresentAttendanceTemplate;

function getAbsentAttendanceTemplate(req, users, callback) {
    var notifiedTo = req.body.notifiedTo;
    if(_.includes(notifiedTo, 'Absent')) {
        var data = { featureId: constant.ATTENDANCE, subFeatureId: constant.ABSENT_ATTENDANCE, action: constant.UPDATE_ACTION, userType: constant.STUDENT };
        nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
            callback(err, req, users, result);
        })
    };
};
exports.getAbsentAttendanceTemplate = getAbsentAttendanceTemplate;

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        notificationObj.isDetailedNotification = true,
        notificationObj.replacementKeys = [constant.FIRST_NAME]
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;

function constructAttendanceObj(req, data, callback) {
    nsaCassandra.Base.attendancebase.constructAttendanceObj(req, data, function(err, data) {
        data.features = {featureId : constant.ATTENDANCE, actions : constant.CREATE, featureTypeId : data.attendance_id};
        callback(err, req, data);
    })
};
exports.constructAttendanceObj = constructAttendanceObj;

function constructAttendanceDetailsObj(req, data, callback) {
    nsaCassandra.Base.attendancebase.constructAttendanceDetailsObj(req, data, function(err, data) {
        callback(err, req, data);
    })
};
exports.constructAttendanceDetailsObj = constructAttendanceDetailsObj;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, result);
    })
};
exports.executeBatch = executeBatch;

exports.updateAttendance = function(req, res) {
    var data = [];
    async.waterfall(
        [
            updateAttendanceObj.bind(null, req, data),
            updateAttendanceDetailObj.bind(),
            insertAuditLog.bind(),
            executeBatch.bind()
        ],
        function (err, result) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2805));
            } else {
                var notify = (req.body.notify.sms || req.body.notify.push) ? true : false;
                if(!_.isEmpty(req.body.notifiedTo) && notify) {
                    sendUpdateNotification(req, function(err, data){
                        if(err) {
                            logger.debug(err);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2803));
                        } else {
                            var result = {};
                            result['message'] = message.nsa2804;
                            result['data'] = data;
                            events.emit('JsonResponse', req, res, result);
                        }
                    })
                } else {
                    result['message'] = message.nsa2804;
                    events.emit('JsonResponse', req, res, result);
                }
            }
        }
    );
};

function updateAttendanceObj(req, data, callback) {
    nsaCassandra.Base.attendancebase.updateAttendanceObj(req, data, function(err, data) {
        callback(err, req, data);
    })
};
exports.updateAttendanceObj = updateAttendanceObj;

function updateAttendanceDetailObj(req, data, callback) {
    nsaCassandra.Base.attendancebase.updateAttendanceDetailObjs(req, data, function(err, data) {
        data.features = {featureId : constant.ATTENDANCE, actions : constant.UPDATE, featureTypeId : data.attendance_id};
        callback(err, req, data);
    })
};
exports.updateAttendanceDetailObj = updateAttendanceDetailObj;

exports.getAllStudentLeaveHistory = function(req, res) {
    events.emit('JsonResponse', req, res, allstudentLeaveHistoryJson);
};

exports.getOverallLeaveHistory = function(req, res) {
    events.emit('JsonResponse', req, res, overallLeaveHistoryJson);
};


exports.getUserLeaveHistory = function(req, res) {
    nsaCassandra.Attendance.getUserLeaveHistory(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2801));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.getOverallAttendanceHistory = function(req, res) {
    events.emit('JsonResponse', req, res, overallattendanceHistoryJson);
};

exports.getAttendanceHistory = function(req, res) {
    var havePermissions = nsaCassandra.BaseService.haveAnyPermissions(req, constant.ATTENDANCE_HISTORY_PERMISSIONS);
    if(havePermissions) {
        var data = [];
        async.waterfall([
            getAcademicYearDetails.bind(null, req, data),
            nsaCassandra.Attendance.getDetailsByClassAndSec.bind(),
            getAttendanceHistoryObj.bind()
        ], function(err, data) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2801));
            } else {
                events.emit('JsonResponse', req, res, data);
            }
        });
    } else {
        events.emit('JsonResponse', req, res, []);
    }
};

function getAttendanceHistoryObj(data, callback) {
    nsaCassandra.Attendance.getAttendanceHistoryObjs(data, function(err, data){
        callback(err, data);
    })
};
exports.getAttendanceHistoryObj = getAttendanceHistoryObj;

exports.getAttendanceHistoryOverview = function(req, res) {
    var havePermissions = nsaCassandra.BaseService.haveAnyPermissions(req, constant.ATTENDANCE_HISTORY_PERMISSIONS);
    if(havePermissions) {
        var data = [];
        async.waterfall([
            getAcademicYearDetails.bind(null, req, data),
            nsaCassandra.Attendance.getDetailsByClassAndSec.bind(),
            getAttendanceHistoryOverviewObjs.bind()
        ], function(err, data) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2801));
            } else {
                events.emit('JsonResponse', req, res, data);
            }
        });
    } else {
        events.emit('JsonResponse', req, res,{});
    }
};

exports.getAttendanceByMonthOfYear = function(req, res) {
    nsaCassandra.Attendance.getAttendanceByMonthOfYear(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1208));
        } else {
            events.emit('JsonResponse', req, res, buildCalendarObj(result));
        }
    })
};

function buildCalendarObj(result) {
    var calendarObjs = [];
    try{
        if(!_.isEmpty(result)) {
            _.forEach(result, function(value, key){
                var startDate = value.attendanceDate;
                var endDate = value.attendanceDate;
                var calendarObj = {};
                calendarObj['title'] = value.isPresent ? 'Present' : 'Absent';
                calendarObj['start'] = startDate;
                calendarObj['end'] = endDate;
                calendarObjs.push(calendarObj);
            });
        }
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4821);
    }
    return calendarObjs;
};
exports.buildCalendarObj = buildCalendarObj;

function getAttendanceHistoryOverviewObjs(data, callback) {
    nsaCassandra.Attendance.getAttendanceHistoryOverviewObjs(data, function(err, result){
        callback(err, result);
    })
};
exports.getAttendanceHistoryOverviewObjs = getAttendanceHistoryOverviewObjs;

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.insertAuditLog = insertAuditLog;

function saveAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveAuditLog(req, data, function(err, result) {
        callback(err, req, data);
    })
};
exports.saveAuditLog = saveAuditLog;

function saveLeaveDetailsData(req, data, callback) {
    nsaCassandra.Attendance.saveLeaveDetails(req, data, function(err, result) {
        data.features = {featureId : constant.ATTENDANCE, actions : constant.CREATE, featureTypeId : data.leave_history_id};
        callback(err, req, data);
    })
};
exports.saveLeaveDetailsData = saveLeaveDetailsData;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.ATTENDANCE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

function throwAttendanceErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.ATTENDANCE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwAttendanceErr = throwAttendanceErr;