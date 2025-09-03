/**
 * Created by Kiranmai A on 3/13/2017.
 */

var events = require('@nsa/nsa-commons').events,
    nsaCassandra = require('@nsa/nsa-cassandra'),
    BaseError = require('@nsa/nsa-commons').BaseError,
    es = require('../../services/search/elasticsearch/elasticsearch.service'),
    notificationService = require('../sms/notifications/notification.service'),
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    dateService = require('../../utils/date.service.js'),
    _= require('lodash'),
	constant = require('@nsa/nsa-commons').constants,
    dateUtils = require('@nsa/nsa-commons').dateUtils,
    nsaAsset = require('@nsa/nsa-asset'),
    logger = require('../../../config/logger'),
    baseService = require('../../../node_modules/@nsa/nsa-cassandra/src/services/common/base.service'),
    gallary = require('../gallery/gallery.service');

const timeTableConfig = require('../../test/json-data/timetable/get-time-configuration.json');
const success = require('../../test/json-data/timetable/save-timetable.json');
const failure = require('../../test/json-data/failure/failure.json');
const getTimetableByClass = require('../../test/json-data/timetable/get-timetable-by-class.json');
const getTimetableByClssAndSec = require('../../test/json-data/timetable/get-timetable-by-class-section.json');
const getTimetableByClssSecAndday = require('../../test/json-data/timetable/get-class-section-timetable-by-day.json');
const getTimetableByUser = require('../../test/json-data/timetable/get-timetable-by-user.json');
const getTimetableByEmpByDay = require('../../test/json-data/timetable/get-timetable-by-employee-by-day.json');

exports.getAllTimetableConfig = function(req, res) {
    var havePermissions = nsaCassandra.BaseService.haveAnyPermissions(req, constant.TIMETABLE_CONF_PERMISSIONS);
    if(havePermissions) {
        async.parallel({
                timeTableConfig : getSchoolTimeTableConfig.bind(null, req, constant.TIMETABLE_CONF_PERMISSIONS),
                classes : getClasses.bind(null, req),
                days: getDays.bind(null, req)
            },
            function (err, result) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4607));
                } else {
                    getAllConfig(req, res, result, function(err1, result1){
                        if(err1) {
                            logger.debug(err);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4607));
                        } else {
                            events.emit('JsonResponse', req, res, result1);
                        }
                    });
                }
            }
        );
    } else {
        events.emit('JsonResponse', req, res, []);
    }
};

exports.getAllTimetableConfigClass = function(req, res) {
    async.parallel({
            timeTableConfig : getSchoolTimeTableConfigWithoutPer.bind(null, req),
            classes : getClasses.bind(null, req)
        },
        function (err, result) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4607));
            } else {
                getAllConfigClass(req, res, result, function(err1, result1){
                    if(err1) {
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4607));
                    } else {
                        events.emit('JsonResponse', req, res, result1);
                    }
                });
            }
        }
    );
};


exports.getTimetableConfigById = function(req, res) {
    async.parallel({
            timeTableConfig : getSchoolTimeTableConfigById.bind(null, req),
            classes : getClasses.bind(null, req),
            schoolPeriods: getSchoolPeriods.bind(null, req),
        },
        function (err, data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4607));
            } else {
                getTimetableConfigByIds(req, res, data, function (err1, result1) {
                    if(err1) {
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4607));
                    } else {
                        events.emit('JsonResponse', req, res, result1);
                    }
                });
            }
        }
    );
};

exports.getClassTimetableConfig = function(req, res) {
    nsaCassandra.Timetable.getClassTimetableConfig(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4607));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.saveTimetableConfig = function(req, res) {
    async.waterfall(
        [
            saveSchoolPeriods.bind(null, req),
            saveSchoolTimeTableConfig.bind(),
            executeBatch.bind()
        ],
        function (err, data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4603));
            } else {
                events.emit('JsonResponse', req, res, {message: message.nsa4604});
            }
        }
    );
};

function getSchoolTimeTableConfigById(req, callback) {
    nsaCassandra.Timetable.getTimetableConfigById(req, function(err, result) {
             callback(err, result);
    })
}
exports.getSchoolTimeTableConfigById = getSchoolTimeTableConfigById;

function getSchoolTimeTableConfiById(req, callback) {
    nsaCassandra.Timetable.getTimetableConfigById(req, function(err, result) {
        callback(err, req, result);
    })
}
exports.getSchoolTimeTableConfiById = getSchoolTimeTableConfiById;

function getAllConfigClass(req, res, data, callback){
    try {
          var classes =[];
        if(!_.isEmpty(data.classes)){
            _.forEach(data.classes, function(value){
                 var configClass = _.filter(data.timeTableConfig, {'applicable_class': value.class_id});
                if(_.isEmpty(configClass)){
                    classes.push(value);
                }
            })
        }
      callback(null, classes)
    }catch (err){
        logger.debug(err);
        callback(err, null);
    }
}

function getAllConfig(req, res, data, callback) {
    try {
        var result = [];
        if(!_.isEmpty(data.timeTableConfig)) {
            _.forEach(data.timeTableConfig, function(value) {
                var dayNames = [];
                var schoolStartTime = value.school_hours.from;
                var schoolEndTime = value.school_hours.to;
                var days = value.working_days;
                _.forEach(days, function(val) {
                    days =  _.filter(data.days, {'id': val});
                    dayNames.push(days[0].name);
                })
                value.school_hours.from = dateUtils.convertTo12Hour(schoolStartTime.toString());
                value.school_hours.to = dateUtils.convertTo12Hour(schoolEndTime.toString());
                var classDetails = filterClassDetails(data.classes, value.applicable_class);
                value['className'] = classDetails[0].class_name;
                value['dayNames'] = dayNames;
                value['editPermissions'] = value.editPermissions;
                result.push(value);
            });
        }

        callback(null, result)
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
}
exports.getAllConfig = getAllConfig;

function getTimetableConfigByIds(req, res, data, callback) {
    try {
        var periods = [];
        var config = data.timeTableConfig;
        var classDetails = filterClassDetails(data.classes, data.timeTableConfig.applicable_class);
        _.forEach(data.timeTableConfig.school_periods, function(value) {
            var periodDetails = filterSchoolPeriods(data.schoolPeriods, value);
            periods.push(periodDetails[0]);
        });
        config['className'] = classDetails[0].class_name;
        config['periods'] = _.orderBy(periods, 'period_start_time');
        callback(null, config);
    } catch (err) {
        callback(err, null);
    }
}
exports.getTimetableConfigByIds = getTimetableConfigByIds;

function getSchoolTimeTableConfig(req, permissions, callback) {
    nsaCassandra.Timetable.getAllTimetableConfig(req, permissions, function(err, result) {
        callback(err, result);
    })
}
exports.getSchoolTimeTableConfig = getSchoolTimeTableConfig;

function getSchoolTimeTableConfigWithoutPer(req, callback){
    nsaCassandra.Timetable.getAllTimeTableConfigWithoutPer(req, function(err, result) {
        callback(err, result);
    })
}


function saveSchoolTimeTableConfig(req, data, callback) {
    nsaCassandra.Timetable.saveTimetableConfig(req, data, function(err, result) {
        callback(null, req, result);
    })
}
exports.saveSchoolTimeTableConfig = saveSchoolTimeTableConfig;

function saveSchoolPeriods(req, callback) {
    nsaCassandra.Periods.saveSchoolPeriod(req, function(err, result) {
        callback(null, req, result);
    })
}
exports.saveSchoolPeriods = saveSchoolPeriods;

function getEmployeeClassifications(req,callback) {
    nsaCassandra.User.getAllEmployees(req, function(err, result) {
        callback(err, result);
    })
}
exports.getEmployeeClassifications = getEmployeeClassifications;
/*
function getUsersByType(req, callback) {
    var data = [];
    data['userType'] = constant.EMPLOYEE;
    nsaCassandra.User.getUsersByUserType(req, data, function(err, result) {
        callback(err, result);
    })
}
exports.getUsersByType = getUsersByType;*/

exports.updateTimetableConfig = function(req, res) {
    var data = [];
    async.waterfall(
        [
            getSchoolTimeTableConfiById.bind(null, req),
            deleteSchoolPeriods.bind(),
            updateSchoolPeriods.bind(),
            updateSchoolTimeTableConfig.bind(),
            executeBatch.bind()
        ],
        function (err, data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4601));
            } else {
                events.emit('JsonResponse', req, res, {message: message.nsa4602});
            }
        }
    );
};

function updateSchoolTimeTableConfig(req, data, callback) {
    nsaCassandra.Timetable.updateTimetableConfig(req, data, function(err, result) {
        callback(null, req, result);
    })
}
exports.updateSchoolTimeTableConfig = updateSchoolTimeTableConfig;

function updateSchoolPeriods(req, data, callback) {
    nsaCassandra.Periods.updateSchoolPeriods(req, data, function(err, result) {
        callback(err, req, result);
    })
}
exports.updateSchoolPeriods = updateSchoolPeriods;

exports.deleteTimetableConfig = function(req, res) {
    nsaCassandra.Timetable.findTimetableConfigInTimetable(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            async.waterfall(
                [
                    getSchoolTimeTableConfiById.bind(null, req),
                    deleteSchoolPeriods.bind(),
                    deleteSchoolTimeTableConfig.bind(),
                    executeBatch.bind()
                ],
                function (err, data) {
                    if(err) {
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4605));
                    } else {
                        var result = {message: message.nsa4606};
                        events.emit('JsonResponse', req, res, result);
                    }
                }
            );
        }
    });
};

function deleteSchoolTimeTableConfig(req, data, callback) {
    nsaCassandra.Timetable.deleteTimetableConfig(req, data, function(err, result) {
        callback(null, req, result);
    })
}
exports.deleteSchoolTimeTableConfig = deleteSchoolTimeTableConfig;

function deleteSchoolPeriods(req, data, callback) {
    nsaCassandra.Periods.deleteSchoolPeriods(req, data, function(err, result) {
        callback(err, req, result);
    })
}
exports.deleteSchoolPeriods = deleteSchoolPeriods;

function getUniqueValues(classes) {
    var classDetails = [];
    try {
        _.forEach(classes, function (val) {
            var stringfyClasses = JSON.stringify(val);
            var clsData = _.uniqBy(JSON.parse(stringfyClasses), 'section_id');
            classDetails.push(clsData);
        })
        classDetails = _.flatten(classDetails);
    } catch (err) {
        logger.debug(err);
        return err;
    }
    return classDetails;
}

function classTimetableObj(req, classDetails, data, classTimetable) {
    var classTimetable = [];
    try {
        _.forEach(classDetails, function (val) {
            var classData = {};
            var stringfyTimetable = JSON.stringify(data.timeTableConfig);
            var timetableConfig = _.filter(JSON.parse(stringfyTimetable), {'applicable_class': val.class_id});
            var classInfo = JSON.stringify(data.classes);
            var sectionInfo = JSON.stringify(data.sections);
            var dayInfo = JSON.stringify(data.days)
            var classObj = filterClassDetails(JSON.parse(classInfo), val.class_id);
            var sectionObj = filterSectionDetails(JSON.parse(sectionInfo), val.section_id);
            var dayName = filterDayDetails(JSON.parse(dayInfo), val);
            classData['classId'] = classObj[0].class_id;
            classData['className'] = classObj[0].class_name;
            timetableConfig[0].school_hours.from = dateUtils.convertTo12Hour(timetableConfig[0].school_hours.from.toString());
            timetableConfig[0].school_hours.to = dateUtils.convertTo12Hour(timetableConfig[0].school_hours.to.toString());
            classData['schoolHours'] = timetableConfig[0].school_hours['from'] + ' - ' + timetableConfig[0].school_hours['to'];
            classData['updatedBy'] = val.updated_by;
            classData['updatedUsername'] = val.updated_username + '-' + val.updated_date;
            classData['sectionId'] = sectionObj[0].sectionId;
            classData['sectionName'] = sectionObj[0].sectionName;
            classData['date'] = dateService.getFormattedDate(val.day_date);
            classData['dayId'] = val.day_id;
            classData['dayName'] = dayName[0].name;
            classData['editPermissions'] = nsaCassandra.BaseService.havePermissionsToEdit(req, constant.TIMETABLE_PERMISSIONS, val['created_by']);
            if(val.is_special_day) {
                classData['timetableName'] = 'Special Day';
            }
            classTimetable.push(classData);
        })
    } catch (err) {

        return err;

    }
    return classTimetable;
}
function getClassTimeTable(req, res, data) {
    var classDetails = [];
    var classTimetable = [];
    var classes = _.groupBy(data.schoolTimetable, 'class_id');
    if(!_.isEmpty(classes)) {
        classDetails = getUniqueValues(classes);
        classTimetable = classTimetableObj(req, classDetails, data, classTimetable);
        events.emit('JsonResponse', req, res, classTimetable);
    } else {
        events.emit('JsonResponse', req, res, classDetails);
    }
}

function getSpecialDayTimeTable(req, res, data) {
    var classDetails = [];
    var classTimetable = [];
    var dates = _.groupBy(data.schoolTimetable, 'day_date');
    if(!_.isEmpty(dates)) {
        _.forEach(dates, function(val){
            var classes = _.groupBy(val, 'class_id');
            if(!_.isEmpty(classes)) {
                classDetails.push(getUniqueValues(classes));
            }
        });
        classTimetable = classTimetableObj(req, _.flatten(classDetails), data, classTimetable);
        // console.info('classTimetable..',classTimetable);
        events.emit('JsonResponse', req, res, classTimetable);
    } else {
        events.emit('JsonResponse', req, res, classTimetable);
    }
}

exports.getTimetableByClass = function(req, res) {
    var havePermissions = nsaCassandra.BaseService.haveAnyPermissions(req, constant.TIMETABLE_PERMISSIONS);
    if(havePermissions) {
        async.parallel({
            schoolTimetable: getSchoolTimetable.bind(null, req),
            timeTableConfig : getSchoolTimeTableConfig.bind(null, req, constant.TIMETABLE_PERMISSIONS),
            classes : getClasses.bind(null, req),
            sections : getSections.bind(null, req),
            days : getDays.bind(null, req)
            }, function (err, result) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4614));
                } else {
                    getClassTimeTable(req, res, result)
                }
        });
    } else {
        events.emit('JsonResponse', req, res, []);
    }
};

function getSchoolTimetable(req, callback) {
    nsaCassandra.Timetable.getSchoolTimetable(req, function(err, result) {
        callback(err, result);
    })
};
exports.getSchoolTimetable = getSchoolTimetable;

function getSpecialDayTimetable(req, callback) {
    nsaCassandra.Timetable.getSpecialDayTimetable(req, function(err, result) {
        callback(err, result);
    })
};
exports.getSpecialDayTimetable = getSpecialDayTimetable;

function getTimetableConfig(req, data, callback) {
    nsaCassandra.Timetable.getTimetableConfigByClass(req, data, function(err, result) {
        callback(null, result);
    })
};
exports.getTimetableConfig = getTimetableConfig;

exports.getTimetableByUser = function(req, res) {
    events.emit('JsonResponse', req, res, getTimetableByUser);
};

exports.generateTimetable = function(req, res) {
    async.parallel({
        classConfig: fetchTimetableConfiguration.bind(null, req),
        teacherTimetable: fetchPeriodTeacherTimetable.bind(null, req)
    }, function (err, data) {
        validation(req, data, function (arrTeacher) {
            if (arrTeacher.length > 0) {
                logger.debug('auto generated teachers already busy ', arrTeacher);
                var msg = "Following Teachers exceed the periods (show total periods per week) : <br>";
                _.each(arrTeacher, function (teacher) {
                    msg += teacher.name + ' - ' + teacher.busyPeriods + '<br>';
                });
                events.emit('ErrorJsonResponse', req, res, {message: msg});
            } else {
                autoGenerate(req, data, function (err, data) {
                    if (err) {
                        logger.debug('auto generated ', err);
                        events.emit('ErrorJsonResponse', req, res, err);
                    } else {
                        saveAndNotifify(req, function (err, data) {
                            if (err) {
                                logger.debug('save and notification ', err);
                                events.emit('ErrorJsonResponse', req, res, err);
                            } else {
                                events.emit('JsonResponse', req, res, {message: message.nsa4624});
                            }
                        });
                    }

                });
            }
        });

    });
};

function validation(req, data, callback) {
    var notAvailableHrs = false, arrTeacher = [],
        activePeriods = _.filter(data.classConfig.schoolPeriods, function(o) { return !o.is_break; });

    var totalPeriods = data.classConfig.working_days.length * activePeriods.length;
    _.each(req.body.teachers, function (teacher) {
        var totalBusyHrs = +teacher.max_periods + data.teacherTimetable[teacher.emp_id].length;
        if (totalBusyHrs > totalPeriods) {
            arrTeacher.push({name: teacher.emp_name, busyPeriods: data.teacherTimetable[teacher.emp_id].length});
            notAvailableHrs = true;
        }
    });
    callback(arrTeacher);
}

function saveAndNotifify(req, callback) {
    async.waterfall([
        saveClassTimetable.bind(null, req),
        updateEmpClassification.bind(),
        executeBatch.bind()
    ], function(err, data) {
        if (err) {
            logger.debug('save error...', err);
            callback(err, null);
        } else {
            async.waterfall([
                    buildUsers.bind(null, req, data),
                    getTimetableTemplate.bind(),
                    getTimetableTemplateObj.bind(),
                    buildFeatureNotificationObj.bind(),
                    notificationService.sendAllNotification.bind(),
                    notificationService.saveNotificationInfo.bind()
                ], function (err, data) {
                    if (err) {
                        logger.debug('notification error...', err);
                        callback(err, null);
                    } else {
                        callback(null, data);
                    }
                }
            )
        }
    });
}

function autoGenerate(req, data, callback) {
    data.allocatedTeachers = req.body.teachers;
    const fork = require('child_process').fork;
    const forked = fork('src/services/timetable/autogenerate.js');

    forked.on('message', function(msg) {
        console.info('Message from child', msg);
        logger.debug('Message from child', msg);
        // events.emit('JsonResponse', req, res, msg);
        if (msg.err) {
            callback(msg.err, null);
        } else {
            var queryArr = [];
            _.each(msg.periods, function (period) {
                queryArr.push(nsaCassandra.Timetable.contructSchoolTimetable(req, period.subjectId, period.teacherId, period.period_id, period.day_id));
            });

            req.params.classId = req.params.id;
            getTimetableByClssAndSect(req, function(err, result) {
                result = JSON.parse(JSON.stringify(result));
                if (result.length > 0) {
                    callback({message: message.nsa4625}, null);
                } else {
                    executeBatch(req, {batchObj: queryArr}, callback);
                }
            });
        }
        if (msg) {
            forked.kill();
        }
    });

    forked.send(data);

}

function fetchTimetableConfiguration(req, callback) {
    nsaCassandra.Timetable.getClassTimetableConfig(req, function(err, timetableConfig) {
        fetchPeriodFromUuid(timetableConfig.school_periods, function (err, periods) {
            if (periods) {
                timetableConfig.schoolPeriods = periods;
            }
            callback(err, timetableConfig);
        });
    });
}

function fetchPeriodFromUuid(schoolPeriods, callback) {
    nsaCassandra.Periods.getSchoolPeriodsByIds(schoolPeriods, function (err, result) {
        callback(err, result);
    })
}

function fetchPeriodTeacherTimetable(req, callback) {
    var base = require('../common/base.service'), teacherObj = {};
    //req, list, saveObj, data, callback
    base.waterfallOver(req, req.body.teachers, getTeacherTimetable, teacherObj, function(err, result) {
        callback(err, teacherObj);
    });
}

function getTeacherTimetable(req, emp, data, report) {
    nsaCassandra.Timetable.getTimetableByEmpId(req, emp.emp_id, function(err, result) {
        if (result) {
            data[emp.emp_id] = (JSON.parse(JSON.stringify(result)));
        }
        report(err, result);
    });
}

exports.saveTimetable = function(req, res) {
    async.parallel([
            saveSchoolTimetable.bind(null, req)
        ],
        function (err, data) {
            var batchObjArray= [];
            _.forEach(data, function(value, key){
                batchObjArray.push(value.batchObj);
            })
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4611));
            } else {
                executeBatch(req, {batchObj: batchObjArray}, function(err, result) {
                    if(err) {
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4611));
                    } else {
                        var backupObjArray= [];
                        _.forEach(data, function(value, key){
                            backupObjArray.push(value.backupObj);
                        })
                        var obj = _.compact(backupObjArray);
                        data['timetableId'] = obj[0];
                        constructEventObj(req, data, function(err, response){
                            if(err) {
                                logger.debug(err);
                                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4611));
                            } else {
                                response['message'] = message.nsa4610;
                                events.emit('JsonResponse', req, res, response);
                            }
                        })
                    }
                })
            }
        }
    );
};

exports.publishTimetable = function(req, res) {
    async.waterfall([
            saveClassTimetable.bind(null, req),
            updateEmpClassification.bind(),
            executeBatch.bind()
    ], function(err, data){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4611));
        } else {
            async.waterfall([
                    buildUsers.bind(null, req, data),
                    getTimetableTemplate.bind(),
                    getTimetableTemplateObj.bind(),
                    buildFeatureNotificationObj.bind(),
                    notificationService.sendAllNotification.bind(),
                    notificationService.saveNotificationInfo.bind()
                ], function (err, data) {
                    if(err) {
                        logger.debug(err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa204));
                    } else {
                        events.emit('JsonResponse', req, res, {message: message.nsa205});
                    }
                }
            )
        }
    })
};

function getTimetableTemplate(req, users, callback) {
    var data = {featureId : constant.TIMETABLE, subFeatureId: constant.CREATE_TIMETABLE, action: constant.CREATE_ACTION, userType: constant.STUDENT};
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getTimetableTemplate = getTimetableTemplate;

function getTimetableTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.timetablebase.getTimetableTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getTimetableTemplateObj = getTimetableTemplateObj;

function constructEventObj(req, data, callback) {
    async.parallel({
        periods: getSchoolPeriods.bind(null, req),
        employees: getEmployeeClassifications.bind(null, req),
        classes: getClasses.bind(null, req)
    }, function(err, response){
        var body = req.body;
        var employeeInfo = filterEmployeeDetails(response.employees, {emp_id: body.empId});
        var periodInfo = filterPeriodDetails(response.periods, {period_id: body.periodId});
        var classJsonObj = JSON.stringify(response.classes);
        var classInfo = filterClassDetails(JSON.parse(classJsonObj), body.classId);

        var eventObj = {};
        var classCode = classInfo.length > 0 ? (classInfo[0] != null ? classInfo[0].class_code : '') : '' ;
        var empShortName = employeeInfo.length > 0 ? (employeeInfo[0] != null ? employeeInfo[0].short_name : '') : '' ;
        var periodName =  periodInfo.length > 0 ? (periodInfo[0] != null ? periodInfo[0].period_name : '') : '' ;
        var title = classCode + ' ( ' + empShortName + ' ) ' + periodName;
        eventObj['title'] = title;
        eventObj['classId'] = body.classId;
        eventObj['classTeacherUserName'] = body.classTeacherUserName;
        eventObj['dayId'] = body.dayId;
        eventObj['empId'] = body.empId;
        eventObj['sectionId'] = body.sectionId;
        eventObj['subjectId'] = body.subjectId;
        eventObj['periodId'] = body.periodId;
        eventObj['start'] = periodInfo[0].period_start_time;
        eventObj['end'] = periodInfo[0].period_end_time;
        eventObj['timetable_id'] = data.timetableId;
        callback(err, eventObj);
    })
};
exports.constructEventObj = constructEventObj;

exports.saveSpecialDay = function(req, res) {
    var data = [];
    async.waterfall(
        [
            getTimetableByClsSec.bind(null, req, data),
            saveSpecialDayTimetable.bind(),
            executeBatch.bind()
        ],
        function (err, data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4617));
            } else {
                if(req.body.status) {
                    sendSpecialDayNotification(req, function(err1, data){
                        if(err1) {
                            logger.debug(err1);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4617));
                        } else {
                            events.emit('JsonResponse', req, res, {message: message.nsa4618});
                        }
                    })
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa4618});
                }

            }
        }
    );
};

function sendSpecialDayNotification(req, callback) {
    var data = [];
    async.waterfall([
        buildUsers.bind(null, req, data),
        getSpecialDayTemplate.bind(),
        getSpecialDayTemplateObj.bind(),
        buildFeatureNotificationObj.bind(),
        notificationService.sendAllNotification.bind(),
        notificationService.saveNotificationInfo.bind()
    ],function (err, data) {
        callback(err, data);
    })
};
exports.sendSpecialDayNotification = sendSpecialDayNotification;

function getSpecialDayTemplate(req, users, callback) {
    var data = {featureId : constant.TIMETABLE, subFeatureId: constant.SPECIAL_TIMETABLE, action: constant.CREATE_ACTION, userType: constant.STUDENT};
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getSpecialDayTemplate = getSpecialDayTemplate;

function getSpecialDayTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.timetablebase.getSpecialDayTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getSpecialDayTemplateObj = getSpecialDayTemplateObj;

exports.getSpecialDay = function(req, res) {
    var havePermissions = nsaCassandra.BaseService.haveAnyPermissions(req, constant.SPECIAL_TIMETABLE_PERMISSIONS);
    if(havePermissions) {
        async.parallel({
                schoolTimetable: getSpecialDayTimetable.bind(null, req),
                timeTableConfig : getSchoolTimeTableConfig.bind(null, req, constant.SPECIAL_TIMETABLE_PERMISSIONS),
                classes : getClasses.bind(null, req),
                sections : getSections.bind(null, req),
                days: getDays.bind(null, req),
            },
            function (err, result) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4621));
                } else {
                    getSpecialDayTimeTable(req, res, result)
                }
            }
        );
    } else {
        events.emit('JsonResponse', req, res, []);
    }

};

exports.updateSpecialDay = function(req, res) {
    /*events.emit('JsonResponse', req, res, getTimetableByClass);*/
    var data = [];
    async.waterfall(
        [
            getTimetableByClsSecDate.bind(null, req, data),
            delSpecialDayTimetable.bind(),
            getTimetableByClsSec.bind(),
            updateSpecialDayTimetable.bind(),
            executeBatch.bind()
        ],
        function (err, data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4615));
            } else {
                if(req.body.status) {
                    sendUpdateSpecialDayNotification(req, function(err1, data){
                        if(err1) {
                            logger.debug(err1);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4615));
                        } else {
                            events.emit('JsonResponse', req, res, {message: message.nsa4616});
                        }
                    })
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa4616});
                }

            }
        }
    );
};

function sendUpdateSpecialDayNotification(req, callback) {
    var data = [];
    async.waterfall([
        buildUsers.bind(null, req, data),
        getUpdateSpecialDayTemplate.bind(),
        getUpdateSpecialDayTemplateObj.bind(),
        buildFeatureNotificationObj.bind(),
        notificationService.sendAllNotification.bind(),
        notificationService.saveNotificationInfo.bind()
    ],function (err, data) {
        callback(err, data);
    })
};
exports.sendUpdateSpecialDayNotification = sendUpdateSpecialDayNotification;

function getUpdateSpecialDayTemplate(req, users, callback) {
    var data = {featureId : constant.TIMETABLE, subFeatureId: constant.SPECIAL_TIMETABLE, action: constant.UPDATE_ACTION, userType: constant.STUDENT};
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getUpdateSpecialDayTemplate = getUpdateSpecialDayTemplate;

function getUpdateSpecialDayTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.timetablebase.getSpecialDayTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getUpdateSpecialDayTemplateObj = getUpdateSpecialDayTemplateObj;

exports.deleteSpecialDay = function(req, res) {
    var data = [];
    async.waterfall(
        [
            getTimetableByClsSecDate.bind(null, req, data),
            delSpecialDayTimetable.bind(),
            executeBatch.bind()
        ],
        function (err, data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4619));
            } else {
                events.emit('JsonResponse', req, res, {message: message.nsa4620});
            }
        }
    );
};



function saveSchoolTimetable(req, callback) {
    nsaCassandra.Timetable.saveSchoolTimetable(req, function(err, result) {
        callback(err, result);
    })
}
exports.saveSchoolTimetable = saveSchoolTimetable;

function saveSpecialDayTimetable(req, data, callback) {
    data['date'] = req.body.date;
    nsaCassandra.Timetable.saveSpecialDayTimetable(req, data, function(err, result) {
        callback(err, req, data);
    })
};
exports.saveSpecialDayTimetable = saveSpecialDayTimetable;

function updateSpecialDayTimetable(req, data, callback) {
    data['date'] = req.body.updatedDate;
    nsaCassandra.Timetable.saveSpecialDayTimetable(req, data, function(err, result) {
        callback(err, req, data);
    })
};
exports.updateSpecialDayTimetable = updateSpecialDayTimetable;

function delSpecialDayTimetable(req, data, callback) {
    nsaCassandra.Timetable.deleteMultiSchoolTimetable(req, data, function(err, result) {
        callback(err, req, data);
    })
};
exports.delSpecialDayTimetable = delSpecialDayTimetable;

function saveClassTimetable(req, callback) {
    nsaCassandra.Timetable.saveClassTimetable(req, function(err, result) {
        callback(err, req, result);
    })
}
exports.saveClassTimetable = saveClassTimetable;

function updateEmpClassification(req, data, callback) {
    nsaCassandra.Timetable.updateEmpClassification(req, data, function(err, result) {
        callback(err, req, result);
    })
}
exports.updateEmpClassification = updateEmpClassification;

function saveTimetableAcrossPeriod(req, res) {
    async.waterfall([
            saveSwapTimetable.bind(null, req),
            executeBatch.bind()
        ],
        function (err, data) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4611));
            } else {
                data['message'] = message.nsa4610;
                events.emit('JsonResponse', req, res, data);
            }
        });
}

function saveSwapAcrossTimetable(req, res) {
    async.waterfall([
            getTimetableByEmpClassAndSec.bind(null, req),
            getOverallSwapObj.bind(),
            executeBatch.bind()
        ],
        function (err, data) {
            if (err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4611));
            } else {
                data['message'] = message.nsa4610;
                events.emit('JsonResponse', req, res, data);
            }
        });
}

function updateSchoolTimetable(req, res) {
    nsaCassandra.Timetable.updateSchoolTimetable(req, function (err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4613));
        } else {
            data['timetableId'] = req.params.id;
            constructEventObj(req, data, function(err, response){
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4613));
                } else {
                    response['message'] = message.nsa4612;
                    events.emit('JsonResponse', req, res, response);
                }
            })
        }
    });
}

exports.updateTimetable = function(req, res) {
    var body = req.body;
    var swap = body.swap;
    var duration = body.validUpto;
    var isPeriod = body.isPeriod;
    if (swap && duration != '') {
        if(isPeriod) {
            saveTimetableAcrossPeriod(req, res);
        } else {
            saveSwapAcrossTimetable(req, res);
        }
    } else {
        updateSchoolTimetable(req, res);
    }
};

function saveSwapTimetable(req, callback) {
    nsaCassandra.Timetable.saveSwapTimetable(req, function(err, result) {
        callback(err, null, result);
    })
};
exports.saveSwapTimetable = saveSwapTimetable;

function getTimetableByEmpClassAndSec(req, callback) {
    nsaCassandra.Timetable.getTimetableByEmpClassAndSec(req, function(err, result) {
        callback(err, req, result);
    })
};
exports.getTimetableByEmpClassAndSec = getTimetableByEmpClassAndSec;

function getOverallSwapObj(req, data, callback) {
    nsaCassandra.Timetable.getOverallSwapObj(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.getOverallSwapObj = getOverallSwapObj;

exports.addClassTimetable = function(req, res) {
    nsaCassandra.Timetable.addClassTimetable(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4613));
        } else {
            result['message'] = message.nsa4612;
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.updateClassTimetable = function(req, res) {
    nsaCassandra.Timetable.updateSchoolTimetable(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4613));
        } else {
            result['message'] = message.nsa4612;
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.deleteClassTimetable = function(req, res) {
    nsaCassandra.Timetable.deleteSchoolTimetable(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4609));
        } else {
            result['message'] = message.nsa4608;
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveNotes = function(req, res) {
    async.waterfall([
        saveNote.bind(null, req),
        buildUploadObj.bind(),
        uploadNote.bind(),
    ], function(err, result){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4702));
        } else {
            events.emit('JsonResponse', req, res, message.nsa4701);
        }
    });
};

exports.saveTimetableNotes = function(req, res) {
    async.waterfall([
        getNotes.bind(null, req),
        validateNotes.bind()
    ], function(err, result){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4702));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa4701});
        }
    });
};

exports.sendNotification = function(req, res) {
    var data = [];
    async.waterfall([
            buildUsers.bind(null, req, data),
            getNotesTemplate.bind(),
            getTemplateObj.bind(),
            buildFeatureNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind()
        ], function (err, data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa204));
            } else {
                events.emit('JsonResponse', req, res, {message: message.nsa205});
            }
        }
    )
};

exports.sendNotification = function(req, res) {
    var data = [];
    async.waterfall([
            buildUsers.bind(null, req, data),
            getNotesTemplate.bind(),
            getTemplateObj.bind(),
            buildFeatureNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind()
        ], function (err, data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa204));
            } else {
                events.emit('JsonResponse', req, res, {message: message.nsa205});
            }
        }
    )
};

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;

function buildUsers(req, data, callback) {
    var params = {};
    params.size = constant.DEFAULT_PARAM_SIZE;
    params.classId = req.body.classId;
    params.sectionId = req.body.sectionId;
    es.getUsersByClassSec(req, params, function(err, result){
        data['users'] = result;
        data['students'] = result;
        callback(err, req, data);
    })
};
exports.buildUsers = buildUsers;

function getNotesTemplate(req, users, callback) {
    var data = {featureId : constant.TIMETABLE, subFeatureId: constant.CREATE_TIMETABLE, action: constant.UPLOAD_ACTION, userType: constant.STUDENT};
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getNotesTemplate = getNotesTemplate;

function getTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.timetablebase.getTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getTemplateObj = getTemplateObj;

function getNotes(req, callback) {
    nsaCassandra.Timetable.getAttachmentsByCSDayDate(req, function(err, result) {
        callback(null, req, result);
    })
};
exports.getNotes = getNotes;

function updateNotes(req, data, callback) {
    nsaCassandra.Timetable.getAttachmentsByCSDayDate(req, function(err, result) {
        callback(null, req, result);
    })
};
exports.updateNotes = updateNotes;

function validateNotes(req, data, callback) {
    if(data != null && data != undefined) {
        nsaCassandra.Timetable.updateNotes(req, data, function(err, data){
            callback(err, data);
        });
    } else {
        nsaCassandra.Timetable.saveNotes(req, function(err, data){
            callback(err, data);
        });
    }
}

exports.validateNotes = validateNotes;

function saveNote(req, callback) {
    nsaCassandra.Timetable.saveNotes(req, function(err, data){
        callback(err, req, data);
    });
};
exports.saveNote = saveNote;

function buildUploadObj(req, data, callback) {
    try {
        var result = data || {};
        result['featureId'] = constant.TIMETABLE || null;
        result['featureName'] = constant.TIME_TABLE_NAME || null;
        result['subFeatureId'] = constant.CREATE_TIMETABLE || null;
        result['subFeatureName'] = constant.CREATE_TIMETABLE_NAME || null;
        result['academicYear'] = '2016-2017' || null;
        callback(null, req, result);
    } catch (err) {
        callback(err, req, null);
    }

};
exports.buildUploadObj = buildUploadObj;

function uploadNote(req, data, callback) {
    nsaAsset.upload.uploadFiles(req, data, function(err, result) {
        callback(err, result);
    });
};
exports.uploadNote = uploadNote;

exports.getNotes = function(req, res) {
    nsaCassandra.Timetable.getAttachmentsByCSDayDate(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4622));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.deleteAttachments = function(req, res) {
    nsaCassandra.Timetable.deleteAttachment(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4622));
        } else {
            req.body.seletedImageIds  = [req.body.curentFile];
            gallary.deleteS3Src(req, function(err, result1){
                if(err){
                    logger.debugLog(req, 'Delete Exam Schedule ', err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9012));
                }else {
                    var output = { message: message.nsa4703, data: req.body};
                    events.emit('JsonResponse', req, res, output);
                }
            });
        }
    })
};


exports.getNotesByMonthAndYear = function(req, res) {
    nsaCassandra.Timetable.getNotesByMonthAndYear(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4622));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getNotesByCSDate = function(req, res) {
    nsaCassandra.Timetable.getAttachmentsByCSDate(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4622));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};


exports.getCalendarByClsAndSec = function(req, res) {
    var data = [];
    async.parallel({
        periods: getSchoolPeriodsByClass.bind(null, req),
        days: getDays.bind(null, req),
        subjects: getSubjects.bind(null, req),
        classes: getClasses.bind(null, req),
        employees: getEmployeeClassifications.bind(null, req),
        classDetails: getTimetableByClssAndSect.bind(null, req),
        swapTimetableDetails : getSwapTimeTable.bind(null, req),
        sections: getSections.bind(null, req),
        attachments: getAttachmentsByCSWeekNo.bind(null, req)

    }, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4622));
        } else {
            result['weekNo'] = req.query.weekNo;
            getCalendarData(req, res, result, function(err, data){
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4622));
                } else {
                    events.emit('JsonResponse', req, res, data);
                }
            });
        }
    });

};

exports.getTimetableByClssAndSec = function(req, res) {
    var data = [];
    async.parallel({
        periods: getSchoolPeriodsByClass.bind(null, req),
        days: getDays.bind(null, req),
        subjects: getSubjects.bind(null, req),
        classes: getClasses.bind(null, req),
        employees: getEmployeeClassifications.bind(null, req),
        classDetails: getTimetableByClssAndSect.bind(null, req),
        swapTimetableDetails : getSwapTimeTable.bind(null, req),
        sections: getSections.bind(null, req),
        attachments: getAttachmentsByCSWeekNo.bind(null, req)

    }, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4614));
        } else {
            getClassPeriods(req, res, result);
        }
    });

};


function timetableByClsSecDayDate(req, callback) {
    var data = [];
    async.parallel({
        periods: getSchoolPeriodsByClass.bind(null, req),
        days: getDays.bind(null, req),
        subjects: getSubjects.bind(null, req),
        classes: getClasses.bind(null, req),
        employees: getEmployeeClassifications.bind(null, req),
        classDetails: getTimetableByClssAndSectAndDay.bind(null, req),
        swapTimetableDetails: getSwapDetailsByCSDate.bind(null, req),
        sections: getSections.bind(null, req),
        attachments: getAttachmentsByCSDate.bind(null, req)

    }, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            getClassPeriodsOfDay(result, function (err, response) {
                callback(err, response);
            });
        }
    });
};
exports.timetableByClsSecDayDate = timetableByClsSecDayDate;

exports.getTimetableByClssSecAndday = function(req, res) {
    timetableByClsSecDayDate(req, function (err, response) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4614));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    });
};

exports.getTimetablebyEmpId = function(req, res) {
    var data = [];
    async.parallel({
        periods: getSchoolPeriods.bind(null, req),
        days: getDays.bind(null, req),
        subjects: getSubjects.bind(null, req),
        classes: getClasses.bind(null, req),
        employees: getEmployeeClassifications.bind(null, req),
        employeeTimetable: getTimetableByEmp.bind(null, req),
        swapTimetableDetails : getSwapDetailsByWeekNoAndEmpId.bind(null, req),
        sections: getSections.bind(null, req),
        attachments: getAttachmentsByWeekNoAndEmpId.bind(null, req)

    }, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4614));
        } else {
            getEmpPeriods(req, res, result);
        }
    });
};

exports.getCalendarByEmpId = function(req, res) {
    var data = [];
    async.parallel({
        periods: getSchoolPeriods.bind(null, req),
        days: getDays.bind(null, req),
        subjects: getSubjects.bind(null, req),
        classes: getClasses.bind(null, req),
        employees: getEmployeeClassifications.bind(null, req),
        employeeTimetable: getTimetableByEmp.bind(null, req),
        swapTimetableDetails : getSwapDetailsByWeekNoAndEmpId.bind(null, req),
        sections: getSections.bind(null, req),
        attachments: getAttachmentsByWeekNoAndEmpId.bind(null, req)

    }, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4614));
        } else {
            result['weekNo'] = req.query.weekNo;
            getCalendarEmpPeriods(req, res, result);
        }
    });
};

exports.getTimetableSlots = function(req, res) {
    var slots = [
        {start: '08:00', end: '09:00', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc", days:[1,2,3,4,5,6]},
        {start: '09:00', end: '10:00', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc"},
        {start: '10:00', end: '11:00', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc"},
        {start: '11:00', end: '12:00', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc"},
        {start: '12:00', end: '13:00', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc"},
        {start: '13:00', end: '14:00', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc"},
        {start: '14:00', end: '15:00', label: 'period 1', periodId: "asczasfczszfcsfcsdxzcsdxzc"},


    ]
    events.emit('JsonResponse', req, res, slots);
};

exports.getTimetableByEmpByDay = function(req, res) {
    getEmpTimetableByDay(req, function(err, result){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4614));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

function getEmpTimetableByDay(req, callback) {
    var data = [];
    async.parallel({
        periods: getSchoolPeriods.bind(null, req),
        days: getDays.bind(null, req),
        subjects: getSubjects.bind(null, req),
        classes: getClasses.bind(null, req),
        employees: getEmployeeClassifications.bind(null, req),
        employeeTimetable: getTimetableByEmpByDayId.bind(null, req),
        swapTimetableDetails : getSwapDetailsByDateAndEmpId.bind(null, req),
        sections: getSections.bind(null, req),
		attachments: getAttachmentsByDateDayAndEmpId.bind(null, req)
    },function(err, result) {
        if (err) {
            logger.debug(err);
            callback(err, null);
        } else {
            getEmpPeriodsOFDay(req, result, function(err, data){
                if(err) {
                    logger.debug(err);
                    callback(err, null);
                } else {
                    callback(null, data);
                }
            });
        }
    });
};
exports.getEmpTimetableByDay = getEmpTimetableByDay;

function getAttachmentsByDateDayAndEmpId(req, callback) {
    nsaCassandra.Timetable.getAttachmentsByDateDayAndEmpId(req, function(err, result) {
        callback(err, result);
    })
};
exports.getAttachmentsByDateDayAndEmpId = getAttachmentsByDateDayAndEmpId;

exports.getClassesByEmp = function(req, res) {
    var data = [];
    async.parallel({
        classes: getClasses.bind(null, req),
        classTeacherClasses: getClassTeacherClasses.bind(null, req),
        sections: getSections.bind(null, req),
    }, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4614));
        } else {
            buildClasses(req, res, result);
        }
    });
};

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, data);
    })
};
exports.executeBatch = executeBatch;

function getSchoolPeriodsByClass(req, callback) {
    nsaCassandra.Periods.getSchoolPeriodsByClass(req, function(err, result) {
      callback(err, result);
    })
};
exports.getSchoolPeriodsByClass = getSchoolPeriodsByClass;

function getSchoolPeriods(req, callback) {
    nsaCassandra.Periods.getSchoolPeriods(req, function(err, result) {
        callback(err, result);
    })
};
exports.getSchoolPeriods = getSchoolPeriods;


function getTimetableByClssAndSect(req, callback) {
    nsaCassandra.Timetable.getTimetableByClssAndSec(req, function(err, result) {
        callback(err, result);
    })
};
exports.getTimetableByClssAndSect = getTimetableByClssAndSect;

function getTimetableByClsSec(req, data, callback) {
    nsaCassandra.Timetable.getTimetableByClSecDay(req, function(err, result) {
        data['schoolTimetable'] = result;
        callback(err, req, data);
    })
};
exports.getTimetableByClsSec = getTimetableByClsSec;

function getTimetableByClsSecDate(req, data, callback) {
    nsaCassandra.Timetable.getTimetableByClSecDate(req, function(err, result) {
        data['swapTimetable'] = result;
        callback(err, req, data);
    })
};
exports.getTimetableByClsSecDate = getTimetableByClsSecDate;

function getTimetableByClssAndSectAndDay(req, callback) {
    nsaCassandra.Timetable.getTimetableByClssAndSecAndDay(req, function(err, result) {
        callback(err, result);
    })
};
exports.getTimetableByClssAndSect = getTimetableByClssAndSect;

function getTimetableByEmp(req, callback) {
    nsaCassandra.Timetable.getTimetableByEmp(req, function(err, result) {
        callback(err, result);
    })
};
exports.getTimetableByEmp = getTimetableByEmp;

function getTimetableByEmpByDayId(req, callback) {
    nsaCassandra.Timetable.getTimetableByEmpByDayId(req, function(err, result) {
        callback(err, result);
    })
};
exports.getTimetableByEmpByDayId = getTimetableByEmpByDayId;

function getDays(req, callback) {
    nsaCassandra.Days.getAllDays(req, function(err, result) {
        callback(err, result);
    })
};
exports.getDays = getDays;

function getSubjects(req, callback) {
    nsaCassandra.Subject.getAllSubjects(req, function(err, result) {
        callback(err, result);
    })
};
exports.getSubjects = getSubjects;

function getClasses(req, callback) {
    nsaCassandra.Classes.getAllClasses(req, function(err, result) {
        callback(err, result);
    })
};
exports.getClasses = getClasses;

function getSections(req, callback) {
    nsaCassandra.Section.getSections(req, function (err, result) {
        callback(err, result);
    });
};
exports.getSections = getSections;

function getClassTeacherClasses(req, callback) {
    nsaCassandra.Timetable.getClassesByEmp(req, function(err, result) {
        callback(err, result);
    })
};
exports.getClassTeacherClasses = getClassTeacherClasses;

function buildClasses(req, res, data) {
    var classData = [];
    if(!(_.isEmpty(data.classTeacherClasses))) {
        var info = {}
        _.forEach(data.classTeacherClasses, function(val) {
            var classInfo = _.filter(data.classes, { 'class_id': val.class_id });
            var sectionInfo = filterSectionDetails(data.sections, val.section_id);
            info['classId'] = classInfo[0].class_id;
            info['className'] = classInfo[0].class_name;
            info['classCode'] = classInfo[0].class_code;
            info['sectionId'] = sectionInfo[0].sectionId;
            info['sectionName'] = sectionInfo[0].sectionName;
            info['sectionCode'] = sectionInfo[0].sectionCode;
            classData.push(info);
        });
        classData = _.orderBy(classData, ['classId'], ['asc']);
    }
    events.emit('JsonResponse', req, res, classData);
};
exports.buildClasses = buildClasses;

function getSwapTimeTable(req, callback) {
    nsaCassandra.Timetable.getSwapDetailsByCSWeekNo(req, function(err, result) {
        callback(err, result);
    })
};
exports.getSwapTimeTable = getSwapTimeTable;

function getAttachmentsByCSWeekNo(req, callback) {
    nsaCassandra.Timetable.getAttachmentsByCSWeekNo(req, function(err, result) {
        callback(err, result);
    })
};
exports.getAttachmentsByCSWeekNo = getAttachmentsByCSWeekNo;

function getAttachmentsByCSDate(req, callback) {
    nsaCassandra.Timetable.getAttachmentsByCSDate(req, function(err, result) {
        callback(err, result);
    })
};
exports.getAttachmentsByCSDate = getAttachmentsByCSDate;

function getSwapDetailsByWeekNoAndEmpId(req, callback) {
    nsaCassandra.Timetable.getSwapDetailsByWeekNoAndEmpId(req, function(err, result) {
        callback(err, result);
    })
};
exports.getSwapDetailsByWeekNoAndEmpId = getSwapDetailsByWeekNoAndEmpId;

function getAttachmentsByWeekNoAndEmpId(req, callback) {
    nsaCassandra.Timetable.getAttachmentsByWeekNoAndEmpId(req, function(err, result) {
        callback(err, result);
    })
};
exports.getAttachmentsByWeekNoAndEmpId = getAttachmentsByWeekNoAndEmpId;

function getSwapDetailsByDateAndEmpId(req, callback) {
    nsaCassandra.Timetable.getSwapDetailsByDateDayAndEmpId(req, function(err, result) {
        callback(err, result);
    })
};
exports.getSwapDetailsByDateAndEmpId = getSwapDetailsByDateAndEmpId;

function getSwapDetailsByCSDate(req, callback) {
    nsaCassandra.Timetable.getSwapDetailsByCSDate(req, function(err, result) {
        callback(err, result);
    })
};
exports.getSwapDetailsByDateAndEmpId = getSwapDetailsByDateAndEmpId;


function filterEmployeeDetails(data, val) {
    var employeeInfo = _.filter(data, {'user_name': val.emp_id});
    return employeeInfo;
}

function filterSubjectDetails(data, val) {
    var subjectInfo = _.filter(data, {'subjectId': val.subject_id});
    return subjectInfo;
}

function checkAttachments(data, val) {
    var attachmentValue = [];
    var attachments = filterAttachmentDetails(data.attachments, val);
    if(!_.isEmpty(attachments)) {
        var latestAttachments = _.orderBy(attachments, ['updated_date'], ['desc']);
        attachmentValue.push(latestAttachments[0].attachments);
    }
    return attachmentValue;
}

function constructClassperiods(data, val, days) {
    try {
        var day = {};
        var assignee = {};
        var subEmpObjs = nsaCassandra.Base.baseService.filterSubEmpDetails(data.employees, data.subjects, val);
        /*var employeeInfo = filterEmployeeDetails(data.employees, val);
        var subjectInfo = filterSubjectDetails(data.subjects, val);*/
        var dayInfo = filterDayDetails(data.days, val);
        var classInfo = filterClassDetails(data.classes, val.class_id);
        var sectionInfo = filterSectionDetails(data.sections, val.section_id);
        var attachmentValue = checkAttachments(data, val);
        assignee['attachments'] = attachmentValue;
        /*assignee['employeeId'] = employeeInfo[0].user_name;
        assignee['employeeName'] = employeeInfo[0].first_name;
        assignee['employeeCode'] = employeeInfo[0].short_name;
        assignee['subjectId'] = subjectInfo[0].subjectId;
        assignee['subCode'] = subjectInfo[0].subCode;
        assignee['subName'] = subjectInfo[0].subName;*/
        assignee['subEmpAssociation'] = subEmpObjs;
        day['dayId'] = dayInfo[0].id;
        day['dayName'] = dayInfo[0].name;
        day['classId'] = classInfo[0].class_id;
        day['className'] = classInfo[0].class_name;
        day['classCode'] = classInfo[0].class_code;
        day['sectionId'] = sectionInfo[0].sectionId;
        day['sectionName'] = sectionInfo[0].sectionName;
        day['sectionCode'] = sectionInfo[0].sectionCode;
        day['assignee'] = assignee;
        /*day['color'] = subjectInfo[0].subColour;*/
        day['color'] = subEmpObjs.length > 0 ? subEmpObjs[0].color : '';
        days.push(day);

    } catch (err) {
        logger.debug(err);
    }
    return days;
}

function constructClassPeriodsOfDay(data, val, days) {
    var day = {};
    var assignee = {};
    var dayInfo = filterDayDetails(data.days, val);
    var periodInfo = filterPeriodDetails(data.periods, val);
    var subEmpObjs = nsaCassandra.Base.baseService.filterSubEmpDetails(data.employees, data.subjects, val);
    /*var subjectInfo = filterSubjectDetails(data.subjects, val);
    var employeeInfo = filterEmployeeDetails(data.employees, val);*/
    var classInfo = filterClassDetails(data.classes, val.class_id);
    var attachmentValue = checkAttachments(data, val);
    var sectionInfo = filterSectionDetails(data.sections, val.section_id);
    assignee['attachments'] = attachmentValue;
    /*assignee['employeeId'] = employeeInfo[0].user_name;
    assignee['employeeName'] = employeeInfo[0].first_name;
    assignee['employeeCode'] = employeeInfo[0].short_name;
    assignee['subjectId'] = subjectInfo[0].subjectId;
    assignee['subCode'] = subjectInfo[0].subCode;
    assignee['subName'] = subjectInfo[0].subName;*/
    assignee['subEmpAssociation'] = subEmpObjs;
    day['dayId'] = dayInfo[0].id;
    day['dayName'] = dayInfo[0].name;
    day['assignee'] = assignee;
    day['periodId'] =  periodInfo[0].period_id;
    day['periodName'] =  periodInfo[0].period_name;
    day['periodStartTime'] =  periodInfo[0].period_start_time;
    day['periodEndTime'] =  periodInfo[0].period_end_time;
    day['is_break'] =  periodInfo[0].is_break;
    day['dayId'] = dayInfo[0].id;
    day['dayName'] = dayInfo[0].name;
    day['classId'] = classInfo[0].class_id;
    day['className'] = classInfo[0].class_name;
    day['classCode'] = classInfo[0].class_code;
    day['sectionId'] = sectionInfo[0].sectionId;
    day['sectionName'] = sectionInfo[0].sectionName;
    day['sectionCode'] = sectionInfo[0].sectionCode;
    /*day['color'] = subjectInfo[0].subColour;*/
    day['color'] = subEmpObjs.length > 0 ? subEmpObjs[0].color : '';
    day['timetable_id'] = val.timetable_id
    days.push(day);
    return days;
}

function filterSwapDetails(data, val) {
    var swapTimetable = _.filter(data, {'period_id': val.period_id, 'day_id': val.day_id});
    return swapTimetable;
}

function filterAttachmentDetails(data, val) {
    var swapTimetable = _.filter(data, {'period_id': val.period_id, 'day_id': val.day_id});
    return swapTimetable;
}


function filterDayDetails(data, detail) {
    return _.filter(data, {'id': detail.day_id});
}

function filterPeriodDetails(data, value) {
    var periodInfo = _.filter(data, {'period_id': value.period_id});
    return periodInfo;
}

function filterSchoolPeriods(data, value) {
    var periodInfo = _.filter(data, {'school_period_id': value});
    return periodInfo;
}

function filterClassDetails(data, value) {
    var classInfo = _.filter(data, {'class_id': value});
    return classInfo;
}

function filterSectionDetails(data, value) {
    var sectionInfo = _.filter(data, {'sectionId': value});
    return sectionInfo;
}

function checkSwapDetails(data, val, days) {
    var swapTimetable = filterSwapDetails(data.swapTimetableDetails, val);
    var latestSwapTimeTablee = _.orderBy(swapTimetable, ['updated_date'], ['desc']);
    if (!_.isEmpty(latestSwapTimeTablee)) {
        _.forEach(latestSwapTimeTablee, function (detail) {
            days = constructClassperiods(data, detail, days);
            return false;
        });
    } else {
        days = constructClassperiods(data, val, days);
    }
    return days;
}

function checkSwapDetailsOFDay(data, val, days) {
    var swapTimetable = filterSwapDetails(data.swapTimetableDetails, val);
    var latestSwapTimeTablee = _.orderBy(swapTimetable, ['updated_date'], ['desc']);
    if (!_.isEmpty(latestSwapTimeTablee)) {
        _.forEach(latestSwapTimeTablee, function (detail) {
            days = constructClassPeriodsOfDay(data, detail, days);
            return false;
        });
    } else {
        days = constructClassPeriodsOfDay(data, val, days);
    }
    return days;
}

function validateSwapTimeTable(value, data) {
    var days = [];
    _.forEach(value, function (val) {
        days = checkSwapDetails(data, val, days);
    });
    return days;
}

function constructTimetableJson(value, data, classData) {
    var periodData = {};
    var event = [];
    var days = validateSwapTimeTable(value, data);
    var periodInfo = filterPeriodDetails(data.periods, value[0]);
    periodData['periodId'] = periodInfo[0].period_id;
    periodData['periodName'] = periodInfo[0].period_name;
    periodData['periodStartTime'] = periodInfo[0].period_start_time;
    periodData['periodEndTime'] = periodInfo[0].period_end_time;
    periodData['is_break'] = periodInfo[0].is_break;
    periodData['days'] = _.orderBy(days, ['dayId'], ['asc']);
    classData.push(periodData);
    return classData;
}

function constructCalendarData(days, periodInfo, data, event) {
    _.forEach(days, function (val) {
        var timetable = _.filter(data.classDetails, {day_id: val.dayId, period_id: periodInfo[0].period_id});
        var eventObj = {};
        var subEmpObjs = val.assignee.subEmpAssociation;
        var subEmpInfo = [];
        var subEmpDetail = [];
        _.forEach(subEmpObjs, function (obj, key) {
            subEmpInfo.push(obj.subCode  + ' ( ' + obj.employeeCode + ' ) '+ '\n');
            subEmpDetail.push(obj.subName  + ' ( ' + obj.employeeName + ' ) ' + '\n');
        });

        /*var title = val.assignee.subCode  + ' ( ' + val.assignee.employeeCode + ' ) ' + '\n'+ ' ( ' + val.className+ ' ) ' +'\n'+' ( ' + val.sectionName +' ) ';
        eventObj['title'] = title;
        eventObj['description'] = {Subject: val.assignee.subName, Staff: val.assignee.employeeName,Class: val.className,Section: val.sectionName};*/

        var classInfo = val.classCode || val.className;
        var secInfo = val.sectionCode ||  val.sectionName;
        eventObj['title'] = subEmpInfo + classInfo + '(' + secInfo + ')';
        var start = dateUtils.getDatesFromWeekNum(data.weekNo, val.dayId, (periodInfo[0].period_start_time).toString());
        var end = dateUtils.getDatesFromWeekNum(data.weekNo, val.dayId, (periodInfo[0].period_end_time).toString());
        var startTime = periodInfo[0].period_start_time;
        var endTime = periodInfo[0].period_end_time;
        eventObj['startTime'] = periodInfo[0].period_start_time;
        eventObj['endTime'] = periodInfo[0].period_end_time;
        eventObj['start'] = start;
        eventObj['end'] = end;
        eventObj['description'] = {Subjects: subEmpDetail, Class: val.className,Section: val.sectionName, 'Start Time': dateUtils.convertTo12Hour(startTime.toString())+ ' ' + ' ' , 'End Time:': dateUtils.convertTo12Hour(endTime.toString())};
        /*eventObj['emp_user_name'] = val.assignee.employeeId;
        eventObj['subjectId'] = val.assignee.subjectId;
        eventObj['subjectName'] = val.assignee.subName;
        eventObj['color'] = val.color;*/
        eventObj['color'] = subEmpObjs.length > 0 ? subEmpObjs[0].color: '';
        eventObj['subEmpAssociation'] = subEmpObjs;
        eventObj['dayId'] = val.dayId;
        eventObj['dayName'] = val.dayName;
        eventObj['periodId'] = periodInfo[0].period_id;
        eventObj['period'] = periodInfo[0];
        eventObj['timetable_id'] = timetable.length > 0 ? timetable[0].timetable_id : '';
        eventObj['classId'] = val.classId;
        eventObj['sectionId'] = val.sectionId;
        event.push(eventObj);
    })
    return event;
};

function constructCalendarTimetableJson(value, data, classData) {
    try {
        var periodData = {};
        var event = [];
        var days = validateSwapTimeTable(value, data);
        var periodInfo = filterPeriodDetails(data.periods, value[0]);
        event = constructCalendarData(days, periodInfo, data, event);
        
    } catch (err) {
        logger.debug(err);
        return err;
    }
	return event;
};

/*
function constructCalendarData(days, periodInfo, data, event) {
    _.forEach(days, function (val) {
        var eventObj = {};
        var title = val.className + '(' + val.employeeCode + ')' + periodInfo[0].period_name;
        eventObj['title'] = title;
        var start = dateUtils.getDatesFromWeekNum(data.weekNo, val.dayId, (periodInfo[0].period_start_time).toString());
        var end = dateUtils.getDatesFromWeekNum(data.weekNo, val.dayId, (periodInfo[0].period_end_time).toString());
        eventObj['start'] = start;
        eventObj['end'] = end;
        event.push(eventObj);
    })
    return event;
};
*/


function getClassPeriods(req, res, data) {
    var classData = [];
    var periods =_.groupBy(data.classDetails, 'period_id');
    if(!(_.isEmpty(periods))) {
        _.forEach(periods, function(value) {
            classData = constructTimetableJson(value, data, classData);
        });
        classData = _.orderBy(classData, ['periodId'], ['asc'])
    }
    events.emit('JsonResponse', req, res, classData);
};
exports.getClassPeriods = getClassPeriods;

function getCalendarData(req, res, data, callback) {
    try {
        var classData = [];
        var periods =_.groupBy(data.classDetails, 'period_id');
        if(!(_.isEmpty(periods))) {
            _.forEach(periods, function(value) {
                var classData1 = constructCalendarTimetableJson(value, data, classData);
                classData.push(classData1);
            });
            classData = _.flatten(classData)
        }
        callback(null, classData);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};
exports.getCalendarData = getCalendarData;

function getClassPeriodsOfDay(data, callback) {
    var days = [];
    if(!(_.isEmpty(data.classDetails))) {
        _.forEach(data.classDetails, function(val) {
            days = checkSwapDetailsOFDay(data, val, days);
        });
        days = _.orderBy(days, ['periodId'], ['asc'])
    }
    callback(null, days);
};
exports.getClassPeriodsOfDay = getClassPeriodsOfDay;


function getEmpPeriods(req, res, data) {
    var classData = [];
    var periods =_.groupBy(data.employeeTimetable, 'period_id');
    if(!(_.isEmpty(periods))) {
        _.forEach(periods, function(value) {
            classData = constructTimetableJson(value, data, classData);
        });
        classData = _.orderBy(classData, ['periodId'], ['asc']);
    }
    events.emit('JsonResponse', req, res, classData);
};
exports.getEmpPeriods = getEmpPeriods;

function getCalendarEmpPeriods(req, res, data) {
    var classData = [];
    var periods =_.groupBy(data.employeeTimetable, 'period_id');
    if(!(_.isEmpty(periods))) {
        _.forEach(periods, function(value) {
            var classData1 = constructCalendarTimetableJson(value, data, classData);
            classData.push(classData1);
        });
        classData = _.flatten(classData)
    }
    events.emit('JsonResponse', req, res, classData);
};
exports.getCalendarEmpPeriods = getCalendarEmpPeriods;

function getEmpPeriodsOFDay(req, data, callback) {
    try {
        var classData = [];
        var periods =_.groupBy(data.employeeTimetable, 'period_id');
        if(!(_.isEmpty(periods))) {
            _.forEach(periods, function(value) {
                classData = checkSwapDetailsOFDay(data, value[0], classData);
            });
            classData = _.orderBy(classData, ['periodId'], ['asc']);
        }
        callback(null, classData)
    } catch (err) {
        callback(null, err);
    }
};
exports.getEmpPeriodsOFDay = getEmpPeriodsOFDay;

function getBaseFilepath(req, res, next) {
    req.headers.basepath = 'senthil/test/'
    next()
}
exports.getBaseFilepath = getBaseFilepath;

exports.getClassTeacherByClsSec = function(req, res) {
    nsaCassandra.Timetable.getClassTeacherByClsSec(req, function(err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4623));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

exports.getEmpTimetableDetails = function(req, res){
    async.parallel({
        Employees : getEmpDetails.bind(null, req),
        SchoolTimetable: getEmpHours.bind(null, req)
    },
     function (err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa601});
        }else {
            getEmployeeTotalPeriods(req, res, result);
        }
    });
};

function getEmployeeTotalPeriods(req,  res, data){
   var empData = [];
    _.forEach(data.Employees, function(value){
        var emp =[];
          _.forEach(data.SchoolTimetable, function(value1){
              var formatedValue = baseService.getFormattedMap(value1.sub_emp_association);
              var findEmp =  _.map(formatedValue, function (e) {
                  if(e.name == value.user_name){return e;}else {return [];}
              });
              emp.push(_.flatten(findEmp));
        });
        var result = JSON.parse(JSON.stringify(value)), emp1 = _.flatten(emp);
        if(emp1.length){
            result.noOfPeriods = emp1.length;
        }else {
            result.noOfPeriods = 0;
        }
        empData.push(result);
    });
    events.emit("JsonResponse", req, res, empData);
}


function getEmpDetails(req, callback){
    nsaCassandra.Timetable.getEmpTimetableDetails(req, function(err, result){
        callback(err, result)
    })
}
exports.getEmpDetails = getEmpDetails;

function getEmpHours(req, callback){
    nsaCassandra.Timetable.getEmpPeriods(req, function(err, result){
        callback(err, result);
    })

}
exports.getEmpHours = getEmpHours;


exports.updateSubEmpInfo = function(req, res) {
    async.waterfall([
        nsaCassandra.Timetable.getAllClassTimetable.bind(null, req),
        executeBatch.bind()
    ], function (err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4613));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa4612});
        }
    })
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.TIME_TABLE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;

function throwTimetableErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.TIME_TABLE_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwTimetableErr = throwTimetableErr;
