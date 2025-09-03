/**
 * Created by senthil on 13/01/17.
 */

var requestParam = require('../common/domains/RequestParam');
var userDomain = require('../common/domains/User');
var dateService = require('../utils/date.service'),
    baseService = require('../services/common/base.service')
    logger = require('../../../../../config/logger');


exports.convertUsers = function(req, data) {
    var newUsers = [];
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
            newUser.roles = baseService.getFormattedMap(user['roles'])
            newUser.userName = user['user_name'];
            newUser.createdDate = user['created_date'];
            newUser.updatedDate = user['updated_date'];
            newUser.active = user['active'];
            newUsers.push(newUser);
        });
    }
    catch (err) {
        return err;
    }
    return newUsers;
};

exports.convertUserDetails = function(req, data) {
    var userContactDetails = {};
    try {
        var user = data.user;
        var userContactInfo = data.userContactInfo;
        userContactDetails = Object.assign({}, userDomain);
            userContactDetails.userId = user.id,
            userContactDetails.userName = user.user_name,
            userContactDetails.emailAddress = user.email,
            userContactDetails.primaryPhone = user.primary_phone
            userContactDetails.firstName = user.first_name,
            userContactDetails.lastName = user.last_name,
            userContactDetails.dob = dateService.getFormattedDate(user.date_of_birth)
        if (userContactInfo.length > 0) {
            userContactDetails.addressLine1 = userContactInfo[0].street_address1,
                userContactDetails.addressLine2 = userContactInfo[0].street_address2,
                userContactDetails.city = userContactInfo[0].city,
                userContactDetails.state = userContactInfo[0].state,
                userContactDetails.pincode = userContactInfo[0].pincode,
                userContactDetails.country = userContactInfo[0].country,
                userContactDetails.fatherEmail = userContactInfo[0].father_email,
                userContactDetails.motherEmail = userContactInfo[0].mother_email,
                userContactDetails.secondaryPhone = userContactInfo[0].phone
        }
    } catch (err) {
        logger.debug(err);
        return err;
    }
    return userContactDetails;
};