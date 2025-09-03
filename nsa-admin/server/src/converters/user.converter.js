/**
 * Created by senthil on 13/01/17.
 */

var requestParam = require('../common/domains/RequestParam');
var userDomain = require('../common/domains/User');
var userParamDomain = require('../common/domains/UserParam');


exports.convertUsers = function(req, res, data) {
    newUsers = [];
    try {
        data.forEach(function (user) {
            var newUser = Object.assign({}, userDomain);
            newUser.userId = user['id'];
            newUser.academicYear = user['academic_year'];
            newUser.dob = user['birthday'];
            newUser.emailAddress = user['email'];
            newUser.firstName = user['first_name'];
            newUser.gender = user['gender'];
            newUser.lastName = user['last_name'];
            newUser.middleName = user['middle_name'];
            newUser.nationality = user['nationality'];
            newUser.primaryPhone = user['primary_phone'];
            newUser.schoolId = user['school_id'];
            newUser.schoolName = user['school_name'];
            newUser.tenantId = user['tenant_id'];
            newUser.title = user['title'];
            newUser.userName = user['user_name'];
            newUser.createdDate = user['created_date'];
            newUser.updatedDate = user['updated_date'];
            newUser.active = user['active'];
            newUsers.push(newUser);
        });
    }
    catch (err) {
        console.log('****************** ', err.stack)
        // ^ will output the "unexpected" result of: elsewhere has failed
    }
    return newUsers;
};

exports.convertEsUsers = function(data) {
    var users = [];
    try {
        var myarr = data.hits.hits;
        if(myarr.length > 0) {
            myarr.forEach(function (user) {
                var newUser = Object.assign({}, userParamDomain);
                user = user._source;
                newUser.id = user['id'];
                newUser.user_name = user['user_name'];
                newUser.tenant_id = user['tenant_id'];
                newUser.school_id = user['school_id'];
                newUser.school_name = user['school_name'];
                newUser.user_type = user['user_type'];
                newUser.user_code = user['user_code'];
                newUser.short_name = user['short_name'];
                newUser.date_of_joining = user['date_of_joining'];
                newUser.device_token = user['device_token'];
                newUser.first_name = user['first_name'];
                newUser.primary_phone = user['primary_phone'];
                newUser.email = user['email'];
                newUser.classes = user['classes'];
                newUser.languages = user['languages'];
                newUser.subjects = user['subjects'];
                newUser.dept = user['dept'];
                newUser.desg = user['desg'];
                newUser.active = user['active'];

                users.push(newUser);
            });
        }
    }
    catch (err) {
        return err;
    }
    return users;
};

exports.convertUserDetails = function(req, res, user, userDetails, userContactInfo) {
    var userContactDetails = Object.assign({}, userDomain);
    userContactDetails.userId = user[0].id,
    userContactDetails.userName = user[0].user_name,
    userContactDetails.emailAddress = user[0].email,
    userContactDetails.primaryPhone = user[0].primary_phone
    userContactDetails.firstName = userDetails[0].first_name,
    userContactDetails.lastName = userDetails[0].last_name,
    userContactDetails.addressLine1 = userContactInfo[0].street_address1,
    userContactDetails.addressLine2 = userContactInfo[0].street_address2,
    userContactDetails.city = userContactInfo[0].city,
    userContactDetails.state = userContactInfo[0].state,
    userContactDetails.pincode = userContactInfo[0].pincode,
    userContactDetails.country = userContactInfo[0].country,
    userContactDetails.fatherEmail = userContactInfo[0].father_email,
    userContactDetails.motherEmail = userContactInfo[0].mother_email,
    userContactDetails.secondaryPhone = userContactInfo[0].phone,
    userContactDetails.dob = userDetails[0].date_of_birth

    return userContactDetails;
};