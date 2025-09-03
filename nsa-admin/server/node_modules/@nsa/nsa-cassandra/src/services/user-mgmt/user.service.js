/**
 * Created by bharatkumarr on 20/03/17.
 */

var baseService = require('../common/base.service')
    , models = require('../../models')
    , passwordHash = require('password-hash')
    , randomstring = require("randomstring")
    , dateSerive = require('../../utils/date.service')
    , _ = require('lodash')
    , BaseError = require('@nsa/nsa-commons').BaseError
    , message = require('@nsa/nsa-commons').messages
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , usermgmtConverter = require('../../converters/usermgmt.converter')
    , dateService = require('../../utils/date.service')
    , constant = require('@nsa/nsa-commons').constants
    , templateConverter = require('../../converters/template.converter')
    , nsaCommons = require('@nsa/nsa-commons');


var User = function f(options) {
    // var self = this;
};

User.getAllEmployees = function(req, data, callback) {
    fetchUser(req, 'Employee', function(err, result) {
        if(_.isEmpty(result)) {
            data.users = [];
        } else {
            data.users = JSON.parse(JSON.stringify(result));
        }
        callback(null, data);
    });
};

User.getAllStudents = function(req, data, callback) {
    fetchUser(req, 'Student', function(err, result) {
        if(_.isEmpty(result)) {
            data.users = [];
        } else {
            data.users = JSON.parse(JSON.stringify(result));
        }
        callback(null, data);
    });
};

User.getUser = function(req, data, callback) {

    var headers = baseService.getHeaders(req);
    var schoolId = models.uuidFromString(headers.school_id);
    var tenantId = models.timeuuidFromString(headers.tenant_id);

    models.instance.User.findOne(
        { school_id: schoolId, tenant_id: tenantId, user_name: req.params.id},
        { allow_filtering: true /*, raw: true  */},
        function(err, result) {
            if(_.isEmpty(result)) {
                data.user = {};
            } else {
                data.user = usermgmtConverter.convertUserObj(result);
            }
            callback(err, data);
        }
    );
};

function fetchOneUser(req, callback) {
    var headers = baseService.getHeaders(req);
    var schoolId = models.uuidFromString(headers.school_id);
    var tenantId = models.timeuuidFromString(headers.tenant_id);

    models.instance.User.findOne(
        {school_id: schoolId, tenant_id: tenantId, user_name: req.params.id}, { allow_filtering: true /*, raw: true  */},
        function(err, result) {
            var formattedResult = baseService.validateResult(result);
            callback(err, result);
        }
    );
}

function fetchUser(req, userType, callback) {
    var headers = baseService.getHeaders(req);
    var schoolId = models.uuidFromString(headers.school_id);
    var tenantId = models.timeuuidFromString(headers.tenant_id);

    models.instance.User.find(
        {school_id: schoolId, tenant_id: tenantId, user_type: userType}, { allow_filtering: true /*, raw: true  */},
        function(err, result) {
            var formattedResult = baseService.validateResult(result);
            callback(err, result);
        }
    );
}

User.saveEmployee = function(req, data, callback) {
    saveUser(req, data, 'E', function(err, result){
        callback(err, result);
    });
};

User.saveStudent = function(req, data, callback) {
    saveUser(req, data, 'S', function(err, result){
        callback(err, result);
    });
};

User.updateEmployee = function(req, data, callback) {
    updateUser(req, data, 'E', function(err, result){
        callback(err, result);
    });
};

User.resetPassword = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var username = req.body.userName;
    var newPassword = randomstring.generate(7);

    updateValues = {
        password: passwordHash.generate(newPassword),
        updated_date: dateService.getCurrentDate()
    }
    models.instance.User.update({user_name: username }, updateValues, function (err, result) {
        callback(err, newPassword)
    });
};

User.updateStudent = function(req, data, callback) {
    updateUser(req, data, 'S', function(err, result){
        callback(err, result);
    });
};


User.getRole = function (req, data, callback) {
    models.instance.RoleType.findOne( { name: data.userType }, {allow_filtering: true}, function(err, result){
        if (result) {
            var role = JSON.parse(JSON.stringify(result))
            data.roleInfo = role;
        }
        callback(err, data);
    });
}

User.getAcademicYear = function (req, data, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    models.instance.AcademicYear.findOne({ tenant_id: tenantId,
        school_id: schoolId
    }, {allow_filtering: true}, function(err, result){
        var academicYear = JSON.parse(JSON.stringify(result))
        data.academic_year = academicYear;
        callback(err, role);
    });
}

User.getSchoolCode = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var tenantId = models.timeuuidFromString(headers.tenant_id);
    var schoolId = models.uuidFromString(headers.school_id);
    models.instance.SchoolDetails.findOne({
        tenant_id: tenantId,
        school_id: schoolId
    }, {allow_filtering: true}, function (err, result) {
        if (result) {
            var schoolInfo = JSON.parse(JSON.stringify(result));
            data.schoolInfo = schoolInfo;
        }
        callback(err, data);
    });
}

function saveUser(req, data, code, callback) {
    getUserObj(req, data, code, function(err, userObj){
        if(err) {
            callback(err, null);
        } else {
            userObj.created_date = dateService.getCurrentDate();
            userObj.roles = {};
            userObj.roles[data.roleInfo.id] = data.roleInfo.name;
            if(req.body.password == ""){
                var password = data.schoolInfo.password ? data.schoolInfo.password : '1234';
                userObj.password = passwordHash.generate(password);
            }else {
                userObj.password = passwordHash.generate(req.body.password);
            }
            userObj.updated_date = userObj.created_date;
            data.user_name = userObj.user_name;
            data.user_id = userObj.id;
            var user = new models.instance.User(userObj);
            var userObject = user.save({return_query: true});
            var array = [userObject];
            data.batchObj = array;
            callback(null, data);
        }
    });

}

function updateUser(req, data, code, callback) {
    getUserObj(req, data, code, function(err, userObj) {
        if(err) {
            callback(err, null);
        } else {
            userObj.updated_date = dateService.getCurrentDate();
            if(req.body.password != undefined && req.body.password != null && req.body.password != ""){
                userObj.password = passwordHash.generate(req.body.password );
            }
            var updateQuery = models.instance.User.update({user_name: req.params.id }, userObj, {return_query: true});
            var array = [updateQuery];
            data.user_name = req.params.id;
            data.batchObj = array;
            callback(null, data);
        }
    });

}

function getUserObj (req, data, code, callback) {
    try {
        var userCode = _.trim(req.body.user_code);
        var newUserCode = userCode.replace(/\s+/g, '');
        var userObj = {};
        userObj = baseService.updateIdsFromHeader(req, userObj, true);
        userObj.primary_phone = req.body.primary_phone;
        userObj.email = req.body.email || null;
        userObj.user_code = newUserCode;
        var joining_date = req.body.date_of_joining || null;
        if (joining_date != null) {
            userObj.date_of_joining = dateService.getFormattedDate(joining_date);
        }
        userObj.user_type = data.userType;
        userObj.active = true;
        userObj.school_name = req.headers.userInfo.school_name;
        userObj.short_name = req.body.short_name || null;
        userObj.blood_group = req.body.blood_group || null;
        userObj.date_of_birth = req.body.date_of_birth ? dateService.getFormattedDate(req.body.date_of_birth) : null;
        userObj.place_of_birth = req.body.place_of_birth || null;
        userObj.mother_tongue = req.body.mother_tongue || null;
        userObj.first_name = req.body.first_name;
        userObj.gender = req.body.gender || null;
        userObj.last_name = req.body.last_name || '';
        userObj.middle_name = req.body.middle_name || '';
        userObj.community = req.body.community || null;
        userObj.nationality = req.body.nationality || null;
        userObj.transport_required = req.body.transport_required || null;
        userObj.medical_info = req.body.medical_info || null;
        userObj.height = req.body.height || null;
        userObj.weight = req.body.weight || null;
        userObj.title = req.body.title || null;
        userObj.is_hostel =  req.body.isHostel != null ? req.body.isHostel : null;

        if (req.method == 'POST') {
            findRandomNumberInUser(req, data, code, function(err, result){
                userObj.user_name = result;
                data.user_name = result;
                userObj.id = models.uuid();
                callback(null, userObj);
            });
        }else {
            callback(null, userObj);
        }
    } catch (err) {
        callback(responseBuilder.buildResponse(constant.USER_NAME, constant.APP_TYPE, 'object conversion err', err.message, constant.HTTP_BAD_REQUEST), null);
    };
}

function  findRandomNumberInUser(req, data, code, callback){
    try {
        var findQuery = baseService.getFindQuery(req);
            findQuery.user_name = Math.floor(1000 + Math.random() * 9000) + data.schoolInfo.school_code + code; //randomNumber + school_code + Student S or Employee E;
            models.instance.User.findOne(findQuery, {allow_filtering: true}, function(err, userName) {
                if (userName) {
                    findRandomNumberInUser(req, data, code, callback);
                } else {
                    callback(null, findQuery.user_name)
                }
            });
    }catch (err){
        callback(err, null);
    }
}

function getQuery(req) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };
    findQuery.user_name = models.uuidFromString(req.params.id);
    return findQuery;
};


User.deactivateUser = function(req, callback) {
    var userName = req.params.id;
    var queryObj = {user_name: userName};
    var status = req.body.active
    models.instance.User.findOne(queryObj, {allow_filtering: true}, function(err, result){
        var updateValues = { active: status };
        if (result != null) {
            var data;
            var updateObj = models.instance.User.update(queryObj, updateValues, {return_query: true});
            var array = [updateObj];
            data = {batchObj :array, _id: req.body._id, userESObj: {user_name: userName, active: status}};

            callback(null, data);
        } else {
            callback(err, null);
        }
    });
};

User.getTemplateForSMS = function(req, data, callback) {
    var templates = { sms_template_message : constant.PASSWORD_RESET, sms_template_title: constant.PASSWORD_RESET_TITLE};
    var params = {school_name: req.body.schoolName, password: data};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        callback(err, result);
    });
};

function getQuery(req) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    };
    findQuery.user_name = req.params.id;
    return findQuery;
};
exports.getQuery = getQuery;

User.UpdateNumberInStudents = function(req, data, callback) {
    try{
        var body = req.body, array = [];
        _.forEach(body.childs, function(value, key){
            var updateQuery = models.instance.User.update({user_name: value.user_name}, {primary_phone: body.NewNumber}, {return_query: true});
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

User.updateWardInStudent = function(req, data, callback) {
    try{
        var body = req.body, array = [];
            var updateQuery = models.instance.User.update({user_name: body.NewWard.userName}, {primary_phone: body.user_name}, {return_query: true});
            array.push(updateQuery);
        data.batchObj = array;
        callback(null, data);
    }catch (err){
        callback(err, null)
    }
};

module.exports = User;
