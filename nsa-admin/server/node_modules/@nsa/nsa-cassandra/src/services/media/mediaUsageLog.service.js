/**
 * Created by karthik on 06-01-2017.
 */
var express = require('express')
    , request = require('request')
    , constants = require('../../common/constants/constants')
    , models = require('../../models/index');


exports.saveMediaUsageLog = function (tenantId, schoolId, academicYear, userId,
                                      notificationId, notifiedList, messageCount, title, message, templateTitle, status, cb) {
    var saved;
    var schoolMediaUsageLog;
    var count = 0 ;

    notifiedList["userDetails"].forEach(function(item, index, array, done) {
        if(item.class_id != "" && item.section_id != "") {
            schoolMediaUsageLog = new models.instance.SchoolMediaUsageLog({
                id: models.uuid(),notification_id: notificationId,tenant_id: tenantId, school_id: schoolId, academic_year:academicYear,
                sent_by: userId, trans_date: new Date(),primary_phone: item.primary_phone, user_type: item.user_type,
                class_id: models.uuidFromString(item.class_id),section_id: models.uuidFromString(item.section_id),count: messageCount, user_name: item.user_name,
                title: title,message: message, message_title: templateTitle,status: status });
        } else {
            schoolMediaUsageLog = new models.instance.SchoolMediaUsageLog({
                id: models.uuid(),notification_id: notificationId,tenant_id: tenantId,school_id: schoolId, academic_year:academicYear, trans_date: new Date(),
                sent_by: userId, primary_phone: item.primary_phone,count: messageCount,user_name: item.user_name, user_type: item.user_type,
                title: title,message: message, message_title: templateTitle, status: status });
        }
        schoolMediaUsageLog.save(function (err, result) {
            if (result) {
                saved = true;
                count++;
            } else {
                count++;
                saved = false;
            }
            if(count == notifiedList["userDetails"].length) {
                cb(saved);
            }
        });
    });
};