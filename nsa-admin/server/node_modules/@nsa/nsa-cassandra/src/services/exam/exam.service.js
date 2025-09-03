/**
 * Created by bharatkumarr on 01/07/17.
 */

var async = require('async')
    , _ = require('lodash')
    , message = require('@nsa/nsa-commons').messages
    , constant = require('@nsa/nsa-commons').constants
    , baseService = require('../common/base.service')
    , models = require('../../models')
    , subjectService = require('../subject/subject.service')
    , dateService = require('../../utils/date.service')
    , examConverter = require('../../converters/exam.converter')
    , subjectConverter = require('../../converters/subject.converter');

var Exam = function f(options) {
};

Exam.getAllExamTypes = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.EXAM_TYPE_PERMISSIONS);
    if (havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.EXAM_TYPE_PERMISSIONS);
        var headers = baseService.getHeaders(req);
        findQuery.academic_year = headers.academic_year;
        models.instance.SchoolWrittenExamType.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, examConverter.examTypeObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

Exam.getExamType = function (req, callback) {
    var findQuery = baseService.getFindQuery(req);
    var headers = baseService.getHeaders(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.written_exam_id = models.uuidFromString(req.params.id);
    models.instance.SchoolWrittenExamType.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Exam.findExamType = function (req, callback) {
    var body = req.body;
    var findQuery = baseService.getFindQuery(req);
    findQuery.written_exam_name = body.written_exam_name;
    models.instance.SchoolWrittenExamType.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
}

Exam.saveExamType = function (req, callback) {
    var examTypeObj = req.body;
    var headers = baseService.getHeaders(req);
    examTypeObj.written_exam_id = models.uuid();
    examTypeObj.academic_year = headers.academic_year;
    examTypeObj = baseService.updateIdsFromHeader(req, examTypeObj, false);
    var examType = new models.instance.SchoolWrittenExamType(examTypeObj);
    examType.save(function (err, result) {
        if (result) {
            result['message'] = message.nsa9001;
        }
        callback(err, result);
    });
};

Exam.updateExamType = function (req, callback) {
    req.body.updated_by = baseService.getHeaders(req).user_id;
    req.body.updated_username = baseService.getHeaders(req).user_name;
    req.body.updated_date = dateService.getCurrentDate();

    var findQuery = baseService.getFindQuery(req);
    var headers = baseService.getHeaders(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.written_exam_id = models.uuidFromString(req.params.id);
    delete req.body.written_exam_id;

    models.instance.SchoolWrittenExamType.update(findQuery, req.body, function(err, result){
        if (result) {
            result['message'] = message.nsa9003;
        }
        callback(err, result);
    });
};

Exam.deleteExamType = function(req, callback) {
    var headers = baseService.getHeaders(req),
        findQuery = baseService.getFindAllQuery(req, true, constant.EXAM_TYPE_PERMISSIONS);
    findQuery.academic_year = headers.academic_year;
    findQuery.written_exam_id = models.uuidFromString(req.params.id);
    models.instance.SchoolExamSchedule.find(findQuery, {allow_filtering: true}, function(err, result) {
        if (result.length === 0) {
            var queryObject = baseService.getFindQuery(req);
            queryObject.academic_year = headers.academic_year;
            queryObject.written_exam_id = models.uuidFromString(req.params.id);

            models.instance.SchoolWrittenExamType.findOne(queryObject, {allow_filtering: true}, function (err, result) {
                if (_.isEmpty(result)) {
                    callback(err, message.nsa9006);
                } else {
                    models.instance.SchoolWrittenExamType.delete(queryObject, function (err, result) {
                        if (result) {
                            result['message'] = message.nsa9007;
                        }
                        callback(err, result);
                    });
                }
            });
        } else {
            var err = {};
            err.message = message.nsa10002;
            callback(err, null);
        }
    });
};

Exam.getAllExamSchedules = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.EXAM_SCHEDULE_PERMISSIONS);
    if (havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.EXAM_SCHEDULE_PERMISSIONS);
        var headers = baseService.getHeaders(req);
        findQuery.academic_year = headers.academic_year;
        models.instance.SchoolExamSchedule.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, examConverter.examObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

function convertDate(req, examSchedule, examSchedules, report) {
    if(examSchedule != undefined) {
        models.instance.SchoolExamPortion.findOne(
            { exam_schedule_id: models.uuidFromString(examSchedule.exam_schedule_id) },
            { allow_filtering: true }, function (err1, portionResult) {

                if (err1) {
                    report(err1, null);
                } else {
                    if (portionResult) {
                        examSchedule['portions'] = JSON.parse(JSON.stringify(portionResult));
                    }

                    async.each(examSchedule.schedule, function(schedule, callback) {
                        schedule['exam_start_time'] = dateService.getFormattedDate(schedule['exam_start_time']);
                        schedule['exam_end_time'] = dateService.getFormattedDate(schedule['exam_end_time']);
                        callback();
                    }, function (err) {
                        examSchedules.push(examSchedule);
                        report(null, examSchedules);
                    });
                }
            });

    } else {
        report(null, examSchedules);
    }
}

function getExamScheduleDetails(req, findQuery, callback) {
    var headers = baseService.getHeaders(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.class_id = models.uuidFromString(req.params.classId);
    findQuery.sections = {'$contains_key': req.params.sectionId};
    models.instance.SchoolExamSchedule.find(findQuery, {allow_filtering: true}, function (err, result) {
        if (err) {
            callback(err, []);
        } else {
            if (_.isEmpty(result)) {
                callback(null, baseService.emptyResponse());
            } else {
                var parsedResult = JSON.parse(JSON.stringify(result));
                baseService.waterfallOver(req, parsedResult, convertDate, [], function (err1, results) {
                    callback(err1, results);
                });
            }
        }
    });
}

Exam.getAllExamSchedulesByClassSec = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.EXAM_SCHEDULE_PERMISSIONS);
    if (havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.EXAM_SCHEDULE_PERMISSIONS);
        findQuery.status= true;
        getExamScheduleDetails(req, findQuery, callback);
    } else {
        callback(null, []);
    }
};


Exam.getExamSchedule = function (req, callback) {
    var findQuery = baseService.getFindQuery(req);
    var headers = baseService.getHeaders(req);
    findQuery.academic_year = headers.academic_year;

    if (req.params.id) {
        findQuery.exam_schedule_id = models.uuidFromString(req.params.id);
    }

    models.instance.SchoolExamSchedule.findOne(findQuery, {allow_filtering: true}, function(err, result) {
        if (result) {
            var finalResult = JSON.parse(JSON.stringify(result));
            var orderByDate =  _.orderBy(finalResult.schedule, 'exam_start_time');
                finalResult.schedule = orderByDate;
            models.instance.SchoolExamPortion.findOne(findQuery, {allow_filtering: true}, function(err1, portionResult) {
                if (!_.isEmpty(portionResult)) {
                    var portionResults = JSON.parse(JSON.stringify(portionResult));
                    if (!_.isEmpty(portionResults.attachments)) {
                        var attachmentsObj = baseService.getFormattedMap(portionResult['attachments'].attachment);
                        portionResults['files'] = attachmentsObj;
                    } else {
                        portionResults['files'] = null;
                    }
                    finalResult.portions = portionResults;
                } else {
                    finalResult.portions = {};
                }
                if (finalResult.schedule) {
                    baseService.sendDatesFormatedResult(finalResult.schedule, ["exam_start_time", "exam_end_time"], function (result1) {
                        finalResult.schedule = result1;
                        callback(err, finalResult);
                    });
                } else {
                    callback(err, finalResult);
                }
            });
        } else {
            callback(err, null);
        }
    });
};

Exam.getExamScheduleByType = function (req, callback) {
    var finalResult = { }, sections = [];
    finalResult.examSchedules = [];
    finalResult.examScheduleIds = [];
    finalResult.createdByOthers = false;
    if (!Array.isArray(req.body.sections)) {
        sections = Object.keys(req.body.sections);
    } else {
        sections = req.body.sections;
    }
    baseService.waterfallOver(req, sections, fetchExamSchedule, finalResult, function (err1, results) {
        callback(err1, results);
    });
};

function fetchExamSchedule(req, sectionId, data, callback) {
    var findQuery = baseService.getFindQuery(req);
    var headers = baseService.getHeaders(req);
    findQuery.academic_year = headers.academic_year;

    findQuery.written_exam_id = models.uuidFromString(req.params.typeId);
    findQuery.class_id = models.uuidFromString(req.body.class_id);
    findQuery.sections = {'$contains_key': sectionId };
    var haveManageAllPermissions = baseService.haveAnyPermissions(req, ['exam_schedule_manageAll']);

    models.instance.SchoolExamSchedule.findOne(findQuery, {allow_filtering: true}, function(err, result) {
        if (result) {
            if (result.created_by.toString() === headers.user_id || haveManageAllPermissions) {
                var exam = _.find(data, ['exam_schedule_id', result.exam_schedule_id.toString()]);
                if (!exam) {
                    var finalResult = JSON.parse(JSON.stringify(result));

                    models.instance.SchoolExamPortion.findOne(
                        {exam_schedule_id:result.exam_schedule_id },
                        { allow_filtering: true },
                        function(err1, portionResult) {

                            if (!_.isEmpty(portionResult)) {
                                var portionResults = JSON.parse(JSON.stringify(portionResult));
                                if (!_.isEmpty(portionResults.attachments)) {
                                    var attachmentsObj = baseService.getFormattedMap(portionResult['attachments'].attachment);
                                    portionResults['files'] = attachmentsObj;
                                } else {
                                    portionResults['files'] = null;
                                }
                                finalResult.portions = portionResults;
                            } else {
                                finalResult.portions = {};
                            }

                            if (data.examScheduleIds.indexOf(finalResult.exam_schedule_id) === -1) {
                                data.examScheduleIds.push(finalResult.exam_schedule_id);
                                data.examSchedules.push(finalResult);
                            }
                            callback(err, data);
                        }
                    );
                }
            } else {
                data.createdByOthers = true;
                callback(err, data);
            }
        } else {
            callback (err, result);
        }

    });
}


function fetchExamScheduleBySection(req, sectionId, data, callback) {
    async.parallel({
        examSchedules : getExamScheduleBySection.bind(null, req, sectionId),
        sectionSubjects : getSectionsSubject.bind(null, req, sectionId)
    }, function(err, response){
        if(err) {
            callback(err, null);
        } else if(response.examSchedules.length > 0) {
            response.sectionSubjects = JSON.parse(JSON.stringify(response.sectionSubjects));
            async.waterfall([
                validateType.bind(null, req, response),
                validateSubjects.bind()
            ], function(err, result) {
                callback(err, result);
            });
        } else {
            callback(err, null);
        }
    });

}

function getExamScheduleBySection(req, sectionId, callback) {
    var findQuery = baseService.getFindQuery(req);
    var headers = baseService.getHeaders(req);
    findQuery.academic_year = headers.academic_year;

    findQuery.class_id = models.uuidFromString(req.body.class_id);
    findQuery.sections = {'$contains_key': sectionId };
    models.instance.SchoolExamSchedule.find(findQuery, {allow_filtering: true}, function(err, result) {
        callback(err, result)
    });
}

function getSectionsSubject(req, sectionId, callback) {
    var headers = baseService.getHeaders(req);

    models.instance.SchoolClassSubjects.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        class_id: models.uuidFromString(req.body.class_id),
        section_id: models.uuidFromString(sectionId),
        academic_year: headers.academic_year
    }, {allow_filtering: true}, function (err, result) {
        callback(err, subjectConverter.subjectAllocationObjs(req, result));
    });
}


function validateType(req, response, callback) {
    if (response.examSchedules) {
        response.examSchedules = JSON.parse(JSON.stringify(response.examSchedules));
        var sameExamSchedule = _.find(response.examSchedules, function (examSchedules) {
            return examSchedules['written_exam_id'] === req.body.written_exam_id;
        });
        if (sameExamSchedule) {
            var err = {};
            err.message = "Exam is already scheduled for this class and section";
            callback(err, req, response);
        } else {
            callback(null, req, response);
        }
    } else {
        callback(null, req, response);
    }
}

function validateSubjects(req, response, callback) {
    if (req.body.schedule && req.body.schedule.length > 0) {
        var finalResult = {existingExam: response.examSchedules, overrideTime: null};
        var schedules = [];
        _.each(req.body.schedule, function (schedule) {
            var subject = _.find(response.sectionSubjects, function (sectionSubject) {
                return sectionSubject.subjectId.toString() === schedule.subject_id;
            });
            if (subject) {
                schedules.push(schedule);
            }
        });

        if (schedules.length > 0) {
            baseService.waterfallOver(req, schedules, validateSubjectTime, finalResult, function (err, results) {
                callback(err, null);
            });
        } else {
            callback(null, null);
        }
    } else {
        callback(null, null);
    }
}

function validateSubjectTime(req, subject, finalResult, callback) {
    var err = null, ind = 0, indExams = 0;
    while (err === null && ind < finalResult.existingExam.length) {
        if (finalResult.existingExam[indExams].schedule != null) {
            var scheduleLength = finalResult.existingExam[indExams].schedule.length;
            var schedules = finalResult.existingExam[indExams].schedule;
            while (err === null && ind < scheduleLength) {
                var existingSubject = schedules[ind];
                var startA = new Date(dateService.getFormattedDate(existingSubject.exam_start_time)),
                    endA = new Date(dateService.getFormattedDate(existingSubject.exam_end_time)),
                    startB = new Date(dateService.getFormattedDate(subject.exam_start_time)),
                    endB = new Date(dateService.getFormattedDate(subject.exam_end_time));

                /*console.info('err........', err, 'ind ... ', ind, '...indExams...',indExams);
                 console.info('startA...', startA, '...endB...', endB, '...', startA <= endB);
                 console.info('endA...', endA, '...startB...', startB, '...', endA >= startB);
                 console.info('startA...', startA, '...endB...', endB, '...', startA <= endB);
                 console.info('startB...', startB, '...endA...', endA, '...', startB <= endA);
                 console.info('(startA <= endB) && (endA >= startB) || (startA <= endB) && (startB <= endA)...',(startA <= endB) && (endA >= startB) || (startA <= endB) && (startB <= endA));*/


                // if ( (startA <= endB)  &&  (endA >= startB) || (startA <= endB)  &&  (startB <= endA) ) {
                if ((startA <= endB) && (endA >= startB) || (startA <= endB) && (startB <= endA)) {
                    // console.info('$$$$$$$$$$$$$$$ override found........');
                    err = {}
                    err.message = "Exam time is already schedule in " + finalResult.existingExam[indExams].written_exam_name;
                    callback(err, null);
                    return;
                } else {
                    ind++;
                    if (ind === scheduleLength) {
                        ind = 0;
                        indExams++;
                    }
                    // console.info(ind,'<== ind, finalResult.existingExam.length..',finalResult.existingExam.length, '...indExams...',indExams);
                    //if (indExams === finalResult.existingExam.length && ind === finalResult.existingExam[indExams].schedule.length) {
                    if (indExams === finalResult.existingExam.length) {
                        // console.info('########## override not found........');
                        callback(null, null);
                        return;
                    }
                }
            }
        } else {
           ind++;
           if (ind === finalResult.existingExam.length) {
               callback(null, null);
           }
        }
    }
    // });
}

Exam.saveExamSchedule = function (req, data, callback) {
    try {
        var sections = Object.keys(req.body.sections), finalResult = {};
        baseService.waterfallOver(req, sections, fetchExamScheduleBySection, finalResult, function (err1, results) {
            if (err1) {
                callback(err1, null);
            } else {
                var examSchedule = getExamScheduleObj(req), headers = baseService.getHeaders(req);
                examSchedule.exam_schedule_id = models.uuid();
                examSchedule = baseService.updateIdsFromHeader(req, examSchedule, false);
                if(req.body.status){
                    examSchedule.count = 1;
                }else{
                    examSchedule.count = 0;
                }
                data.count = examSchedule.count;
                examSchedule.academic_year = headers.academic_year;
                var examScheduleObj = new models.instance.SchoolExamSchedule(examSchedule);
                var array = [examScheduleObj.save({return_query: true})];
                data.exam_schedule_id = examSchedule.exam_schedule_id;
                data.batchObj = array;
                callback(null, data);
            }
        });

    } catch (err) {
        callback (err, null);
    }
};

function getExamScheduleObj (req) {
    var examSchedule = req.body, headers = baseService.getHeaders(req);
    examSchedule.written_exam_id = models.uuidFromString(examSchedule.written_exam_id);
    examSchedule.class_id = models.uuidFromString(examSchedule.class_id);

    if (examSchedule.schedule && examSchedule.schedule.length > 0) {
        for (var i = 0; i < examSchedule.schedule.length; i++) {
            examSchedule.schedule[i].subject_id = models.uuidFromString(examSchedule.schedule[i].subject_id);
            examSchedule.schedule[i].exam_start_time = dateService.getFormattedDate(examSchedule.schedule[i].exam_start_time);
            examSchedule.schedule[i].exam_end_time = dateService.getFormattedDate(examSchedule.schedule[i].exam_end_time);
        }
    }
    return examSchedule;
}

Exam.updateExamSchedule = function (req, data, callback) {
    var examSchedule = getExamScheduleObj(req), headers = baseService.getHeaders(req)
    examSchedule.updated_by = baseService.getHeaders(req).user_id;
    examSchedule.updated_username = baseService.getHeaders(req).user_name;
    examSchedule.updated_date = dateService.getCurrentDate();
    delete examSchedule.exam_schedule_id;
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.exam_schedule_id = models.uuidFromString(req.params.id);
     models.instance.SchoolExamSchedule.findOne(findQuery, function(err, result){
         if(req.body.status){
             examSchedule.count = result.count + Number(1);
         }else {
             examSchedule.count = result.count;
         }
         data.count = examSchedule.count;
         var updateQuery = models.instance.SchoolExamSchedule.update(findQuery, examSchedule, {return_query: true});
         var array = [updateQuery];
         data.exam_schedule_id = models.uuidFromString(req.params.id);
         data.batchObj = array;
         callback(null, data);
    });

};

Exam.deleteExamSchedule = function(req, data, callback) {
    var examScheduleId = models.uuidFromString(req.params.id);
    var queryObject = baseService.getFindQuery(req), headers = baseService.getHeaders(req);
    queryObject.academic_year = headers.academic_year;
    queryObject.exam_schedule_id = examScheduleId;
    models.instance.SchoolExamSchedule.findOne(queryObject, {allow_filtering: true}, function(err, result){
        var data = {exam_schedule_id: examScheduleId,status: result.status};
        if(_.isEmpty(result)) {
            callback(err, message.nsa9013);
        } else {
            var deleteObj = models.instance.SchoolExamSchedule.delete(queryObject, {return_query: true});
            var array = [deleteObj];
            data = {exam_schedule_id: examScheduleId, batchObj: array};
            callback(err, data);
        }
    });
};

Exam.findExamScheduleIdInSchoolMarklist = function(req, callback){
    var queryObject = baseService.getFindQuery(req);
        queryObject.exam_schedule_id = models.uuidFromString(req.params.id);
    models.instance.SchoolMarkList.findOne(queryObject, {allow_filtering: true}, function(err, result){
        callback(err,result);
    })
}

Exam.getExamScheduleByClassAndSec = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.MARKS_UPLOAD_PERMISSIONS);
    if (havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.MARKS_UPLOAD_PERMISSIONS);
        findQuery.status = true;
        getExamScheduleDetails(req, findQuery, callback);
    } else {
        callback(null, []);
    }
};

Exam.deleteAttachment = function(req, callback) {
    var body = req.body;
    var headers = baseService.getHeaders(req), portionsAttach = {}, findQuery ={};
    findQuery.exam_schedule_id = models.uuidFromString(body.exam_schedule_id);
    findQuery.id = models.uuidFromString(req.params.id);
    var files = req.body.attachments;
    if (files && files.length > 0) {
        var existingFiles = baseService.getExistingFiles(body);
        _.forEach(existingFiles, function (value, key) {
            portionsAttach[value.id] = value.name;
        });
        var attachmentTypeObj = {
            attachment : !_.isEmpty(portionsAttach) ? portionsAttach : null,
            description: null,
            updated_by: headers.user_id,
            updated_username: headers.user_name
        };
    }
    req.body.attachments = existingFiles;
    var updateValues = { updated_by : headers.user_id, updated_username : headers.user_name, attachments: attachmentTypeObj};
    models.instance.SchoolExamPortion.update(findQuery, updateValues, function(err, result){
        if(err){
            callback(err, null)
        }else {
            callback(null, result)
        }
    });
};

Exam.getPortionById = function (req, callback) {
    try {
        var findQuery = baseService.getFindQuery(req);
        var headers = baseService.getHeaders(req);
        findQuery.academic_year = headers.academic_year;
        findQuery.id = models.uuidFromString(req.params.id);
        models.instance.SchoolExamPortion.findOne(findQuery, {allow_filtering: true}, function(err, result){
            var portionResults = JSON.parse(JSON.stringify(result));
            if (!_.isEmpty(portionResults.attachments)) {
                var attachmentsObj = baseService.getFormattedMap(portionResults['attachments'].attachment);
                portionResults['files'] = attachmentsObj;
            } else {
                portionResults['files'] = null;
            }
            callback(null, portionResults);
        });
    }catch (err){
        callback(err, null)
    }
};

function getFindQuery(req){
    var headers = baseService.getHeaders(req);
    var queryObject = baseService.getFindQuery(req);
    queryObject.academic_year = headers.academic_year;

    return queryObject;
}


Exam.getCalendarDetails = function(req, data, callback){
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.exam_details  = {$contains_key: models.uuidFromString(req.params.id)};
    models.instance.CalendarData.findOne(findQuery, {allow_filtering: true}, function(err, result){
        if (err) {
            callback(err, []);
        } else {
            if (_.isEmpty(result)) {
                callback(null, []);
            } else {
                data.calendarFindData = result;
                callback(err, data);
            }
        }
    })
}

Exam.saveCalendarData = function(req, data, callback){
    try {
        var body = req.body;
       var examObject = getconstructExamObject(req);
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var id = models.uuid();
        var map = {};
        examObject.exam_schedule_id = data.exam_schedule_id;
        map[examObject.exam_schedule_id] = examObject;
        var saveQuery = {
            id: id,
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year : headers.academic_year,
            class_id: body.class_id ,
            exam_details: map,
            created_date: currentDate,
            updated_username: headers.user_name,
            updated_date: currentDate,
            updated_by: headers.user_id,
        };
        data.calendarData = saveQuery;
        var calendarDetails = new models.instance.CalendarData(saveQuery);
        calendarDetails.save(function(err, result){
            if(err){
                callback(err, null);
            }else{
                callback(null, data);
            }
        });
    } catch (err) {
        callback(err, null);
    }
}

function getconstructExamObject(req){
    var body = req.body;
    var subjectDetails =[];
    var examDetails ={};
    for(var i= 0; i < body.schedule.length; i++){
        var subjectDetail = {};
        subjectDetail.exam_date = baseService.getFormattedDate(body.schedule[i].date);
        subjectDetail.exam_start_time = baseService.getFormattedDate(body.schedule[i].exam_start_time);
        subjectDetail.exam_end_time = baseService.getFormattedDate(body.schedule[i].exam_end_time);
        subjectDetail.subject_name = body.schedule[i].subject_name;
        subjectDetails.push(subjectDetail);
    }
    var subjects = JSON.stringify(subjectDetails);
    var sections = baseService.getFormattedMap(body.sections)
    examDetails.subject_details = subjects.toString();
    examDetails.written_exam_name = body.written_exam_name;
    examDetails.class_name = body.class_name;
    examDetails.sections = JSON.stringify(sections).toString();

    return examDetails
}

Exam.updateCalendarData = function (req, data, callback) {
    try {
        var examObjs = getconstructExamObject(req);
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var body = req.body;
        var currentDate = new Date();
        examObjs.exam_schedule_id = req.params.id;
        var map = {};
        map[examObjs.exam_schedule_id] = examObjs;
        var findQuery = {};
        var calendarDetails = data.calendarFindData;
        findQuery.id = calendarDetails.id;
        findQuery.created_date = calendarDetails.created_date;
        var saveQuery = {
            exam_details: map,
            updated_username: headers.user_name,
            updated_date: currentDate,
            updated_by: headers.user_id
        };
        models.instance.CalendarData.update(findQuery, saveQuery, function (err, result) {
            if (err) {
                callback(err, null);
            } else {
                saveQuery.id = calendarDetails.id;
                saveQuery.tenant_id = tenantId;
                saveQuery.school_id = schoolId;
                saveQuery.class_id = body.class_id;
                saveQuery.academic_year = headers.academic_year;
                saveQuery.created_date = calendarDetails.created_date;
                data.calendarData = saveQuery;
                callback(null, data);
            }
        });

    } catch (err) {
        callback(err, null);
    }
}

Exam.deleteCalendarDetails = function(req, data, callback){
    var array = data.batchObj;
    var findQuery =  getFindQuery(req);
    findQuery.exam_details = {$contains_key: models.uuidFromString(req.params.id)};
    models.instance.CalendarData.findOne(findQuery, {allow_filtering: true}, function(err, result){
        if(err){
            callback(err, [])
        }
        else if (_.isEmpty(result)) {
            data['nodata'] = true;
            callback(err, data);
        } else {
            var queryObject ={};
            queryObject.id = result.id;
            queryObject.created_date = result.created_date;
            var deleteObj = models.instance.CalendarData.delete(queryObject, {return_query: true});
            array.push(deleteObj);
            data['id'] =  result.id.toString();
            data['nodata'] = false;
            data.batchObj= array;
            callback(err, data);
        }
    })
}

Exam.saveExamPortions = function (req, data, callback) {
    try {
        var array = data.batchObj;
        var examPortionsObj = {}, portionsAttach = {}, headers = baseService.getHeaders(req);
        if (req.body.portions.portion_id) {
            examPortionsObj.id = models.uuidFromString(req.body.portions.portion_id);
        } else {
            examPortionsObj.id = models.uuid();
        }

        if (req.params.id) {
            examPortionsObj.exam_schedule_id = models.uuidFromString(req.params.id);
        } else {
            examPortionsObj.exam_schedule_id = data.exam_schedule_id;
        }
        examPortionsObj = baseService.updateIdsFromHeader(req, examPortionsObj, false);
        examPortionsObj.academic_year = headers.academic_year;
        examPortionsObj.portion_details = req.body.portions.portion_details;
        examPortionsObj.media_name = req.body.media_name;
        var files = req.body.portions.files;
        if (files && files.length > 0) {
            _.forEach(files, function (value, key) {
                portionsAttach[value.id] = value.name;
            });


            var attachmentTypeObj = {
                attachment :  portionsAttach,
                description: null,
                updated_by: headers.user_id,
                updated_username: headers.user_name
            };
            examPortionsObj.attachments = attachmentTypeObj;
        } else {
            examPortionsObj.attachments = null;
        }

        var examPortionModelObj = new models.instance.SchoolExamPortion(examPortionsObj);
        array.push(examPortionModelObj.save({return_query: true}));
        data.batchObj = array;
        data.id = examPortionsObj.id;
        callback(null, data);

    } catch (err) {
        callback(err, null);
    }
}

Exam.deleteExamPortion = function(req, data, callback) {
    var examScheduleId = models.uuidFromString(req.params.id);
    var queryObject = baseService.getFindQuery(req), headers = baseService.getHeaders(req);
    queryObject.academic_year = headers.academic_year;
    queryObject.exam_schedule_id = examScheduleId;
    models.instance.SchoolExamPortion.findOne(queryObject, {allow_filtering: true}, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, data);
        } else {
            if(result.attachments){
                var attachements = baseService.getFormattedMap(result.attachments.attachment);
                data.s3FilesKeys = attachements ? attachements.map(function(a) {return a.id;}) : null;
            }
            queryObject.id = result.id;
            var deleteObj = models.instance.SchoolExamPortion.delete(
                { id: result.id, exam_schedule_id: result.exam_schedule_id },
                { return_query: true } );
            data.batchObj.push(deleteObj);
            callback(err, data);
        }
    });
};

Exam.findSubjectIdExam = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    models.instance.SchoolExamSchedule.find(findQuery, {select: ['schedule'] , raw:true, allow_filtering: true}, function(err, result) {
        var resultString = JSON.parse(JSON.stringify(result));
        var found = _.find(resultString, _.flow(
            _.property('schedule'),
            _.partialRight(_.some, { subject_id: req.params.id })
        ));
        if (found)
            callback(err, { used: true });
        else
            callback(err, { used: false });
    });
};

//For IOS Start
//TODO: do generically this method from getExamSchedule method
Exam.getExamScheduleDetails = function (req, callback) {
    var findQuery = baseService.getFindQuery(req);
    var headers = baseService.getHeaders(req);
    findQuery.academic_year = headers.academic_year;

    if (req.params.id) {
        findQuery.exam_schedule_id = models.uuidFromString(req.params.id);
    }

    models.instance.SchoolExamSchedule.findOne(findQuery, {allow_filtering: true}, function(err, result) {
        if (result) {
            var finalResult = JSON.parse(JSON.stringify(result));
            var orderByDate =  _.orderBy(finalResult.schedule, 'exam_start_time');
            finalResult.schedule = orderByDate;
            models.instance.SchoolExamPortion.findOne(findQuery, {allow_filtering: true}, function(err1, portionResult) {
                if (!_.isEmpty(portionResult)) {
                    var portionResults = JSON.parse(JSON.stringify(portionResult));
                    if (!_.isEmpty(portionResults.attachments)) {
                        var attachmentsObj = baseService.getFormattedMap(portionResult['attachments'].attachment);
                        portionResults['files'] = attachmentsObj;
                    } else {
                        portionResults['files'] = null;
                    }
                    finalResult.portions = portionResults;
                } else {
                    finalResult.portions = {};
                }
                if (finalResult.schedule) {
                    baseService.returnDatesFormatedResult(finalResult.schedule, ["exam_start_time", "exam_end_time"], function (result1) {
                        finalResult.schedule = result1;
                        callback(err, finalResult);
                    });
                } else {
                    callback(err, finalResult);
                }
            });
        } else {
            callback(err, null);
        }
    });
};
//For IOS End

module.exports = Exam;
