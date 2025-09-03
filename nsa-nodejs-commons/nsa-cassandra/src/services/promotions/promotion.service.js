/**
 * Created by Deepak A on 3/4/2017.
 */

var express = require('express')
    , request = require('request')
    , async = require('async')
    , baseService = require('../common/base.service')
    , models = require('../../models/index')
    , constants = require('../../common/constants/constants')
    , classConverter = require('../../converters/class.converter')
    , sectionConverter = require('../../converters/section.converter')
    , logger = require('../../../config/logger')
    , nsaElasticSearch = require('@nsa/nsa-elasticsearch')
    , nsabb = require('@nsa/nsa-bodybuilder').builderutil
    , _ = require('lodash')
    , constant = require('@nsa/nsa-commons').constants;

var Promotion = function f(options) {
    var self = this;
};

Promotion.getClassByOrder = function(req, params, callback) {
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = params.year,
    params.orderBy = params.orderBy ? params.orderBy : 0;
    findQuery.order_by = parseInt(params.orderBy) + 1,
    models.instance.SchoolClassDetails.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Promotion.getClassesByYear = function(year, val, callback) {
    try {
        var findQuery = {
            "academic_year": year,
            "tenant_id": val.tenant_id,
            "school_id": val.school_id
        }
        var array =[];
        models.instance.SchoolClassDetails.eachRow(findQuery, {allow_filtering: true}, function(n, row){
            array.push(row);
        }, function(err, result){
            if(err) throw err;
            if (result.nextPage) {
                result.nextPage();
            } else {
                callback(null, array);
            }
        });
    } catch (err) {
       callback(null, err);
    }
    /*models.instance.SchoolClassDetails.find(findQuery, {allow_filtering: true}, function(err, result){
     console.log("err", err);
     callback(err, result);
     });*/
};

Promotion.getAllSchools = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var array =[];
    if(req.body.isSingle) {
        var findQuery = {
            "tenant_id": models.timeuuidFromString(headers.tenant_id),
            "school_id": models.uuidFromString(headers.school_id)
        };
        models.instance.SchoolDetails.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, result);
        })
    } else {
        models.instance.SchoolDetails.eachRow({}, function(n, row){
            array.push(row);
        }, function(err, result){
            if(err) throw err;
            if (result.nextPage) {
                result.nextPage();
            } else {
                callback(null, array);
            }
        });
    }
};

Promotion.getTimetableConfig = function(req, val, callback) {
    try {
        var findQuery = {
            "academic_year": req.body.year,
            "tenant_id": val.tenant_id,
            "school_id": val.school_id
        }
        models.instance.SchoolTimetableConfiguration.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(null, result);
        });
    } catch (err){
        callback(err, null)
    }
};

Promotion.getVehicleUsers = function(req, data, callback) {
    try {
        var findQuery = {
            "tenant_id": models.timeuuidFromString(req.headers.userInfo.tenant_id),
            "school_id": models.uuidFromString(req.headers.userInfo.school_id),
        }
        if(data.update) {
            findQuery.class_id = models.uuidFromString(req.body.promotedClasses[0].id)
            findQuery.academic_year = req.body.academicYear
        } else {
            findQuery.class_id = models.uuidFromString(req.body.existingClass[0].id)
            findQuery.academic_year = req.body.year
        }
        models.instance.SchoolVehicleAllocation.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(null, result);
        });
    } catch (err){
        callback(err, null)
    }
};

Promotion.getSchoolPeriods = function(req, val, callback) {
    try {
        var findQuery = {
            "academic_year": req.body.year,
            "tenant_id": val.tenant_id,
            "school_id": val.school_id
        }
        models.instance.SchoolPeriods.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(null, result);
        });
    } catch (err){
        callback(err, null)
    }
};

Promotion.getClasses = function(req, callback) {
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = req.params.year;
    findQuery.status = true
    models.instance.SchoolClassDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, classConverter.classObjs(req, result));
    });
};

Promotion.getClassTaxonomy = function(req, callback) {
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = req.body.academicYear;
    findQuery.id = models.uuidFromString(req.body.promotedClasses[0].id);
    models.instance.Taxanomy.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Promotion.getFailedClassTaxonomy = function(req, callback) {
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = req.body.academicYear;
    findQuery.id = models.uuidFromString(req.body.existingClasses[0].id);
    models.instance.Taxanomy.findOne(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Promotion.getFailedClassSecTaxonomy = function(req, data, callback) {
    if(!_.isEmpty(data.failClassTaxonomy)) {
        var findQuery = baseService.getFindQuery(req);
        findQuery.academic_year = req.body.academicYear;
        findQuery.parent_category_id = data.failClassTaxonomy.category_id;
        models.instance.Taxanomy.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, []);
    }

};

Promotion.getClassSecTaxonomy = function(req, data, callback) {
    if(!_.isEmpty(data.classTaxonomy)) {
        var findQuery = baseService.getFindQuery(req);
        findQuery.academic_year = req.body.academicYear;
        findQuery.parent_category_id = data.classTaxonomy.category_id;
        models.instance.Taxanomy.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, result);
        });
    } else {
        callback(null, []);
    }

};

Promotion.deleteClassSecTaxonomy = function(req, data, callback) {
    var array = data.batchObj;
    if(!_.isEmpty(data.secTaxonomy)) {
        _.forEach(data.secTaxonomy, function (value) {
            var findQuery = baseService.getFindQuery(req);
            findQuery.academic_year = value.academic_year;
            findQuery.category_id = value.category_id;
            var deleteQuery = models.instance.Taxanomy.delete(findQuery, {return_query: true});
            array.push(deleteQuery);
        })
    }

    data.batchObj = array;
    callback(null, data)

};

Promotion.getClassesByClsId = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.STUDENT_PROMOTIONS_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.STUDENT_PROMOTIONS_PERMISSIONS);
        findQuery.academic_year = req.params.year != undefined ? req.params.year : req.body.academicYear;
        findQuery.class_id = models.uuidFromString(req.params.classId != undefined ? req.params.classId : req.body.classes[0].id);
        models.instance.SchoolClassSectionDetails.find(findQuery, {allow_filtering: true}, function (err, result) {
            callback(err, result);
        });
    } else {
        callback(null, []);
    }
};

Promotion.getUsersFromES = function(req, callback) {
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = req.params.year != undefined ? req.params.year : req.body.academicYear;
    findQuery.class_id = models.uuidFromString(req.params.classId != undefined ? req.params.classId : req.body.classes[0].id);
    models.instance.SchoolClassSectionDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Promotion.getFeature = function(req, callback) {
    models.instance.SchoolFeature.find({}, function(err, result){
        callback(err, result);
    });
};


Promotion.getFeaturesByYear = function(req, val, callback) {
    var findQuery = {
        "academic_year": req.body.year,
        "tenant_id": val.tenant_id,
        "school_id": val.school_id
    }
    var array =[];
    models.instance.SchoolFeature.eachRow(findQuery, {allow_filtering: true}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            callback(null, array);
        }
    });
   /* models.instance.SchoolFeature.find({}, {allow_filtering: true}, function(err, result){
        console.log("res", result.length);
        callback(err, result);
    });*/
};


Promotion.updateFeature = function(data, callback) {
    var array = [];
    try {
        _.forEach(data.features, function (val, index) {
            var queryObject = {id : val.id, school_id : val.school_id, tenant_id : val.tenant_id};
            var updateValues = {academic_year : '2017-2018'};
            var updateObj = models.instance.SchoolFeature.update(queryObject, updateValues, {return_query: true});
            array.push(updateObj);
            if(index == (data.features.length -1 )) {
                data.batchObj = array;
                callback(null, data);
            }
        })


    } catch (err) {
        callback(err, null);
    }


};

Promotion.getAllTermsByYear = function(req, val,  callback) {
    var findQuery = {
        "ac_year": req.body.year,
        "tenant_id": val.tenant_id,
        "school_id": val.school_id
    }
    var array =[];
    models.instance.SchoolTerms.eachRow(findQuery, {allow_filtering: true}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            callback(null, array);
        }
    });
    /*models.instance.SchoolTerms.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });*/
};

Promotion.getAllSubjectsByYear = function(req, val, callback) {
    var findQuery = {
        "academic_year": req.body.year,
        "tenant_id": val.tenant_id,
        "school_id": val.school_id
    }
    var array =[];
    models.instance.SchoolSubject.eachRow(findQuery, {allow_filtering: true}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            callback(null, array);
        }
    });
   /* models.instance.SchoolSubject.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });*/
};


Promotion.getAllSectionsByYear = function(req, val, callback) {
    var findQuery = {
        "academic_year": req.body.year,
        "tenant_id": val.tenant_id,
        "school_id": val.school_id
    }
    var array =[];
    models.instance.SchoolSections.eachRow(findQuery, {allow_filtering: true}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            callback(null, array);
        }
    });
    /*models.instance.SchoolSections.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });*/
};

Promotion.getAllClassesAssoc = function(year, callback) {
    var findQuery = {"academic_year": year }
    var array =[];
    models.instance.SchoolClassSectionDetails.eachRow(findQuery, {allow_filtering: true}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            callback(null, array);
        }
    });
    /*models.instance.SchoolClassSectionDetails.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });*/
};

Promotion.getAllTaxonomy = function (req, val, callback) {
    var findQuery = {
        "academic_year": req.body.year,
        "tenant_id": val.tenant_id,
        "school_id": val.school_id
    }
    var array =[];
    models.instance.Taxanomy.eachRow(findQuery, {allow_filtering: true}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            taxonomyObject(array, function (err, response) {
                callback(err, response)
            })
        }
    });
    /*models.instance.Taxanomy.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });*/
}

function taxonomyObject(array, callback) {
    async.waterfall([
        buildDeptTaxanomyObj.bind(null, array, 3),
        buildEmpTaxanomyObj.bind(),
        buildClassTaxanomyObj.bind(),
    ], function (err, result) {
        callback(err, result)
    });
}

function buildEmpTaxanomyObj(data, taxObj, callback) {
    var level = 2;
    var taxonomyObj = taxObj;
    try {
        var count = 0;
        var parentData = _.sortBy(_.filter(JSON.parse(JSON.stringify(data)), {parent_category_id: constants.TAXANOMY_ID, name: 'All Employee'}), constants.ORDER_BY);
        var setChildren = function (obj) {
            count ++;
            var children = _.filter(JSON.parse(JSON.stringify(data)), {parent_category_id: obj.category_id})
            if (children.length) {
                children.forEach(function (obj) {
                    taxonomyObj.push(obj)
                });
            }
        }
        _.forEach(parentData, function (obj, index) {
            count = 1;
            taxonomyObj.push(obj)
            if(count < level) {
                setChildren(obj);
            }
            if(index == (parentData.length -1)) {
                callback(null, data, taxonomyObj)
            }
        });
    } catch (err) {
        logger.debug(err);
        callback(err, taxonomyObj)
    }
}

function buildClassTaxanomyObj(data, taxObj, callback) {
    var level = 2;
    var taxonomyObj = taxObj;
    try {
        var count = 0;
        var parentData = _.sortBy(_.filter(JSON.parse(JSON.stringify(data)), {parent_category_id: constants.TAXANOMY_ID, name: constants.ALL_CLASSES}), constants.ORDER_BY);
        var setChildren = function (obj) {
            count ++;
            var children = _.filter(JSON.parse(JSON.stringify(data)), {parent_category_id: obj.category_id})
            if (children.length > 0) {
                children.forEach(function (obj) {
                    taxonomyObj.push(obj)
                });
            }
        }
        _.forEach(parentData, function (obj, index) {
            count = 1;
            taxonomyObj.push(obj)
            if(count < level) {
                setChildren(obj);
            }
            if(index == (parentData.length -1)) {
                callback(null, taxonomyObj)
            }
        });
    } catch (err) {
        logger.debug(err);
        callback(err, taxonomyObj)
    }
}

function buildDeptTaxanomyObj(data, level, callback) {
    var taxonomyObj = [];
    //ToDO Change level if more than 3
    try {
        var count = 0;
        var parentData = _.sortBy(_.filter(JSON.parse(JSON.stringify(data)), {parent_category_id: constants.DEPT_TAXANOMY_ID}), constants.ORDER_BY);
        var setChildren = function (obj, index) {
            var children = _.filter(JSON.parse(JSON.stringify(data)), {parent_category_id: obj.category_id})
            if (children.length > 0) {
                _.forEach(children, function (obj, inde) {
                    taxonomyObj.push(obj)
                    var children2 = _.filter(JSON.parse(JSON.stringify(data)), {parent_category_id: obj.category_id});
                    taxonomyObj.push(children2)
                });
            }

        }
        _.forEach(parentData, function (obj, index) {
            count = 1;
            taxonomyObj.push(obj)
            if(count < level) {
                setChildren(obj, index);
                if(index == (parentData.length -1)) {
                    callback(null, data, _.flatten(taxonomyObj))
                }
            }
        });

    } catch (err) {
        logger.debug(err);
    }
};

Promotion.updateClassAcademicYear = function(req, data, callback) {
    var array = data.batchObj;
    var body = req.body;
    try {
        _.forEach(data.classes, function (value) {
            var obj = new models.instance.SchoolClassDetails ({
                class_id : value.class_id,
                class_name : value.class_name,
                class_code : value.class_code,
                tenant_id : value.tenant_id,
                school_id : value.school_id,
                academic_year : body.academicYear,
                course : value.course,
                updated_by : value.updated_by,
                updated_username : value.updated_username,
                updated_date : new Date(),
                created_by : value.created_by,
                created_date  : new Date(),
                created_firstname : value.created_firstname,
                status : value.status,
            });
            obj = obj.save({return_query: true});
            array.push(obj)
        })
        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        callback(err, null);
    }
};

Promotion.getAllSchoolClassSections = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.STUDENT_PROMOTIONS_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.STUDENT_PROMOTIONS_PERMISSIONS);
        models.instance.SchoolClassSectionDetails.find(findQuery, {allow_filtering: true}, function (err, result) {
            var formattedResult = baseService.validateResult(result);
            callback(err, sectionConverter.SchoolPromotoionDetail(req, result));
        });
    } else {
        callback(null, []);
    }
};

Promotion.getAllShuffleSchoolClassSections = function (req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.SHUFFLE_STUDENT_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, true, constant.SHUFFLE_STUDENT_PERMISSIONS);
        models.instance.SchoolClassSectionDetails.find(findQuery, {allow_filtering: true}, function (err, result) {
            var formattedResult = baseService.validateResult(result);
            callback(err, sectionConverter.SchoolShuffleDetail(req, result));
        });
    } else {
        callback(null, []);
    }
};

Promotion.updateClassOrderBy = function(req, data, callback) {
    var array = [];
    var body = req.body;
    var orderBy = 0;
    try {
        _.forEach(data.classes, function (value) {
            if((value.class_id).toString() == "596152fe-e748-4778-b91d-e192d7c89d32") {
                orderBy = 1;
            } else if((value.class_id).toString() == "c4dcadd0-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 2;
            } else if((value.class_id).toString() == "c4e33d80-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 3;
            } else if((value.class_id).toString() == "c4e44ef0-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 4;
            } else if((value.class_id).toString() == "c4e56060-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 5;
            }  else if((value.class_id).toString() == "c4e6bff0-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 6;
            } else if((value.class_id).toString() == "c4e81f80-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 7;
            } else if((value.class_id).toString() == "c4e97f10-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 8;
            } else if((value.class_id).toString() == "c4ea9080-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 9;
            } else if((value.class_id).toString() == "c4eba1f0-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 10;
            } else if((value.class_id).toString() == "c4ec3e30-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 11;
            } else if((value.class_id).toString() == "c4ed4fa0-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 12;
            } else if((value.class_id).toString() == "c4ee3a00-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 13;
            } else if((value.class_id).toString() == "c4eefd50-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 14;
            } else if((value.class_id).toString() == "c6445420-ea0d-11e6-8b3a-9d7cc28d7ccd") {
                orderBy = 15;
            }

            var obj = new models.instance.SchoolClassDetails ({
                class_id : value.class_id,
                class_name : value.class_name,
                class_code : value.class_code,
                tenant_id : value.tenant_id,
                school_id : value.school_id,
                academic_year : value.academic_year,
                course : value.course,
                updated_by : value.updated_by,
                updated_username : value.updated_username,
                updated_date : new Date(),
                created_by : value.created_by,
                created_date  : new Date(),
                created_firstname : value.created_firstname,
                status : value.status,
                order_by: orderBy
            });
            obj = obj.save({return_query: true});
            array.push(obj)
        })
        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        callback(err, null);
    }
};


Promotion.updateSchoolFeatures = function(req, data, callback) {
    var array = data.batchObj;
    var body = req.body;
    var cdate = new Date();
    var year = cdate.getFullYear();
    var month = cdate.getMonth();
    var day = cdate.getDate();
    var newDate = new Date(year + 1, month, day)
    try {
        _.forEach(data.features, function (value) {
            var obj = new models.instance.SchoolFeature ({
                tenant_id: value.tenant_id ,
                school_id: value.school_id,
                id: value.id,
                academic_year: body.academicYear,
                feature_id: value.feature_id,
                feature_name: value.feature_name,
                parent_feature_id: value.parent_feature_id,
                activated_date: cdate,
                expire_date: newDate,
                description: value.description,
                icon: value.icon,
                school_name: value.school_name,
                mobile_priority: value.mobile_priority,
                sms: value.sms,
                email: value.email,
                push: value.push,
                notify_hostelers: value.notify_hostelers,
                is_channels:value.is_channels,
                is_override:value.is_override,
                help_text:value.help_text,
                order_by: value.order_by,
                title: value.title,
                doc_desc: value.doc_desc,
                content: value.content,
                link: value.link,
                asset_url: value.asset_url,
                keywords: value.keywords,
                user_types: value.user_types,
                tags: value.tags,
                additional_links: value.additional_links,
                images: value.images,
                status: value.status,
            });
            obj = obj.save({return_query: true});
            array.push(obj)
        })
        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        callback(err, null);
    }
};


Promotion.updateSectionAcademicYear = function(req, data, callback) {
    var array = data.batchObj;
    var body = req.body;
    try {
        _.forEach(data.sections, function (value) {
            var obj = new models.instance.SchoolSections ({
                tenant_id: value.tenant_id,
                school_id: value.school_id,
                academic_year: body.academicYear,
                updated_date: new Date(),
                updated_by: value.updated_by,
                updated_username: value.updated_username,
                section_id: value.section_id,
                section_name: value.section_name,
                section_code: value.section_code,
                status: value.status,
                created_by: value.created_by,
                created_date : new Date(),
                created_firstname: value.created_firstname,
            });
            obj = obj.save({return_query: true});
            array.push(obj)

        })
        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        callback(err, null);
    }
};

Promotion.updateTermsAcademicYear = function(req, data, callback) {
    var array = data.batchObj;
    var body = req.body;
    try {
        _.forEach(data.terms, function (value) {
            var obj = new models.instance.SchoolTerms ({
                id : value.id,
                ac_year : body.academicYear,
                end_date : value.end_date,
                school_id : value.school_id,
                start_date : value.start_date,
                tenant_id : value.tenant_id,
                term : value.term,
            });
            obj = obj.save({return_query: true});
            array.push(obj)

        })
        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        callback(err, null);
    }
};

Promotion.updateAcYearDetails = function(req, data, callback) {
    var array = [];
    var body = req.body;
    try {
        _.forEach(data.academics, function (value) {
            var obj = new models.instance.AcademicYear ({
                id : value.id,
                ac_year : body.year,
                school_id : value.school_id,
                tenant_id : value.tenant_id,
                created_date: value.created_date,
                is_current_year : body.isCyear
            });
            obj = obj.save({return_query: true});
            array.push(obj)
        })
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

Promotion.updateSubjectsAcademicYear = function(req, data, callback) {
    var array = data.batchObj;
    var body = req.body;
    try {
        _.forEach(data.subjects, function (value) {
            var obj = new models.instance.SchoolSubject ({
                subject_id: value.subject_id,
                tenant_id: value.tenant_id,
                school_id: value.school_id,
                dept_id: value.dept_id,
                academic_year: body.academicYear,
                sub_name: value.sub_name,
                sub_desc: value.sub_desc,
                sub_code: value.sub_code,
                sub_colour: value.sub_colour,
                sub_aspects: value.sub_aspects,
                updated_date: new Date(),
                updated_by: value.updated_by,
                updated_username: value.updated_username,
                default_value: value.default_value,
                status: value.status,
                created_by: value.created_by,
                created_date : new Date(),
                created_firstname: value.created_firstname,
            });
            obj = obj.save({return_query: true});
            array.push(obj)

        })
        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        callback(err, null);
    }
};

Promotion.updateTaxonomyAcademicYear = function (req, data, callback) {
    var array = data.batchObj;
    var body = req.body;
    try {
        _.forEach(data.taxonomy, function (value) {
            var obj = new models.instance.Taxanomy ({
                category_id: models.uuidFromString(value.category_id),
                tenant_id: models.timeuuidFromString(value.tenant_id),
                school_id: models.uuidFromString(value.school_id),
                academic_year : body.academicYear,
                id: models.uuidFromString(value.id),
                name: value.name,
                parent_category_id: models.uuidFromString(value.parent_category_id),
                description: value.description,
                status: value.status,
                type: value.type,
                order_by: value.order_by,
            });
            obj = obj.save({return_query: true});
            array.push(obj)
        })
        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        callback(err, null);
    }
}


Promotion.saveFailedTaxonomyForClass = function (req, data, callback) {
    var array = data.batchObj;
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var taxonomyObj = {};
    try {
        if(_.isEmpty(data.failClassTaxonomy)) {
            _.forEach(body.existingClasses, function (value) {
                taxonomyObj.school_id = models.uuidFromString(headers.school_id);
                taxonomyObj.tenant_id = models.timeuuidFromString(headers.tenant_id);
                taxonomyObj.updated_date = new Date();
                taxonomyObj.academic_year = body.academicYear;
                taxonomyObj.order_by = -1;
                taxonomyObj.id = models.uuidFromString(value.id);
                taxonomyObj.name = value.name;
                taxonomyObj.category_id = models.uuid();
                taxonomyObj.parent_category_id = models.uuidFromString(constants.ALL_CLASSES_CATEGORY_ID);
                taxonomyObj.status = true;
                var taxonomy = new models.instance.Taxanomy(taxonomyObj);
                var taxonomyObject = taxonomy.save({return_query: true});
                taxonomy = taxonomy.save({return_query: true});
                array.push(taxonomy)
            })

        } else {
            taxonomyObj.category_id = data.failClassTaxonomy.category_id;
        }
        data.failTaxonomyObjId = taxonomyObj.category_id;
        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        console.log("Err", err)
        callback(err, null);
    }
}

Promotion.saveTaxonomyForClass = function (req, data, callback) {
    var array = data.batchObj;
    var body = req.body;
    var headers = baseService.getHeaders(req);
    var taxonomyObj = {};
    try {
        if(_.isEmpty(data.classTaxonomy)) {
            _.forEach(body.promotedClasses, function (value) {
                taxonomyObj.school_id = models.uuidFromString(headers.school_id);
                taxonomyObj.tenant_id = models.timeuuidFromString(headers.tenant_id);
                taxonomyObj.updated_date = new Date();
                taxonomyObj.academic_year = body.academicYear;
                taxonomyObj.order_by = -1;
                taxonomyObj.id = models.uuidFromString(value.id);
                taxonomyObj.name = value.name;
                taxonomyObj.category_id = models.uuid();
                taxonomyObj.parent_category_id = models.uuidFromString(constants.ALL_CLASSES_CATEGORY_ID);
                taxonomyObj.status = true;
                var taxonomy = new models.instance.Taxanomy(taxonomyObj);
                var taxonomyObject = taxonomy.save({return_query: true});
                taxonomy = taxonomy.save({return_query: true});
                array.push(taxonomy)
            })

        } else {
            taxonomyObj.category_id = data.classTaxonomy.category_id;
        }
        data.taxonomyObjId = taxonomyObj.category_id;
        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        callback(err, null);
    }
}

Promotion.saveTaxonomyForSections = function (req, data, callback) {
    var array = data.batchObj;
    var body = req.body;
    var sections = [];
    if(!_.isEmpty(body.promotedClasses)) {
        sections = body.promotedClasses[0].sections;
    }
    var secTaxonomy = JSON.parse(JSON.stringify(data.secTaxonomy));
    var sectionObjs = _.differenceBy(sections, secTaxonomy, 'id');
    var headers = baseService.getHeaders(req);

    try {
        if(!_.isEmpty(sectionObjs)) {
            _.forEach(sectionObjs, function (value) {
                var taxonomyObj = {};
                taxonomyObj.school_id = models.uuidFromString(headers.school_id);
                taxonomyObj.tenant_id = models.timeuuidFromString(headers.tenant_id);
                taxonomyObj.updated_date = new Date();
                taxonomyObj.academic_year = body.academicYear;
                taxonomyObj.order_by = -1;
                taxonomyObj.id =  models.uuidFromString(value.id);
                taxonomyObj.name = value.name;
                taxonomyObj.category_id = models.uuid();
                taxonomyObj.parent_category_id = data.taxonomyObjId;
                taxonomyObj.status = true;
                var taxonomy = new models.instance.Taxanomy(taxonomyObj);
                var taxonomyObject = taxonomy.save({return_query: true});
                taxonomy = taxonomy.save({return_query: true});
                array.push(taxonomy)
            })
        }

        data.batchObj = array;
        callback(null, data);


    } catch (err) {
        callback(err, null);
    }
}

Promotion.saveFailedTaxonomyForSections = function (req, data, callback) {
    var array = data.batchObj;
    var body = req.body;
    var sections = [];
    if(!_.isEmpty(body.existingClass)) {
        sections = body.existingClass[0].sections;
    }
    var secTaxonomy = JSON.parse(JSON.stringify(data.failSecTaxonomy));
    var sectionObjs = _.differenceBy(sections, secTaxonomy, 'id');
    var headers = baseService.getHeaders(req);

    try {
        if(!_.isEmpty(sectionObjs)) {
            _.forEach(sectionObjs, function (value) {
                var taxonomyObj = {};
                taxonomyObj.school_id = models.uuidFromString(headers.school_id);
                taxonomyObj.tenant_id = models.timeuuidFromString(headers.tenant_id);
                taxonomyObj.updated_date = new Date();
                taxonomyObj.academic_year = body.academicYear;
                taxonomyObj.order_by = -1;
                taxonomyObj.id =  models.uuidFromString(value.id);
                taxonomyObj.name = value.name;
                taxonomyObj.category_id = models.uuid();
                taxonomyObj.parent_category_id = data.failTaxonomyObjId;
                taxonomyObj.status = true;
                var taxonomy = new models.instance.Taxanomy(taxonomyObj);
                var taxonomyObject = taxonomy.save({return_query: true});
                taxonomy = taxonomy.save({return_query: true});
                array.push(taxonomy)
            })
        }

        data.batchObj = array;
        callback(null, data);


    } catch (err) {
        callback(err, null);
    }
}

Promotion.getUserClassification = function (req, data, callback) {
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = req.body.academicYear;
    findQuery.class_id = models.uuidFromString(req.body.classes[0].id);
    models.instance.UserClassification.find(findQuery, {allow_filtering: true}, function(err, result){
        data.userClassification = result;
        callback(err, data);
    });
}

Promotion.getDepromotedUsers = function (req, data, callback) {
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = req.body.academicYear;
    findQuery.class_id = models.uuidFromString(req.body.existingClass[0].id);
    findQuery.promoted = false;
    models.instance.UserClassification.find(findQuery, {allow_filtering: true}, function(err, result){
        data.failedUserObj = result;
        callback(err, data);
    });
}

Promotion.updateClassAssocAcademicYear = function(req, data, callback) {
    var array = data.batchObj;
    var body = req.body;
    try {
        _.forEach(data.classAssoc, function (value) {
            var obj = new models.instance.SchoolClassSectionDetails ({
                tenant_id: value.tenant_id,
                school_id: value.school_id,
                academic_year: body.academicYear,
                id: models.uuid(),
                class_id: value.class_id,
                class_name: value.class_name,
                section_id: value.section_id,
                section_name: value.section_name,
                student_intake: value.student_intake,
                status: value.status,
                updated_by: value.updated_by,
                updated_date: new Date(),
                updated_firstname: value.updated_firstname,
                created_by: value.created_by,
                created_date: new Date(),
                created_firstname: value.created_firstname,
            });
            obj = obj.save({return_query: true});
            array.push(obj)
        })
        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        console.log("err", err);
        callback(err, null);
    }
};

Promotion.saveClassAssocAcademics = function(req, data, callback) {
    var array = [];
    var sections = [];
    var headers = baseService.getHeaders(req);
    var body = req.body;
    var classId = "";
    var className = "";
    if(!_.isEmpty(body.promotedClasses)) {
        classId = body.promotedClasses[0].id;
        className =  body.promotedClasses[0].name;
        sections = body.promotedClasses[0].sections;
    }

    try {
        if(!_.isEmpty(sections)) {
            _.forEach(sections, function (value) {
                var obj = new models.instance.SchoolClassSectionDetails ({
                    tenant_id: models.timeuuidFromString(headers.tenant_id),
                    school_id: models.uuidFromString(headers.school_id),
                    academic_year: body.academicYear,
                    id: models.uuid(),
                    class_id: models.uuidFromString(classId),
                    class_name: className,
                    section_id: models.uuidFromString(value.id),
                    section_name: value.name,
                    status: true,
                    updated_by: headers.user_id,
                    updated_date: new Date(),
                    updated_firstname: headers.user_name,
                    created_by: value.user_id,
                    created_date: new Date(),
                    created_firstname: headers.user_name,
                });
                obj = obj.save({return_query: true});
                array.push(obj)
            })
        }

        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        console.log("err", err);
        callback(err, null);
    }
};

Promotion.upadteClassAssoc = function(req, data, callback) {
    var array = data.batchObj;
    var sections = [];
    var headers = baseService.getHeaders(req);
    var body = req.body;
    var classId = "";
    var className = "";
    if(!_.isEmpty(body.existingClass)) {
        classId = body.existingClass[0].id;
        className =  body.existingClass[0].name;
        sections = body.sectionObjs;
    }

    try {
        if(!_.isEmpty(sections)) {
            _.forEach(sections, function (value) {
                var obj = new models.instance.SchoolClassSectionDetails ({
                    tenant_id: models.timeuuidFromString(headers.tenant_id),
                    school_id: models.uuidFromString(headers.school_id),
                    academic_year: body.year,
                    id: models.uuid(),
                    class_id: models.uuidFromString(classId),
                    class_name: className,
                    section_id: models.uuidFromString(value.id),
                    section_name: value.name,
                    status: true,
                    updated_by: headers.user_id,
                    updated_date: new Date(),
                    updated_firstname: headers.user_name,
                    created_by: headers.user_id,
                    created_date: new Date(),
                    created_firstname: headers.user_name,
                    promoted_class_id : req.body.classes ? models.uuidFromString(req.body.classes[0].id) : null,
                    promoted_class_name : req.body.classes ? req.body.classes[0].name : null,
                    promoted_section_id : models.uuidFromString(value.sectionId),
                    promoted_section_name : value.sectionName,
                    promoted: true,
                });
                obj = obj.save({return_query: true});
                array.push(obj)
            })
        }

        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        console.log("err", err);
        callback(err, null);
    }
};


Promotion.updateTimetableConfig = function(req, data, callback) {
    var array = data.batchObj;
    var sections = [];
    var headers = baseService.getHeaders(req);
    var body = req.body;

    try {
        if(!_.isEmpty(data.timetableConfig)) {
            _.forEach(data.timetableConfig, function (value) {
                var configObj = new models.instance.SchoolTimetableConfiguration ({
                    timetable_config_id: models.uuid(),
                    tenant_id: value.tenant_id,
                    school_id: value.school_id,
                    applicable_class: value.applicable_class,
                    school_periods: value.school_periods,
                    school_breaks: value.school_breaks,
                    working_days: value.working_days,
                    school_hours: value.school_hours,
                    updated_date: new Date(),
                    updated_by: headers.user_id,
                    updated_username: headers.user_name,
                    created_date: new Date(),
                    academic_year: req.body.academicYear,
                    created_by: headers.user_id,
                    created_firstname: headers.user_name
                });
                configObj = configObj.save({return_query: true});
                array.push(configObj)
            })
        }

        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        console.log("err", err);
        callback(err, null);
    }
};

Promotion.updateVehicleUsers = function(req, data, callback) {
    var array = data.batchObj;
    var sections = [];
    var headers = baseService.getHeaders(req);
    var body = req.body;

    try {
        if(!_.isEmpty(data.vehicleUsers)) {
            _.forEach(data.vehicleUsers, function (value) {
                var usrObject = {};
                var userObj = _.filter(body.users, {"user_name": value.user_name});
                var failedUsers = [];

                if(body.failedUsers) {
                    failedUsers = _.filter(body.failedUsers, {"user_name": value.user_name});
                }

                if(!_.isEmpty(failedUsers)) {
                    usrObject = failedUsers[0];
                } else if(!_.isEmpty(userObj)) {
                    usrObject = userObj[0];
                }
                var configObj = new models.instance.SchoolVehicleAllocation ({
                    tenant_id: value.tenant_id ,
                    school_id: value.school_id,
                    academic_year: req.body.academicYear,
                    route_id: value.route_id,
                    reg_no: value.reg_no,
                    first_name: value.first_name,
                    user_name: value.user_name,
                    class_id: (usrObject.classes) ? models.uuidFromString(usrObject.classes[0].class_id) : value.class_id,
                    class_name: (usrObject.classes) ? usrObject.classes[0].class_name : value.class_name,
                    section_name: (usrObject.classes) ? usrObject.classes[0].section_name : value.section_name,
                    section_id: (usrObject.classes) ? models.uuidFromString(usrObject.classes[0].section_id) : value.section_id,
                    pickup_location: value.pickup_location,
                    pickup_location_index: value.pickup_location_index,
                    notify_distance: value.notify_distance,
                    notify_type: value.notify_type,
                    id: value.id,
                    updated_by: headers.user_id,
                    updated_username: headers.user_name,
                    updated_date : new Date(),
                    created_by: headers.user_id,
                    created_date : new Date(),
                    created_firstname: headers.user_name
                });
                configObj = configObj.save({return_query: true});
                array.push(configObj)
            })
        }

        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        console.log("err", err);
        callback(err, null);
    }
};

Promotion.updateSchoolPeriods = function(req, data, callback) {
    var array = data.batchObj;
    var sections = [];
    var headers = baseService.getHeaders(req);
    var body = req.body;

    try {
        if(!_.isEmpty(data.periods)) {
            _.forEach(data.periods, function (value) {
                var schoolPeriodsObj = new models.instance.SchoolPeriods ({
                    school_period_id: value.school_period_id,
                    tenant_id: value.tenant_id,
                    school_id: value.school_id,
                    academic_year: req.body.academicYear,
                    class_id: value.class_id,
                    period_id: value.period_id,
                    period_name: value.period_name,
                    period_start_time: value.period_start_time,
                    period_end_time: value.period_end_time,
                    is_break: value.is_break || false
                });
                schoolPeriodsObj = schoolPeriodsObj.save({return_query: true});
                array.push(schoolPeriodsObj)
            })
        }

        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        console.log("err", err);
        callback(err, null);
    }
};

Promotion.saveClassAssociationForFailed = function(req, data, callback) {
    var array = data.batchObj;
    var sections = [];
    var headers = baseService.getHeaders(req);
    var body = req.body;
    var classId = "";
    var className = "";
    if(!_.isEmpty(body.existingClass)) {
        classId = body.existingClass[0].id;
        className =  body.existingClass[0].name;
        sections = body.existingClass[0].sections;
    }

    try {
        if(!_.isEmpty(sections) && !_.isEmpty(req.body.failedUsers)) {
            _.forEach(sections, function (value) {
                var obj = new models.instance.SchoolClassSectionDetails ({
                    tenant_id: models.timeuuidFromString(headers.tenant_id),
                    school_id: models.uuidFromString(headers.school_id),
                    academic_year: body.academicYear,
                    id: models.uuid(),
                    class_id: models.uuidFromString(classId),
                    class_name: className,
                    section_id: models.uuidFromString(value.id),
                    section_name: value.name,
                    status: true,
                    updated_by: headers.user_id,
                    updated_date: new Date(),
                    updated_firstname: headers.user_name,
                    created_by: headers.user_id,
                    created_date: new Date(),
                    created_firstname: headers.user_name,
                });
                obj = obj.save({return_query: true});
                array.push(obj)
            })
        }

        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        console.log("err", err);
        callback(err, null);
    }
};

Promotion.saveUserClassfication = function(req, data, callback) {
    var array = data.batchObj;
    var headers = baseService.getHeaders(req);
    var body = req.body;

    try {
        if(!_.isEmpty(body.users)) {
            _.forEach(body.users, function (value) {
                var obj = new models.instance.UserClassification ({
                    tenant_id: models.timeuuidFromString(headers.tenant_id),
                    school_id: models.uuidFromString(headers.school_id),
                    academic_year: body.academicYear,
                    user_name: value.user_name,
                    class_id: models.uuidFromString(value.newClassId),
                    section_id: models.uuidFromString(value.newSectionId),
                    languages : getLanguagesMap(value.languages),
                });
                obj = obj.save({return_query: true});
                array.push(obj)
            })
        }

        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        callback(err, null);
    }
};

Promotion.saveDepromotedUsers = function(req, data, callback) {
    var array = data.batchObj;
    var headers = baseService.getHeaders(req);
    var body = req.body;

    try {
        if(!_.isEmpty(body.failedUsers)) {
            _.forEach(body.failedUsers, function (value) {
                var obj = new models.instance.UserClassification ({
                    tenant_id: models.timeuuidFromString(headers.tenant_id),
                    school_id: models.uuidFromString(headers.school_id),
                    academic_year: body.academicYear,
                    user_name: value.user_name,
                    class_id: models.uuidFromString(value.classes[0].class_id),
                    section_id: models.uuidFromString(value.classes[0].section_id),
                    languages : getLanguagesMap(value.languages),
                });
                obj = obj.save({return_query: true});
                array.push(obj)
            })
        }

        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        console.log("err......", err);
        callback(err, null);
    }
};

Promotion.updatePromotedStatus = function(req, data, callback) {
    var array = data.batchObj;
    var headers = baseService.getHeaders(req);
    var body = req.body;

    try {
        if(!_.isEmpty(body.users)) {
            _.forEach(body.users, function (value) {
                var findQuery = baseService.getFindQuery(req);
                findQuery.class_id = models.uuidFromString(body.existingClass[0].id);
                findQuery.user_name = value.user_name;
                findQuery.academic_year = body.year; //data.academic_year.ac_year;
                var updateValues = {
                    promoted : true
                }
                var updateQuery = models.instance.UserClassification.update(findQuery, updateValues, {return_query: true});
                array.push(updateQuery);
            })
        }

        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        console.log("err......", err);
        callback(err, null);
    }
};

Promotion.updateDePromotedStatus = function(req, data, callback) {
    var array = data.batchObj;
    var headers = baseService.getHeaders(req);
    var body = req.body;

    try {
        if(!_.isEmpty(body.failedUsers)) {
            _.forEach(body.failedUsers, function (value) {
                var findQuery = baseService.getFindQuery(req);
                findQuery.class_id = models.uuidFromString(body.existingClass[0].id);
                findQuery.user_name = value.user_name;
                findQuery.academic_year = body.year; //data.academic_year.ac_year;
                var updateValues = {
                    promoted : false
                }
                var updateQuery = models.instance.UserClassification.update(findQuery, updateValues, {return_query: true});
                array.push(updateQuery);
            })
        }

        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        console.log("err......", err);
        callback(err, null);
    }
};

Promotion.delUserClassficationObj = function(req, data, callback) {
    var array = data.batchObj;
    var headers = baseService.getHeaders(req);
    var body = req.body;

    try {
        if(!_.isEmpty(body.users)) {
            _.forEach(body.users, function (value) {
                var findQuery = baseService.getFindQuery(req);
                findQuery.class_id = models.uuidFromString(value.oldClassId);
                findQuery.user_name = value.user_name;
                findQuery.academic_year = req.body.academicYear; //data.academic_year.ac_year;
                var deleteQuery = models.instance.UserClassification.delete(findQuery, {return_query: true});
                array.push(deleteQuery);
            })
        }

        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        console.log("err......", err);
        callback(err, null);
    }
};


Promotion.deleteClassAssoc = function(req, data, callback) {
    var array = [];
    var body = req.body;
    try {
        if(!_.isEmpty(data.delClassObj)) {
            _.forEach(data.delClassObj, function (value) {
                var findQuery = baseService.getFindQuery(req);
                findQuery.class_id = value.class_id;
                findQuery.section_id = value.section_id;
                findQuery.academic_year = value.academic_year; //data.academic_year.ac_year;
                var deleteQuery = models.instance.SchoolClassSectionDetails.delete(findQuery, {return_query: true});
                array.push(deleteQuery);
            })
        }

        data.batchObj = array;
        callback(null, data);

    } catch (err) {
        console.log("err......", err);
        callback(err, null);
    }
};

function getLanguagesMap(input) {
    if (input != null && input != undefined) {
        var map = {};
        input.forEach(function (item){
            map[parseInt(item['language_type'])] = models.uuidFromString(item['language_id']);
        });
        return map;
    }

    return input;
}


Promotion.updateAcademicEsUserAllocation = function(req, allocation, schoolDetails, callback) {
    var bulkObjs = [];
    try {
        var searchParams = nsabb.getVehiclesBySchool(schoolDetails, req.body.academicYear);
        nsaElasticSearch.search.searchUsers(searchParams, function (err, data, status) {
            data = data.hits.hits;
            if(!_.isEmpty(data)){
               callback(null, data)
            }else {
                allocation = _.map(allocation, function(value){ return value._source});
                _.forEach(allocation, function(val){
                    var bulkDoc = {
                        index:{
                            "_index": global.config.elasticSearch.index.userIndex,
                            "_type": global.config.elasticSearch.index.vehicleType,
                            "_id": (models.uuid()).toString()
                        }
                    };
                    val.academic_year = req.body.academicYear;
                    bulkObjs.push(bulkDoc);
                    bulkObjs.push(val);
                });
                nsaElasticSearch.index.bulkDoc({body: bulkObjs}, function (err, result) {
                    callback(err, result);
                });
            }
        })
    } catch (err) {
        callback(err, null);
    }
};

module.exports = Promotion;