/**
 * Created by Kiranmai A on 1/19/2017.
 */

var express = require('express')
    , request = require('request')
    , _ = require('lodash')
    , baseService = require('../common/base.service')
    , models = require('../../models/index')
    , constants = require('../../common/constants/constants')
    , dateService = require('../../utils/date.service')
    , sectionConverter = require('../../converters/section.converter');

var Section = function f(options) {
    var self = this;
};

Section.getClassSecById = function (req, callback) {
    var headers = baseService.getHeaders(req);

    var id = req.params.id;
    var findQuery = baseService.getFindQuery(req)
    findQuery.id = models.uuidFromString(id);
    findQuery.academic_year = headers.academic_year;
     findSectionQuery(req, findQuery, function(err, result){
         callback(err, result);
     })
};

Section.findSectionInClass = function(req, callback){
    var headers = baseService.getHeaders(req);
    var sectionId =models.uuidFromString(req.params.id);
    var findQuery = baseService.getFindQuery(req)
    findQuery.academic_year = headers.academic_year;
    findQuery.section_id = sectionId;
    findSectionQuery(req, findQuery, function(err, result){
        callback(err, result);
    });

};

function findSectionQuery(req, findQuery, callback){
    models.instance.SchoolClassSectionDetails.findOne(findQuery, {allow_filtering: true},
        function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, sectionConverter.sectionDetail(req, formattedResult));
        });
};

Section.getAllClassSections = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.SECTION_ALLOC_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.SECTION_ALLOC_PERMISSIONS);

        models.instance.SchoolClassSectionDetails.find(findQuery, {allow_filtering: true}, function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, sectionConverter.sectionDetailsObjs(req, formattedResult));
        });
    } else {
        callback(null, []);
    }
};

Section.getAllSchoolClassSections = function (req, callback) {
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year =  req.headers.userInfo.academic_year;
    models.instance.SchoolClassSectionDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, result);
    });
};


Section.saveClassSections = function (req, callback) {
    var data = [];
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var studentIntake = body.studentIntake == '' ? null : parseInt(body.studentIntake);
    var sections = body.sections;
    var batchObj = [];
	var currentDate = new Date();

    _.forEach(sections, function(value, key) {
        var sectionId = models.uuidFromString(value.id);
        var sectionName = value.name;
        var saveSection = new models.instance.SchoolClassSectionDetails({
            id: models.uuid(),
            class_id: models.uuidFromString(body.classId),
            tenant_id: tenantId,
            school_id: schoolId,
            class_name: body.className,
            academic_year: headers.academic_year,
            section_id: sectionId,
            section_name: sectionName,
            student_intake: studentIntake,
            status: body.status,
            created_by: headers.user_id,
            created_date: currentDate,
            created_firstname: headers.user_name,
            updated_by: headers.user_id,
            updated_date: currentDate,
            updated_firstname: headers.user_name
        });
        saveSection = saveSection.save({return_query: true});
        batchObj.push(saveSection);
    })
    data['batchObj'] = batchObj;
    callback(null, data);
};

Section.updateSecByClassAndSec = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var classId = req.params.id
    var body = req.body;
	var currentDate = new Date();
    var studentIntake = (body.studentIntake == '' || body.studentIntake == null) ? null : parseInt(body.studentIntake);
    var findQuery = {
        section_id: models.uuidFromString(body.sectionId),
        class_id: models.uuidFromString(classId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year
    };

    var updateSection = {
        student_intake:  studentIntake,
        updated_by: headers.user_id,
        updated_date: currentDate,
        updated_firstname: headers.user_name
    };

    models.instance.SchoolClassSectionDetails.update(findQuery, updateSection, function (err, result) {
        callback(err, result)
    });
};

Section.deleteSecByClass = function (req, callback) {
    var data = [];
    try {
        var headers = baseService.getHeaders(req);
        var classId = req.params.classId;
        var body = req.body;
        var batchObj = [];
        var findQuery = {
            class_id: models.uuidFromString(classId),
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id),
            academic_year: headers.academic_year,
            section_id: models.uuidFromString(body.sectionId)
        };

        var delObj = models.instance.SchoolClassSectionDetails.delete(findQuery, {return_query: true});
        batchObj.push(delObj);
        data['batchObj'] = batchObj;
        callback(null, data);
    } catch(err) {
        callback(err, null);
    }
};

/*Section Service*/

Section.getAllSections = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.SECTION_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.SECTION_PERMISSIONS);

        models.instance.SchoolSections.find(findQuery, {allow_filtering: true},
            function(err, result){
                var formattedResult = baseService.validateResult(result);
                callback(err, sectionConverter.SchoolSectionsDetail(req, formattedResult));
            });
    } else {
        callback(null, []);
    }
};

Section.getSections = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    models.instance.SchoolSections.find(findQuery, {allow_filtering: true},
        function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, sectionConverter.SchoolSectionsDetail(req, formattedResult));
        });
};

Section.getSection = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var sectionId = req.params.id;

    findQuery = {
        section_id: models.uuidFromString(sectionId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year
    };

    models.instance.SchoolSections.findOne(findQuery, {allow_filtering: true},
        function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, sectionConverter.SchoolSectionDetail(req, formattedResult));
        });
};

Section.getActiveSections = function(req, callback){
    var headers = baseService.getHeaders(req);
    findQuery ={
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        status: true,
    };
    models.instance.SchoolSections.find(findQuery, {allow_filtering: true},
    function(err, result){
        var formattedResult = baseService.validateResult(result);
        callback(err, sectionConverter.SchoolSectionsDetail(req, formattedResult));
    })
};


Section.saveSection = function (req, callback) {
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);

    var sectionSave = new models.instance.SchoolSections({
        tenant_id: tenantId,
        school_id: schoolId,
        academic_year: headers.academic_year,
        section_id: models.uuid(),
        section_name: body.sectionName,
        section_code: body.sectionCode,
        status: JSON.parse(body.status),
        updated_date: new Date(),
        updated_by: headers.user_id,
        updated_username: headers.user_name,
        created_date: new Date(),
        created_by: headers.user_id,
        created_firstname: headers.user_name
    });

    sectionSave.save(function (err, result) {
        callback(err, result)
    });
};

Section.findSectionName = function(req, callback) {
    var findQuery = getFindQuery(req);
    findQuery.section_name = req.body.sectionName;
    models.instance.SchoolSections.find(findQuery, {allow_filtering: true}, function (err, result) {
        callback(err, result);
    });
};

Section.findSectionCode = function(req, callback) {
    var findQuery = getFindQuery(req);
    findQuery.section_code = req.body.sectionCode;
    models.instance.SchoolSections.find(findQuery, {allow_filtering: true}, function (err, result) {
        callback(err, result);
    });
};

Section.updateSection = function (req, callback) {
    var body = req.body;
    var sectionId = req.params.id;
    var headers = baseService.getHeaders(req);

    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        section_id: models.uuidFromString(sectionId),
        academic_year: headers.academic_year
    };

    var updateSection = {
        section_name: body.sectionName,
        section_code:body.sectionCode,
        status:JSON.parse(body.status),
        updated_date: new Date(),
        updated_by: headers.user_id,
        updated_username: headers.user_name
    };

    models.instance.SchoolSections.update(findQuery, updateSection, function (err, result) {
        callback(err, result)
    });
};

Section.deleteSection = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var body = req.body;

    var findQuery = getFindQuery(req);
    findQuery.section_id = models.uuidFromString(body.sectionId);

    models.instance.SchoolSections.delete(findQuery, function (err, result) {
        callback(err, result);
    });
};

Section.findSectionInClassSections = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = getFindQuery(req);
    findQuery.section_id = models.uuidFromString(req.body.sectionId);
    models.instance.SchoolClassSectionDetails.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

function getFindQuery(req){
    var headers = baseService.getHeaders(req);
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year};
    return findQuery;
}

Section.getSecByClass = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var classId = req.params.id;

    var findQuery = getFindQuery(req);
    findQuery.class_id = models.uuidFromString(classId);
    findQuery.academic_year = headers.academic_year;
    models.instance.SchoolClassSectionDetails.find(findQuery, {allow_filtering: true},
        function(err, result){
            var formattedResult = baseService.validateResult(result);
            callback(err, sectionConverter.sectionDetailsObjs(req, formattedResult));
        });
};


Section.findStudentInSection = function (req, callback) {
    var findQuery = getFindQuery(req);
        findQuery.class_id = models.uuidFromString(req.body.classId);
        findQuery.section_id = models.uuidFromString(req.body.sectionId);
    models.instance.UserClassification.find(findQuery, {allow_filtering: true}, function(err, result){
       callback(err, result);
    })
};

module.exports = Section;