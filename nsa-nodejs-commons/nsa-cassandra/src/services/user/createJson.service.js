/**
 * Created by Karthik on 30-01-2017.
 */
var express = require('express')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , models = require('../../models')
    , async = require('async')
    , _ = require('lodash')
    , fileStream = require('fs')
    , nsaCassandra = require('@nsa/nsa-cassandra')
    , logger = require('../../../config/logger');

var UserJson = function f(options) {
    var self = this;
};

UserJson.buildStudentObj = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var schoolId = models.uuidFromString(headers.school_id);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var userResult = data.user;
    if(!(_.isEmpty(userResult))){
        var jsonObj = {};
        var name = 'users';
        jsonObj[name] = [];
        var jsonData = "";
        _.forEach(userResult, function(userValue, userKey) {
            if(userValue.user_type == 'Student') {
                var userClasifyRes = filterUserClassifyDetails(data.userClassification, userValue);
                var userContactInfo = filterUserClassifyDetails(data.userContactInfo, userValue);
                jsonData = jsonData + (JSON.stringify({ index: {"_index": global.config.elasticSearch.index.userIndex,
                        "_type": global.config.elasticSearch.index.studentType, "_id": userValue.user_name }}) + "\n" +
                    JSON.stringify({id: userValue.id, user_name: userValue.user_name, user_code: userValue.user_code, short_name: userValue.short_name,
                        date_of_joining: userValue.date_of_joining, tenant_id: userValue.tenant_id, school_id: userValue.school_id,
                        school_name: userValue.school_name, academic_year: userClasifyRes[0].academic_year, user_type: userValue.user_type,
                        name: userValue.first_name, first_name: userValue.first_name, primary_phone: userValue.primary_phone, email: userValue.email,
                        active: userValue.active, is_hostel: userValue.is_hostel, last_name : userValue.last_name, middle_name : userValue.middle_name, gender : userValue.gender, date_of_birth : userValue['date_of_birth'], place_of_birth : userValue['place_of_birth'], nationality : userValue.nationality, community : userValue.community, mother_tongue : userValue.mother_tongue, profile_picture : userValue.profile_picture, medical_info : userValue.medical_info, blood_group : userValue.blood_group, height : userValue.height, weight : userValue.weight}));

                var roless = userValue.roles != null ? userValue.roles: null;
                var rolesObj = {};
                var rolesArr = [];
                if (roless != null) {
                    for(var key in roless){
                        rolesArr.push({role_id:key, role_name: roless[key]})
                    };
                } else {
                    rolesArr.push({role_id:null, role_name: null})
                }
                rolesObj.roles = rolesArr;

                var deviceToken = userValue.device_token != null ? userValue.device_token : null ;
                var deviceTokenObj = {};
                var deviceTokenArr = [];
                if (deviceToken != null) {
                    for(var key in deviceToken){
                        deviceTokenArr.push({registration_id:key, endpoint_arn: deviceToken[key]})
                    };
                } else {
                    deviceTokenArr.push({registration_id: null, endpoint_arn: null})
                }
                deviceTokenObj.device_token = deviceTokenArr;

                var classesObj = {};
                var classesArr = [];
                if(userClasifyRes.length > 0) {
                    var classInfo = filterClassDetails(data.classes, userClasifyRes[0].class_id);
                    var sectionInfo = filterSectionDetails(data.sections, userClasifyRes[0].section_id);
                    if(classInfo.length > 0 && sectionInfo.length > 0) {
                        var classData = { class_id: classInfo[0] != null ? classInfo[0].class_id : null ,
                            class_name: classInfo[0] != null ? classInfo[0].class_name : null,
                            class_code: classInfo[0] != null ? classInfo[0].class_code : null,
                            section_id: sectionInfo[0] != null ? sectionInfo[0].sectionId : null,
                            section_name: sectionInfo[0] != null ? sectionInfo[0].sectionName : null,
                            section_code: sectionInfo[0] != null ? sectionInfo[0].sectionCode : null};
                        classesArr.push(classData);
                    } else {
                        classesArr.push({class_id : null, class_name : null, class_code: null, section_id : null, section_name : null, section_code : null})
                    }

                    classesObj.classes =  classesArr;
                }

                var languagesArr = [];
                var languagesObj = {};
                var userParentObj = {};
                var userAddressObj = {};
                var userAContactObj = {};
                if(userClasifyRes.length > 0) {
                    _.forEach(userClasifyRes[0].languages, function(langValue, langKey){
                        var langInfo = filterLangDetails(data.languages, langValue);
                        if(langInfo.length > 0) {
                            var langData = {language_id : langInfo[0] != null ? langInfo[0].languageId : null ,
                                language_name: langInfo[0] != null ? langInfo[0].languageName : null ,
                                language_type: langInfo[0] != null ? langKey.toString() : null};
                            languagesArr.push(langData);
                        } else {
                            languagesArr.push({language_id: null, language_name: null, language_type: null})
                        }
                    });
                    languagesObj.languages = languagesArr;
                }

                if(userContactInfo.length > 0) {
                    userParentObj['parent_info'] = {father_name : userContactInfo[0].father_name, father_qualification : userContactInfo[0].father_qualification, father_occupation : userContactInfo[0].father_occupation, father_email : userContactInfo[0].father_email, father_phone : userContactInfo[0].father_phone, mother_name : userContactInfo[0].mother_name, mother_qualification : userContactInfo[0].mother_qualification, mother_occupation : userContactInfo[0].mother_occupation, mother_email : userContactInfo[0].mother_email, mother_phone : userContactInfo[0].mother_phone, mother_income : userContactInfo[0].mother_income};
                    userAddressObj['address_info'] = {street_address1 : userContactInfo[0].street_address1, street_address2 : userContactInfo[0].street_address2, city : userContactInfo[0].city, state : userContactInfo[0].state, pincode : userContactInfo[0].pincode, country : userContactInfo[0].country, present_street_address1 : userContactInfo[0].present_street_address1, present_street_address2 : userContactInfo[0].present_street_address2, present_city : userContactInfo[0].present_city, present_state : userContactInfo[0].present_state, present_pincode : userContactInfo[0].present_pincode};
                    userAContactObj['additonal_contact_info'] = {additional_contact1_name : userContactInfo[0].additional_contact1_name, additional_contact1_relation : userContactInfo[0].additional_contact1_relation, additional_contact1_address : userContactInfo[0].additional_contact1_address, additional_contact1_phone : userContactInfo[0].additional_contact1_phone, additional_contact2_name : userContactInfo[0].additional_contact2_name, additional_contact2_relation : userContactInfo[0].additional_contact2_relation, additional_contact2_address : userContactInfo[0].additional_contact2_address, additional_contact2_phone : userContactInfo[0].additional_contact2_phone};
                    jsonData = jsonData.substring(0, jsonData.length - 1) + ",";
                    userParentObj = JSON.stringify(userParentObj)
                    userAddressObj = JSON.stringify(userAddressObj)
                    userAContactObj = JSON.stringify(userAContactObj)

                    userParentObj = userParentObj.substring(1, userParentObj.length);
                    userParentObj = userParentObj.substring(0, userParentObj.length - 1) + ",";
                    userAddressObj = userAddressObj.substring(1, userAddressObj.length);
                    userAddressObj = userAddressObj.substring(0, userAddressObj.length - 1) + ",";
                    userAContactObj = userAContactObj.substring(1, userAContactObj.length);
                    userAContactObj = userAContactObj.substring(0, userAContactObj.length - 1) + ",";
                    jsonData = jsonData +  userParentObj + userAddressObj + userAContactObj;
                }

                var classesJson = JSON.stringify(classesObj);
                var languagesJson = JSON.stringify(languagesObj);
                var deviceTokenJson = JSON.stringify(deviceTokenObj);
                var rolesJson = JSON.stringify(rolesObj);
                jsonData = jsonData.substring(0, jsonData.length - 1) + ",";
                classesJson = classesJson.substring(1, classesJson.length);
                classesJson = classesJson.substring(0, classesJson.length - 1) +",";
                languagesJson = languagesJson.substring(1, languagesJson.length);
                languagesJson = languagesJson.substring(0, languagesJson.length - 1) + ",";
                deviceTokenJson = deviceTokenJson.substring(1, deviceTokenJson.length);
                deviceTokenJson = deviceTokenJson.substring(0, deviceTokenJson.length - 1) + ",";
                rolesJson = rolesJson.substring(1, rolesJson.length);
                jsonData = jsonData  + classesJson + languagesJson + deviceTokenJson + rolesJson + "\n";
            }
        });
        fileStream.writeFile( __dirname + '//student-users.json', jsonData, function(err, result){
            callback(err, 'file saved successfully');
        });
    } else if(err) {
        callback(err, null);
    } else {
        callback(null, 'no user found');
    }
};

function filterUserClassifyDetails(data, value) {
    var userInfo = _.filter(data, {'user_name': value.user_name});
    return userInfo;
}

function filterClassDetails(data, value) {
    var classInfo  = _.filter(data, {'class_id': value});
    return classInfo;
}

function filterSectionDetails(data, value) {
    var sectionInfo  = _.filter(data, {'sectionId': value});
    return sectionInfo;
}

function filterLangDetails(data, value) {
    var langInfo = _.filter(data, {'languageId': value});
    return langInfo;
}

function filterSubjectDetails(data, value) {
    var subInfo = _.filter(data, {'subjectId': value});
    return subInfo;
}

function filterDeptDetails(data, value) {
    var deptInfo = _.filter(data, {'dept_id': value});
    return deptInfo;
}

function filterDesgDetails(data, value) {
    var desgInfo = _.filter(data, {'desg_id': value});
    return desgInfo;
}

function buildJsonObject(jsonData, userValue, userClasifyRes) {
    jsonData = jsonData + (JSON.stringify({
            index: {
                "_index": global.config.elasticSearch.index.userIndex,
                "_type": userValue.user_type == 'Student' ? global.config.elasticSearch.index.studentType : global.config.elasticSearch.index.empType, "_id": userValue.user_name
            }
        }) + "\n" +
        JSON.stringify({
            id: userValue.id,
            user_name: userValue.user_name,
            user_code: userValue.user_code,
            short_name: userValue.short_name,
            date_of_joining: userValue.date_of_joining,
            tenant_id: userValue.tenant_id,
            school_id: userValue.school_id,
            school_name: userValue.school_name,
            academic_year: userClasifyRes ? userClasifyRes[0].academic_year : null,
            user_type: userValue.user_type,
            name: userValue.first_name,
            first_name: userValue.first_name,
            primary_phone: userValue.primary_phone,
            email: userValue.email,
            active: userValue.active
        }));



    var roless = userValue.roles != null ? userValue.roles : null;
    var rolesObj = {};
    var rolesArr = [];
    if (roless != null) {
        for (var key in roless) {
            rolesArr.push({role_id: key, role_name: roless[key]})
        }
        ;
    } else {
        rolesArr.push({role_id: null, role_name: null})
    }
    rolesObj.roles = rolesArr;

    var deviceToken = userValue.device_token;
    var deviceTokenObj = {};
    var deviceTokenArr = [];
    if (deviceToken != null) {
        for (var key in deviceToken) {
            deviceTokenArr.push({registration_id: key, endpoint_arn: deviceToken[key]})
        }
        ;
    } else {
        deviceTokenArr.push({registration_id: null, endpoint_arn: null})
    }
    deviceTokenObj.device_token = deviceTokenArr;
    return {jsonData: jsonData, rolesObj: rolesObj, deviceTokenObj: deviceTokenObj};
};
exports.buildJsonObject = buildJsonObject;

UserJson.buildEmployeeObj = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var schoolId = models.uuidFromString(headers.school_id);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var userResult = data.user;
    if(!(_.isEmpty(userResult))){
        var jsonObj = {};
        var name = 'users';
        jsonObj[name] = [];
        var jsonData = "";
        _.forEach(userResult, function(userValue, userKey) {
            if(userValue.user_type == 'Employee') {
                var userClasifyRes = filterUserClassifyDetails(data.employeeClassification, userValue);
                var __ret = buildJsonObject(jsonData, userValue, userClasifyRes);
                jsonData = __ret.jsonData;
                var rolesObj = __ret.rolesObj;
                var deviceTokenObj = __ret.deviceTokenObj;

                var classesObj = {};
                var classesArr = [];
                if(userClasifyRes.length > 0) {
                    _.forEach(userClasifyRes[0].class_associations, function(langValue, langKey){
                        var classJsonObj = JSON.stringify(data.classes);
                        var classInfo = filterClassDetails(JSON.parse(classJsonObj), langKey);
                        var sectionInfo = filterSectionDetails(data.sections, langValue);

                        if(classInfo.length > 0 && sectionInfo.length > 0) {
                            var classData = { class_id: classInfo[0] != null ? classInfo[0].class_id : null ,
                                class_name: classInfo[0] != null ? classInfo[0].class_name : null,
                                class_code: classInfo[0] != null ? classInfo[0].class_code : null,
                                section_id: sectionInfo[0] != null ? sectionInfo[0].sectionId : null,
                                section_name: sectionInfo[0] != null ? sectionInfo[0].sectionName : null,
                                section_code: sectionInfo[0] != null ? sectionInfo[0].sectionCode : null};
                            classesArr.push(classData);
                        } else {
                            classesArr.push({class_id : null, class_name : null, class_code: null, section_id : null, section_name : null, section_code : null})
                        }
                    });
                };
                classesObj.classes =  classesArr;

                var subjectsObj = {};
                var subjectsArr = [];
                if(userClasifyRes.length > 0) {
                    _.forEach(userClasifyRes[0].subjects, function(value, key){
                        var subjectInfo = filterSubjectDetails(data.subjects, value);
                        if(subjectInfo.length > 0) {
                            var subjectData = { subject_id: subjectInfo[0].subjectId,  subject_name: subjectInfo[0].subName };
                            subjectsArr.push(subjectData);
                        }
                    });
                }

                subjectsObj.subjects =  subjectsArr;

                var deptObj = {};
                var deptArr = [];
                if(userClasifyRes.length > 0) {
                    _.forEach(userClasifyRes[0].dept_id, function(value, key){
                        var deptInfo = filterDeptDetails(data.dept, value);
                        if(deptInfo.length > 0) {
                            var deptData = { dept_id: deptInfo[0].dept_id,  dept_name: deptInfo[0].dept_name };
                            deptArr.push(deptData);
                        }
                    });
                    deptObj.dept =  deptArr;
                }

                var desgObj = {};
                if(userClasifyRes.length > 0) {
                    var desgInfo = filterDesgDetails(data.desg, userClasifyRes[0].desg_id);
                    if(desgInfo.length > 0) {
                        desgObj['desg'] = { desg_id: desgInfo[0].desg_id,  desg_name: desgInfo[0].desg_name };
                    } else {
                        desgObj['desg'] = { desg_id: '',  desg_name: '' };
                    }
                } else {
                    desgObj['desg'] = { desg_id: '',  desg_name: '' };
                }

                var classesJson = JSON.stringify(classesObj);
                var subjectsJson = JSON.stringify(subjectsObj);
                var deptJson = JSON.stringify(deptObj);
                var desgJson = JSON.stringify(desgObj);
                var deviceTokenJson = JSON.stringify(deviceTokenObj);
                var rolesJson = JSON.stringify(rolesObj);
                jsonData = jsonData.substring(0, jsonData.length - 1) + ",";
                classesJson = classesJson.substring(1, classesJson.length);
                classesJson = classesJson.substring(0, classesJson.length - 1) +",";
                subjectsJson = subjectsJson.substring(1, subjectsJson.length);
                subjectsJson = subjectsJson.substring(0, subjectsJson.length - 1) +",";
                deptJson = deptJson.substring(1, deptJson.length);
                deptJson = deptJson.substring(0, deptJson.length - 1) +",";
                desgJson = desgJson.substring(1, desgJson.length);
                desgJson = desgJson.substring(0, desgJson.length - 1) +",";
                deviceTokenJson = deviceTokenJson.substring(1, deviceTokenJson.length);
                deviceTokenJson = deviceTokenJson.substring(0, deviceTokenJson.length - 1) +",";
                rolesJson = rolesJson.substring(1, rolesJson.length);
                jsonData = jsonData + classesJson + subjectsJson + deptJson + desgJson + deviceTokenJson + rolesJson + "\n";
            } else if (userValue.user_type != 'Student' && userValue.user_type != 'Employee') {
                var __ret = buildJsonObject(jsonData, userValue, null);
                jsonData = __ret.jsonData;
                var rolesObj = __ret.rolesObj;
                var deviceTokenObj = __ret.deviceTokenObj;

                var deviceTokenJson = JSON.stringify(deviceTokenObj);
                var rolesJson = JSON.stringify(rolesObj);
                jsonData = jsonData.substring(0, jsonData.length - 1) + ",";
                deviceTokenJson = deviceTokenJson.substring(1, deviceTokenJson.length);
                deviceTokenJson = deviceTokenJson.substring(0, deviceTokenJson.length - 1) +",";
                rolesJson = rolesJson.substring(1, rolesJson.length);
                jsonData = jsonData + deviceTokenJson + rolesJson + "\n";
            }

        });
        fileStream.writeFile( __dirname + '//employee-users.json', jsonData, function(err, result){
            callback(err, "File saved successfully");
        });
    } else if(err) {
        callback(err, null);
    } else {
        callback(null, 'no user found');
    }
};

UserJson.buildStudentESObj = function(req, data, callback) {
    var userESObj = {};
    try {
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var schoolInfo = data.schoolInfo;

        var classesArr = [];
        var classData = { class_id : body.class_id, section_id : body.section_id,
            class_name: body.class_name, section_name: body.section_name };
        classesArr.push(classData);

        var languagesMap = baseService.getFormattedMap(body.languages);
        var languagesArr = [];
        _.forEach(languagesMap, function(value, key){
            var langInfo = filterLangDetails(data.lang, models.uuidFromString(value.name));
            if(langInfo.length > 0) {
                var langData = {language_id : langInfo[0] != null ? langInfo[0].languageId.toString() : null ,
                    language_name: langInfo[0] != null ? langInfo[0].languageName : null ,
                    language_type: value != null ? value.id : null};
                languagesArr.push(langData);
            } else {
                languagesArr.push({language_id: null, language_name: null, language_type: null})
            }
        });

        var userId = (data.user_id != null && data.user_id != undefined)? data.user_id.toString() : null;

        var userCode = _.trim(body.user_code);
        var newUserCode = userCode.replace(/\s+/g, '');

        userESObj['tenant_id'] = schoolInfo.tenant_id;
        userESObj['school_id'] = schoolInfo.school_id;
        userESObj['school_name'] = schoolInfo.school_name;
        userESObj['academic_year'] = headers.academic_year;
        userESObj['id'] = userId || body.id;
        userESObj['primary_phone'] = body.primary_phone;
        userESObj['user_name'] = data.user_name || body.user_name;
        userESObj['user_type'] = 'Student';
        userESObj['short_name'] = body.short_name;
        userESObj['user_code'] = newUserCode;
        userESObj['date_of_joining'] = body.date_of_joining ;
        userESObj['name'] = body.first_name;
        userESObj['first_name'] = body.first_name;
        userESObj['active'] = true;
        userESObj['classes'] = classesArr;
        userESObj['languages'] = languagesArr;
        userESObj['is_hostel']= body.isHostel;
        var parentObj = {};
        var addrsObj = {};
        var addContObj = {};

        userESObj['last_name']= body.last_name != undefined ? body.last_name : null;
        userESObj['middle_name']= body.middle_name != undefined ? body.middle_name : null;
        userESObj['gender']= body.gender != undefined ? body.gender : null;
        userESObj['date_of_birth']= body.date_of_birth != undefined ? body.date_of_birth : null;
        userESObj['place_of_birth']= body.place_of_birth != undefined ? body.place_of_birth : null;
        userESObj['nationality']= body.nationality != undefined ? body.nationality : null;
        userESObj['community']= body.community != undefined ? body.community : null;
        userESObj['mother_tongue']= body.mother_tongue != undefined ? body.mother_tongue : null;
        userESObj['blood_group']= body.blood_group != undefined ? body.blood_group : null;
        userESObj['height']= body.height != undefined ? body.height : null;
        userESObj['weight']= body.weight != undefined ? body.weight : null;
        parentObj['father_name']= body.father_name != undefined ? body.father_name : null;
        parentObj['father_qualification']= body.father_qualification != undefined ? body.father_qualification : null;
        parentObj['father_occupation']= body.father_occupation != undefined ? body.father_occupation : null;
        parentObj['father_email']= body.father_email != undefined ? body.father_email : null;
        parentObj['father_phone']= body.father_phone != undefined ? body.father_phone : null;
        parentObj['father_income']= body.father_income != undefined ? body.father_income : null;
        parentObj['mother_name']= body.mother_name != undefined ? body.mother_name : null;
        parentObj['mother_qualification']= body.mother_qualification != undefined ? body.mother_qualification : null;
        parentObj['mother_occupation']= body.mother_occupation != undefined ? body.mother_occupation : null;
        parentObj['mother_email']= body.mother_email != undefined ? body.mother_email : null;
        parentObj['mother_phone']= body.mother_phone != undefined ? body.mother_phone : null;
        parentObj['mother_income']= body.mother_income != undefined ? body.mother_income : null;
        addrsObj["street_address1"] = body.street_address1 != undefined ? body.street_address1 : null;
        addrsObj["street_address2"]= body.street_address2 != undefined ? body.street_address2 : null;
        addrsObj["city"]= body.city != undefined ? body.city : null;
        addrsObj["state"]= body.state != undefined ? body.state : null;
        addrsObj["pincode"]= body.pincode != undefined ? body.pincode : null;
        addrsObj["country"]= body.country != undefined ? body.country : null;
        addrsObj["present_street_address1"]= body.present_street_address1 != undefined ? body.present_street_address1 : null;
        addrsObj["present_street_address2"]= body.present_street_address2 != undefined ? body.present_street_address2 : null;
        addrsObj["present_city"]= body.present_city != undefined ? body.present_city : null;
        addrsObj["present_state"]= body.present_state != undefined ? body.present_state : null;
        addrsObj["present_pincode"]= body.present_pincode != undefined ? body.present_pincode : null;
        addContObj["additional_contact1_name"]= body.additional_contact1_name != undefined ? body.additional_contact1_name : null;
        addContObj["additional_contact1_relation"]= body.additional_contact1_relation != undefined ? body.additional_contact1_relation : null;
        addContObj["additional_contact1_address"]= body.additional_contact1_address != undefined ? body.additional_contact1_address : null;
        addContObj["additional_contact1_phone"]= body.additional_contact1_phone != undefined ? body.additional_contact1_phone : null;
        addContObj["additional_contact2_name"]= body.additional_contact2_name != undefined ? body.additional_contact2_name : null;
        addContObj["additional_contact2_relation"]= body.additional_contact2_relation != undefined ? body.additional_contact2_relation : null;
        addContObj["additional_contact2_address"]= body.additional_contact2_address != undefined ? body.additional_contact2_address : null;
        addContObj["additional_contact2_phone"]= body.additional_contact2_phone != undefined ? body.additional_contact2_phone : null;
        userESObj['parent_info'] = parentObj;
        userESObj['address_info'] = addrsObj;
        userESObj['additonal_contact_info'] = addContObj;
        userESObj["medical_info"] = body.medical_info != undefined ? body.medical_info : null;


        if(req.method == 'POST') {
            var rolesObj = {};
            var rolesArr = [];
            if (data != null) {
                rolesArr.push({role_id:data.id, role_name: data.name})
            } else {
                rolesArr.push({role_id:null, role_name: null})
            }
            rolesObj.roles = rolesArr;
            userESObj['roles']=rolesArr;
        }

        data['userESObj'] = userESObj;
        callback(null, data);
    } catch (err) {
        callback(err, data);
    }
};

UserJson.buildEmpESObj = function(req, data, callback) {
    var userESObj = {};
    try {
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var schoolInfo = data.schoolInfo;

        var classesArr = [];

        var department = body.dept_id;
        var designation = body.desg_id;
        var subject = body.subjects;
        var deptObj = {};
        var deptArr = [];
        if(department.length > 0) {
            _.forEach(department, function(value, key){
                var deptInfo = filterDeptDetails(data.dept, models.uuidFromString(value));
                if(deptInfo.length > 0) {
                    var deptData = { dept_id: deptInfo[0].dept_id,  dept_name: deptInfo[0].dept_name };
                    deptArr.push(deptData);
                }
            });
            deptObj.dept =  deptArr;
        }

        var desgObj = {};
        if(designation != null) {
            var desgInfo = filterDesgDetails(data.desg,  models.uuidFromString(designation));
            if(desgInfo.length > 0) {
                desgObj = { desg_id: desgInfo[0].desg_id,  desg_name: desgInfo[0].desg_name };
            }
        }

        var subjectsObj = {};
        var subjectsArr = [];
        if(subject.length > 0) {
            _.forEach(subject, function(value, key){
                var subjectInfo = filterSubjectDetails(data.subject, models.uuidFromString(value));
                if(subjectInfo.length > 0) {
                    var subjectData = { subject_id: subjectInfo[0].subjectId,  subject_name: subjectInfo[0].subName};
                    subjectsArr.push(subjectData);
                }
            });
            subjectsObj.subjects =  subjectsArr;
        }

        var userId = (data.user_id != null && data.user_id != undefined)? data.user_id.toString() : null;

        var userCode = _.trim(body.user_code);
        var newUserCode = userCode.replace(/\s+/g, '');

        userESObj['tenant_id'] = schoolInfo.tenant_id;
        userESObj['school_id'] = schoolInfo.school_id;
        userESObj['school_name'] = schoolInfo.school_name;
        userESObj['academic_year'] = headers.academic_year;
        userESObj['id'] = userId || body.id;
        userESObj['primary_phone'] = body.primary_phone;
        userESObj['user_name'] = data.user_name || body.user_name;
        userESObj['user_type'] = 'Employee';
        userESObj['short_name'] = body.short_name;
        userESObj['user_code'] = newUserCode;
        userESObj['date_of_joining'] = body.date_of_joining ;
        userESObj['first_name'] = body.first_name;
        userESObj['name'] = body.first_name;
        userESObj['active'] = true;
        userESObj['classes'] = classesArr;
        userESObj['dept'] = deptArr;
        userESObj['desg'] = desgObj;
        userESObj['subjects']=subjectsArr;

        if(req.method == 'POST') {
            var rolesObj = {};
            var rolesArr = [];
            if (data != null) {
                rolesArr.push({role_id:data.id, role_name: data.name})
            } else {
                rolesArr.push({role_id:null, role_name: null})
            }
            rolesObj.roles = rolesArr;
            userESObj['roles']=rolesArr;
        }

        data['userESObj'] = userESObj;
        callback(null, data);
    } catch (err) {
        callback(err, data);
    }

};

UserJson.buildCalendarJson = function (req, data, callback) {
    if(!(_.isEmpty(data))){
        var jsonData = "";
        _.forEach(data, function (value, key) {
            var eventsObj = value.events;
            if(eventsObj != null) {
                jsonData = jsonData + (JSON.stringify({ index: {"_index": global.config.elasticSearch.index.calendarIndex,
                        "_type": global.config.elasticSearch.index.eventsType, "_id": value.id.toString() }}) + "\n" +
                    JSON.stringify({id: value.id.toString(), tenant_id: value.tenant_id.toString(), school_id: value.school_id.toString(),
                        academic_year: value.academic_year, created_date: value.created_date}));


                var calendarEventsObj = {
                    event_id: eventsObj.event_id.toString(), event_name: eventsObj.event_name,
                    activity_type: eventsObj.activity_type,
                    start_date : eventsObj.start_date, end_date: eventsObj.end_date,
                    start_time: eventsObj.start_time, end_time: eventsObj.end_time};

                var eventsCalendarObj = {};
                eventsCalendarObj.events = calendarEventsObj;

                var eventsJson = JSON.stringify(eventsCalendarObj);
                jsonData = jsonData.substring(0, jsonData.length - 1) + ",";
                eventsJson = eventsJson.substring(1, eventsJson.length);
                jsonData = jsonData  + eventsJson + "\n";
            }
        })
        fileStream.writeFile( __dirname + '//calendar-events.json', jsonData, function(err, result) {
            callback(err, 'file saved successfully');
        });
    } else {
        callback(null, 'no data found');
    }
};

function getAssessmentObj(value, array) {
    var bulkDoc = {
        index: {
            "_index": global.config.elasticSearch.index.assessmentIndex,
            "_type": global.config.elasticSearch.index.marksType,
            "_id": value.mark_list_detail_id.toString()
        }
    };

    var subjMarksDetails = [];
    _.forEach(value.subject_mark_details, function (value1, key1) {
        var subMarksObj = {
            subject_id: value1.subject_id.toString(),
            subject_name: value1.subject_name,
            marks_obtained: value1.marks_obtained,
            marks_obtained_value: isNaN(value1.marks_obtained) ? 0 : parseFloat(value1.marks_obtained),
            max_marks: value1.max_marks,
            grade_id: value1.grade_id != null ? value1.grade_id.toString() : null,
            grade_name: value1.grade_name,
            cgpa_value: value1.cgpa_value
        };
        subjMarksDetails.push(subMarksObj);
    })

    var doc = {};
    doc['tenant_id'] = value.tenant_id.toString();
    doc['school_id'] = value.school_id.toString();
    doc['academic_year'] = value.academic_year;
    doc['user_name'] = value.user_name;
    doc['first_name'] = value.first_name;
    doc['class_id'] = value.class_id.toString();
    doc['class_name'] = value.class_name;
    doc['section_id'] = value.section_id.toString();
    doc['section_name'] = value.section_name;
    doc['mark_list_id'] = value.mark_list_id.toString();
    doc['mark_list_detail_id'] = value.mark_list_detail_id.toString();
    doc['exam_schedule_id'] = value.exam_schedule_id.toString();
    doc['written_exam_id'] = value.written_exam_id.toString();
    doc['written_exam_name'] = value.written_exam_name;
    doc['subject_mark_details'] = subjMarksDetails;
    doc['total_marks_obtained'] = value.total_marks;
    doc['total_max_marks'] = value.total_max_marks;
    doc['total_grade_id'] = value.total_grade_id != null ? value.total_grade_id.toString() : null;
    doc['total_grade_name'] = value.total_grade_name;
    doc['total_cgpa_value'] = value.total_cgpa_value;
    doc['remarks'] = value.remarks;

    array.push(bulkDoc);
    array.push(doc);
};

UserJson.buildAssessmentObjs = function(req, data, callback) {
    var array = [];
    if(!_.isEmpty(data)) {
        _.forEach(data, function (value, key) {
            getAssessmentObj(value, array);
        });
        callback(null, array)
    } else {
        callback(null, array);
    }
};

UserJson.buildAssessmentObj = function(req, data, callback) {
    var array = [];
    if(!_.isEmpty(data)) {
        getAssessmentObj(data, array);
        callback(null, {body: array})
    } else {
        callback(null, 'nothing found');
    }
};

UserJson.buildNotificationObjs = function(req, data, callback) {
    var array = [];
    if(!_.isEmpty(data)) {
        _.forEach(data, function (value, key) {
            getNotificationObj(value, array);
        });
        callback(null, array)
    } else {
        callback(null, array);
    }
};

UserJson.buildNotificationObj = function(req, data, callback) {
    var array = [];
    if(!_.isEmpty(data)) {
        getNotificationObj(data, array);
        callback(null, array)
    } else {
        callback(null, array);
    }
};

function getNotificationObj(value, array) {
    var bulkDoc = {
        index: {
            "_index": global.config.elasticSearch.index.notificationsIndex,
            "_type": global.config.elasticSearch.index.notificationsType,
            "_id": value.notification_id.toString()
        }
    };

    var doc = {};
    var attachmentsArray = [];
    if(value.attachments != undefined) {
        if(!_.isEmpty(value.attachments)) {
            _.forEach(value.attachments, function (item, key) {
                attachmentsArray.push({id: key, name: item})
            })
        } else {
            attachmentsArray = [];
        };
    }
    doc['notification_id'] = value.notification_id.toString();
    doc['tenant_id'] = value.tenant_id.toString();
    doc['school_id'] = value.school_id.toString();
    doc['feature_id'] = value.feature_id != null ? value.feature_id.toString() : null;
    doc['object_id'] = value.object_id != null ? value.object_id.toString() : null;
    doc['academic_year'] = value.academic_year;
    doc['media_name'] = value.media_name;
    doc['sender_id'] = value.sender_id || null;
    doc['template_id'] = value.template_id != null ? value.template_id.toString() : null;
    doc['sms_raw_response'] = value.sms_raw_response || null;
    doc['template_title'] = value.template_title;
    doc['title'] = value.title;
    doc['message'] = value.message;
    doc['notified_categories'] = value.notified_categories;
    doc['notified_students'] = value.notified_students;
    doc['notified_mobile_numbers'] = value.notified_mobile_numbers;
    doc['email_template_title'] = value.email_template_title;
    doc['email_template_message'] = value.email_template_message;
    doc['push_template_title'] = value.push_template_title;
    doc['push_template_message'] = value.push_template_message;
    doc['count'] = value.count;
    doc['notification_type'] = value.notification_type || null;
    doc['priority'] = value.priority || null;
    doc['status'] = value.status;
    doc['updated_date'] = value.updated_date;
    doc['updated_by'] = value.updated_by;
    doc['updated_username'] = value.updated_username;
    doc['created_by'] = value.created_by;
    doc['created_date'] = value.created_date;
    doc['created_firstname'] = value.created_firstname;
    doc['user_types'] =  value.user_types || null;
    doc['attachments'] =  attachmentsArray;
    doc['media_status'] =  value.media_status;

    array.push(bulkDoc);
    array.push(doc);
};

UserJson.buildNotificationDetailObjs = function(req, data, callback) {
    var array = [];
    if(!_.isEmpty(data)) {
        _.forEach(data, function (value, key) {
            getNotificationDetailObj(value, array);
        });
        callback(null, array)
    } else {
        callback(null, array);
    }
};

function getNotificationDetailObj(value, array) {
    var bulkDoc = {
        index: {
            "_index": global.config.elasticSearch.index.notificationsIndex,
            "_type": global.config.elasticSearch.index.notificationDetailsType,
            "_id": value.id.toString(),
            "parent": value.notification_id.toString()
        }
    };

    var doc = {};
    var attachmentsArray = [];
    if(value.attachments != undefined) {
        if(!_.isEmpty(value.attachments)) {
            _.forEach(value.attachments, function (item, key) {
                attachmentsArray.push({id: key, name: item})
            })
        } else {
            attachmentsArray = [];
        };
    }


    doc['id'] = value.id.toString();
    doc['notification_id'] = value.notification_id.toString();
    doc['tenant_id'] = value.tenant_id.toString();
    doc['school_id'] = value.school_id.toString();
    doc['feature_id'] = value.feature_id != null ? value.feature_id.toString() : null;
    doc['object_id'] = value.object_id != null ? value.object_id.toString() : null;
    doc['academic_year'] = value.academic_year;
    doc['sender_id'] = value.sender_id;
    doc['media_name'] = value.media_name;
    doc['user_name'] = value.user_name;
    doc['first_name'] = value.first_name;
    doc['user_type'] = value.user_type;
    doc['class_id'] = value.class_id != null ? value.class_id.toString() : null;
    doc['section_id'] = value.section_id != null ? value.section_id.toString() : null;
    doc['primary_phone'] = value.primary_phone;
    doc['template_title'] = value.template_title;
    doc['title'] = value.title;
    doc['message'] = value.message;
    doc['email_template_title'] = value.email_template_title;
    doc['email_template_message'] = value.email_template_message;
    doc['push_template_title'] = value.push_template_title;
    doc['push_template_message'] = value.push_template_message;
    doc['count'] = value.count;
    doc['notification_type'] = value.notification_type;
    doc['priority'] = value.priority;
    doc['status'] = value.status;
    doc['updated_date'] = value.updated_date;
    doc['updated_by'] = value.updated_by;
    doc['updated_username'] = value.updated_username;
    doc['created_by'] = value.created_by;
    doc['created_date'] = value.created_date;
    doc['created_firstname'] = value.created_firstname;
    doc['sms_response'] = value.sms_response;
    doc['deactivated'] = value.deactivated;
    doc['attachments'] = attachmentsArray;


    array.push(bulkDoc);
    array.push(doc);
};

UserJson.buildAssignmentObjs = function(req, data, callback) {
    var array = [];
    if(!_.isEmpty(data)) {
        _.forEach(data, function (value, key) {
            getAssignmentObj(value, array);
        });
        callback(null, array)
    } else {
        callback(null, array);
    }
};

UserJson.buildAssignmentObj = function(req, data, callback) {
    var array = [];
    if(!_.isEmpty(data)) {
        getAssignmentObj(data, array);
        callback(null, array)
    } else {
        callback(null, array);
    }
};

function getAssignmentObj(value, array) {
    var bulkDoc = {
        index: {
            "_index": global.config.elasticSearch.index.assignmentsIndex,
            "_type": global.config.elasticSearch.index.assignmentsMasterType,
            "_id": value.assignment_id.toString()
        }
    };

    var subjectsDetails = [];
    _.forEach(value.subjects, function (value, key) {
        var subObj = {
            subject_id: key.toString(),
            subject_name: value,
        };
        subjectsDetails.push(subObj);
    })

    var attachmentsArray = [];
    if(!_.isEmpty(value.attachments)) {
        _.forEach(value.attachments, function (item, key) {
            attachmentsArray.push({id: key, name: item})
        })
    } else {
        attachmentsArray = null;
    };

    var doc = {};
    doc['assignment_id'] = value.assignment_id.toString();
    doc['tenant_id'] = value.tenant_id.toString();
    doc['school_id'] = value.school_id.toString();
    doc['academic_year'] = value.academic_year;
    doc['media_name'] = value.media_name != null ? value.media_name : null;
    doc['assignment_name'] = value.assignment_name;
    doc['assignment_type_id'] = value.assignment_type_id != null ? value.assignment_type_id.toString() : null;
    doc['assignment_type_name'] = value.assignment_type_name != null ? value.assignment_type_name.toString() : null;
    doc['assignment_desc'] = value.assignment_desc;
    doc['notified_categories'] = value.notified_categories;
    doc['subjects'] = subjectsDetails;
    doc['due_date'] = value.due_date || null;
    doc['repeat_option_id'] = value.repeat_option_id;
    doc['repeat_option'] = value.repeat_option;
    doc['priority'] = value.priority;
    doc['notify_to'] = value.notify_to;
    doc['attachments'] = attachmentsArray;
    doc['status'] = value.status;
    doc['updated_date'] = value.updated_date;
    doc['updated_by'] = value.updated_by;
    doc['updated_username'] = value.updated_username;
    doc['created_by'] = value.created_by;
    doc['created_date'] = value.created_date;
    doc['created_firstname'] = value.created_firstname;

    array.push(bulkDoc);
    array.push(doc);
};

UserJson.buildAssignmentDetailObjs = function(req, data, callback) {
    var array = [];
    if(!_.isEmpty(data)) {
        _.forEach(data, function (value, key) {
            getAssignmentDetailObj(value, array);
        });
        callback(null, array)
    } else {
        callback(null, 'nothing found');
    }
};

function getAssignmentDetailObj(value, array) {
    var bulkDoc = {
        index: {
            "_index": global.config.elasticSearch.index.assignmentsIndex,
            "_type": global.config.elasticSearch.index.assignmentDetailsType,
            "_id": value.assignment_detail_id.toString(),
            "parent": value.assignment_id.toString()
        }
    };

    var subjectsDetails = [];
    _.forEach(value.subjects, function (value, key) {
        var subObj = {
            subject_id: key.toString(),
            subject_name: value,
        };
        subjectsDetails.push(subObj);
    })

    var attachmentsArray = [];
    if(!_.isEmpty(value.attachments)) {
        _.forEach(value.attachments, function (item, key) {
            attachmentsArray.push({id: key, name: item})
        })
    } else {
        attachmentsArray = null;
    };

    var doc = {};
    doc['assignment_detail_id'] = value.assignment_detail_id.toString();
    doc['assignment_id'] = value.assignment_id.toString();
    doc['tenant_id'] = value.tenant_id.toString();
    doc['school_id'] = value.school_id.toString();
    doc['academic_year'] = value.academic_year;
    doc['media_name'] = value.media_name != null ? value.media_name : null;
    doc['assignment_name'] = value.assignment_name;
    doc['assignment_type_id'] = value.assignment_type_id != null ? value.assignment_type_id.toString() : null;
    doc['assignment_type_name'] = value.assignment_type_name != null ? value.assignment_type_name.toString() : null;
    doc['assignment_desc'] = value.assignment_desc;
    doc['user_name'] = value.user_name;
    doc['first_name'] = value.first_name;
    doc['class_id'] = value.class_id != null ? value.class_id.toString() : null;
    doc['section_id'] = value.section_id != null ? value.section_id.toString() : null;
    doc['class_name'] = value.class_name;
    doc['section_name'] = value.section_name;
    doc['subjects'] = subjectsDetails;
    doc['due_date'] = value.due_date || null;
    doc['repeat_option_id'] = value.repeat_option_id;
    doc['repeat_option'] = value.repeat_option;
    doc['priority'] = value.priority;
    doc['notify_to'] = value.notify_to;
    doc['attachments'] = attachmentsArray;
    doc['status'] = value.status;
    doc['updated_date'] = value.updated_date;
    doc['updated_by'] = value.updated_by;
    doc['updated_username'] = value.updated_username;
    doc['created_by'] = value.created_by;
    doc['created_date'] = value.created_date;
    doc['created_firstname'] = value.created_firstname;
    doc['submitted_date'] = value.submitted_date || null;
    doc['is_submitted'] = value.is_submitted || null;

    array.push(bulkDoc);
    array.push(doc);
};

module.exports = UserJson;