/**
 * Created by senthil on 2/24/2017.
 */
var _ = require('lodash'),
    gcm = require('node-gcm'),
    stringFormat = require('string-template'),
    util = require('util');

var ServiceUtils = function f(options) {
    var self = this;
};

ServiceUtils.buildSMSObj = function(req, notificationObj, senderId, callback) {
    try {
        var users = notificationObj.users;
        var sender_name = senderId[0].sender_name;
        var message = notificationObj.smsTemplate.templateName;
        var recepients = _.compact(_.split(notificationObj.phoneNo, ','));
        var result = _(recepients).omitBy(_.isUndefined).omitBy(_.isNull).value();
        notificationObj.senderIds = senderId;
        var userList = _.concat(users);
        var arr = [];
        var detailedMessages = {};
        if(notificationObj.isDetailedNotification) {
            _.forEach(_(userList).omitBy(_.isUndefined).omitBy(_.isNull).value(), function(value, key) {
                var msg = formatMsg(notificationObj, value, message)
                detailedMessages[value.primaryPhone] = msg;
                arr.push({to: value.primaryPhone, message: msg, custom: message.replace(',',' ')})
            });
        } else {
            _.forEach(_(userList).omitBy(_.isUndefined).omitBy(_.isNull).value(), function(value, key) {
                arr.push({to: value.primaryPhone, message: message, custom: message.replace(',',' ')})
            });
        }
        _.forEach(result, function(value, key) {
            arr.push({to: _.trim(value), message: message, custom: message.replace(',',' ')})
        });

        var smsObj = {sender: sender_name, sms: arr}
        notificationObj.users = userList;
        notificationObj.detailedMessages = detailedMessages
        notificationObj.smsObj = smsObj;

        callback(null, notificationObj)
    } catch (err) {
        callback(err, null)
    }
};


ServiceUtils.buildOTPSMSObj = function(req, message, phoneNumber, callback) {
    var notificationObj = {};
    try {
        var arr = [];
        arr.push({to: phoneNumber})
        var smsObj = {sender: 'NXTECH', message: message, sms: arr}
        notificationObj.smsObj = smsObj;
        callback(null, notificationObj)
    } catch (err) {
        callback(err, null)
    }
};

ServiceUtils.buildPushObj = function(req, notificationObj, callback) {
    var schoolDetails = notificationObj.schoolDetails;
    var featureId = req.headers.id;
    var attachments = "";
    try {
        var users = notificationObj.users;
        var pushTemplate = notificationObj.pushTemplate;
        var templateMessage = pushTemplate.templateName;
        var title = pushTemplate.title;
        var testTokens = ['APA91bGEhw6XOPaV2HDQM9xrNX5Pm1RyjZM9jkDd5-kZly88VsTom6gq14PMAaeR7e3ly8DrqUL2U9HL0K1GJQl_XBLG1VnJMG7OXb1S8SbvSu9NSAWs_QuaKH7vH85n8TuwALsEZU04'];
        var registrationIds = [];
        _.forEach(users, function(value, key){
            _.forEach(value.deviceToken, function(value1, key1){
                registrationIds.push(value1['registration_id']);
            })
        });
        var classesObj = notificationObj.classes || []
        registrationIds = _.compact(registrationIds);

        if(notificationObj.notifiedStudents) {
            _.forEach(notificationObj.notifiedStudents, function(value, key){
                var clsObj = value.classes[0];
                if(clsObj) {
                    var cls = {}
                    cls.id = clsObj.class_id
                    cls.section = [clsObj.section_id]
                    classesObj.push(cls)
                }
            });
        }
        classesObj = _.uniqWith(classesObj, _.isEqual);
        if(notificationObj.attachments != null) {
            var attach = notificationObj.attachments.length > 0 ? notificationObj.attachments[0].id : "";
            var myarr = ["jpeg", "jpg", "png", "gif"];
            var tests = attach.split(".").pop(-1);
            var found = (myarr.indexOf(tests) > -1);
            if(found) {
                attachments = notificationObj.attachments.length > 0 ? notificationObj.attachments[0].id : "";
            }
        }
        var message = new gcm.Message({content_available: true,
            data: {featureId: featureId, classes: classesObj, schoolId: req.headers.userInfo.school_id, attachments: attachments, title: title},
            notification: {title: title, sound: "default", content_available: true, /*icon: "ic_launcher",*/ body: templateMessage}
        });
        var regTokens = _.isEmpty(registrationIds) ? testTokens : registrationIds;
        var pushObj = {message: message, recipients: regTokens, senderId: schoolDetails.server_api_key};
        notificationObj.pushObj = pushObj;

        callback(null, notificationObj)
    } catch (err) {
        callback(err, null)
    }
};

ServiceUtils.getFormattedString = function(string, params) {
    // Format using a number indexed array
    // greeting = format("Hello {name}, you have {count} unread messages",{name : "Robert", count: 12})
    // greeting -> "Hello Robert, you have 12 unread messages"
    if(string != null && string != '' && string != undefined) {
        var formattedString = stringFormat(string, params);
        return formattedString;
    }
    return string;
};

ServiceUtils.getNamesFromArray = function(input, key) {
    // it will unwrap as [{ "id" : "1" , "name" : "name1"}, {"id" : "2", "name" : "name2"}] to ["name1" , "name2"]
    var array = [];
    if (input != null && input != undefined) {
        input.forEach(function (item){
            if(item != null) {
                array.push(item[key]);
            }

        });
        return array;
    }
    return input;
};

ServiceUtils.havePermissionsToEdit = function (req, permissions, createdBy) {
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

ServiceUtils.getPermissions = function (req, permissions) {

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

function formatMsg(notificationObj, user, msg) {
    var replacementKeys = notificationObj.replacementKeys
    var replacementMsgs = notificationObj.replacementMsgs
    var primaryPhone = user.primaryPhone;
    for(var key in replacementKeys) {
        var objKey = replacementKeys[key]
        if(user.hasOwnProperty(objKey)) {
            msg = util.format(msg, user[objKey])
        } else if (replacementMsgs != null && replacementMsgs != undefined && replacementMsgs.hasOwnProperty(primaryPhone)) {
            var obj = replacementMsgs[primaryPhone]
            msg = util.format(msg, obj[objKey])
        } else {
            msg = util.format(msg, ' ')
        }
    }
    return msg;
}
exports.formatMsg = formatMsg;

module.exports = ServiceUtils;