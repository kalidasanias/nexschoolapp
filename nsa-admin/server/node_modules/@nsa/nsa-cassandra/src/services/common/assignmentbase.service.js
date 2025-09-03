/**
 * Created by Kiranmai A on 3/3/2017.
 */


var models = require('../../models/index'),
    baseService = require('./base.service'),
    dateService = require('../../utils/date.service.js'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    _ = require('lodash'),
    templateConverter = require('../../converters/template.converter'),
    logger = require('../../../config/logger');

var AssignmentBase = function f(options) {
    var self = this;
};

AssignmentBase.constructAssignmentTypeDetails = function(req) {
    var assignmentTypeDetails;
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var userName = headers.user_id;
        var currentDate = new Date();

        assignmentTypeDetails = new models.instance.SchoolAssignmentType({
            assignment_type_id: models.uuid(),
            tenant_id:tenantId,
            school_id:schoolId,
            assignment_type_name: body.name,
            assignment_desc: body.desc,
            updated_date: currentDate,
            updated_by : userName,
            created_by: userName,
            created_date: currentDate,
            created_firstname: headers.user_name,
            updated_username: headers.user_name,
            default_value : false,
            status : true
        });
    } catch (err) {
		logger.debug(err);
        return err;
    }
    return assignmentTypeDetails;
};

AssignmentBase.assignmentTypeQueryObject = function(req) {
    var assignmentTypeQueryObject;
    try {
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var assignmentTypeId = req.params.id;

        assignmentTypeQueryObject = {
            assignment_type_id: models.uuidFromString(assignmentTypeId),
            tenant_id: tenantId,
            school_id:  schoolId,
        };
    }  catch (err){
        logger.debug(err)
        return err;
    }
    return assignmentTypeQueryObject;
};

AssignmentBase.assignmentTypeUpdateValues = function(req) {
    var updateValues;
    try{
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var currentDate = new Date();

        updateValues = {
            assignment_type_name: body.name,
            assignment_desc: body.desc,
            updated_date: currentDate,
            updated_by :  headers.user_id,
            updated_username: headers.user_name,
            default_value : false,
            status : JSON.parse(body.status),
        };
    } catch (err) {
        logger.debug(err);
        throwConverterErr(err, message.nsa436);
    }
    return updateValues;
};

AssignmentBase.constructAssignmentObj = function(req, data, callback) {
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var academicYear = headers.academic_year;
        var userName = headers.user_id;
        var currentDate = new Date();
        var assignmentId = body.assignmentId != null ? models.uuidFromString(body.assignmentId) : models.uuid();
        var attachmentsObj = baseService.getMapFromFormattedMap(body.attachments);
        var subjects = baseService.getMapFromFormattedMap(body.subjects);
        body.object_id = assignmentId;

        var obj = {
            assignment_id: assignmentId,
            tenant_id:tenantId,
            school_id:schoolId,
            academic_year: academicYear,
            media_name: baseService.getMedia(req),
            assignment_name: body.assignmentName,
            assignment_type_id : models.uuidFromString(body.assignmentTypeId),
            assignment_type_name: body.assignmentTypeName,
            assignment_desc: body.assignmentDesc,
            notified_categories: JSON.stringify(data.taxanomy),
            /*subject_id: body.subjectId != null ? models.uuidFromString(body.subjectId) : null,
             subject_name: body.subjectName != null ? body.subjectName : null,*/
            subjects: subjects,
            due_date: baseService.getFormattedDate(body.dueDate),
            repeat_option_id: models.uuidFromString('f45c5ba9-934e-465b-95cd-0f17c800b2b3'),   //Have to rework this hot coded
            repeat_option: 'Once',
            priority: body.priority,
            notify_to: body.notifiedTo,
            attachments: attachmentsObj,
            updated_by: userName,
            updated_date: currentDate,
            updated_username: headers.user_name,
            created_by: userName,
            created_date: currentDate,
            created_firstname: headers.user_name,
            status: JSON.parse(body.status)
        }
        var assignmentObj = new models.instance.SchoolAssignment (obj);

        var assignmentObject = assignmentObj.save({return_query: true});
        var array = [assignmentObject];
        data.assignment_id = assignmentId;
        data.batchObj = array;
        data.esAssignmentsObj = obj;
        callback(null, data)
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

AssignmentBase.constructAssignmentDetailsObj = function(req, data, callback) {
    try {
        var esDetailObjs = [];
        var users = req.body.users;
        var array = data.batchObj;
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var academicYear = headers.academic_year;
        var userName = headers.user_id;
        var currentDate = new Date();
        if(typeof body.attachments == "string") {
            var attachmentsObj = (body.attachments != null && body.attachments != undefined) ? baseService.getMapFromFormattedMap(JSON.parse(body.attachments)): null;
        } else if(Array.isArray(body.attachments)) {
            var attachmentsObj = Array.isArray(body.attachments) ? baseService.getMapFromFormattedMap(body.attachments): null;
        }
        var subjects = baseService.getMapFromFormattedMap(body.subjects);

        _.forEach(users, function(value, key){

            var obj = {
                assignment_detail_id: models.uuid(),
                assignment_id: data.assignment_id,
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id: models.uuidFromString(headers.school_id),
                academic_year: academicYear,
                media_name: baseService.getMedia(req),
                assignment_name: body.assignmentName,
                assignment_type_id : models.uuidFromString(body.assignmentTypeId),
                assignment_type_name: body.assignmentTypeName,
                assignment_desc: body.assignmentDesc,
                user_name: value.userName,
                first_name: value.firstName,
                class_id: models.uuidFromString(value.classes[0].class_id),
                class_name: value.classes[0].class_name,
                section_id: models.uuidFromString(value.classes[0].section_id),
                section_name: value.classes[0].section_name,
                /*subject_id: body.subjectId != null ? models.uuidFromString(body.subjectId) : null,
                 subject_name: body.subjectName != null ? body.subjectName : null,*/
                subjects: subjects,
                due_date: baseService.getFormattedDate(body.dueDate),
                repeat_option_id: models.uuidFromString('f45c5ba9-934e-465b-95cd-0f17c800b2b3'),
                repeat_option: 'Once',
                priority: body.priority,
                attachments: attachmentsObj || null,
                updated_by: userName,
                updated_date: currentDate,
                updated_username: headers.user_name,
                created_by: userName,
                created_date: currentDate,
                created_firstname: headers.user_name,
                status: JSON.parse(body.status)
            };

            var assignmentDetails = new models.instance.SchoolAssignmentDetails (obj);
            var assignmentDetailsObj = assignmentDetails.save({return_query: true});
            array.push(assignmentDetailsObj);
            esDetailObjs.push(obj);
        });
        data.batchObj = array;
        data.esAssignmentsDetailObj = esDetailObjs;
        callback(null, data)
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

AssignmentBase.updateAssignmentObj = function(req, data, callback) {

    try{
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var academicYear = headers.academic_year;
        var userName = headers.user_id;
        var assignmentId = models.uuidFromString(req.params.id);
        body.object_id = assignmentId;
        var currentDate = new Date();
        if(typeof body.attachments == "string") {
            var attachmentsObj = (body.attachments != null && body.attachments != undefined) ? baseService.getMapFromFormattedMap(JSON.parse(body.attachments)): null;
        } else if(Array.isArray(body.attachments)) {
            var attachmentsObj = Array.isArray(body.attachments) ? baseService.getMapFromFormattedMap(body.attachments): null;
        }

        var subjects = baseService.getMapFromFormattedMap(body.subjects);

        var queryObject = {
            assignment_id: assignmentId, tenant_id: tenantId, school_id:  schoolId, academic_year: academicYear
        };

        var updateValues = {
            media_name: baseService.getMedia(req),
            assignment_name: body.assignmentName,
            assignment_type_id : models.uuidFromString(body.assignmentTypeId),
            assignment_type_name: body.assignmentTypeName,
            assignment_desc: body.assignmentDesc,
            notified_categories: JSON.stringify(data.taxanomy),
            /*subject_id: body.subjectId != null ? models.uuidFromString(body.subjectId) : null,
            subject_name: body.subjectName != null ? body.subjectName : null,*/
            subjects: subjects,
            due_date: baseService.getFormattedDate(body.dueDate),
            repeat_option_id: models.uuidFromString('f45c5ba9-934e-465b-95cd-0f17c800b2b3'),
            repeat_option: 'Once',
            priority: body.priority,
            notify_to: body.notifiedTo,
            attachments: attachmentsObj || null,
            updated_by: userName,
            updated_date: currentDate,
            updated_username: headers.user_name,
            status: JSON.parse(body.status)
        };

        var updateQuery = models.instance.SchoolAssignment.update(queryObject, updateValues, {return_query: true});

        var array = [updateQuery];
        data.assignment_id = assignmentId;
        data.batchObj = array;
        data.esAssignmentsObj = _.assignIn(queryObject, updateValues);

        callback(null, data);
    } catch(err) {
        logger.debug(err);
        callback(err, null);
    }
};

AssignmentBase.assignmentQueryObject = function(req) {
    var assignmentQueryObject;
    try {
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var assignmentId = req.params.id;
        var body = req.body;
        var academicYear = headers.academic_year;

        assignmentQueryObject = {
            assignment_id: models.uuidFromString(assignmentId), tenant_id: tenantId, school_id:  schoolId, academic_year: academicYear
        };
    } catch (err){
        logger.debug(err);
        return err;
    }
    return assignmentQueryObject;
};

AssignmentBase.findAssignmentDetailsObj = function (req, data, callback) {
    var headers = baseService.getHeaders(req);
    var assignmentId = req.params.id;
    var body = req.body;
    var academicYear = headers.academic_year;

    var assignmentQueryObject = {
        assignment_id: models.uuidFromString(assignmentId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id:  models.uuidFromString(headers.school_id),
        academic_year: academicYear
    };

    models.instance.SchoolAssignmentDetails.find(assignmentQueryObject, {allow_filtering: true}, function(err, result){
        if (err) {
            logger.debug(err);
            callback(err, null);
        } else {
            data.result = result;
            callback(null, data);
        }
    });
};

AssignmentBase.deleteAssignmentDetails = function (req, data, callback) {
    var array = data.batchObj || [];
    try {
        var headers = baseService.getHeaders(req);
        var body = req.body;
        _.forEach(data.result, function(value, key) {
            var assignmentQueryObject = {
                assignment_detail_id: value.assignment_detail_id,
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id:  models.uuidFromString(headers.school_id),
                academic_year: value.academic_year
            };
            var deleteQueries = models.instance.SchoolAssignmentDetails.delete(assignmentQueryObject , {return_query: true});
            array.push(deleteQueries)
        });
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        
        logger.debug(err);
        callback(err, null);
    }
};

AssignmentBase.assignmentDetailQueryObj = function(req) {
    var assignmentDetailQueryObject;
    try{
        var headers = baseService.getHeaders(req);
        assignmentDetailQueryObject = {
            assignment_detail_id: models.uuidFromString(req.params.id),
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id:  models.uuidFromString(headers.school_id),
            academic_year: headers.academic_year
        };
    } catch(err) {
       logger.debug(err);
        return err;
    }
    return assignmentDetailQueryObject;
};

AssignmentBase.assignmentDetailUpdateValues = function(req) {
    var updateValues;
    try {
        var currentDate = new Date();
        var body = req.body;
        updateValues = {
            submitted_date: currentDate,
            is_submitted: JSON.parse(body.isSubmitted)
        }
    } catch (err) {
        
        logger.debug(err);
        return err;
    }
    return updateValues;
};

AssignmentBase.getTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var headers = baseService.getHeaders(req);
    var dueDate= dateService.getFormattedDateWithoutTime(body.dueDate)
    var subjects = baseService.getNamesFromArray(body.subjects, "name");
    var params = {subject_name: body.subjectName != null ? body.subjectName : '', title: body.assignmentName, desc: body.assignmentDesc, staff_name: headers.user_name, due_date: dueDate, subjects: subjects};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
};

AssignmentBase.updateAttachmentsObj = function(req, data, callback) {

    try{
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var academicYear = headers.academic_year;
        var assignmentId = models.uuidFromString(req.params.id);
        var currentDate = new Date();
        
        var attachmentsObj = baseService.getMapFromFormattedMap(body.attachments);

        var queryObject = { assignment_id: assignmentId, tenant_id: tenantId, school_id:  schoolId, academic_year: academicYear };
        var updateValues = { attachments: {'$add' : attachmentsObj} };
        var updateQuery = models.instance.SchoolAssignment.update(queryObject, updateValues, {return_query: true});

        var array = [updateQuery];
        data.assignment_id = assignmentId;
        data.batchObj = array;
        data.esAssignmentsObj = _.assignIn(queryObject, {attachments: attachmentsObj});

        callback(null, data);
    } catch(err) {
        logger.debug(err);
        callback(err, null);
    }
};

AssignmentBase.updateAssignmentDetails = function(req, data, callback) {
    try {
        var esDetailObjs = [];
        var users = req.body.users;
        var array = data.batchObj;
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var attachmentsObj = baseService.getMapFromFormattedMap(body.attachments);
        var exisitngAttachments = {};
        _.forEach(data.result, function(value, key){
            exisitngAttachments = value.attachments;
            var queryObject = { assignment_detail_id: value.assignment_detail_id, tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id:  models.uuidFromString(headers.school_id), academic_year: value.academic_year };
            var updateValues = { attachments: {'$add' : attachmentsObj} };

            var updateQuery = models.instance.SchoolAssignmentDetails.update(queryObject, updateValues, {return_query: true});
            array.push(updateQuery);
            esDetailObjs.push(_.assignIn(queryObject, {attachments: attachmentsObj}))
        });
        data.batchObj = array;
        data.esAssignmentsDetailObj = esDetailObjs;
        data.attachmentObjs = _.assignIn(attachmentsObj, exisitngAttachments);
        callback(null, data)
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

AssignmentBase.updateAssignmentAndDetails = function (req, data, callback) {
    try{
        var array = data.batchObj || [];
        if(!_.isEmpty(data.assignments)) {
            _.forEach(data.assignments, function(value, key){
                if(!_.isEmpty(value.subject_id)) {
                    var queryObject = { assignment_id: value.assignment_id, tenant_id: value.tenant_id,
                        school_id:  value.school_id, academic_year: value.academic_year };
                    var subjmap = {};
                    subjmap[value.subject_id] = value.subject_name;
                    var updateValues = { subjects:  subjmap};

                    var updateQuery = models.instance.SchoolAssignment.update(queryObject, updateValues, {return_query: true});
                    array.push(updateQuery);
                }
            });
        }
        if(!_.isEmpty(data.assignmentDetails)) {
            _.forEach(data.assignmentDetails, function(value, key){
                if(!_.isEmpty(value.subject_id)) {
                    var queryObject = { assignment_detail_id: value.assignment_detail_id, tenant_id: value.tenant_id,
                        school_id:  value.school_id, academic_year: value.academic_year };
                    var submap = {};
                    submap[value.subject_id] = value.subject_name;
                    var updateValues = { subjects: submap};

                    var updateQuery = models.instance.SchoolAssignmentDetails.update(queryObject, updateValues, {return_query: true});
                    array.push(updateQuery);
                }
            });
        }
        data.batchObj = array;
        callback(null, req, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

AssignmentBase.deleteAttachmentsObj = function(req, data, callback) {
    try {
        var body = req.body;
        var findQuery = getFindQuery(req);
        findQuery.assignment_id = models.uuidFromString(req.params.id);
        var existingFiles = baseService.getExistingFiles(body);
        req.body.attachments = existingFiles;
        var updateQuery = models.instance.SchoolAssignment.update(findQuery, {attachments: baseService.getMapFromFormattedMap(existingFiles)}, {return_query: true});
        data.batchObj = [updateQuery];
        data.id = findQuery.assignment_id;
        data.s3DeleteIds = [req.body.curentFile];
        data.existingFiles = existingFiles;
        data.esAssignmentsObj = _.assignIn(findQuery, {attachments: baseService.getMapFromFormattedMap(existingFiles)});
        data.attachmentObjs = baseService.getMapFromFormattedMap(existingFiles);
        callback(null, data)
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

function getFindQuery(req){
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;

    return findQuery;
}

AssignmentBase.deleteAttachmentsDetailsObj = function(req, data, callback) {
    try {
        var esDetailObjs = [];
        var body = req.body;
        var findQuery = getFindQuery(req);
        findQuery.assignment_id = models.uuidFromString(req.params.id);
        models.instance.SchoolAssignmentDetails.find(findQuery, {allow_filtering: true}, function(err, result){
            if(_.isEmpty(result)) {
                callback(null, data);
            } else {
                var array = data.batchObj || [];
                var results = JSON.parse(JSON.stringify(result));
                _.forEach(results, function(value, key) {
                    delete findQuery.assignment_id;
                    findQuery.assignment_detail_id = models.uuidFromString(value.assignment_detail_id);
                    esDetailObjs.push(_.assignIn(value, {attachments: baseService.getMapFromFormattedMap(data.existingFiles)}))
                    var updateQuery = models.instance.SchoolAssignmentDetails.update(findQuery, {attachments: baseService.getMapFromFormattedMap(data.existingFiles)}, {return_query: true});
                    array.push(updateQuery);
                    if (results.length -1 === key) {
                        data.batchObj = array;
                        data.esAssignmentsDetailObj = esDetailObjs;
                        data.attachmentObjs = baseService.getMapFromFormattedMap(data.existingFiles);
                        callback(null, data);
                    }
                });
            }
        });
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

function throwConverterErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.ASSIGNMENT_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwConverterErr = throwConverterErr;

AssignmentBase.deleteAttachmentByKey = function(req, data, callback) {
    try {
        var body = req.body;
        var findQuery = getFindQuery(req);
        findQuery.attachments = {'$contains_key': req.body.curentFile};
        models.instance.SchoolAssignment.find(findQuery, {allow_filtering: true}, function (err, result) {
            callback(err, result)
        });

    } catch (err) {
        callback(err, null);
    }
};

function getFindQuery(req){
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;

    return findQuery;
}

module.exports = AssignmentBase;
