/**
 * Created by kiranmai on 7/12/17.
 */


var baseService = require('../common/base.service')
    , models = require('../../models')
    , constant = require('@nsa/nsa-commons').constants
    , markslistConverter = require('../../converters/markslist.converter');

var Marks = function f(options) {
    var self = this;
};

Marks.getAllMarkListDetails = function (req, callback) {
    models.instance.SchoolMarkListDetails.find({}, function(err, result){
        callback(err, result);
    });
};

Marks.getDetailsByMarkslistId = function (req, data, callback) {
    var findQuery = baseService.getFindAllQuery(req, true, constant.MARKS_UPLOAD_PERMISSIONS);
    findQuery.mark_list_id = data.mark_list_id;
    models.instance.SchoolMarkListDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Marks.getMarksDetails = function (req, data, callback) {
    models.instance.SchoolMarkListDetails.findOne({mark_list_detail_id: data.mark_list_detail_id}, function(err, result){
        callback(err, req, result);
    });
};

Marks.getMarklist = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.MARKS_UPLOAD_PERMISSIONS);

    if (havePermissions) {
        var queryParams = req.query;
        var findQuery = marklistFindQuery(req, queryParams, true, constant.MARKS_UPLOAD_PERMISSIONS);

        models.instance.SchoolMarkList.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, markslistConverter.marklistObjs(req,  result));
        });
    } else {
        callback(null, []);
    }

};

function marklistFindQuery(req, params, academicYear, permissions) {
    var classId = params.classId || req.params.classId;
    var sectionId = params.sectionId || req.params.sectionId;
    var examScheduleId = params.id || req.params.id;

    var findQuery = baseService.getFindAllQuery(req, academicYear, permissions);

    if (typeof classId != 'undefined' && classId != null && !(_.isEmpty(classId))) {
        findQuery.class_id = models.uuidFromString(classId);
    }
    if (typeof sectionId != 'undefined' && sectionId != null && !(_.isEmpty(sectionId))) {
        findQuery.section_id = models.uuidFromString(sectionId);
    }
    if (typeof examScheduleId != 'undefined' && examScheduleId != null && !(_.isEmpty(examScheduleId))) {
        findQuery.exam_schedule_id = models.uuidFromString(examScheduleId);
    }
    return findQuery;
}
exports.marklistFindQuery = marklistFindQuery;

Marks.getMarkDetailsByClassAndSec = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.MARKS_UPLOAD_PERMISSIONS);

    if (havePermissions) {
        var params = req.params;
        var findQuery = marklistFindQuery(req, params, true, constant.MARKS_UPLOAD_PERMISSIONS);
        models.instance.SchoolMarkListDetails.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, markslistConverter.marklistDetailsObjs(req,  result));
        });
    } else {
        callback(null, []);
    }

};

Marks.getMarklistById = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.MARKS_UPLOAD_PERMISSIONS);
    if (true) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.MARKS_UPLOAD_PERMISSIONS);
        findQuery.mark_list_id = models.uuidFromString(req.params.id);
        models.instance.SchoolMarkList.findOne(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, {});
    }
};

Marks.getMarklistDetailsById = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.MARKS_UPLOAD_PERMISSIONS);
    if (true) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.MARKS_UPLOAD_PERMISSIONS);
        findQuery.mark_list_id = models.uuidFromString(req.params.id);
        models.instance.SchoolMarkListDetails.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, []);
    }
};

Marks.getUserMarksDetails = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    var params = req.params;
    findQuery.user_name = params.id;
    findQuery.exam_schedule_id = models.uuidFromString(params.examScheduleId);
    findQuery.status = true;
    models.instance.SchoolMarkListDetails.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, markslistConverter.marklistDetailObj(req, result));
    });
};

Marks.updateMarklistById = function (req, data, callback) {
    var findQuery = baseService.getFindAllQuery(req, true, constant.MARKS_UPLOAD_PERMISSIONS);
    findQuery.mark_list_id = data.mark_list_id;
    models.instance.SchoolMarkList.findOne(findQuery, {allow_filtering: true}, function(err, result) {
        if (result) {
            result.generated_marklist = data.generated_marklist;
            var marks = new models.instance.SchoolMarkList(result);
            marks.save(function (err, result) {
                callback(err, result);
            });
        }
    });

};

module.exports = Marks;
