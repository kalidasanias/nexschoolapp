/**
 * Created by Kiranmai A on 5/25/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    async = require('async'),
    events = require('@nsa/nsa-commons').events,
    constant = require('@nsa/nsa-commons').constants,
    message = require('@nsa/nsa-commons').messages,
    baseService = require('../common/base.service'),
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    logger = require('../../../config/logger'),
    dateUtils = require('@nsa/nsa-commons').dateUtils,
    es = require('../../services/search/elasticsearch/elasticsearch.service'),
    _ = require('lodash'),
    notificationService = require('../sms/notifications/notification.service');

var json = require('../../test/json-data/leaves/user-leaves-take.json');

exports.applyEmpLeave = function(req, res) {

    async.parallel({
       leaveTypeHolidays: getLeaves.bind(null, req),
       holidays: getAllHolidays.bind(null, req),
       weekoffs: getSchoolWeekOff.bind(null, req),
    }, function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2807));
        } else {
            calDaysAndValidate(req, result, function(err, days) {
                if(err){
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2807));
                } else {
                    var totalDays = result.leaveTypeHolidays.remLeaves;
                    var day = totalDays - days;
                    if(day < 0) {
                        events.emit('ErrorJsonResponse', req, res, {message: message.nsa2814});
                    } else {
                        req.body['leavesCount'] = days;
                        async.waterfall([
                            findReportingEmpForEmp.bind(null, req),
                            findReportingEmpObj.bind(),
                            saveEmpAppliedLeaveDetails.bind(),
                            saveEmpAppliedLeaveLogs.bind(),
                            saveLeaveAppliedHistory.bind(),
                            executeBatch.bind()
                        ], function (err, result) {
                            if(err){
                                logger.debug(err);
                                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2807));
                            }else {
                                sendLeaveReqNotification(req, result, function(err1, data){
                                    if(err1) {
                                        logger.debug(err1);
                                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa2807));
                                    } else {
                                        data['message'] = message.nsa2806;
                                        events.emit('JsonResponse', req, res, data);
                                    }
                                });
                            }
                        })
                    }
                }
            })
        }
    })
};

function getLeaves(req, callback) {
    async.parallel(
        {
            getLeaveTypeName: getLeaveAssignByTypeId.bind(null, req),
            leavesTaken: leavesTakenByEmployee.bind(null, req)
        }, function(err, data) {
            if (err) {
                callback(err, null);
            } else {
                getLeavesCount(data, function(err, result) {
                   callback(err, result);
                })
            }
        })
}
exports.getLeaves = getLeaves;

function calDaysAndValidate(req, data, callback) {
    var date1 = req.body.fromDate;
    var date2 = req.body.toDate;
    date1 = new Date(date1);
    date2 = new Date(date2)
    var dates = dateUtils.getDatesBetweenTwoDates(date1, date2);
    var days = dateUtils.getNoOfDays(date1, date2);
    try {
        if(Array.isArray(data.holidays) && !_.isEmpty(data.holidays)) {
            _.forEach(_.uniqBy(data.holidays, 'fullDate'), function(val){
                var hStart = new Date((val.startDate).toString());
                var hEnd = new Date((val.endDate).toString());
                _.forEach(dates, function(date){
                    var sFound = dateUtils.checkDateInRange(hStart, hEnd, date);
                    if(sFound) {
                        var day = false;
                        var dataVal = data.weekoffs;
                        var weekDays = dateUtils.checkSatAndSunWeek(date);
                        if(weekDays.haveDay) {
                            day = checkSatAndSunInDate(dataVal, weekDays);
                        }
                        if(!day) {
                            days = days - 1;
                        }
                    }
                })
            })
        }
        if(!_.isEmpty(data.weekoffs)) {
            var dataVal = data.weekoffs;
            _.forEach(dates, function(date){
                var weekDays = dateUtils.checkSatAndSunWeek(date);
                if(dataVal.saturday != undefined) {
                    if(weekDays.haveDay) {
                        if(weekDays.day == 6) {
                            var day = _.includes(dataVal.saturday, weekDays.weekNo);;
                            if(day) {
                                days = days - 1;
                            }

                        } else if(weekDays.day == 0) {
                            var day = _.includes(dataVal.sunday, weekDays.weekNo);;
                            if(day) {
                                days = days - 1;
                            }
                        }
                    }
                }
            })
        }
        callback(null, days);

    } catch (err) {
        callback(err, null);
    }

}
exports.calDaysAndValidate = calDaysAndValidate;


function getAllHolidays(req, callback) {
    nsaCassandra.Holiday.getAllSchoolHolidays(req, function(err, result){
        callback(err, result);
    })
}
exports.getAllHolidays = getAllHolidays;

function getSchoolWeekOff(req, callback) {
    nsaCassandra.Holiday.getSchoolWeekOff(req, function(err, result){
        callback(err, result);
    })
}
exports.getSchoolWeekOff = getSchoolWeekOff;

function sendLeaveReqNotification(req, data, callback) {
    async.waterfall([
            buildUsers.bind(null, req, data),
            getApplyLeaveTemplate.bind(),
            getTemplateObj.bind(),
            buildFeatureNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind()
        ],
        function (err, data) {
            callback(err, data)
        }
    )
};
exports.sendLeaveReqNotification = sendLeaveReqNotification;

function buildUsers(req, data, callback) {
    var users = data.reportingEmpObj;
    try {
        data['users'] = users;
        callback(null, req, data);
    } catch(err) {
        logger.debug(err);
        callback(err, null, null);
    }
};
exports.buildUsers = buildUsers;

exports.editEmpLeave = function(req, res) {
    async.parallel({
        leaveTypeHolidays: getLeaves.bind(null, req),
        holidays: getAllHolidays.bind(null, req),
        weekoffs: getSchoolWeekOff.bind(null, req),
    }, function (err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2807));
        } else {
            var data = req.body;
            if(req.body.status == constant.PENDING) {
                calDaysAndValidate(req, result, function(err, days) {
                    if(err){
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2807));
                    } else {
                        var totalDays = result.leaveTypeHolidays.remLeaves;
                        var day = totalDays - days;
                        if(day < 0) {
                            events.emit('ErrorJsonResponse', req, res, {message: message.nsa2814});
                        } else {
                            req.body['leavesCount'] = days;
                            async.waterfall([
                                findReportingEmpObj.bind(null, req, data),
                                editEmpAppliedLeaveDetails.bind(),
                                editEmpAppliedLeaveLogs.bind(),
                                saveLeaveAppliedHistory.bind(),
                                executeBatch.bind()
                            ], function (err, result) {
                                if(err){
                                    logger.debug(err);
                                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2807));
                                }else {
                                    sendLeaveReqNotification(req, result, function(err1, data){
                                        if(err1) {
                                            logger.debug(err1);
                                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa2807));
                                        } else {
                                            data['message'] = message.nsa2806;
                                            events.emit('JsonResponse', req, res, data);
                                        }
                                    });
                                }
                            })

                        }
                    }
                })
            } else {
                async.waterfall([
                    findReportingEmpObj.bind(null, req, data),
                    editEmpAppliedLeaveDetails.bind(),
                    saveEmpAppliedLeaveLogs.bind(),
                    saveLeaveAppliedHistory.bind(),
                    executeBatch.bind()
                ], function (err, result) {
                    if(err){
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2807));
                    }else {
                        if(req.body.status == constant.CANCELLED) {
                            data['message'] = message.nsa2811;
                            events.emit('JsonResponse', req, res, data);
                        } else {
                            sendUpdateLeaveNotification(req, result, function(err1, data){
                                if(err1) {
                                    logger.debug(err1);
                                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa2807));
                                } else {
                                    req.body.status == constant.APPROVED ?  data['message'] = message.nsa2812 : data['message'] = message.nsa2813;
                                    events.emit('JsonResponse', req, res, data);
                                }
                            })
                        }
                    }
                })
            }
        }
    })
};

function sendUpdateLeaveNotification(req, data, callback) {
    async.waterfall([
            buildUpdateUsers.bind(null, req, data),
            getUpdateLeaveTemplate.bind(),
            getUpdateTemplateObj.bind(),
            buildFeatureNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind()
        ],
        function (err, data) {
            callback(err, data)
        }
    )
};
exports.sendLeaveReqNotification = sendLeaveReqNotification;

function buildUpdateUsers(req, data, callback) {
    data['empUserName'] = req.body.empId;
    es.getUserObj(req, data, function(err, result){
        if(err) {
            logger.debug(err);
            callback(err, null);
        } else {
            data['users'] = result;
            callback(null, req, data);
        }
    });
};
exports.buildUpdateUsers = buildUpdateUsers;

function editEmpAppliedLeaveDetails(req, data, callback) {
    nsaCassandra.Leaves.editEmpAppliedLeaveDetails(req, data, function(err, result){
        callback(err, req, result)
    });
};
exports.editEmpAppliedLeaveDetails = editEmpAppliedLeaveDetails;

function editEmpAppliedLeaveLogs(req, data, callback) {
    nsaCassandra.Leaves.editEmpAppliedLeaveLogs(req, data, function(err, result){
        callback(err, req, result)
    });
};
exports.saveEmpAppliedLeaveLogs = saveEmpAppliedLeaveLogs;

function editLeaveAppliedHistory(req, data, callback) {
    nsaCassandra.Leaves.editLeaveAppliedHistory(req, data, function(err, result){
        callback(err, req, result)
    });
};
exports.editLeaveAppliedHistory = editLeaveAppliedHistory;

function getApplyLeaveTemplate(req, users, callback) {
    var data = {action: constant.CREATE_ACTION, userType: constant.EMPLOYEE};
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getApplyLeaveTemplate = getApplyLeaveTemplate;

function getUpdateLeaveTemplate(req, users, callback) {
    var data;
    if(req.body.status == constant.APPROVED) {
        data = {action: constant.CREATE_ACTION, userType: constant.EMPLOYEE};
    } else if (req.body.status == constant.DENIED) {
        data = {action: constant.UPDATE_ACTION, userType: constant.EMPLOYEE};
    }
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getUpdateLeaveTemplate = getUpdateLeaveTemplate;

function getTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.leavesbase.getTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getTemplateObj = getTemplateObj;

function getUpdateTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.leavesbase.getUpdateTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getUpdateTemplateObj = getUpdateTemplateObj;

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;

function findReportingEmpForEmp(req, callback) {
    nsaCassandra.Leaves.findReportingEmpForEmp(req, function(err, result){
        result['empUserName'] = result.reporting_emp_id;
        callback(err, req, result)
    })
}
exports.findReportingEmpForEmp = findReportingEmpForEmp;

function findReportingEmpObj(req, data, callback) {
    es.getUserObj(req, data, function(err, result){
        data['reportingEmpObj'] = result;
        callback(err, req, data)
    });
};
exports.findReportingEmpObj = findReportingEmpObj;

function saveEmpAppliedLeaveDetails(req, data, callback) {
    nsaCassandra.Leaves.saveEmpAppliedLeaveDetails(req, data, function(err, result){
        callback(err, req, result)
    });
};
exports.saveEmpLeaveAppliedDetails = saveEmpAppliedLeaveDetails;

function saveEmpAppliedLeaveLogs(req, data, callback) {
    nsaCassandra.Leaves.saveEmpAppliedLeaveLogs(req, data, function(err, result){
        callback(err, req, result)
    });
};
exports.saveEmpAppliedLeaveLogs = saveEmpAppliedLeaveLogs;

function saveLeaveAppliedHistory(req, data, callback) {
    nsaCassandra.Leaves.saveLeaveAppliedHistory(req, data, function(err, result){
        callback(err, req, result)
    });
};
exports.saveLeaveAppliedHistory = saveLeaveAppliedHistory;

exports.leavesTakenByEmp = function(req, res) {
    nsaCassandra.Leaves.leavesTakenByEmp(req, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

exports.getTakenLeavesByEmp = function(req, res) {
    nsaCassandra.Leaves.getTakenLeavesByEmp(req, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};



exports.getEmpAppliedLeaves = function(req, res) {
    nsaCassandra.Leaves.getEmpAppliedLeaves(req, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

exports.getEmpLeavebyStatus = function(req, res) {
    nsaCassandra.Leaves.getEmpLeavebyStatus(req, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

 exports.getRemainingLeaves = function(req, res) {
    async.parallel({
        leaveTypes: leaveTypes.bind(null, req),
        leavesTaken: leavesTaken.bind(null, req)
    }, function(err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
        } else {
            getRemaingLeaves(data, function(err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    })

};

exports.getLeaveByTypeAndName = function (req, res) {
    async.parallel(
        {
            getLeaveTypeName: getLeaveAssignByTypeName.bind(null, req),
            leavesTaken: leavesTaken.bind(null, req)
        }, function(err, data) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
            } else {
                getLeavesCount(data, function(err, result) {
                    if (err) {
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
                    } else {
                        events.emit('JsonResponse', req, res, result);
                    }
                })
            }
    })
};

exports.getAppliedLeaveDetailsById = function(req, res) {
    async.waterfall([
        getAppliedLeavesById.bind(null, req),
        getLeaveTypeById.bind(),
    ], function(err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    })
};

exports.getReqLeavesByRempId = function(req, res) {
    async.parallel({
        empLists : nsaCassandra.Leaves.getReqLeavesByRempId.bind(null, req),
        empObjs : es.getAllEmployees.bind(null, req)
    }, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
        } else {
            buildEmpListsObj(data, function(err, result){
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    });
};

exports.getEmpByRempId = function(req, res) {
    async.parallel({
      empLists : getEmpListsbyRempId.bind(null, req),
      empObjs : es.getAllEmployees.bind(null, req)
    }, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
        } else {
            buildEmpListsObj(data, function(err, result){
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
                } else {
                    events.emit('JsonResponse', req, res, _.uniqBy(result, 'empId'));
                }
            })
        }
    });
};

function buildEmpListsObj(data, callback) {
    try {
        var empLists = data.empLists;
        _.forEach(empLists, function(value, key){
            var empInfo = filterEmpDetails(data.empObjs, value.empId);
            value['empName'] = empInfo[0].firstName;
            value['designation'] = empInfo[0].desg.desg_name;
        })
        callback(null, empLists);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};
exports.buildEmpListsObj = buildEmpListsObj;

function filterEmpDetails(data, value) {
    var empInfo  = _.filter(data, {'user_name': value});
    return empInfo;
}

function getEmpListsbyRempId(req, callback) {
    nsaCassandra.Leaves.getEmpByRempId(req, function(err, data){
        callback(err, data);
    })
};
exports.getEmpListsbyRempId = getEmpListsbyRempId;

exports.getApprovalHistory = function(req, res) {
    async.parallel({
        empLists : nsaCassandra.Leaves.getLeavesApprovedByRemp.bind(null, req),
        empObjs : es.getAllEmployees.bind(null, req)
    }, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
        } else {
            buildEmpListsObj(data, function(err, result){
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    });
};


function leaveTypes(req, callback) {
    nsaCassandra.LeaveAssign.getLeaveAssignByName(req, function (err, result) {
        callback(err, result)
    })
};
exports.leaveTypes = leaveTypes;

function leavesTaken(req, callback) {
    nsaCassandra.Leaves.leavesTakenByEmp(req, function(err, data){
        callback(err, data)
    })
}

exports.leavesTaken = leavesTaken;

function leavesTakenByEmployee(req, callback) {
    nsaCassandra.Leaves.leavesTakenByEmployee(req, function(err, data){
        callback(err, data)
    })
}

exports.leavesTakenByEmployee = leavesTakenByEmployee;


function getLeaveTypeById(req, data, callback) {
    nsaCassandra.LeaveType.getLeaveTypeById(req, data, function(err, result) {
        data['leaveTypeName'] = result.leave_type_name
        callback(err, data)
    })
};
exports.getLeaveTypeById = getLeaveTypeById;

function getAppliedLeavesById(req, callback) {
    nsaCassandra.Leaves.getAppliedLeaveDetailsById(req, function(err, result){
        callback(err, req, result)
    })
};
exports.getAppliedLeavesById = getAppliedLeavesById;

function getRemaingLeaves(data, callback) {
    var remObj = [];
    try {
        if(!_.isEmpty(data.leaveTypes)) {
            _.forEach(data.leaveTypes, function(val) {
                var leavCount = 0;
                var totalLeaves =  val.no_of_leaves;
                var leaves = _.filter(data.leavesTaken, {'leaveTypeId' : val.leave_type_id});
                if(!_.isEmpty(leaves)) {
                    _.forEach(leaves, function(leav) {
                        leavCount = leavCount + Number(leav.leavesCount)
                    })
                }
                var remainingLeaves = totalLeaves - leavCount;
                remainingLeaves = remainingLeaves > 0 ? remainingLeaves : 0;
                val['remainingLeaves'] = remainingLeaves;
                val['leaveTypeName'] = val.leave_type_name;
                remObj.push(val);
            })
        }
        callback(null, remObj);
    } catch (err) {
        callback(err, null);
    }
}

exports.getRemaingLeaves = getRemaingLeaves;

exports.getCalendarObj = function(req, res) {
    async.parallel({
        leavesTaken: nsaCassandra.Leaves.leavesTakenByEmp.bind(null, req),
        holidays: nsaCassandra.Holiday.getAllSchoolHolidays.bind(null, req)
    }, function (err, data){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa2810));
        } else {
            events.emit('JsonResponse', req, res, buildCalendarObj(data));
        }
    });
};

function buildCalendarObj(data) {
    var calendarObjs = [];
    try{
        if(!_.isEmpty(data)) {
            var holidays = data.holidays;
            var leavesTaken = data.leavesTaken;
            if(Array.isArray(holidays) && !_.isEmpty(holidays)) {
                _.forEach(holidays, function(value, key){
                    var calendarObj = {};
                    calendarObj['title'] = value.holidayName;
                    calendarObj['start'] = dateUtils.setTimeToDate(new Date(value.startDate), '00:00:00');
                    calendarObj['end'] = dateUtils.setTimeToDate(new Date( value.endDate), '23:59:00');
                    calendarObj['color'] = '#FFC300';
                    calendarObjs.push(calendarObj);
                });
            }
            if(Array.isArray(leavesTaken) && !_.isEmpty(leavesTaken)) {
                _.forEach(leavesTaken, function(value, key){
                    var startDate = value.fromDate;
                    var endDate = value.toDate;
                    var calendarObj = {};
                    calendarObj['title'] = 'Leave approved';
                    calendarObj['start'] = dateUtils.setTimeToDate(new Date(startDate), '00:00:00');
                    calendarObj['end'] = dateUtils.setTimeToDate(new Date( endDate), '23:59:00');
                    calendarObj['color'] = '#0cd63b';
                    calendarObjs.push(calendarObj);
                });
            }
        }
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa2810);
    }
    return calendarObjs;
};
exports.buildCalendarObj = buildCalendarObj;

function getLeaveAssignByTypeName(req, callback) {
    nsaCassandra.LeaveAssign.getLeaveAssignByTypeName(req, function (err, result) {
        callback(err, result);
    });
}

exports.getLeaveAssignByTypeName = getLeaveAssignByTypeName;

function getLeaveAssignByTypeId(req, callback) {
    nsaCassandra.LeaveAssign.getLeaveAssignByTypeId(req, function (err, result) {
        callback(err, result);
    });
}

exports.getLeaveAssignByTypeId = getLeaveAssignByTypeId;

function getLeavesCount(data, callback) {
    var leaves = data.getLeaveTypeName;
    try {
        var leavesCount = 0;
        if(!_.isEmpty(data.leavesTaken)) {
            var leaveDetails = _.filter(data.leavesTaken, {'leaveTypeId' : leaves.leave_type_id});
            _.forEach(leaveDetails, function(val){
                leavesCount = leavesCount + Number(val.leavesCount)
            })
            leaves['remLeaves'] = leaves.no_of_leaves - leavesCount;
        } else {
            leaves['remLeaves'] = leaves.no_of_leaves;
        }
        callback(null, leaves);
    } catch (err) {
        callback(err, null);
    }
}

exports.getLeavesCount = getLeavesCount;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
};
exports.executeBatch = executeBatch;

function checkSatAndSunInDate(dataValue , weekDays){
    var day = false;
    if(weekDays.day == 6){
        day = _.includes(dataValue.saturday, weekDays.weekNo);
    } else {
        day = _.includes(dataValue.sunday, weekDays.weekNo);
    }

    return day;
}

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.LEAVES_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;