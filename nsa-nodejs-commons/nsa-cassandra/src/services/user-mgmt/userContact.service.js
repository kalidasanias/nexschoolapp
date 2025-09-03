/**
 * Created by bharatkumarr on 20/03/17.
 */

var baseService = require('../common/base.service')
    , models = require('../../models')
    , _ = require('lodash')
    , BaseError = require('@nsa/nsa-commons').BaseError
    , message = require('@nsa/nsa-commons').messages
    .responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , usermgmtConverter = require('../../converters/usermgmt.converter')
    , passwordHash = require('password-hash')
    , dateService = require('../../utils/date.service')
    , constant = require('@nsa/nsa-commons').constants
    , nsaElasticSearch = require('@nsa/nsa-elasticsearch')
    , nsabb = require('@nsa/nsa-bodybuilder').builderutil
    , logger = require('../../../config/logger');

var UserContactInfo = function f(options) {
    // var self = this;
};


UserContactInfo.getStudent = function(req, data, callback) {
    var findQuery = {
        user_name: req.params.id
    };

    models.instance.UserContactInfo.findOne(findQuery, function (err, result) {
        var formattedResult = baseService.validateResult(result);

        data.user['father_name'] = formattedResult['father_name'];
        data.user['father_qualification'] = formattedResult['father_qualification'];
        data.user['father_occupation'] = formattedResult['father_occupation'];
        data.user['father_email'] = formattedResult['father_email'];
        data.user['father_phone'] = formattedResult['father_phone'];
        data.user['father_income'] = formattedResult['father_income'];

        data.user['mother_name'] = formattedResult['mother_name'];
        data.user['mother_qualification'] = formattedResult['mother_qualification'];
        data.user['mother_occupation'] = formattedResult['mother_occupation'];
        data.user['mother_email'] = formattedResult['mother_email'];
        data.user['mother_phone'] = formattedResult['mother_phone'];
        data.user['mother_income'] = formattedResult['mother_income'];

        data.user['street_address1'] = formattedResult['street_address1'];
        data.user['street_address2'] = formattedResult['street_address2'];
        data.user['city'] = formattedResult['city'];
        data.user['state'] = formattedResult['state'];
        data.user['pincode'] = formattedResult['pincode'];

        data.user['country'] = formattedResult['country'];
        data.user['present_street_address1'] = formattedResult['present_street_address1'];
        data.user['present_street_address2'] = formattedResult['present_street_address2'];
        data.user['present_city'] = formattedResult['present_city'];
        data.user['present_state'] = formattedResult['present_state'];
        data.user['present_pincode'] = formattedResult['present_pincode'];

        data.user['additional_contact1_name'] = formattedResult['additional_contact1_name'];
        data.user['additional_contact1_relation'] = formattedResult['additional_contact1_relation'];
        data.user['additional_contact1_address'] = formattedResult['additional_contact1_address'];
        data.user['additional_contact1_phone'] = formattedResult['additional_contact1_phone'];

        data.user['additional_contact2_name'] = formattedResult['additional_contact2_name'];
        data.user['additional_contact2_relation'] = formattedResult['additional_contact2_relation'];
        data.user['additional_contact2_address'] = formattedResult['additional_contact2_address'];
        data.user['additional_contact2_phone'] = formattedResult['additional_contact2_phone'];


        callback(err, data);
    });
};


/*
UserContactInfo.deleteStudent = function(req, data, callback) {
    var array = [];
    fetchUserContactInfo(req, models.instance.UserContactInfo, req.params.id, function(err, result) {
        if (result != null) {
            var queryObj = getQuery(req, data);
            var deleteQuery = models.instance.UserContactInfo.delete(queryObj, {return_query: true});
            array.push(deleteQuery);
            data.batchObj = array;
            callback(null, data);
        }
    });
};
*/

UserContactInfo.updateStudent = function(req, data, callback) {
    try {
        var array = data.batchObj, userContactObj = getStudentContactObj(req),
            queryObject = getQuery(req, data);
        var updateQuery = models.instance.UserContactInfo.update(queryObject, userContactObj, {return_query: true});
        array.push(updateQuery);
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

UserContactInfo.saveStudent = function(req, data, callback) {
    try {
        var array = data.batchObj, userContactObj = getStudentContactObj(req)
        userContactObj.user_name = data.user_name;
        var UserContact = new models.instance.UserContactInfo(userContactObj);
        var UserContactQuery = UserContact.save({return_query: true});
        array.push(UserContactQuery);
        data.batchObj = array;
        data.userContactObj = userContactObj;
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

function getStudentContactObj(req) {
    try {
        var userContactObj = {};
        userContactObj.father_name = req.body.father_name || null;
        userContactObj.father_qualification = req.body.father_qualification || null;
        userContactObj.father_occupation = req.body.father_occupation || null;
        userContactObj.father_email = req.body.father_email || null;
        userContactObj.father_phone = req.body.father_phone || null;
        userContactObj.father_income = req.body.father_income || null;

        userContactObj.mother_name = req.body.mother_name || null;
        userContactObj.mother_qualification = req.body.mother_qualification || null;
        userContactObj.mother_occupation = req.body.mother_occupation || null;
        userContactObj.mother_email = req.body.mother_email || null;
        userContactObj.mother_phone = req.body.mother_phone || null;
        userContactObj.mother_income = req.body.mother_income || null;

        userContactObj.additional_contact1_name = req.body.additional_contact1_name || null;
        userContactObj.additional_contact1_relation = req.body.additional_contact1_relation;
        userContactObj.additional_contact1_address = req.body.additional_contact1_address;
        userContactObj.additional_contact1_phone = req.body.additional_contact1_phone || null;

        userContactObj.additional_contact2_name = req.body.additional_contact2_name || null;
        userContactObj.additional_contact2_relation = req.body.additional_contact2_relation;
        userContactObj.additional_contact2_address = req.body.additional_contact2_address;
        userContactObj.additional_contact2_phone = req.body.additional_contact2_phone || null;
        userContactObj.city = req.body.city || null;
        userContactObj.pincode = req.body.pincode || null;
        userContactObj.state = req.body.state || null;
        userContactObj.street_address1 = req.body.street_address1 || null;
        userContactObj.street_address2 = req.body.street_address2 || null;
        userContactObj.country = req.body.country || null;

        userContactObj.present_city = req.body.present_city || null;
        userContactObj.present_state = req.body.present_state || null;
        userContactObj.present_pincode = req.body.present_pincode || null;
        userContactObj.present_street_address1 = req.body.present_street_address1 || null;
        userContactObj.present_street_address2 = req.body.present_street_address2 || null;

    }catch (err){
        logger.debug(err);
		return err;
    }
    return userContactObj;
}

UserContactInfo.UpdateNumberInStudentContact = function(req, data, callback) {
    try{
        var body = req.body, array = data.batchObj;
        _.forEach(body.childs, function(value, key){
            var updateValues ={};
            var contactInfo = _.find(data.userContacts, function(o) { return o.user_name == value.user_name});
            if(contactInfo){
                updateValues = (contactInfo.father_phone == body.user_name) ? {father_phone: body.NewNumber, additional_contact1_phone: body.NewNumber} : {mother_phone: body.NewNumber, additional_contact2_phone: body.NewNumber};
            }else {
                updateValues = {father_phone: body.NewNumber, additional_contact1_phone: body.NewNumber};
            }
            var updateQuery = models.instance.UserContactInfo.update({user_name: value.user_name}, updateValues, {return_query: true});
            array.push(updateQuery);
            if(body.childs.length -1 === key){
                data.batchObj = array;
                callback(null, data);
            }
        })
    }catch (err){
        callback(err, null)
    }
};

UserContactInfo.getUserContactInformation = function(req, data, callback){
    var headers = baseService.getHeaders(req);
    models.instance.UserContactInfo.findOne({user_name: req.body.NewWard.userName}, {allow_filtering: true}, function(err, result){
        data.userContact = result;
        callback(err, data);
    })
};

UserContactInfo.updateWardInStudentContact = function(req,data, callback){
    try{
        var body = req.body, array = data.batchObj, updateValues ={};
        var userContact = data.userContact;
        if(userContact && userContact.father_phone !== body.NewWard.primaryPhone){
            updateValues.mother_phone = body.user_name;
            updateValues.additional_contact2_phone = body.user_name;
            updateValues.mother_name = userContact.mother_name;
        }else {
            updateValues.father_phone = body.user_name;
            updateValues.additional_contact1_phone = body.user_name;
            updateValues.father_name = body.father_name ? body.father_name : null;
        };
        var updateQuery = models.instance.UserContactInfo.update({user_name: body.NewWard.userName}, updateValues, {return_query: true});
        array.push(updateQuery);
        data.batchObj = array;
        callback(null, data);
    }catch (err){
        callback(err, null)
    }
}

function throwUserErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.USER_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwUserErr = throwUserErr;

function getQuery(req, data) {
    var findQuery = {};
    findQuery.user_name = req.params.id;
    return findQuery;
};

UserContactInfo.getAllContactinfomation = function(req, callback){
    var array =[];
    models.instance.UserContactInfo.eachRow({}, {allow_filtering: true}, function(n, row){
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

UserContactInfo.saveParentLoginForStudent = function (req, data, callback) {
    try {
        var body = req.body, array = data.batchObj, schoolDetails = data.schoolInfo, headers = baseService.getHeaders(req);
        if (data.parentLogin) {
            var exitsingLogin = data.parentLogin;
            var insertXref = getMemberXrefQuery(req, data, exitsingLogin.id);
            array.push(insertXref.save({return_query: true}));
            var searchParams = nsabb.getParentById(exitsingLogin.id);
            nsaElasticSearch.search.getUserById(searchParams, function (err, esData, status) {
                if (err) {
                    callback(err, null)
                } else {
                    esData = esData._source;
                    var child = getChildObj(req, body, data);
                    esData.childs.push(child);
                    var updateParams = nsabb.updateParentParams(esData);
                    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
                        if (err) {
                            callback(err, null)
                        } else {
                            data.batchObj = array;
                            callback(null, data);
                        }
                    })
                }
            })
        } else {
            var newId = models.uuid();
            var password = schoolDetails.password || '1234';
            var insertMemberQuery = new models.instance.SchoolMembers({
                id: newId,
                user_name: body.primary_phone,
                first_name: body.first_name,
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                password: passwordHash.generate(password),
                user_type: "Parent",
                created_date: new Date(),
                updated_date: new Date(),
            });
            var parentLoigns = new models.instance.SchoolParentLogins({
                id: newId,
                user_name: body.primary_phone,
                tenant_id: models.timeuuidFromString(headers.tenant_id)
            });
            array.push(parentLoigns.save({return_query: true}));
            insertMemberQuery = insertMemberQuery.save({return_query: true});
            array.push(insertMemberQuery);
            var insertobjXref = getMemberXrefQuery(req, data, newId);
            array.push(insertobjXref.save({return_query: true}));
            createParentLoginInEs(req, data, newId, function (err, result) {
                if (err) {
                    callback(err, null)
                } else {
                    data.batchObj = array;
                    callback(null, data);
                }
            })
        }
    } catch (err) {
        callback(err, null)
    }
};

function getMemberXrefQuery(req, data, id){
    var body = req.body, schoolDetails = data.schoolInfo, headers = baseService.getHeaders(req);
   var memberXref = new models.instance.SchoolMembersXref({
        id: models.uuid(),
        member_id: id,
        tenant_id: models.timeuuidFromString(schoolDetails.tenant_id),
        school_id: models.uuidFromString(schoolDetails.school_id),
        school_name: schoolDetails.school_name,
        user_name: data.user_name,
        father_name: body.father_name || body.mother_name || null,
        user_id: data.user_id,
        member_user_name: body.primary_phone,
        first_name: body.first_name,
        updated_date: new Date(),
        updated_by: headers.user_id,
        updated_first_name: headers.user_name
    });

    return memberXref;
}

function createParentLoginInEs(req, data, id, cb) {
    try {
        var body = req.body, headers = baseService.getHeaders(req);
        var doc = {};
        doc['id'] = id.toString();
        doc['tenant_id'] = headers.tenant_id;
        doc['father_name'] = body.father_name || body.mother_name || null;
        doc['user_name'] = body.primary_phone;
        doc['childs'] = [getChildObj(req, body, data)];
        doc['updated_date'] = new Date();
        doc['updated_by'] = headers.user_name;
        doc['created_by'] = headers.user_id;
        doc['created_date'] = new Date();
        var updateParams = nsabb.updateParentParams(doc);
        nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
            cb(err, result);
        })
    } catch (err) {
        cb(err, null)
    }
}

function getChildObj(req, value, data) {
    var child = {}, headers = baseService.getHeaders(req);
    child.member_user_name = value.primary_phone;
    child.user_name = data.user_name;
    child.first_name = value.first_name;
    child.admission_no = value.user_code;
    child.user_id = data.user_id;
    child.class_id = value.class_id;
    child.section_id = value.section_id;
    child.class_name = value.class_name;
    child.section_name = value.section_name;
    child.active = true;
    child.tenant_id = headers.tenant_id.toString();
    child.school_id = headers.school_id.toString();
    child.school_name = headers.school_name;
    return child;
}


exports.getQuery = getQuery;

module.exports = UserContactInfo;
