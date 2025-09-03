/**
 * Created by bharatkumarr on 02/07/17.
 */

var async = require('async'),
    nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    message = require('@nsa/nsa-commons').messages,
    es = require('../search/elasticsearch/elasticsearch.service'),
    notificationService = require('../sms/notifications/notification.service'),
    logger = require('../../common/logging'),
    nsaElasticSearch = require('@nsa/nsa-elasticsearch'),
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    nsacu = require('@nsa/nsa-bodybuilder').calendarUtil,
    dateUtils = require('@nsa/nsa-commons').dateUtils,
    _ = require('lodash'),
    gallary = require('../gallery/gallery.service');

exports.getAllExamTypes = function(req, res) {
    try {
        nsaCassandra.Exam.getAllExamTypes(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get All Exam Types', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get All Exam Types', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
    }
};


exports.getExamType = function(req, res) {
    try {
        nsaCassandra.Exam.findExamType(req, function(err, result) {
            if (err) {
                logger.debugLog(req, 'Save Exam Type ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9002));
            } else if (!_.isEmpty(result)) {
                events.emit('ErrorJsonResponse', req, res, {message: message.nsa9018});
            } else {
                nsaCassandra.Exam.getExamType(req, function (err, result) {
                    if (err) {
                        logger.debugLog(req, 'Get Exam Type ', err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
                    } else {
                        events.emit('JsonResponse', req, res, result);
                    }
                });
            }
        })
            } catch (err) {
                logger.debugLog(req, 'Get Exam Type ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
            }
        };


/*exports.getExamType = function(req, res) {
    try {

        nsaCassandra.Exam.getExamType(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get Exam Type ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Exam Type ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
    }
};*/

exports.saveExamType = function(req, res) {
    try {
        nsaCassandra.Exam.findExamType(req, function(err, result){
            if(err){
                logger.debugLog(req, 'Save Exam Type ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9002));
            }else if (!_.isEmpty(result)) {
                events.emit('ErrorJsonResponse', req, res, {message: message.nsa9018});
            }else {
                nsaCassandra.Exam.saveExamType(req, function (err, result) {
                    if (err) {
                        logger.debugLog(req, 'Save Exam Type ', err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9002));
                    } else {
                        events.emit('JsonResponse', req, res, result);
                    }
                });
            }
        })
    } catch (err) {
        logger.debugLog(req, 'Save Exam Type ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
    }
};

exports.updateExamType = function(req, res) {
    try {
        nsaCassandra.Exam.updateExamType(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Update Exam Type ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9004));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Update Exam Type ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
    }
};

exports.deleteExamType = function(req, res) {
    try {
        nsaCassandra.Exam.deleteExamType(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Delete Exam Type ', err);
                var msg = err.message === message.nsa10002 ? message.nsa10002 : message.nsa9005;
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, msg));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Delete Exam Type ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
    }
};

exports.getAllExamSchedules = function(req, res) {
    try {
        nsaCassandra.Exam.getAllExamSchedules(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get All Exam Schedules ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9013));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get All Exam Schedules ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
    }
};

exports.getAllExamSchedulesByClassSec = function(req, res) {
    try {
        nsaCassandra.Exam.getAllExamSchedulesByClassSec(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get All Exam Schedules ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9013));
            } else {
                events.emit('JsonResponse', req, res,  _.sortBy(result, 'updated_date').reverse());
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get All Exam Schedules ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
    }
};

exports.getExamSchedule = function(req, res) {
    try {
        nsaCassandra.Exam.getExamSchedule(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get Exam Schedule ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9013));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Exam Schedule ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
    }
};

exports.getExamScheduleByType = function(req, res) {
    try {
        nsaCassandra.Exam.getExamScheduleByType(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get Exam Schedule ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, err.message === message.nsa9017 ? err.message : message.nsa9013));
            } else {
                if (result.createdByOthers) {
                    events.emit('ErrorJsonResponse', req, res,
                        buildErrResponse({message: message.nsa9017}, message.nsa9017));
                } else {
                    events.emit('JsonResponse', req, res, result.examSchedules);
                }
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Exam Schedule ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
    }
};

exports.saveExamSchedule  = function (req, res) {
    try {
        var data = {};
        async.waterfall(
            [
                constructExamObj.bind(null, req, data),
                constructUpdatePortionObj.bind(),
                insertAuditLog.bind(),
                executeBatch.bind(),
            ],
            function (err, req, result) {
                if (err) {
                    if (err.message.toString().indexOf(message.nsa9015) >= 0 || err.message.toString().indexOf(message.nsa9016) >= 0) {
                        logger.debugLog(req, 'Save Exam Schedule Err ', err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, err.message));
                    } else {
                        logger.debugLog(req, 'Save Exam Schedule Err ', err);
                        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err,message.nsa9022));
                    }
                } else {
                    req.body['count'] = result.count;
                    var data1 ={};
                    data1.exam_schedule_id = result.exam_schedule_id;
                    data1.id = result.id;
                    if(req.body.status) {
                        async.waterfall(
                            [
                                saveCalendarDetails.bind(null, req, data1),
                                saveCalendarDataInES.bind(),
                            ],function(err2,req, result){
                                if(err2){
                                    logger.debugLog(req, 'Save Exam Schedule Err ', err2);
                                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err2, message.nsa9009));
                                }else {
                                    sendNotification(req, function(err1, data){
                                        if(err1) {
                                            logger.debugLog(req, 'Save Exam Schedule - Send Notification Err ', err1);
                                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa9009));
                                        } else {
                                            var output = {message: message.nsa9020, exam_schedule_id: result.exam_schedule_id ,id: result.id};
                                            events.emit('JsonResponse', req, res, output);
                                        }
                                    })
                                }
                            })
                    } else {
                        var output = {message: message.nsa9008, exam_schedule_id: result.exam_schedule_id , id: result.id};
                        events.emit('JsonResponse', req, res, output);
                    }
                }
            }
        );
    } catch (err) {
        logger.debugLog(req, 'Save Exam Schedule Err ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9009));
    }
};

function constructExamObj(req, data, callback) {
    nsaCassandra.Exam.saveExamSchedule(req, data, function (err, result) {
        if (result) {
            result.features = {actions: constant.CREATE, featureTypeId: result.exam_schedule_id};
        }
        callback(err, req, result);
    })
};

//exam calenderDetailssss
function saveCalendarDetails(req, data1, callback){
    nsaCassandra.Exam.saveCalendarData(req, data1, function(err, result){
        callback(err, req, result)
    })
}
exports.saveCalendarDetails = saveCalendarDetails;

function getCalenderdetails(req, data, callback){
    nsaCassandra.Exam.getCalendarDetails(req, data, function(err, result){
        if(_.isEmpty(result)){
            saveCalendarDetails(req, data, function(err, req, result){
                callback(err, req, result);
            })
        }else {
            updateCalendarDetails(req, data, function(err, req, result){
                callback(err, req, result);
            });
        }

    })

}

function updateCalendarDetails(req, data, callback){
    nsaCassandra.Exam.updateCalendarData(req, data, function(err, result){
        callback(err,req, result)
    })
}
exports.updateCalendarDetails = updateCalendarDetails;

function updateCalendarDataInES(req, data, callback) {
    var updateParams = nsacu.buildExamDocQuery(req, data);
    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
        callback(err, req, data);
    })
};
exports.updateCalendarDataInES = updateCalendarDataInES;


function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};


function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err ,req, data);
    })
};

function saveCalendarDataInES(req, data, callback) {
    var updateParams = nsacu.buildExamDocQuery(req, data);
    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
        callback(err, req, data);
    })
};
exports.saveCalendarDataInES = saveCalendarDataInES;

function sendNotification(req, callback) {
    var data = [];
    async.waterfall([
            buildUsers.bind(null, req, data),
            getExamScheduleTemplate.bind(),
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

function buildUsers(req, data, callback) {
    var sections = req.body.sections, classes = [], clas = {};
    clas.id = req.body.class_id.toString();
    clas.section = [];
    for (var section_id in sections) {
        if (sections.hasOwnProperty(section_id)) {
            req.body.section_name = sections[section_id];
            clas.section.push(section_id);
        }
    }
    classes.push(clas);
    req.body.classes = classes;
    es.getUsersByClassSections(req, function(err, users) {
        if (err) {
            logger.debugLog(req, 'Fetch Users from ES to Notify Exam Schedule err ', err);
        }
        data['users'] = users;
        callback(null, req, data);
    });
};

function getExamScheduleTemplate(req, users, callback) {
    try {
        var data = {
            featureId: constant.EXAM_SCHEDULE,
            subFeatureId: constant.CREATE_EXAM,
            action: constant.CREATE_ACTION,
            userType: constant.STUDENT
        };
        nsaCassandra.Feature.getFeatureTemplate(req, data, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Send Notification - Get Exam Schedule Template Err ', err);
            }
            callback(err, req, users, result);
        })
    } catch (err) {
        if (err) {
            logger.debugLog(req, 'Send Notification - Get Exam Schedule Template Err ', err);
        }
    }
};

function getTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.exambase.getExamTemplateObj(req, templates, function(err, templateObj) {
        if (err) {
            logger.debugLog(req, 'Send Notification - Exam Template Err ', err);
        }
        callback(err, req, users, templateObj);
    })
};

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        if (err) {
            logger.debugLog(req, 'Send Notification - Feature Notification Err ', err);
        }
        notificationObj.isDetailedNotification = true;
        notificationObj.replacementKeys = ['section'];
        notificationObj = getChangeTemplateString(req, users, notificationObj);
       callback(err, req, notificationObj);
    })
};

function getChangeTemplateString(req, data, notificationObj) {
    var obj = {};
    _.forEach(data.users, function (value, key) {
        if(value.classes.length > 0) {
            obj[value.primaryPhone] = {section: value.classes[0].section_name};
        } else {
            obj[value.primaryPhone] = {section: "" };
        }


    })
    notificationObj.replacementMsgs = obj;
    return notificationObj;
};

exports.updateExamSchedule  = function (req, res) {
    try {
        nsaCassandra.Exam.findExamScheduleIdInSchoolMarklist(req, function(err, result){
            if(err){
                logger.debugLog(req, 'Get Exam Schedule ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9013));
            }else if(!_.isEmpty(result)){
                events.emit('ErrorJsonResponse', req, res, {message: message.nsa9019});
            }else {
                var data = {};
                async.waterfall(
                    [
                        constructUpdateExamObj.bind(null, req, data),
                        constructUpdatePortionObj.bind(),
                        insertAuditLog.bind(),
                        executeBatch.bind(),
                    ],
                    function (err, req, result) {
                        if (err) {
                            logger.debugLog(req, 'Update Exam Schedule Err ', err);
                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9011));
                        } else {
                            if(req.body.status && !req.body.secondTime) {
                                req.body['count'] = result.count;
                                var data1 = {};
                                data1.exam_schedule_id = result.exam_schedule_id;
                                async.waterfall(
                                    [
                                        getCalenderdetails.bind(null, req, data1),
                                        updateCalendarDataInES.bind(),
                                    ],
                                    function(err1,req, result){
                                        if(err1){
                                            logger.debugLog(req, 'Update Exam Schedule Err ', err1);
                                            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa9011));
                                        }else {
                                            sendNotification(req, function(err2, data){
                                                if(err2) {
                                                    logger.debugLog(req, 'Update Exam Schedule - Send Notification Err ', err2);
                                                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa9011));
                                                } else {
                                                    var output = {message: message.nsa9020, exam_schedule_id: result.exam_schedule_id};
                                                    events.emit('JsonResponse', req, res, output);
                                                }
                                            })
                                        }
                                    }
                                )
                            } else {
                                var output = {message: message.nsa9010, exam_schedule_id: result.exam_schedule_id};
                                events.emit('JsonResponse', req, res, output);
                            }
                        }
                    }
                );
            }
        })
    } catch (err) {
        logger.debugLog(req, 'Update Exam Schedule Err ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9011));
    }
};

function constructUpdateExamObj(req, data, callback) {
    nsaCassandra.Exam.updateExamSchedule(req, data, function (err, result) {
        result.features = {actions : constant.CREATE, featureTypeId : result.exam_schedule_id};
        callback(err, req, result);
    })
};

function constructUpdatePortionObj(req, data, callback) {
    if (req.body.portions) {
        nsaCassandra.Exam.saveExamPortions(req, data, function (err, result) {
            callback(err, req, result);
        })
    } else {
        callback(null, req, data);
    }
};


exports.updateExamScheduleObj = function(req, res) {
    try {
        nsaCassandra.Exam.updateExamSchedule(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Update Exam Schedule ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9011));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Update Exam Schedule ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9011));
    }
};

exports.deleteExamSchedule = function(req, res) {
    try {
        nsaCassandra.Exam.findExamScheduleIdInSchoolMarklist(req, function(err, result){
            if(err){
                logger.debugLog(req, 'Delete Exam Schedule ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9012));
            }else if(!_.isEmpty(result)){
                events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
            }else {
                var data = {};
                async.waterfall(
                    [
                        deleteExamSchedule.bind(null, req, data),
                        deleteExamPortion.bind(),
                        deleteCalenderdetails.bind(),
                        insertAuditLog.bind(),
                        executeBatch.bind(),
                        deleteCalendarDataInES.bind(),
                    ],function(err, req, data){
                        if(data.s3FilesKeys){
                            req.body.seletedImageIds  = data.s3FilesKeys;
                            gallary.deleteS3Src(req, function(err, result1){
                                if(err){
                                    logger.debugLog(req, 'Delete Exam Schedule ', err);
                                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9012));
                                }else {
                                    events.emit('JsonResponse', req, res, {message: message.nsa9014});
                                }
                            });
                        }else {
                            events.emit('JsonResponse', req, res, {message: message.nsa9014});
                        }
                    })
            }

        })
    } catch (err) {
        logger.debugLog(req, 'Delete Exam Schedule ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
    }
};

function deleteExamSchedule(req, data, callback){
    nsaCassandra.Exam.deleteExamSchedule(req, data, function (err, result) {
        callback(err, req, result);
    })
}

function deleteExamPortion(req, data, callback){
    nsaCassandra.Exam.deleteExamPortion(req, data, function (err, result) {
        callback(err, req, result);
    })
}

function deleteCalenderdetails(req, data, callback){
    nsaCassandra.Exam.deleteCalendarDetails(req, data, function(err, result){
        result['features'] = {actions : constant.DELETE, featureTypeId : data.exam_schedule_id};
        callback(err, req, result);
    });
}
exports.deleteCalenderdetails = deleteCalenderdetails;

function deleteCalendarDataInES(req, data, callback) {
    if(!data.nodata){
        var updateParams = nsacu.deleteExamDoc(req, data);
        nsaElasticSearch.delete.deleteDoc(updateParams, function (err, result) {
            callback(err, req, data);
        })
    }else {
        callback(null, req, data)
    }

};
exports.deleteCalendarDataInES = deleteCalendarDataInES;

exports.getExamScheduleByClassAndSec = function(req, res) {
    try {
        nsaCassandra.Exam.getExamScheduleByClassAndSec(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get Exam Schedule By Written Exams', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9013));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Exam Schedule By Written Exams', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
    }
};

exports.getStudentExamsMontly = function(req, callback){
    var queryParams = req.query;
    var monthNo = queryParams.monthNo;  // Ex: 17
    var year = queryParams.year; //Ex: 2017
    var dates = dateUtils.getDatesByMonthOfYear(monthNo, year);
    var params = {};
    params.startDate = dates.startDate;
    params.endDate = dates.endDate;
    params.classId = queryParams.classId.toString();
    params.sectionId = queryParams.sectionId.toString();
    var searchParams = nsacu.getExamsByClassId(req, params);
    nsaElasticSearch.search.getCalendarObjs(searchParams, function (err, result) {
        if (err) {
            logger.debugLog(req, 'Student login class And section Exams for Dashboard', err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });

}

exports.deleteAttachments = function (req, res) {
   nsaCassandra.Exam.deleteAttachment(req, function(err, result){
       if(err){
           logger.debugLog(req, 'deleteAttachments In portions ', err);
           events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4704));
       }else {
           if (err) {
               logger.debug(err);
               events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4704));
           } else {
               req.body.seletedImageIds = result.s3DeleteIds;
               /*req.body.seletedImageIds = [req.body.curentFile];
               gallary.deleteS3Src(req, function(err, result1){
                   if(err){
                       logger.debug(err);
                   }else {
                       var output = { message: message.nsa4703, data: req.body};
                       events.emit('JsonResponse', req, res, output);
                   }
               });*/
               getAttachmentsByKey(req, result, function (err, data) {
                   if(_.isEmpty(data)) {
                       gallary.deleteS3Src(req, function(err, result1){
                           if(err){
                               logger.debug(err);
                           }else {
                               var output = { message: message.nsa4703, data: req.body};
                               events.emit('JsonResponse', req, res, output);
                           }
                       });
                   } else {
                       var output = { message: message.nsa4703, data: req.body};
                       events.emit('JsonResponse', req, res, output);
                   }
               })
           }
       }

   })
};

function getAttachmentsByKey(req, data, callback) {
    nsaCassandra.Base.exambase.deleteAttachmentByKey(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.getAttachmentsByKey = getAttachmentsByKey;

exports.getPortionById = function(req, res) {
    try {
        nsaCassandra.Exam.getPortionById(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get Portion By Id', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9021));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Portion By Id', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9021));
    }
};

function getMonthOfYearUserEventsExams(req, callback) {
    var queryParams = req.query;
    var monthNo = queryParams.monthNo;  // Ex: 17
    var year = queryParams.year;   //Ex: 2017
    var dates = dateUtils.getDatesByMonthOfYear(monthNo, year);
    var params = {};
    params.startDate = dates.startDate;
    params.endDate = dates.endDate;
    var searchParams = nsacu.getExamsDatesRangeQueryParam(req, params);
    nsaElasticSearch.search.getCalendarObjs(searchParams, function (err, result) {
        if (err) {
            logger.debugLog(req, 'Month Based Exams for Dashboard', err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};
exports.getMonthOfYearUserEventsExams = getMonthOfYearUserEventsExams;

//For IOS Start
exports.getExamScheduleDetails = function(req, res) {
    try {
        nsaCassandra.Exam.getExamScheduleDetails(req, function (err, result) {
            if (err) {
                logger.debugLog(req, 'Get Exam Schedule ', err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9013));
            } else {
                events.emit('JsonResponse', req, res, result);
            }
        });
    } catch (err) {
        logger.debugLog(req, 'Get Exam Schedule ', err);
        events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa9007));
    }
};

function getStudentExamsPerDay(req, params, callback) {
    var searchParams = nsacu.getExamsDatesRangeQueryParam(req, params);
    nsaElasticSearch.search.getCalendarObjs(searchParams, function (err, result) {
        if (err) {
            logger.debugLog(req, 'Month Based Exams for Dashboard', err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};
exports.getStudentExamsPerDay = getStudentExamsPerDay;
//For IOS End

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.EVENTS_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;
