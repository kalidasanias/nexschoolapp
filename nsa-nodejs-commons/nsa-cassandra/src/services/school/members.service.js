/**
 * Created by senthil on 22/09/17.
 */

var baseService = require('../common/base.service')
    , models = require('../../models/index')
    , _ = require('lodash')
    , nsaElasticSearch = require('@nsa/nsa-elasticsearch')
    , nsabb = require('@nsa/nsa-bodybuilder').builderutil
    , async = require('async');

var Members = function f(options) {
    var self = this;
};

Members.getSchoolDetails = function (req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };
    models.instance.SchoolDetails.findOne(findQuery, function (err, result) {
        callback(err, result);
    });
};

Members.getAllParentChaild = function(req, callback) {
    var array =[];
    models.instance.SchoolMembersXref.eachRow({}, {allow_filtering: true}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            callback(null, array);
        }
    });
};

Members.getAllMembers = function(req, callback) {
    var array =[];
    models.instance.SchoolMembers.eachRow({}, {allow_filtering: true}, function(n, row){
        array.push(row);
    }, function(err, result){
        if(err) throw err;
        if (result.nextPage) {
            result.nextPage();
        } else {
            callback(null, array);
        }
    });
};

Members.getSchoolChild = function(req, callback) {
    var findQuery = baseService.getFindQuery(req);
    models.instance.SchoolMembersXref.find(findQuery, {allow_filtering: true}, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};

Members.updateFatherName = function(req, data, callback) {

    var schoolMembersXref =[];
    try{
        var createObj = function(object, callback) {
            var findQuery ={}, updateValues ={};
            findQuery.member_user_name = object.member_user_name;
            findQuery.member_id = object.member_id;
            findQuery.user_id = object.user_id;
            updateValues.father_name = object.ContactInfo ? object.ContactInfo.father_name : null;
            updateValues.updated_date = new Date();
            updateValues.created_date = new Date();
            updateValues.created_by = "Admin";
            models.instance.SchoolMembersXref.update(findQuery, updateValues, function(err, result){
                if(err){
                    callback(err, null);
                }else {
                    callback(null, result);
                }
            });
        };

        var users = data.childs;
        var contactDetails = data.contactInfo;
        async.times(users.length, function (i, next) {
            var obj = users[i];
            var userContactInfo = _.find(contactDetails, function (o) {
                return o.user_name == obj.user_name;
            });
            obj.ContactInfo = userContactInfo;
             createObj(obj, function (err, data) {
                    next(err, data);
                });
        }, function (err, Objs) {
            callback(null, Objs)
        });

    } catch (err) {
        callback(err, null)
    }
};


Members.buildOnboardParentLoginObjs = function (req, data, callback) {
    var arrayObjs = [];
    try {
        var getOnboardParentLoginObj = function (value, callback) {
            var result = _.filter(data.AllStudent, function (o) {
                o.user_name = o.user_name ? o.user_name : o._source.user_name;
                return o.user_name == value.user_name;
            });
            if(!_.isEmpty(result)){
                var bulkDoc = {
                    index:{
                        "_index": global.config.elasticSearch.index.userIndex,
                        "_type": global.config.elasticSearch.index.parentType,
                        "_id": value.member_id.toString()
                    }
                };
                var searchParams = nsabb.getParentById(value.member_id);
                nsaElasticSearch.search.getUserById(searchParams, function (err, response, status) {
                    response = (status === 404) ? null : response.found ? response._source : null;
                    var arrayResult = _.find(arrayObjs, {'id': value.member_id.toString(), 'user_name': value.member_user_name, 'tenant_id': value.tenant_id.toString()});
                    var Object = response ? response : arrayResult ? arrayResult : null;
                    result = result[0]._source ? result[0]._source : result[0];
                    if(Object){
                        var isChild = _.find(Object.childs, {'user_name': value.user_name});
                        if(!isChild){
                            var child = getChildObj(value, result);
                            Object.childs.push(child);
                        }
                        var currentObj = [];
                        arrayObjs.push(bulkDoc);
                        arrayObjs.push(Object);
                        currentObj.push(bulkDoc);
                        currentObj.push(Object);
                        callback(null, currentObj);
                    }else {
                        var doc = {};
                        doc['id'] = value.member_id.toString();
                        doc['tenant_id'] = value.tenant_id.toString();
                        doc['father_name'] = value.father_name || null;
                        doc['user_name'] = value.member_user_name;
                        doc['childs'] =  [getChildObj(value, result)];
                        doc['updated_date'] = new Date();
                        doc['updated_by'] = "Admin";
                        doc['created_by'] = new Date();
                        doc['created_date'] = new Date();
                        var currentObj = [];
                        currentObj.push(bulkDoc);
                        currentObj.push(doc);
                        arrayObjs.push(bulkDoc);
                        arrayObjs.push(doc);
                        callback(null, currentObj);
                    }
                })

            }else {
                callback(null, null);
            }
        };

        async.times(data.Logins.length, function (i, next) {
            var obj = data.Logins[i];
            getOnboardParentLoginObj(obj, function (err, data) {
                next(err, data);
            });
        }, function (err, objs) {
            callback(err, arrayObjs);
        });
    } catch (err) {
        callback(err, null);
    }
};

Members.buildParentLoginObj = function (req, data, callback) {
    var arrayObjs = [];
    try {
        var getParentLoginObj = function (value, callback) {
            var result = _.filter(data.AllStudent, function (o) {
                o.user_name = o.user_name ? o.user_name : o._source.user_name;
                return o.user_name == value.user_name;
            });
            if (!_.isEmpty(result)) {
                var bulkDoc = {
                    index: {
                        "_index": global.config.elasticSearch.index.userIndex,
                        "_type": global.config.elasticSearch.index.parentType,
                        "_id": value.member_id.toString()
                    }
                };

                var Object = _.find(arrayObjs, {
                    'id': value.member_id.toString(),
                    'user_name': value.member_user_name,
                    'tenant_id': value.tenant_id.toString()
                });
                result = result[0]._source ? result[0]._source : result[0];
                if (Object) {
                    var isChild = _.find(Object.childs, {'user_name': value.user_name});
                    if (!isChild) {
                        var child = getChildObj(value, result);
                        Object.childs.push(child);
                    }
                    var currentObj = [];
                    arrayObjs.push(bulkDoc);
                    arrayObjs.push(Object);
                    currentObj.push(bulkDoc);
                    currentObj.push(Object);
                    callback(null, currentObj);
                } else {
                    var doc = {};
                    doc['id'] = value.member_id.toString();
                    doc['tenant_id'] = value.tenant_id.toString();
                    doc['father_name'] = value.father_name || null;
                    doc['user_name'] = value.member_user_name;
                    doc['childs'] = [getChildObj(value, result)];
                    doc['updated_date'] = new Date();
                    doc['updated_by'] = "Admin";
                    doc['created_by'] = new Date();
                    doc['created_date'] = new Date();
                    var currentObj = [];
                    currentObj.push(bulkDoc);
                    currentObj.push(doc);
                    arrayObjs.push(bulkDoc);
                    arrayObjs.push(doc);
                    callback(null, currentObj);
                }
            } else {
                callback(null, null);
            }
        };


        async.times(data.Logins.length, function (i, next) {
            var obj = data.Logins[i];
            getParentLoginObj(obj, function (err, data) {
                next(err, data);
            });
        }, function (err, objs) {
            callback(err, arrayObjs);
        });
    } catch (err) {
        callback(err, null);
    }
};

function getChildObj(value, result) {
    var classInfo = result.classes ? result.classes[0] : null;
    var child = {};
    child.member_user_name = value.member_user_name;
    child.user_name = value.user_name;
    child.first_name = value.first_name;
    child.admission_no = result.userCode;
    child.user_id = value.user_id;
    child.class_id = classInfo ? classInfo.class_id : null;
    child.section_id = classInfo ? classInfo.section_id : null;
    child.class_name = classInfo ? classInfo.class_name : null;
    child.section_name = classInfo ? classInfo.section_name : null;
    child.tenant_id = value.tenant_id.toString();
    child.school_id = value.school_id.toString();
    child.school_name = result.school_name;
    child.active = result.active;

    return child;
}

function getStudentInformation(user, cb) {
    var searchParams = nsabb.getStudentByName(user.user_name);
    nsaElasticSearch.search.getUserById(searchParams, function (err, data, status) {
        if (err) {
            cb(err, null)
        } else {
            cb(null, data._source)
        }
    })
}

Members.UpdateNumberInParentLogin = function (req, data, callback) {
    try {
        var body = req.body, array = data.batchObj;
        var headers = baseService.getHeaders(req);
        body.primary_phone = body.NewNumber;
        Members.findNumberInSchoolMember(req, data, function (err, data) {
            var tenantResult = data.parentLogin;
            if (tenantResult) {
                var deleteParentLoigns = models.instance.SchoolParentLogins.delete({tenant_id: models.timeuuidFromString(headers.tenant_id),user_name: body.user_name}, {return_query: true});
                array.push(deleteParentLoigns);
                var deleteMemberQuery = models.instance.SchoolMembers.delete({id: models.uuidFromString(body.id)}, {return_query: true});
                array.push(deleteMemberQuery);
            } else {
                var deleteParentLoigns = models.instance.SchoolParentLogins.delete({tenant_id: models.timeuuidFromString(headers.tenant_id),user_name: body.user_name}, {return_query: true});
                  array.push(deleteParentLoigns);
                var parentLoigns = new models.instance.SchoolParentLogins({
                    id: models.uuidFromString(body.id),
                    user_name: body.primary_phone,
                    tenant_id: models.timeuuidFromString(headers.tenant_id)                });
                array.push(parentLoigns.save({return_query: true}));
                var updateQuery = models.instance.SchoolMembers.update({id: models.uuidFromString(body.id)}, {user_name: body.NewNumber}, {return_query: true});
                array.push(updateQuery);
            }
            _.forEach(body.childs, function (value, key) {
                var findQuery = {};
                findQuery.member_user_name = value.member_user_name;
                findQuery.member_id = models.uuidFromString(body.id);
                findQuery.user_id = models.uuidFromString(value.user_id);
                var deleteQuery = (new models.instance.SchoolMembersXref(findQuery)).delete({return_query: true});
                array.push(deleteQuery);
                var objXref = new models.instance.SchoolMembersXref({
                    id: models.uuid(),
                    member_id: tenantResult ? tenantResult.id : models.uuidFromString(body.id),
                    tenant_id: models.timeuuidFromString(headers.tenant_id),
                    school_id: models.uuidFromString(value.school_id),
                    school_name: value.school_name,
                    user_name: value.user_name,
                    user_id: models.uuidFromString(value.user_id),
                    member_user_name: body.NewNumber,
                    first_name: value.first_name,
                    father_name: value.father_name,
                    updated_date: new Date(),
                    updated_by: "Admin",
                    created_date: new Date(),
                    created_by: "Admin"
                });
                objXref = objXref.save({return_query: true});
                array.push(objXref);
                if (body.childs.length - 1 === key) {
                    data.batchObj = array;
                    callback(null, data);
                }
            })
        });
    } catch (err) {
        callback(err, null)
    }
};

Members.UpdateNumberInEsParentLogin = function (req, data, callback) {
    try {
        var body = req.body;
        if(data.parentLogin){
            var bulkParams =[];
            bulkParams.push(getdeleteBulkDoc(body.id));
            var searchParams = nsabb.getParentById(data.parentLogin.id);
            nsaElasticSearch.search.getUserById(searchParams, function (err, response, status) {
                response = response._source;
                _.forEach(body.childs, function(value, key){
                    value.member_user_name = body.NewNumber;
                    response.childs.push(value)
                });
                bulkParams.push(nsabb.updateParentDoc(response));
                bulkParams.push(response);
                body.id = data.parentLogin.id;
                nsaElasticSearch.index.bulkDoc({body: bulkParams}, function (err, result) {
                    callback(err, result);
                });
            })
        }else {
            var updateParams = nsabb.updateParentDocQuery(req);
            nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
                callback(null, result);
            })
        }
    } catch (err) {
        callback(err, null)
    }
};

Members.UpdateNumberInStudentESObj = function (req, data, callback) {
    try {
        var body = req.body;
        var bulkParams = constructStudentBulk(body, data);
        nsaElasticSearch.index.bulkDoc({body: bulkParams}, function (err, result) {
            callback(err, result);
        });

    } catch (err) {
        callback(err, null)
    }
};

function constructStudentBulk(body, data) {
    var array = [];
    _.forEach(body.childs, function (value, key) {
        var user = _.find(data.cYearUsers, { 'userName': value.user_name});
        var _id = user ? user._id : value.user_name
        var bulkDoc = {
            update: {
                "_index": global.config.elasticSearch.index.userIndex,
                "_type": global.config.elasticSearch.index.studentType,
                "_id": _id
            }
        };
        array.push(bulkDoc);
        array.push({"doc": {"primary_phone": body.NewNumber}})
    });

    return array;
};

Members.updateWardInParentLogin = function (req, data, callback) {
    try {
        var body = req.body, array = data.batchObj, headers = baseService.getHeaders(req);
        var findQuery = baseService.getFindQuery(req);
        findQuery.member_user_name = body.NewWard.primaryPhone;
        models.instance.SchoolMembersXref.find(findQuery, {allow_filtering: true}, function (err, result) {
            if (result.length > 1) {
                var currenUser = _.filter(result, {'user_name': body.NewWard.userName});
                var results = JSON.parse(JSON.stringify(currenUser));
                var findObj = constructFindQuery(results[0]);
                var deleteQuery = (new models.instance.SchoolMembersXref(findObj)).delete({return_query: true});
                array.push(deleteQuery);
                var objXref = getXrefObj(req, body);
                array.push(objXref);
                data.esParentId = results[0].member_id;
                data.batchObj = array;
                callback(null, data);
            } else {
                var deleteLoginsQuery = models.instance.SchoolParentLogins.delete({tenant_id: models.timeuuidFromString(headers.tenant_id), user_name: body.NewWard.primaryPhone}, {return_query: true});
                array.push(deleteLoginsQuery);
                var deleteMembersQuery = models.instance.SchoolMembers.delete({id: models.uuidFromString(body.NewWard.id)}, {return_query: true});
                array.push(deleteMembersQuery);
                var results = JSON.parse(JSON.stringify(result));
                var childFindObj = constructFindQuery(results[0]);
                var deleteMembersXrefQuery = (new models.instance.SchoolMembersXref(childFindObj)).delete({return_query: true});
                array.push(deleteMembersXrefQuery);
                var inserMemberXref = getXrefObj(req, body);
                array.push(inserMemberXref);
                data.esParentId = results[0].member_id;
                data.batchObj = array;
                callback(null, data);
            }
        })
    } catch (err) {
        callback(err, null)
    }
};

function getXrefObj(req, body) {
    var headers = baseService.getHeaders(req);
    var objXref = new models.instance.SchoolMembersXref({
        id: models.uuid(),
        member_id: models.uuidFromString(body.id),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        school_name: headers.school_name,
        user_name: body.NewWard.userName,
        user_id: models.uuidFromString(body.NewWard.id),
        member_user_name: body.user_name,
        first_name: body.NewWard.firstName,
        father_name: body.father_name,
        updated_date: new Date(),
        updated_by: "Admin",
        created_date: new Date(),
        created_by: "Admin"
    });
    objXref = objXref.save({return_query: true});

    return objXref;
}

function constructFindQuery(result) {
    var childFindObj = {};
    childFindObj.member_user_name = result.member_user_name;
    childFindObj.member_id = models.uuidFromString(result.member_id);
    childFindObj.user_id = models.uuidFromString(result.user_id);
    return childFindObj;
};

Members.UpdateWardInEsParentLogin = function (req, data, callback) {
    try {
        var body = req.body, array = [];
        var headers = baseService.getHeaders(req);
        var searchParams = nsabb.getParentById(data.esParentId);
        nsaElasticSearch.search.getUserById(searchParams, function (err, response, status) {
            response = response._source;
            if (response.childs.length > 1) {
                var childs = [];
                _.forEach(response.childs, function (value, key) {
                    if (value.user_name != body.NewWard.userName) {
                        childs.push(value)
                    }
                });
                response.childs = childs;
                var bulkDoc = getUpdateBulkDoc(response.id);
                var documnet = {"doc": response};
                array.push(bulkDoc);
                array.push(documnet);
            } else if (response.childs.length == 1) {
                var deletbulkDoc = getdeleteBulkDoc(data.esParentId);
                array.push(deletbulkDoc);
            }
            var child = constructChildObj(req, body);
            var childs = body.childs;
            childs.push(child);
            body.childs = childs;
            var doc = {};
            doc['id'] = body.id.toString();
            doc['childs'] = childs;
            doc['updated_date'] = new Date();
            doc['updated_by'] = headers.user_name;
            doc['created_by'] = body.created_by;
            doc['created_date'] = body.created_date;
            var createBulkDoc = getUpdateBulkDoc(doc.id);
            array.push(createBulkDoc);
            var documnet = {"doc": doc};
            array.push(documnet);
            nsaElasticSearch.index.bulkDoc({body: array}, function (err, result) {
                callback(err, result);
            });
        })
    } catch (err) {
        callback(err, null)
    }
};

function constructChildObj(req, body) {
    var headers = baseService.getHeaders(req);
    var classInfo = body.NewWard.classes[0];
    var child = {};
    child.member_user_name = body.user_name;
    child.user_name = body.NewWard.userName;
    child.first_name = body.NewWard.firstName;
    child.admission_no = body.NewWard.userCode;
    child.user_id = body.NewWard.id;
    child.class_id = classInfo.class_id;
    child.section_id = classInfo.section_id;
    child.class_name = classInfo.class_name;
    child.section_name = classInfo.section_name;
    child.tenant_id = headers.tenant_id;
    child.school_id = headers.school_id;
    child.school_name = headers.school_name;
    child.active = true

    return child;
}

function getdeleteBulkDoc(id) {
    var bulkDoc = {
        delete: {
            "_index": global.config.elasticSearch.index.userIndex,
            "_type": global.config.elasticSearch.index.parentType,
            "_id": id.toString()
        }
    };
    return bulkDoc;
};
Members.getdeleteBulkDoc = getdeleteBulkDoc;

function getUpdateBulkDoc(id){
    var bulkDoc = {
        update:{
            "_index": global.config.elasticSearch.index.userIndex,
            "_type": global.config.elasticSearch.index.parentType,
            "_id": id.toString()
        }
    };
    return bulkDoc;
};
Members.getUpdateBulkDoc = getUpdateBulkDoc;

Members.UpdateWardInStudentESObj = function(req, data, callback){
    try {
        var body = req.body;
        var updateParams = {
            index: global.config.elasticSearch.index.userIndex,
            type: global.config.elasticSearch.index.studentType,
            id: body.NewWard._id,
            body: {
                doc: {
                    primary_phone: body.user_name
                }
            }
        };
        nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
            callback(err, result);
        })
    }catch (err){
        callback(err, null)
    }
};

Members.findNumberInSchoolMember = function(req, data, cb){
    try{
        var body = req.body,  headers = baseService.getHeaders(req);
        models.instance.SchoolMembers.findOne({user_name: body.primary_phone, tenant_id: models.timeuuidFromString(headers.tenant_id)}, {allow_filtering: true}, function (err, result) {
            data.parentLogin = result;
            cb(err, data);
        })
    }catch (err){
        cb(err, null);
    }
}

Members.getParentLoginDetials = function (req, data, callback) {
    var findQuery = baseService.getFindQuery(req);
    findQuery.user_name = req.params.id;
    findQuery.member_user_name = req.body.primaryPhone;
    models.instance.SchoolMembersXref.findOne(findQuery, {allow_filtering: true}, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            data.parentLogin = result;
            callback(null, data);
        }
    });
};

Members.getParentLoginsEsDetials = function(req, data, callback){
    try {
        var logins = data.parentLogin;
        var searchParams = nsabb.getParentById(logins.member_id);
        nsaElasticSearch.search.getUserById(searchParams, function (err, response, status) {
            response = response._source;
            data.esParentLogin = response;
            callback(null, data)
        });
    }catch (err){
        callback(err, null)
    }
}

Members.updateEsParentLoignDoc = function (req, data, callback) {
    try {
        var esObj = data.esParentLogin;
        var childs  = _.forEach(esObj.childs, function(value){if(value.user_name == req.params.id){value.active = req.body.active;} return value;})
        var updateParams = {index: global.config.elasticSearch.index.userIndex, type: global.config.elasticSearch.index.parentType, id: esObj.id.toString(),
            body: {doc: {childs: childs}}
        };
        nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
            if(err){
                callback(err, null)
            }else {
                callback(null, data);
            }
        })
    } catch (err) {
        callback(err, null)
    }
};


Members.getTenantIdChilds = function(req, data, callback){
    try {
        var body = req.body;
        var searchParams = nsabb.getParentById(body.id);
        nsaElasticSearch.search.getUserById(searchParams, function (err, response, status) {
            response = response._source;
            req.body.childs = response.childs;
            callback(null, data)
        });
    }catch (err){
        callback(err, null)
    }
}

Members.insertLogin = function (req, data, callback) {
    try {
        var insertLoginObj = function (object, callback) {
            if(object.tenant_id && object.user_name){
                var insertObj = new models.instance.SchoolParentLogins({
                    tenant_id: object.tenant_id,
                    user_name: object.user_name,
                    id: object.id
                });
                insertObj.save(function (err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, result);
                    }
                });
            }else {
                callback(null, null);
            }
        };

        async.times(data.Members.length, function (i, next) {
            var obj = data.Members[i];
             console.info('i',i);
            insertLoginObj(obj, function (err, data) {
                next(err, data);
            });
        }, function (err, objs) {
            callback(err, objs);
        });
    } catch (err) {
        callback(err, null)
    }
};

Members.getCurrentYearESIds = function(req, data, callback){
    try {
        var body = req.body;
        var users = _.map(body.childs, function(value){return value.user_name;});
        var searchParams = nsabb.getUsersByAcademic(req, users);
        nsaElasticSearch.search.getUsersByQuery(searchParams, function (err, response, status) {
            data.cYearUsers = response;
            callback(null, data)
        });
    }catch (err){
        callback(err, null)
    }
}

module.exports = Members;