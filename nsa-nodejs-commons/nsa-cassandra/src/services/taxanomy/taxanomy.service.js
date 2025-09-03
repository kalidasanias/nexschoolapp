/**
 * Created by Sai Deepak on 01-Feb-17.
 */

var express = require('express')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , taxanomyConverter = require('../../converters/taxanomy.converter')
    , models = require('../../models')
    , async = require('async')
    , logger = require('../../../../../../config/logger')
    , _ = require('lodash');

var Taxanomy = function f(options) {
    var self = this;
};

Taxanomy.getAllCategories = function(req, callback) {
    Taxanomy.getAllTaxanomyCategories(req, function (err, result) {
        if(err) {
            callback(err, null)
        } else {
            callback(null, taxanomyConverter.taxanomy(req, result, 3))
        }
    })
};

Taxanomy.getDeptCategories = function(req, callback) {
    Taxanomy.getAllTaxanomyCategories(req, function (err, result) {
        if(err) {
            callback(err, null)
        } else {
            callback(null, taxanomyConverter.deptTaxanomy(req, result, 3))
        }
    })
};

Taxanomy.getAllTaxanomyCategories = function(req, callback) {
    var headers = baseService.getHeaders(req);
    models.instance.Taxanomy.find({
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year, status: true
    }, {allow_filtering: true}, function (err, result) {
        if(err) {
            callback(err, null)
        } else {
            callback(null, result)
        }
    });
};

Taxanomy.getTwoLevelCategories = function(req, callback) {
    Taxanomy.getAllTaxanomyCategories(req, function (err, result) {
        if(err) {
            callback(err, null)
        } else {
            var taxanomy = taxanomyConverter.taxanomy(req, result, 2)
            callback(null, [taxanomy[1]])
        }
    })
};

Taxanomy.getLevelCategories = function(req, callback) {
    var levelId = req.params.id;
    Taxanomy.getAllTaxanomyCategories(req, function (err, result) {
        if(err) {
            callback(err, null)
        } else {
            var taxanomy = taxanomyConverter.taxanomy(req, result, levelId)
            callback(null, [taxanomy[1]])
        }
    })
};

Taxanomy.addSectionsToTaxonomy = function(req, data, callback) {
    try {
        var taxonomyObj = {}, array = data.batchObj;
        this.updateIdsFromHeader(req, taxonomyObj, true);
        _.forEach(req.body.sections, function(value, key) {
            var sectionId = models.uuidFromString(value.id);
            var hasSection = _.find(data.childObjs, ['id', sectionId]);
            var childObjs = data.childObjs.length;
            if(hasSection == undefined) {
                var sectionName = value.name;
                taxonomyObj.order_by = childObjs;
                taxonomyObj.id = sectionId;
                taxonomyObj.name = sectionName;
                taxonomyObj.status = true;
                taxonomyObj.category_id = models.uuid();
                taxonomyObj.parent_category_id = models.uuidFromString(data.parent_category_id);
                var taxonomy = new models.instance.Taxanomy(taxonomyObj);
                var taxonomyObject = taxonomy.save({return_query: true});
                array.push(taxonomyObject);
            }
        });
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, data);
    }

}

Taxanomy.updateEmpStatusInTaxonomy = function (req, data, callback) {
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = baseService.getHeaders(req).academic_year;
    findQuery.id = models.uuidFromString(req.body.id);
    models.instance.Taxanomy.findOne(findQuery, {allow_filtering: true}, function (err, result) {
        if(result){
            var array = data.batchObj;
            var findQuery1 = baseService.getFindQuery(req);
            findQuery1.academic_year = baseService.getHeaders(req).academic_year;
            findQuery1.category_id = result.category_id;
            var updateValue = data.updateValue;
            var updateQuery = models.instance.Taxanomy.update(findQuery1, updateValue, {return_query: true});
            array.push(updateQuery);
            data.batchObj = array;
            callback(null, data);
        }else {
            callback(null, data);
        }

    })
}


Taxanomy.getSingleTaxonomy = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    models.instance.Taxanomy.findOne({ tenant_id: tenantId,
        school_id: schoolId, id: models.uuidFromString(data.id), parent_category_id: models.uuidFromString(data.parentCategoryId),
        academic_year: headers.academic_year, status: true
    }, {allow_filtering: true}, function(err, result){
        if(err) {
            callback(err, null)
        } else {
            data['taxonomy'] = result;
            callback(null, data);
        }
    });
}

Taxanomy.deleteTaxonomy = function(req, data, callback) {
    try {
        var batchObj = data.batchObj;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var queryObj = {
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year: headers.academic_year,
            category_id: data.taxonomy.category_id
        };
        var delObj = models.instance.Taxanomy.delete(queryObj, {return_query: true});
        batchObj.push(delObj);
        data.batchObj = batchObj;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, data);
    }
}



Taxanomy.updateIdsFromHeader = function(req, obj, dateAlone) {
    try {
        var headers = baseService.getHeaders(req);
        obj.school_id = models.uuidFromString(headers.school_id);
        obj.tenant_id = models.timeuuidFromString(headers.tenant_id);
        obj.updated_date = dateService.getCurrentDate();
        obj.academic_year = headers.academic_year;
        if (!dateAlone) {
            obj.updated_by = req.headers.userInfo.user_name;
            obj.updated_username = req.headers.userInfo.first_name;
        }
    } catch (err) {
        logger.debug(err);
        return err;
    }
    return obj;
};

Taxanomy.fetchChildTaxanomy = function(req, parentCategoryId, callback) {
    var headers = baseService.getHeaders(req);
    var parentCatId = models.uuidFromString(parentCategoryId);
    var findQuery = {
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id),
            academic_year: headers.academic_year,
            status: true , parent_category_id: parentCatId};
    models.instance.Taxanomy.find(findQuery, {allow_filtering: true}, function(err, result){
        if(err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

/*
Taxanomy.promoteClassSectionInClassSectionDetails = function(req, data, callback){
    var body = req.body;
    var addingClassSectionDetails = [];
    //tenant_id,school_id,academic_year,class_id,section_id,class_name,id,section_name,status,student_intake
    try {
        var headers = baseService.getHeaders(req);
        var insertClassSectionInSchoolClassSection = function(object, cb){
            var obj = new models.instance.SchoolClassSectionDetails({
                id: models.uuid(),
                class_id: models.uuidFromString(object.classObj.classId),
                tenant_id: headers.tenant_id,
                school_id: headers.school_id,
                class_name: object.classObj.class_name,
                academic_year: headers.academic_year,
                section_id: models.uuidFromString(object.section_id),
                section_name: object.section_name,
                status: true,
                created_by: headers.user_id,
                created_date: new Date(),
                created_firstname: headers.user_name,
                updated_by: headers.user_id,
                updated_date: new Date(),
                updated_firstname: headers.user_name
            });
            var Object = obj.save({return_query: true});
            addingClassSectionDetails.push(Object);
            callback(null, Object);
        }

        console.info('body.classes.sections',body.classes.sections);
        _.forEach(body.classes, function(value, key){
            async.times(value.sections.length, function(i, next) {
                var currentObject = value.sections[i];
                console.info('currentObject..',currentObject);
                findClassSectionInSchoolClassSection(currentObject, value, function(err, result){
                    if(!result){
                        currentObject.classObj = value;
                        insertClassSectionInSchoolClassSection(currentObject, function(err, data) {
                            next(err, data);
                        });
                    } else{
                        next(err, addingClassSectionDetails);
                    }
                });
            }, function(err, objs) {
                data.batchObj = addingClassSectionDetails;
                callback(null, data);
            });
        })
    }catch (err){
        callback(err, null);
    }
};


function findClassSectionInSchoolClassSection(section, classDetails, callback){
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
        findQuery.class_id = classDetails.class_id;
        findQuery.section_id = section.section_id;
        findQuery.academic_year = headers.academic_year;
    console.info('findQuery...',findQuery);
    models.instance.SchoolClassSectionDetails.findOne(findQuery, {allow_filtering: true}, function(err, result){
         callback(err, result);
    })
};

Taxanomy.promotedClassSectionInTaxanomy = function(req, data, callback){
    var batchObj = [];
 try {
     var body = req.body;
     var headers = baseService.getHeaders(req);
       var insertClassLevelCategory = function(object, callback){
           var taxonomyObj = {};
           taxonomyObj.school_id = headers.school_id;
           taxonomyObj.tenant_id = headers.tenant_id;
           taxonomyObj.updated_date = new date();
           taxonomyObj.academic_year = headers.academic_year;
           taxonomyObj.order_by = -1;
           taxonomyObj.id = object.class_id;
           taxonomyObj.name = object.class_name;
           taxonomyObj.category_id = models.uuid();
           taxonomyObj.parent_category_id = models.uuidFromString(object.parent_category_id);
           taxonomyObj.status = true;
           var taxonomy = new models.instance.Taxanomy(taxonomyObj);
           var taxonomyObject = taxonomy.save({return_query: true});
           batchObj.push(taxonomyObject);
           callback(null, taxonomyObject);
       };

     var findQuery = baseService.getFindQuery(req);
         findQuery.academic_year = headers.academic_year;
         findQuery.name = constants.ALL_CLASSES;
     findCategoryBasedOnTaxanomy(findQuery, function(err, result){
         if (!result){
             insertParentClassLevelCategory(req, function(err, AllClass){
                 batchObj.push(AllClass);
                 async.times(body.classes.length, function(i, next){
                     var currentClass = body.classes[i];
                     console.info('currentClass..',currentClass);
                     var findClass = baseService.getFindQuery(req);
                         findClass.academic_year = headers.academic_year;
                         findClass.id = currentClass.class_id;
                     findCategoryBasedOnTaxanomy(findClass, function(err, result){
                         if(!result){
                             if(!batchObj.parent_category_id){
                                 /!*getParentCategoryId(req, function(err, parentCategory){
                                   batchObj.parent_category_id = parentCategory;
                                 })*!/
                             }
                             currentClass.parent_category_id = batchObj.parent_category_id;
                             insertClassLevelCategory(currentClass, function(err, Classes) {
                                 batchObj.push(Classes);
                                 next(err, data);
                             });
                         } else{
                             next(err, batchObj);
                         }
                     });
                 }, function(err, objs){
                     data.batchObj = batchObj;
                     callback(null, data);
                 })
             })
         }else {
             async.times(body.classes.length, function(i, next){
                 var currentClass = body.classes[i];
                 console.info('currentClass..',currentClass);
                 var findClass = baseService.getFindQuery(req);
                 findClass.academic_year = headers.academic_year;
                 findClass.id = currentClass.class_id;
                 findCategoryBasedOnTaxanomy(findClass, function(err, result){
                     if(!result){
                         getParentCategoryId(req, function(err, parentCategory){
                             currentClass.parent_category_id = parentCategory;
                             insertClassLevelCategory(currentClass, function(err, Classes) {
                                 batchObj.push(Classes);
                                 next(err, data);
                             });
                         })
                     } else{
                         next(err, batchObj);
                     }
                 });
             }, function(err, objs){
                 data.batchObj = batchObj;
                 callback(null, data);
             })
         }
     })
 }catch (err){
     callback(err, null);
 }
};

function getParentCategoryId(req, callback){
    var headers = this.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
        findQuery.academic_year = headers.academic_year;
        findQuery.name = constants.ALL_CLASSES;
    models.instance.Taxanomy.findOne(findQuery, {allow_filtering: true}, function(err, result){
        var resultJson = JSON.parse(JSON.stringify(result))
        callback(err, resultJson.category_id);
    });
}

function insertParentClassLevelCategory(req, callback){
    try {
        var headers = baseService.getHeaders(req);
         var taxonomyObj = {};
        taxonomyObj.order_by = 1;
        taxonomyObj.id = constants.ALL_CLASSES_ID;
        taxonomyObj.name = constants.ALL_CLASSES;
        taxonomyObj.status = true;
        taxonomy.academic_year = headers.academic_year;
        taxonomy.type = 'O';
        taxonomyObj.category_id = models.uuid();
        taxonomyObj.parent_category_id = models.uuidFromString(constants.TAXANOMY_ID);
        var taxonomy = new models.instance.Taxanomy(taxonomyObj);
        var taxonomyObject = taxonomy.save({return_query: true});
        taxonomyObject.parent_category_id = taxonomyObj.category_id;
        callback(null, taxonomyObject);
    }catch (err){
        callback(err, null)
    }
};

function findCategoryBasedOnTaxanomy(findQuery, callback){
    models.instance.Taxanomy.findOne(findQuery, {allow_filtering: true}, function (err, result) {
        if(err) {
            callback(err, null)
        } else {
            callback(null, result)
        }
    });
};
*/

module.exports = Taxanomy;