/**
 * Created by senthil on 13/01/17.
 */

var requestParam = require('../common/domains/RequestParam');
var userDomain = require('../common/domains/User');


exports.convertUsers = function(req, res, data) {
    newUsers = [];
    try {
        data.forEach(function (user) {
            var newUser = Object.assign({}, userDomain);
            newUser.userId = user['user_id'];
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
}