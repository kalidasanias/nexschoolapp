/**
 * Created by karthik on 06-01-2017.
 */
var express = require('express')
    , request = require('request')
    , constants = require('../../common/constants/constants')
    , models = require('../../models/index');


exports.saveMediaUsageLog = function (res, tenantId, schoolId, userId,
                                      notificationId, notifiedList, messageCount, title, message, status, cb) {
    var saved;
    var schoolMediaUsageLog;
    var count = 0 ;

    notifiedList.forEach(function(item, index, array, done) {
        schoolMediaUsageLog = new models.instance.SchoolMediaUsageLog({
            id: models.uuid(), notification_id: notificationId, tenant_id: tenantId, school_id: schoolId,
            sent_by: userId, user_id: item, trans_date: new Date(), primary_phone: item,
            count: messageCount, title: title, message: message, status: status
        });
        schoolMediaUsageLog.save(function (err, result) {
            if (result) {
                saved = true;
                count++;
            } else {
                count++;
                saved = false;
            }
            if(count == notifiedList.length) {
                cb(saved);
            }
        });
    });
};