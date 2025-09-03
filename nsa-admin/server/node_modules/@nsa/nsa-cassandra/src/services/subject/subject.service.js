/**
 * Created by Kiranmai A on 3/4/2017.
 */
var express = require('express'),
    models = require('../../models/index'),
    baseService = require('../common/base.service'),
    subjectConverter = require('../../converters/subject.converter');

var Subject = function f(options) {
    var self = this;
};

Subject.getSchoolSubjects = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.SUBJECT_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.SUBJECT_PERMISSIONS);
        models.instance.SchoolSubject.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, subjectConverter.schoolSubjectObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

Subject.getAllSubjects = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    models.instance.SchoolSubject.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, subjectConverter.schoolSubjectObjs(req, result));
    });
};

Subject.getSchoolSubjectsById = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var subjectId = models.uuidFromString(req.params.id);
    var academicYear = headers.academic_year;
    var findObject =  {
        subject_id : subjectId,
        tenant_id : tenantId,
        school_id : schoolId,
        academic_year : academicYear
    };
    models.instance.SchoolSubject.findOne(findObject, function(err, result){
        callback(err, subjectConverter.schoolSubjectObj(req, result));
    });
};

Subject.findAspectIdInSubjectDetails = function(req, callback){
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var sub_aspects = {$contains_key: models.uuidFromString(req.params.id)};
    var academicYear = headers.academic_year;
    var findQuery = {
        tenant_id : tenantId,
        school_id : schoolId,
        sub_aspects : sub_aspects,
        academic_year : academicYear
    };
    models.instance.SchoolSubject.find(findQuery, {allow_filtering: true},function(err, result){
        callback(err, subjectConverter.schoolSubjectObjs(req, result));
    })
}

Subject.findSubjectsInClassSections = function(req, callback){
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var subjectId = models.uuidFromString(req.params.id);
    var academicYear = headers.academic_year;
    var findQuery = {
        tenant_id : tenantId,
        school_id : schoolId,
        subject_id : subjectId,
        academic_year : academicYear
    };
    models.instance.SchoolClassSubjects.find(findQuery, {allow_filtering: true},function(err, result){
        callback(err, subjectConverter.subjectAllocationObjs(req, result));
    })
}

Subject.getSchoolActiveSubjects = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var findQuery =  {
        tenant_id : tenantId,
        school_id : schoolId,
        academic_year : academicYear,
        status: true,
    };
    models.instance.SchoolSubject.find(findQuery,{ allow_filtering: true}, function(err, result){
        callback(err, subjectConverter.schoolSubjectObjs(req, result));
    });
};

Subject.saveSchoolSubjects = function(req, callback){
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var subjectAspects = baseService.getMapFromFormattedMap(body.subAspects);
        var subjectId = models.uuid();
        var schoolSubjects = new models.instance.SchoolSubject({
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year :headers.academic_year,
            updated_by:  headers.user_id,
            updated_username:  headers.user_name,
            updated_date: currentDate,
            subject_id: subjectId,
            default_value : false,
            status :JSON.parse(body.status),
            sub_aspects : subjectAspects,
            sub_code: body.subCode,
            dept_id: models.uuidFromString(body.deptId),
            sub_desc: body.subDesc,
            sub_name: body.subName,
            created_date: currentDate,
            created_by : headers.user_id,
            created_firstname : headers.user_name,
        });
        var saveObj = schoolSubjects.save({return_query: true});
        var data = {subObj: schoolSubjects, batchObj: [saveObj], subject_id: subjectId};
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

Subject.getDeptTaxanomy = function (req, data, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var findQuery = { tenant_id: tenantId, school_id: schoolId,
        id: data.subObj.dept_id,
        academic_year: academicYear
    };
    baseService.getTaxonomyObj(findQuery, function(err, result){
        if(err) {
            callback(err, null);
        } else {
            data.taxanomy = result;
            callback(null, data);
        }
    })
};

Subject.addDeptSubTaxonomy = function(req, data, callback) {
    try {
        var taxonomyObj = {};
        var array = data.batchObj || [];
        taxonomyObj.order_by = 0;
        taxonomyObj.id = data.subObj.subject_id;
        taxonomyObj.name = data.subObj.sub_name;
        taxonomyObj.category_id = models.uuid();
        taxonomyObj.tenant_id = data.taxanomy.tenant_id;
        taxonomyObj.school_id = data.taxanomy.school_id;
        taxonomyObj.parent_category_id = data.taxanomy.category_id;
        taxonomyObj.academic_year = data.taxanomy.academic_year;
        taxonomyObj.status = JSON.parse(req.body.status);
        taxonomyObj.type = 'O';
        var taxonomy = new models.instance.Taxanomy(taxonomyObj);
        var taxonomyObject = taxonomy.save({return_query: true});
        array.push(taxonomyObject);
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
}


Subject.updateSchoolSubjects = function (req, callback) {
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenant_id = models.timeuuidFromString(headers.tenant_id);
        var school_id = models.uuidFromString(headers.school_id);
        var subject_id = models.uuidFromString(req.params.id);
        var deptId = models.uuidFromString(body.deptId);
        var academicYear = headers.academic_year;
        var currentDate = new Date();
        var status = JSON.parse(body.status);
        var subjectAspects = baseService.getMapFromFormattedMap(body.subAspects);
        var queryObject = { tenant_id: tenant_id, school_id: school_id, academic_year: academicYear, subject_id: subject_id };
        var updateValues = { updated_by: headers.user_id, updated_username: headers.user_name, updated_date: currentDate,
            default_value: false, sub_aspects: subjectAspects, sub_code: body.subCode, dept_id: deptId,
            sub_desc: body.subDesc, sub_name: body.subName , status: status};
        var updateQuery = models.instance.SchoolSubject.update(queryObject, updateValues , {return_query: true});
        var data = {batchObj: [updateQuery], subject_id: subject_id, subObj: {subject_id: subject_id, sub_name: body.subName, dept_id: deptId}};
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

Subject.getSubTaxanomy = function (req, data, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var findQuery = { tenant_id: tenantId, school_id: schoolId,
        id: data.subject_id,
        academic_year: academicYear
    };
    baseService.getTaxonomyObj(findQuery, function(err, result){
        if(err) {
            callback(err, null);
        } else {
            data.taxanomy = result;
            callback(null, data);
        }
    })
};

Subject.deleteSchoolSubjects = function(req, callback){
    try {
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var subjectId = models.uuidFromString(req.params.id);
        var academicYear = headers.academic_year;
        var queryObject =  {
            subject_id : subjectId,
            tenant_id : tenantId,
            school_id : schoolId,
            academic_year : academicYear
        };
        var deleteQuery = models.instance.SchoolSubject.delete(queryObject, {return_query: true});
        var data = {batchObj: [deleteQuery], subject_id: subjectId};
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

/*Subject Allocation */
Subject.getSchoolClassSubjects = function (req, callback) {
    var findQuery = baseService.getFindAllQuery(req, true, constant.SUBJECT_ALLOC_PERMISSIONS);

    models.instance.SchoolClassSubjects.find(findQuery, {allow_filtering: true}, function (err, result) {
        callback(err, subjectConverter.subjectAllocationObjs(req, result));
    });
};

Subject.getSchoolClassSubjectsById = function (req, callback) {
    var headers = baseService.getHeaders(req);

    models.instance.SchoolClassSubjects.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        class_id: models.uuidFromString(req.params.id)
    }, {allow_filtering: true}, function (err, result) {
        callback(err, subjectConverter.subjectAllocationObjs(req, result));
    });
};

Subject.getSubjectsbyClassSection = function (req, callback) {
    var body = req.body;
    var headers = baseService.getHeaders(req);

    models.instance.SchoolClassSubjects.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        class_id: models.uuidFromString(body.classId),
        section_id: models.uuidFromString(body.sectionId),
        academic_year: headers.academic_year
    }, {allow_filtering: true}, function (err, result) {
        callback(err, subjectConverter.subjectAllocationObjs(req, result));
    });
};

Subject.saveSchoolClassSubjects = function (req, callback) {
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var classes = body.classes;
        var batchObj = [];
        var currentDate = new Date();
        _.forEach(classes, function (value, key) {
            var classId = models.uuidFromString(value.id);
            _.forEach(value.section, function (val, key) {
                var section = models.uuidFromString(val);
                _.forEach(body.subjectId, function (subject, key) {
                    var subjectId = models.uuidFromString(subject);
                    var saveSchoolClassSubject = new models.instance.SchoolClassSubjects({
                        tenant_id: tenantId,
                        school_id: schoolId,
                        academic_year: headers.academic_year,
                        class_id: classId,
                        section_id: section,
                        subject_id: subjectId,
                        subject_type: body.subjectType,
                        notified_categories: JSON.stringify(body.notifiedCategories),
                        created_by: headers.user_id,
                        created_date: currentDate,
                        created_firstname: headers.user_name,
                        updated_by: headers.user_id,
                        updated_date: currentDate,
                        updated_firstname: headers.user_name
                    });
                    saveSchoolClassSubject = saveSchoolClassSubject.save({return_query: true});
                    batchObj.push(saveSchoolClassSubject);
                });
            });
        });
        callback(null, {batchObj: batchObj});
    } catch (err) {
        
        callback(err, null);
    }



};

Subject.updateSchoolClassSubjects = function (req, callback) {
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var classId = models.uuidFromString(req.params.id);
    var sectionId = models.uuidFromString(body.sectionId);
    var subjectId = models.uuidFromString(body.subjectId);
	var currentDate = new Date();
    var queryObject = {
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: headers.academic_year,
        class_id: classId,
        section_id: sectionId,
        subject_id: subjectId
    };
    var updateValues = {
        subject_type: JSON.parse(body.subjectType),
        updated_by: headers.user_id,
        updated_date: currentDate,
        updated_firstname: headers.user_name
    };
    models.instance.SchoolClassSubjects.update(queryObject, updateValues, function (err, result) {
        callback(err, result);
    });
};

Subject.deleteSchoolClassSubjects = function (req, callback) {
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var academicYear = headers.academic_year;
    var subjectId = models.uuidFromString(req.params.id);
    var findQuery = {
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: academicYear,
        class_id: models.uuidFromString(body.classId),
        subject_id: subjectId,
        section_id: models.uuidFromString(body.sectionId)
    };
    models.instance.SchoolClassSubjects.delete(findQuery, function (err, result) {
        callback(err, result);
    });
};

Subject.subjectFindInSubjectAllocation = function(req, callback){
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
        findQuery.subject_id = models.uuidFromString(req.params.id);
        findQuery.academic_year = headers.academic_year;
    models.instance.SchoolClassSubjects.find(findQuery, {allow_filtering: true}, function (err, result) {
        callback(err, result);
    });
};

Subject.findDeptIdInSchoolSubjects = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.dept_id = models.uuidFromString(req.params.id);
    models.instance.SchoolSubject.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err,  result);
    });
}

module.exports = Subject;