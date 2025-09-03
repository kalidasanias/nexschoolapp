/**
 * Created by senthil on 13/01/17.
 */

var express = require('express')
    , request = require('request')
    , async = require('async')
    , session = require('express-session');

var constants = require('../../common/constants/constants');
var status = require('../../common/domains/Status');
var requestParam = require('../../common/domains/RequestParam'),
    models = require('../../models'),
    baseService = require('../common/base.service'),
    dateService = require('../../utils/date.service'),
    constant = require('@nsa/nsa-commons').constants,
    _ = require('lodash'),
    nsaCassandra = require('@nsa/nsa-cassandra'),
    logger = require('../../../config/logger');

var BaseService = function f(options) {
    var self = this;
};


/*exports.validateHeaders = function(req, res) {
 var isHeaderParamAvailable = false;


 if (req.headers.tenant_id == undefined && req.headers.school_id == undefined) {
 res.send({status: baseService.getFailureStatus(req, res, constants.HTTP_UNAUTHORIZED, "Header Parameters are not provided")});
 }
 };*/

BaseService.waterfallOver =  function(req, list, saveObj, data, callback) {
    var nextItemIndex = 0;  //keep track of the index of the next item to be processed

    function report(err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        nextItemIndex++;
        // if nextItemIndex equals the number of items in list, then we're done
        if(nextItemIndex === list.length) {
            callback(err, data);
        } else
        // otherwise, call the iterator on the next item
            saveObj(req, list[nextItemIndex], data, report);
    }
    // instead of starting all the iterations, we only start the 1st one
    saveObj(req, list[0], data, report);
}


BaseService.getHeaders = function(req) {

    var headers = {user_id: req.headers.userInfo.user_name, user_name:req.headers.userInfo.first_name,
        user_type: req.headers.userInfo.user_type, tenant_id: req.headers.userInfo.tenant_id,
        school_id: req.headers.userInfo.school_id,  /*,academic_year : req.headers.academic_year*/
        school_name: req.headers.userInfo.school_name,
        permissions: req.headers.userInfo.permissions,
        feature_id: req.headers.id,
        academic_year: req.headers.academicyear ? req.headers.academicyear : req.headers.userInfo.academic_year
    };
    return headers;
};

BaseService.getFindQuery = function (req) {
    var headers = this.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };
    return findQuery;
};

BaseService.getFindAllQuery = function (req, academicYear, permissions) {
    var headers = this.getHeaders(req);
    var findQuery = {};
        findQuery.tenant_id = models.timeuuidFromString(headers.tenant_id);
        findQuery.school_id = models.uuidFromString(headers.school_id);
        if(academicYear) {
            findQuery.academic_year = req.headers.academicyear ? req.headers.academicyear : headers.academic_year;
        }
        if(this.checkPermissionsToQuery(req, permissions)) {
                findQuery.created_by = headers.user_id
        }
    return findQuery;
};

BaseService.getUpdatedUserFindAllQuery = function (req, academicYear, permissions) {
    var headers = this.getHeaders(req);
    var findQuery = {};
    findQuery.tenant_id = models.timeuuidFromString(headers.tenant_id);
    findQuery.school_id = models.uuidFromString(headers.school_id);
    if(academicYear) {
        findQuery.academic_year = req.headers.academicyear ? req.headers.academicyear : headers.academic_year;
    }
    if(this.checkPermissionsToQuery(req, permissions)) {
        findQuery.updated_by = headers.user_id
    }
    return findQuery;
};

BaseService.getUserFindAllQuery = function (req, academicYear, permissions) {
    var headers = this.getHeaders(req);
    var findQuery = {};
    findQuery.tenant_id = models.timeuuidFromString(headers.tenant_id);
    findQuery.school_id = models.uuidFromString(headers.school_id);
    if(academicYear) {
        findQuery.academic_year = req.headers.academicyear ? req.headers.academicyear : headers.academic_year
    }
    if(this.checkPermissionsToQuery(req, permissions)) {
        findQuery.user_name = headers.user_id
    }
    return findQuery;
};

BaseService.checkPermissionsToQuery = function(req, permissions) {
    var check = true;
    var permissions = this.getPermissions(req, permissions);
    var manage = _.includes(permissions, constants.MANAGE);
    var view = _.includes(permissions, constants.VIEW);

    if(manage || view) {
        var viewAll = _.includes(permissions, constants.VIEW_All);
        var manageAll = _.includes(permissions, constants.MANAGE_ALL);
        if(viewAll || manageAll) {
            check = false;
        }
    } else {
        check = false;
    }

    return check;
};


BaseService.getPermissions = function (req, permissions) {

    var userPermissions = req.headers.userInfo.permissions;
    var permissions = _.intersection(userPermissions, permissions);
    var array = [];
    for ( var prop in permissions ) {
        var arr = permissions[prop].split('_');
        var userpermission = arr[arr.length - 1];
        array.push(userpermission);
    }
    return array;
};

BaseService.getQuery = function(req) {
    var headers = this.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };
    findQuery.user_name = models.uuidFromString(req.params.id);
    return findQuery;
};

BaseService.getListOfUuid = function(strUuids) {
    var output = [];
    for(var key in strUuids){
        output.push(models.uuidFromString(strUuids[key]));
    };
    return output;

    /*_.forEach(strUuids, function(value, key) {
     uuids.push(models.uuidFromString(value));
     if (key == strUuids.length - 1) {
     callback(uuids);
     }
     });*/
};

BaseService.getMapUuid = function(strUuids) {
    var output = {};
    for(var key in strUuids){
        var uuidkey = models.uuidFromString(key);
        var value = strUuids[key];
        output[uuidkey]=value;
        // delete strUuids[key];
    };
    return output;

    /*_.forEach(strUuids, function(value, key) {
        uuids.push(models.uuidFromString(value));
        if (key == strUuids.length - 1) {
            callback(uuids);
        }
    });*/
};

BaseService.updateIdsFromHeader = function(req, obj, dateAlone) {
    try {
        obj.school_id = models.uuidFromString(req.headers.userInfo.school_id);
        obj.tenant_id = models.timeuuidFromString(req.headers.userInfo.tenant_id);
        obj.updated_date = dateService.getCurrentDate();
        if (!dateAlone) {
            obj.updated_by = req.headers.userInfo.user_name;
            obj.updated_username = req.headers.userInfo.first_name;
            obj.created_date = dateService.getCurrentDate();
            obj.created_by = req.headers.userInfo.user_name;
            obj.created_firstname = req.headers.userInfo.first_name;
        }
    } catch (err) {
        logger.debug(err);
        return err;
    }
    return obj;
};

BaseService.getStatus = function(req, res, statusCode, statusMessage) {
    status.code = statusCode;
    status.message = statusMessage;

    return status;
}

BaseService.getSuccessStatus = function(req, res, statusMessage) {
    return this.getStatus(req, res, constants.HTTP_OK, statusMessage);
}

BaseService.getFailureStatus = function(req, res, statusCode, statusMessage) {
    return this.getStatus(req, res, statusCode, statusMessage);
}

BaseService.getRequestParam = function(req, res, param) {
    requestParam.totalRecords = 100;
    return requestParam;
}

BaseService.sendDateFormatedResult = function(result, key, callback) {
    if (result.length > 0) {
        for (i = 0; result.length > i; i++) {
            var obj = result[i];
            if (obj[key]) {
                obj[key] = dateService.getFormattedDate(obj[key]);
            }
            if (i == result.length -1) {
                callback(result)
            }
        }
    } else {
        callback(result)
    }

};

BaseService.sendDatesFormatedResult = function(result, key, callback) {
    if (result.length > 0) {
        for (i = 0; result.length > i; i++) {
            var obj = result[i];
            for (j = 0; key.length > j; j++) {
                if (obj[key[j]]) {
                    obj[key[j]] = dateService.getFormattedDate(obj[key[j]]);
                }
            }
            if (i == result.length -1) {
                callback(result)
            }
        }
    } else {
        callback(result)
    }

};

//For IOS Start
BaseService.returnDatesFormatedResult = function(result, key, callback) {
    if (result.length > 0) {
        for (i = 0; result.length > i; i++) {
            var obj = result[i];
            for (j = 0; key.length > j; j++) {
                if (obj[key[j]]) {
                    obj[key[j]] = dateService.getDateFormatted(obj[key[j]], "d mmm dddd yyyy h:MM TT");
                }
            }
            if (i == result.length -1) {
                callback(result)
            }
        }
    } else {
        callback(result)
    }

};
//For IOS End

BaseService.returnDateFormatedResult = function(result, key) {
    if (result.length > 0) {
        for (i = 0; result.length > i; i++) {
            var obj = result[i];
            if (obj[key]) {
                obj[key] = dateService.getFormattedDate(obj[key]);
            }
            if (i == result.length -1) {
                return result;
            }
        }
    } else {
        return result;
    }

};


BaseService.getTaxonomyObj = function(findQuery, callback) {
    models.instance.Taxanomy.findOne(findQuery, {allow_filtering: true}, function(err, result){
        if(err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}

BaseService.deleteTaxonomyObj = function(req, data, callback) {
    try {
        var array = data.batchObj || [];
        var queryObj = { tenant_id:  data.taxanomy.tenant_id, school_id: data.taxanomy.school_id,
            academic_year: data.taxanomy.academic_year, category_id: data.taxanomy.category_id };
        var deleteQuery = models.instance.Taxanomy.delete(queryObj, {return_query: true});
        array.push(deleteQuery);
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

BaseService.getEmployeeTaxonomy = function(req, data, callback) {
    var headers = this.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    models.instance.Taxanomy.findOne({ tenant_id: tenantId,
        school_id: schoolId, name: constants.ALL_EMPLOYEE,
        academic_year: headers.academic_year
    }, {allow_filtering: true}, function(err, result){
        var resultJson = JSON.parse(JSON.stringify(result))
        data.parent_category_id = resultJson.category_id;
        callback(err, data);
    });
}

BaseService.getAllEmployeesInTaxonomy = function(req, data , callback) {
    var addingEmployees = [];
    try{
        var addEmployeeInTaxonomyObj = function(object, callback) {
            var taxonomyObj = {};
            taxonomyObj.school_id = object.school_id;
            taxonomyObj.tenant_id = object.tenant_id;
            taxonomyObj.updated_date = dateService.getCurrentDate();
            taxonomyObj.academic_year = constants.ACADEMIC_YEAR;
            taxonomyObj.order_by = -1;
            taxonomyObj.id = object.id;
            taxonomyObj.name = object.first_name;
            taxonomyObj.category_id = models.uuid();
            taxonomyObj.parent_category_id = models.uuidFromString(object.parent_category_id);
            taxonomyObj.status = true;
            var taxonomy = new models.instance.Taxanomy(taxonomyObj);
            var taxonomyObject = taxonomy.save({return_query: true});
            addingEmployees.push(taxonomyObject);
            callback(null, taxonomyObject);
        };
         var users = data.users;
        async.times(users.length, function(i, next) {
            var currentUesr = users[i];
            findUserInTaxonomy(currentUesr, function(err, result){
               if(!result){
                   getParentCategoryDetails(currentUesr, function(err, Category){
                        addEmployeeInTaxonomyObj(Category, function(err, data) {
                            next(err, data);
                           });
                        });
                }else{
                    next(err, addingEmployees);
                }
            });
        }, function(err, objs) {
             data.batchObj = addingEmployees;
            callback(null, data);
        });
    }catch (err){
        logger.debug(err);
        callback(err, null);
    }
};

function getHeadersFromUser(user){
    var findObject ={};
    findObject.school_id = user.school_id;
    findObject.tenant_id = user.tenant_id;
    findObject.academic_year = constants.ACADEMIC_YEAR;
    return findObject;
};

function getParentCategoryDetails(user, callback){
    try {
        var findQuery = getHeadersFromUser(user);
        findQuery.name = constant.ALL_EMPLOYEE;
        models.instance.Taxanomy.findOne(findQuery, {allow_filtering: true}, function(err, result){
            var resultJson = JSON.parse(JSON.stringify(result));
            user.parent_category_id = resultJson.category_id;
            callback(null, user)
        });
    }catch (err){
        callback(err, null);
    }
};

function findUserInTaxonomy(user, callback){
    var findQuery = getHeadersFromUser(user);
        findQuery.id = user.id;
    models.instance.Taxanomy.findOne(findQuery,{allow_filtering: true}, function(err, result){
       if(err){
           logger.debug(err);
           callback(err, null);
       }else {
           callback(null, result);
       }
    })
};

BaseService.getSectionTaxonomy = function(req, data, callback) {
    var headers = this.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    models.instance.Taxanomy.findOne({ tenant_id: tenantId,
        school_id: schoolId, category_id: req.body.section_id,
        academic_year: headers.academic_year
    }, {allow_filtering: true}, function(err, result){
        var resultJson = JSON.parse(JSON.stringify(result))
        data.parent_category_id = resultJson.category_id;
        callback(err, data);
    });
}


BaseService.getClassTaxonomy = function(req, data, callback) {
    var headers = this.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var classId = models.uuidFromString(req.body.classId);
    models.instance.Taxanomy.findOne({ tenant_id: tenantId,
        school_id: schoolId, id: classId,
        academic_year: headers.academic_year
    }, {allow_filtering: true}, function(err, result){
        var resultJson = JSON.parse(JSON.stringify(result))
        data.parent_category_id = resultJson.category_id;
        callback(err, data);
    });
}

BaseService.addTaxonomy = function(req, data, callback) {
    var taxonomyObj = {}, array=data.batchObj;
    this.updateIdsFromHeader(req, taxonomyObj, true);
    taxonomyObj.order_by = -1;
    taxonomyObj.id = data.user_id;
    taxonomyObj.name = req.body.first_name;
    taxonomyObj.category_id = models.uuid();
    taxonomyObj.parent_category_id = models.uuidFromString(req.body.section_id || data.parent_category_id);
    taxonomyObj.academic_year = this.getHeaders(req).academic_year; //data.academic_year.ac_year;
    taxonomyObj.status = true;
    var taxonomy = new models.instance.Taxanomy(taxonomyObj);
    var taxonomyObject = taxonomy.save({return_query: true});
    array.push(taxonomyObject);
    data.batchObj = array;
    callback(null, data);
}

/** User related methods **/

BaseService.getUserFromRequestBody = function(req) {

    var body = req.body;

    var headers = this.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    var dob = body.dob;
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    var dt = new Date(dob.replace(pattern,'$1-$2-$3'));
    var currentDate = new Date();

    var userDetails = new models.instance.User( {
        user_name: body.userName,
        email: body.emailAddress,
        password: body.password,
        primary_phone: body.primaryPhone,
        school_id: schoolId,
        school_name: "PSBB",
        tenant_id: tenantId,
        created_date : currentDate,
        updated_date : currentDate,
        active: true
    });

    return user;
}

BaseService.getSessionUser = function(req, res) {
    session = req.session;


    if (session.user) {
        return session.user;
    }
}

// TODO : Refactor these method
BaseService.getArrayFromMap = function(input) {
    // it will wrap map to list as {"1" : "name1" , "2" : "name2"} to ["name1", "name2"]
    var output = [];
    for(var key in input){
        output.push(input[key])
    };
    return output;
};

BaseService.changeArrayKeyWithKey = function(input, key1, key2) {
    // it will unwrap as [{ "id" : "1" , "name" : "name1"}, {"id" : "2", "name" : "name2"}] to [{ "key1" : "1" , "key2" : "name1"}, {"key1" : "2", "key2" : "name2"}]
    var array = []
    if (input != null && input != undefined) {
        input.forEach(function (item){
            var map = {};
            map[key1] = item.id;
            map[key2] = item.name;
            array.push(map);
        });

        return array;
    }

    return input;
};

BaseService.getFormattedMap = function(input) {
    // it will unwrap map as {"1" : "name1" , "2" : "name2"} to [{ "id" : "1" , "name" : "name1"}, {"id" : "2", "name" : "name2"}]
    if (input != null && input != undefined) {
        var output = [];
        for(var key in input){
            output.push({'id':key, 'name': input[key]})
        };
        return output;
    }
    return input;
};

BaseService.getMapFromFormattedMap = function(input) {
    // it will unwrap as [{ "id" : "1" , "name" : "name1"}, {"id" : "2", "name" : "name2"}] to {"1" : "name1" , "2" : "name2"}
    if (input != null && input != undefined) {
        var map = {};
        input.forEach(function (item){
            map[item.id] = item.name;
        });
        return map;
    }
    return input;
};

BaseService.getArrayFromArray = function(input, key, key1, changeKey, changeKey1) {
    // it will unwrap as [{ "id" : "1" , "name" : "name1"}, {"id" : "2", "name" : "name2"}] to {"1" : "name1" , "2" : "name2"}
    var array = [];
    if (input != null && input != undefined) {
        var map = {};
        input.forEach(function (item){
            item[key] = map[changeKey],
            item[key1] = map[changeKey1]
            array.push(map);
        });
        return array;
    }
    return array;
};

BaseService.getNamesFromArray = function(input, key) {
    // it will unwrap as [{ "id" : "1" , "name" : "name1"}, {"id" : "2", "name" : "name2"}] to ["name1" , "name2"]
    var array = [];
    if (input != null && input != undefined) {
        input.forEach(function (item){
            array.push(item[key]);
        });
        return array;
    }
    return input;
};

// TODO : Refactor these method
BaseService.getMultiFormattedMap = function(input, cb) {
    //Ex output JSON object [{ "id" : "1" , "name" : "name1", "amount" : "2000", "percent" : "20"}] to multiple maps as {"1" : "name1"} & {"1" : "2000"} & {"1" : "20"}
    var feeTypesName = {};
    var feeTypesAmount = {};
    var feeTypesPercent = {};
    input.forEach(function (item){
        feeTypesName[item.id] = item.name;
        feeTypesAmount[item.id] = item.amount ? item.amount : 0;
        feeTypesPercent[item.id] = item.percent;
    });
    cb(feeTypesName, feeTypesAmount, feeTypesPercent);
};

BaseService.foramttedMap = function(input, cb) {
    //Ex output JSON object [{ "id" : "1" , "name" : "name1", "amount"}] to multiple maps as {"1" : "name1"} & {"1" : "2000"}
    var scholarShipName = {};
    var scholarShipAmount = {};
    input.forEach(function (item){
        scholarShipName[item.id] = item.name;
        scholarShipAmount[item.id] = item.amount;
    });
    cb(scholarShipName, scholarShipAmount);
};

// TODO : Refactor these method
BaseService.getMultiFormattedMap = function(input, cb) {
    //Ex output JSON object [{ "id" : "1" , "name" : "name1", "amount" : "2000", "percent" : "20"}] to multiple maps as {"1" : "name1"} & {"1" : "2000"} & {"1" : "20"}
    var feeTypesName = {};
    var feeTypesAmount = {};
    var feeTypesPercent = {};
    input.forEach(function (item){
        feeTypesName[item.id] = item.name;
        feeTypesAmount[item.id] = item.amount ? item.amount : 0;
        feeTypesPercent[item.id] = item.percent;
    });
    cb(feeTypesName, feeTypesAmount, feeTypesPercent);
};

// TODO : Refactor these method
BaseService.getFormattedMaps = function(name, amount, percent) {
    // it will unwrap map as {"1" : "name1"} & {"1" : "2000"} & {"1" : "20"} to [{ "id" : "1" , "name" : "name1", "amount" : "2000", "percent" : "20"}]
    var output = [];
    var id;
    for(var key in name) {
        id = key;
        if(amount != null && amount != '') {
            for (var key1 in amount) {
                if (id == key1) {
                    if(percent != null && percent != '') {
                        for (var key2 in percent) {
                            if (id == key2) {
                                output.push({'id': key, 'name': name[key], 'amount': amount[key1], 'percent': percent[key2]})
                            }
                        }
                    } else {
                        output.push({'id': key, 'name': name[key], 'amount': amount[key1], 'percent': ''})
                    }
                }
            }
        } else {
            output.push({'id': key, 'name': name[key], 'amount': '', 'percent': ''})
        }
    };
    return output;
};

BaseService.formattedMaps = function(name, amount) {
    var output = [];
    var id;
    for(var key in name) {
        id = key;
        if(amount != null && amount != '') {
            for (var key1 in amount) {
                if (id == key1) {
                    output.push({'id': key, 'name': name[key], 'amount': amount[key1]})
                }
            }
        } else {
            output.push({'id': key, 'name': name[key], 'amount': ''})
        }
    };
    return output;
};

BaseService.getFormattedDate = function(inputDate){
    var date = inputDate == "" ? null: inputDate;
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    var formattedDate = null;
    if(date != null) {
        formattedDate = new Date(date.replace(pattern,'$1-$2-$3'));
    }

    return formattedDate;
};

BaseService.executeBatch = function(queries, callback) {
    models.doBatch(queries, function(err, result) {
        callback(err, result);
    })
};

BaseService.validateResult = function(result) {
    result =  _(result).omitBy(_.isUndefined).omitBy(_.isNull).value();
    return result;
};

BaseService.emptyResponse = function() {
    var emptyResponse = {message: 'No Result Found'};
    return emptyResponse;
};

BaseService.haveAnyPermissions = function(req, permissions) {

    if (req.headers.userInfo.user_type === constant.STUDENT) {
        return true;
    }

    var userPermissions = req.headers.userInfo.permissions
    //userPermissions = userPermissions.length || ['manageAll', 'manage', 'view']
    var permissionSet = new Set(userPermissions);

    for ( var prop in permissions ) {
        if(permissionSet.has(permissions[prop])) {
            return true;
        }
    }

    return false;
};

BaseService.havePermissionsToEdit = function (req, permissions, createdBy) {
    var userName = req.headers.userInfo.user_name;

    var permissions = this.getPermissions(req, permissions);
    var manage = _.includes(permissions, constants.MANAGE);
    var manageAll = _.includes(permissions, constants.MANAGE_ALL);
    var check = false;

    if(manageAll) {
        check = true
    } else if(manage && createdBy == userName) {
        check = true
    }

    return check;
};

BaseService.getMedia = function(req) {
    try {
        var mediaName = [];
        var notify = req.body.notify;
        if(notify.sms) {
            mediaName.push('sms');
        };
        if(notify.email) {
            mediaName.push('email');
        };
        if(notify.push) {
            mediaName.push('push')
        };
    } catch (err) {
        return err;
    }
    return mediaName;
};

BaseService.filterSubEmpDetails = function(employees, subjects, val) {
    var empSubObjs = [];
    _.map(val.sub_emp_association, function (value, key) {
        var empSubObj = {};
        var employeeInfo = _.filter(employees, ['user_name', value]);
        var subjectInfo = _.filter(subjects, {'subjectId': models.uuidFromString(key)});

        empSubObj['employeeId'] = employeeInfo.length > 0 ? employeeInfo[0].user_name : '';
        empSubObj['employeeName'] = employeeInfo.length > 0 ? employeeInfo[0].first_name : '';
        empSubObj['employeeCode'] = employeeInfo.length > 0 ? employeeInfo[0].short_name : '';
        empSubObj['subjectId'] = subjectInfo.length > 0 ? subjectInfo[0].subjectId : null;
        empSubObj['subCode'] = subjectInfo.length > 0 ? subjectInfo[0].subCode : '';
        empSubObj['subName'] = subjectInfo.length > 0 ? subjectInfo[0].subName : '';
        empSubObj['color'] = subjectInfo.length > 0 ? subjectInfo[0].subColour : '';

        empSubObjs.push(empSubObj);
    });
    return empSubObjs;
};

BaseService.getRangeObj = function(objs, value) {
    var obj = {}
    objs.forEach(function (item) {
        if(value >= item.start_range && value <= item.end_range) {
            obj = item
        }
    })
    return obj;
};

BaseService.getCgpaObj = function (objs, value) {
    var obj = {}
    objs.forEach(function (item) {
        if(value == item.cgpa_value) {
            obj = item
        }
    })
    return obj;
};

BaseService.convertToTwoDecimal = function (value) {
    if(value != null && value != undefined && !(isNaN(value))) {
        var no = Number(value);
        var output = no % 1 == 0 ? no : no.toFixed(2)
        return Number(output);
    }
    return value;
};

exports.getMedia = function (req) {
    try {
        var mediaName = [];
        var notify = req.body.notify;
        if(notify.sms) {
            mediaName.push('sms');
        };
        if(notify.email) {
            mediaName.push('email');
        };
        if(notify.push) {
            mediaName.push('push')
        };
    } catch (err) {
        return err;
    }
    return mediaName;
};

BaseService.getExistingFiles = function(body){
    var files = [];
    _.forEach(body.attachments , function(value, key){
        if(value.id !== body.curentFile){
            files.push(value);
        }
    });
     return files;
}

module.exports = BaseService;
