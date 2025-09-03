/**
 * Created by Kiranmai A on 3/4/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    async = require('async'),
    _ = require('lodash'),
    taxonomyUtils = require('@nsa/nsa-commons').taxanomyUtils,
    constant = require('@nsa/nsa-commons').constants,
    logger = require('../../../config/logger'),
    baseService = require('../common/base.service');

exports.getSchoolSubjects = function (req, res) {
    nsaCassandra.Subject.getSchoolSubjects(req, function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getSchoolSubjectsById = function(req, res) {
    nsaCassandra.Subject.getSchoolSubjectsById(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1801));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getSchoolActiveSubjects =function(req, res){
    nsaCassandra.Subject.getSchoolActiveSubjects(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1801));
        }else{
            events.emit('JsonResponse',req,res, result)
        }

    })
}

exports.saveSchoolSubjects = function(req, res) {
    async.waterfall([
        saveSubjects.bind(null, req),
        getDeptTaxanomy.bind(),
        addDeptSubTaxonomy.bind(),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1802));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa1811});
        }
    });
};

function saveSubjects(req, callback) {
    nsaCassandra.Subject.saveSchoolSubjects(req, function (err, result) {
        result.features = {actions : constant.CREATE, featureTypeId : result.subject_id};
        callback(err, req, result);
    })
};
exports.saveSubjects = saveSubjects;

function getDeptTaxanomy(req, data, callback) {
    nsaCassandra.Subject.getDeptTaxanomy(req, data, function (err, result) {
        callback(err, req, result);
    })
};
exports.getDeptTaxanomy = getDeptTaxanomy;

function addDeptSubTaxonomy(req, data, callback) {
    nsaCassandra.Subject.addDeptSubTaxonomy(req, data, function (err, result) {
        callback(err, req, result);
    })
};
exports.addDeptSubTaxonomy = addDeptSubTaxonomy;

exports.updateSchoolSubjects = function (req, res) {
    nsaCassandra.Subject.subjectFindInSubjectAllocation(req, function(err, result){
        var status = JSON.parse(req.body.status);
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1813));
        } else if(!_.isEmpty(result) && !status){
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa1820});
        } else {
            async.waterfall([
                updateSubjects.bind(null, req),
                getSubTaxanomy.bind(),
                deleteDeptSubTaxanomy.bind(),
                getDeptTaxanomy.bind(),
                addDeptSubTaxonomy.bind(),
                insertAuditLog.bind(),
                executeBatch.bind()
            ], function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1813));
                } else {
                    result['message'] = message.nsa1814;
                    events.emit('JsonResponse', req, res, result);
                }
            });
        }
    });

};

function updateSubjects(req, callback) {
    nsaCassandra.Subject.updateSchoolSubjects(req, function (err, result) {
        result.features = {actions : constant.UPDATE, featureTypeId : result.subject_id};
        callback(err, req, result);
    })
};
exports.updateSubjects = updateSubjects;

function getSubTaxanomy(req, data, callback) {
    nsaCassandra.Subject.getSubTaxanomy(req, data, function (err, result) {
        callback(err, req, result);
    })
};
exports.getSubTaxanomy = getSubTaxanomy;

function deleteDeptSubTaxanomy(req, data, callback) {
    nsaCassandra.BaseService.deleteTaxonomyObj(req, data, function (err, result) {
        callback(err, req, result);
    })
};
exports.deleteDeptSubTaxanomy = deleteDeptSubTaxanomy;

exports.deleteSchoolSubjects = function (req, res) {
    nsaCassandra.Subject.findSubjectsInClassSections(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1803));
        }else if(!_.isEmpty(result) && !result.subjectId){
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002})
        }else {
            async.waterfall([
                deleteSubjects.bind(null, req),
                getSubTaxanomy.bind(),
                deleteDeptSubTaxanomy.bind(),
                insertAuditLog.bind(),
                executeBatch.bind()
            ], function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1803));
                } else {
                    result['message'] = message.nsa1815;
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    })
};

function deleteSubjects(req, callback) {
    nsaCassandra.Subject.deleteSchoolSubjects(req, function (err, result) {
        result.features = {actions : constant.DELETE, featureTypeId : result.subject_id};
        callback(err, req, result);
    })
};
exports.deleteSubjects = deleteSubjects;

exports.getSubjectsByDepts = function (req, res) {
    nsaCassandra.Subject.getSchoolSubjects(req, function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1803));
        } else {
            result['message'] = message.nsa1815;
            getDeptDetails(req, result, function(err1, result1){
                if (err1) {
                    logger.debug(err1);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa1803));
                } else {
                    events.emit('JsonResponse', req, res, result1);
                }
            })
        }
    })
};

function getDeptDetails(req, data, callback) {
    try {
        var body = req.body;
        var depts = nsaCassandra.BaseService.getListOfUuid(body.deptId);
        var deptInfo;
        _.forEach(depts, function(value, key){
            deptInfo = filterDeptDetails(data, value);
        });
        callback(null, deptInfo);
    } catch (err) {
        callback(err, null);
    }
};
exports.getDeptDetails = getDeptDetails;

function filterDeptDetails(data, val) {
    var deptInfo = _.filter(data, {'deptId': val});
    return deptInfo;
};

/* Subject Allocation */
exports.getSchoolClassSubjects = function(req, res) {
    var havePermissions = nsaCassandra.BaseService.haveAnyPermissions(req, constant.SUBJECT_ALLOC_PERMISSIONS);
    if(havePermissions) {
        async.parallel({
            classSubjects: getSchoolClassAllSubject.bind(null, req),
            subjects: getAllSchoolSubjects.bind(null, req),
            classes : getClasses.bind(null, req),
            sections : getSections.bind(null, req)
        }, function (err, data) {
            if(err) {
                logger.debug(err);
                events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
            } else {
                getSchoolClassSub(req, res, data);

            }
        })
    } else {
        events.emit('JsonResponse', req, res, []);
    }
};

function getClasses(req, callback) {
    nsaCassandra.Classes.getAllClasses(req, function(err, result) {
        callback(err, result);
    })
};
exports.getClasses = getClasses;

function getSections(req, callback) {
    nsaCassandra.Section.getAllSections(req, function (err, result) {
        callback(err, result);
    });
};
exports.getSections = getSections;

exports.getSchoolClassSubjectsById = function(req, res) {
    nsaCassandra.Subject.getSchoolClassSubjectsById(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
        }else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

/*
exports.getSubjectsbyClassSection = function(req, res){
    nsaCassandra.Subject.getSubjectsbyClassSection(req, function(err, result){
        if(err){
            throwSubjectErr(err, message.nsa1902);
        } else{
            events.emit('JsonResponse', req, res, result);
        }
    })
}
*/

exports.getSubjectsbyClassSection = function(req, res) {
    async.parallel({
        classSubjects: getSubjectsByClassAndSec.bind(null, req),
        subjects: getAllSchoolSubjects.bind(null, req)
    }, function (err, data) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
        } else {
            getClassSub(req, res, data, function(err, result) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            });

        }
    })
};


exports.getSubjectsbyClassSections = function(req, res) {
    async.parallel({
        classSubjects: getSubjectsByClassAndSecs.bind(null, req),
        subjects: getAllSchoolSubjects.bind(null, req)
    }, function (err, data) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err,
                err.message.toString().indexOf(message.nsa1819) > -1 ? err.message : message.nsa1812));
        } else {
            data.subjects = JSON.parse(JSON.stringify(data.subjects));
            getClassSub(req, res, data, function(err, result) {
                if(err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1812));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            });

        }
    })
};

function getAllSchoolSubjects(req, callback) {
    nsaCassandra.Subject.getSchoolSubjects(req, function(err, result) {
        callback(err, result)
    })
}

function getSubjectsByClassAndSec(req, callback) {
    nsaCassandra.Subject.getSubjectsbyClassSection(req, function(err, result){
        callback(err, result);
    })
}

function getSubjectsByClassAndSecs(req, callback) {
    var sections = req.body.sectionIds, data1 = {mergedsubjects: [] };
    baseService.waterfallOver(req, sections, iterateQuery, data1, function(err, result) {
        callback(err, data1.mergedsubjects);
    });
}

function iterateQuery(req, sectionId, data1, report) {
    req.body.sectionId = sectionId;
    nsaCassandra.Subject.getSubjectsbyClassSection(req, function(err, result) {
        var results = JSON.parse(JSON.stringify(result));
        if (results.length > 0) {
            _.each(results, function (subject) {
                var alreadyAddedSubject = _.find(data1.mergedsubjects, ['subjectId', subject.subjectId]);
                if (alreadyAddedSubject) {
                    alreadyAddedSubject.sectionIds.push(subject.sectionId);
                } else {
                    subject.sectionIds = [subject.sectionId];
                    delete subject.sectionId;
                    data1.mergedsubjects.push(subject);
                }
            });
        } else {
            err = {};
            err.message = message.nsa1821;
            if(!_.isEmpty(req.body.sections)){
                var sections = _.find(req.body.sections, function (o) {return o.id == sectionId;});
                err.message = message.nsa1819 + sections.name;
            }
        }
        report(err, data1);
    })
}

function getSchoolClassAllSubject(req, callback) {
    nsaCassandra.Subject.getSchoolClassSubjects(req, function(err, result){
        callback(err, result)
    })
}

function getClassSub(req, res, data, callback) {
    try {
        var subjects = [];
        if(!_.isEmpty(data.classSubjects) && !_.isEmpty(data.subjects)) {
            _.forEach(data.classSubjects, function(val){
                var sub = _.filter(data.subjects, {'subjectId' : val.subjectId});
                if(Array.isArray(sub) && sub.length > 0) {
                    val['subjectName'] = sub[0].subName;
                }
                subjects.push(val);
            })
        }
        callback(null, subjects);
    } catch (err) {
        callback(err, null);
    }
}

function getSchoolClassSub(req, res, data) {
    var subjects = [];
    try {
        if(!_.isEmpty(data.classSubjects) && !_.isEmpty(data.subjects)) {
            _.forEach(data.classSubjects, function(val){
                var sub = _.filter(data.subjects, {'subjectId' : val.subjectId});
                var className = _.filter(data.classes, { 'class_id': val.classId});
                var section = _.filter(data.sections, {'sectionId': val.sectionId});
                val['subjectName'] = sub[0].subName;
                val['className'] = !_.isEmpty(className) ? className[0].class_name : null;
                val['sectionName'] = !_.isEmpty(section) ? section[0].sectionName : null;
                val['editPermissions'] = val.editPermissions;
                subjects.push(val);
            })
        }
        events.emit('JsonResponse', req, res, subjects);
    } catch (err) {
        logger.debug(err);
        events.emit('ErrorJsonResponse', req, res, err);
    }


}

exports.saveSchoolClassSubjects = function(req, res) {
    async.waterfall([
        buildTaxanomyObj.bind(null, req),
        saveSchoolObject.bind(),
        executeBatch.bind(),
    ], function(err, result) {
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1802));
        } else{
            var result = {};
            result['message'] = message.nsa1816;
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.updateSchoolClassSubjects = function(req, res) {
    nsaCassandra.Subject.updateSchoolClassSubjects(req, function(err, result){
        if(err){
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1813));
        } else{
            result['message'] = message.nsa1817;
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.deleteSchoolClassSubjects = function(req, res) {
    async.parallel({
        timetable: nsaCassandra.Timetable.findSubjectIdInTimetable.bind(null, req),
        assignments: nsaCassandra.Assignments.findSubjectIdAssignments.bind(null, req),
        exam: nsaCassandra.Exam.findSubjectIdExam.bind(null, req),
    }, function(err, data){
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1803));
        } else if(!_.isEmpty(data.timetable) || !_.isEmpty(data.assignments) || (data.exam.used)){
            var result = {};
            result['message'] = message.nsa10002;
            events.emit('ErrorJsonResponse', req, res, result);
        } else{
            nsaCassandra.Subject.deleteSchoolClassSubjects(req, function(err, result){
                if(err){
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1803));
                } else{
                    result['message'] = message.nsa1818;
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }})
};


function saveSchoolObject(req, data, callback) {
    nsaCassandra.Subject.saveSchoolClassSubjects(req, function(err, result){
        callback(err, req, result)
    })
}

function buildTaxanomyObj(req, callback) {
    taxonomyUtils.buildTaxanomyObj(req, function(err, result){
        callback(err, req, result)
    })
}

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.insertAuditLog = insertAuditLog;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, result);
    })
};
exports.executeBatch = executeBatch;

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.SUB_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;

function throwSubjectErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.SUB_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwSubjectErr = throwSubjectErr;