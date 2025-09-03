/**
 * Created by bharatkumarr on 12/09/17.
 */

var _ = require('lodash'),
    constants = require('@nsa/nsa-commons').constants,
    dateService = require('@nsa/nsa-commons').dateUtils;

exports.updateDateAndPermission = function(req, permissions, data) {
    var objs = [];
    try {
        var myarr = data.hits.hits;
        if (myarr.length > 0) {
            myarr.forEach(function (notification) {
                var obj = notification._source
                obj.updated_date = dateService.getDateFormatted(obj.updated_date, "mmm d yyyy h:MM TT");
                if (permissions) {
                    obj.editPermissions = havePermissionsToEdit(req, permissions, obj.created_by);
                }
                obj.attachments = obj.attachments != undefined ? obj.attachments : [];
                objs.push(obj);
            });
        }

        var returnData = {};
        returnData.draw = req.query.draw;
        returnData.recordsTotal = data.hits.total;
        returnData.recordsFiltered = data.hits.total;
        returnData.data = objs;
        return returnData;
    }
    catch (err) {
        return err;
    }
};

function getPermissions (req, permissions) {
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

function havePermissionsToEdit(req, permissions, createdBy) {

    var userName = req.headers.userInfo.user_name;

    var permissions = getPermissions(req, permissions);
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
