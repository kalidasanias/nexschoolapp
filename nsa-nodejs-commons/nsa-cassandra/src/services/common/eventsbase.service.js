/**
 * Created by Kiranmai A on 4/25/2017.
 */

var express = require('express')
    , constants = require('../../common/constants/constants')
    , models = require('../../models/index')
    , baseService = require('./base.service')
    , message = require('@nsa/nsa-commons').messages
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , constant = require('@nsa/nsa-commons').constants
    , async = require('async')
    , _ = require('lodash')
    , templateConverter = require('../../converters/template.converter');

exports.eventTypeSaveObj = function(req, callback) {
    try {
        var data;
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var eventTypeId = models.uuid();

        var eventTypeDetails = new models.instance.SchoolEventType  ({
            event_type_id: eventTypeId,
            tenant_id: tenantId,
            school_id: schoolId,
            event_type_name: body.eventTypeName,
            description: body.desc,
            updated_date: currentDate,
            updated_by: headers.user_id,
            updated_username: headers.user_name,
            created_date: currentDate,
            created_by: headers.user_id,
            created_firstname: headers.user_name
        });
        var saveObj = eventTypeDetails.save({return_query: true});
        var array = [saveObj];
        data = {event_type_id: eventTypeId, batchObj: array};
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

exports.eventTypeUpdateObj = function(req, callback) {
    try {
        var data;
        var id = req.params.typeId;
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();

        var eventTypeId = models.uuidFromString(id);

        var queryObj = { event_type_id : eventTypeId, tenant_id: tenantId, school_id: schoolId };
        var updateValues = {
            event_type_name: body.eventTypeName,
            description: body.desc,
            updated_date: currentDate,
            updated_by: headers.user_id,
            updated_username: headers.user_name
        };
        var updateObj = models.instance.SchoolEventType.update(queryObj, updateValues, {return_query: true});
        var array = [updateObj];
        data = {event_type_id: eventTypeId, batchObj: array};
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

exports.eventTypeDeleteObj = function(req, callback) {
    try {
        var data;
        var id = req.params.typeId;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var eventTypeId = models.uuidFromString(id);

        var queryObj = { event_type_id : eventTypeId, tenant_id: tenantId, school_id: schoolId };

        var deleteObj = models.instance.SchoolEventType.delete(queryObj, {return_query: true});
        var array = [deleteObj];
        data = {event_type_id: eventTypeId, batchObj: array};
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

exports.eventVenueSaveObj = function(req, callback) {
    try {
        var data;
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var venueTypeId = models.uuid();

        var eventVenueDetails = new models.instance.SchoolVenueType ({
            venue_type_id: venueTypeId,
            tenant_id: tenantId,
            school_id: schoolId,
            venue_type_name: body.eventVenueName,
            location: body.location,
            updated_date: currentDate,
            updated_by: headers.user_id,
            updated_username: headers.user_name,
            created_date: currentDate,
            created_by: headers.user_id,
            created_firstname: headers.user_name
        });
        var saveObj = eventVenueDetails.save({return_query: true});
        var array = [saveObj];
        data = {venue_type_id: venueTypeId, batchObj: array};
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

exports.eventVenueUpdateObj = function(req, callback) {
    try {
        var data;
        var id = req.params.venueId;
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();

        var venueTypeId = models.uuidFromString(id);

        var queryObj = { venue_type_id : venueTypeId, tenant_id: tenantId, school_id: schoolId };
        var updateValues = {
            venue_type_name: body.eventVenueName,
            location: body.location,
            updated_date: currentDate,
            updated_by: headers.user_id,
            updated_username: headers.user_name
        };
        var updateObj = models.instance.SchoolVenueType.update(queryObj, updateValues, {return_query: true});
        var array = [updateObj];
        data = {venue_type_id: venueTypeId, batchObj: array};
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

exports.eventVenueDeleteObj = function(req, callback) {
    try {
        var data;
        var id = req.params.venueId;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var eventVenueId = models.uuidFromString(id);

        var queryObj = { venue_type_id : eventVenueId, tenant_id: tenantId, school_id: schoolId };

        var deleteObj = models.instance.SchoolVenueType.delete(queryObj, {return_query: true});
        var array = [deleteObj];
        data = {venue_type_id: eventVenueId, batchObj: array};
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }

};

exports.eventSaveObj = function(req, data1, callback) {
    var data;
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var eventId = body.eventId != null ? models.uuidFromString(body.eventId) : models.uuid();
        var attachmentsObj = baseService.getMapFromFormattedMap(body.attachments);

        var venueObj = baseService.getMapFromFormattedMap(body.venue);
        var eventDate = body.date;
        var date1 = eventDate.split('-')[0];
        var date2 = eventDate.split('-')[1];
        var startDate = baseService.getFormattedDate(date1);
        var endDate = baseService.getFormattedDate(date2);

        var notifiedStudents = req.body.students != null ? JSON.stringify(req.body.students) : null;

        var eventDetails = new models.instance.SchoolEvents  ({
            event_id: eventId, tenant_id: tenantId, school_id: schoolId,
            academic_year : headers.academic_year, event_name: body.eventName,
            start_date: models.datatypes.LocalDate.fromDate(startDate), end_date: models.datatypes.LocalDate.fromDate(endDate),
            start_time: models.datatypes.LocalTime.fromString(body.startTime),
            end_time: models.datatypes.LocalTime.fromString(body.endTime),
            event_type_id: ( body.eventTypeId != null && body.eventTypeId != '' ) ? models.uuidFromString(body.eventTypeId) : null,
            event_type_name: body.eventTypeName,
            activity_type_id: ( body.activityTypeId != null && body.activityTypeId != '' ) ? models.uuidFromString(body.activityTypeId) : null,
            activity_type_name: body.activityTypeName,
            event_venue: venueObj,
            description: body.desc,
            latitude: body.latitude,
            longitude: body.longitude,
            map_location: body.mapLocation,
            notified_categories: JSON.stringify(data1.taxanomy),
            notified_students : notifiedStudents,
            is_mandatory: body.isMandatory,
            attachments: attachmentsObj,
            updated_username: headers.user_name,
            updated_date: currentDate,
            updated_by: headers.user_id,
            created_firstname: headers.user_name,
            created_date: currentDate,
            created_by: headers.user_id,
            status: body.status
        });
        var saveObj = eventDetails.save({return_query: true});
        var array = [saveObj];
        data = {event_id: eventId, batchObj: array};
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

exports.attachmentUpdateObj = function(req, callback) {
    var data;
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var eventId = models.uuidFromString(req.params.id);

        var attachmentsObj = baseService.getMapFromFormattedMap(body.attachments);

        var queryObj = { event_id: eventId, tenant_id: tenantId, school_id: schoolId, academic_year : headers.academic_year };
        var updateValues = { attachments: {'$add' : attachmentsObj} };

        var saveObj = models.instance.SchoolEvents.update(queryObj, updateValues, {return_query: true});
        var array = [saveObj];
        data = {event_id: eventId, batchObj: array};
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

exports.eventDeleteObj = function(req, callback) {
    try {
        var data;
        var params = req.params;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var eventId = models.uuidFromString(params.id);
        var queryObj = {
            event_id: eventId, tenant_id: tenantId, school_id: schoolId,
            academic_year : headers.academic_year
        };

        var deleteObj = models.instance.SchoolEvents.delete(queryObj, {return_query: true});
        var array = [deleteObj];
        data = {event_id: eventId, batchObj: array};
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

exports.calendarDataDeleteObj = function(req, data, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var array = data.batchObj;
        var calendarId = models.uuidFromString(body.calendar_id)

            var queryObj = {
                id: calendarId, created_date: body.created_date
            };
            var deleteObj = models.instance.CalendarData.delete(queryObj, {return_query: true});
            array.push(deleteObj);

        data[' batchObj'] = array;
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

exports.eventDetailsDeleteObj = function(req, data, callback) {
    var data;
    try {
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var eventDetails = data.eventDetails;
        var array = data.batchObj;

        _.forEach(eventDetails, function(value, key){
            var queryObj = {
                event_detail_id: value.event_detail_id, tenant_id: tenantId, school_id: schoolId,
                academic_year : headers.academic_year
            };

            var deleteObj = models.instance.SchoolEventsDetails.delete(queryObj, {return_query: true});
            array.push(deleteObj);
        });

        data[' batchObj'] = array;
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

exports.eventDetailsSaveObj = function(req, data, callback) {
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var array = data.batchObj || [];
        var attachmentsObj = baseService.getMapFromFormattedMap(body.attachments);

        var users = data.users || [];
        _.forEach(users, function(value, key){

            var classId = value.classes.length > 0 ? (value.classes[0].class_id != '' ? models.uuidFromString(value.classes[0].class_id) : null) : null;
            var className = value.classes.length > 0 ? (value.classes[0].class_name != '' ? value.classes[0].class_name : null) : null;
            var sectionId = value.classes.length > 0 ? (value.classes[0].section_id != '' ? models.uuidFromString(value.classes[0].section_id) : null) : null;
            var sectionName = value.classes.length > 0 ? (value.classes[0].section_name != '' ? value.classes[0].section_name : null) : null;

            var venueObj = baseService.getMapFromFormattedMap(body.venue);
            var eventDate = body.date;
            var date1 = eventDate.split('-')[0];
            var date2 = eventDate.split('-')[1];
            var startDate = baseService.getFormattedDate(date1);
            var endDate = baseService.getFormattedDate(date2);
            var eventDetailId = models.uuid();
            var eventDetails = new models.instance.SchoolEventsDetails  ({
                event_detail_id: eventDetailId,
                event_id: data.event_id,
                tenant_id: tenantId,
                school_id: schoolId,
                academic_year : headers.academic_year,
                event_name: body.eventName,
                start_date: models.datatypes.LocalDate.fromDate(startDate),
                end_date: models.datatypes.LocalDate.fromDate(endDate),
                start_time: models.datatypes.LocalTime.fromString(body.startTime),
                end_time: models.datatypes.LocalTime.fromString(body.endTime),
                event_type_id: (body.eventTypeId !=null && body.eventTypeId !='') ? models.uuidFromString(body.eventTypeId) : null,
                event_type_name: body.eventTypeName,
                activity_type_id: (body.activityTypeId !=null && body.activityTypeId !='') ? models.uuidFromString(body.activityTypeId) : null,
                activity_type_name: body.activityTypeName,
                event_venue: venueObj,
                description: body.desc,
                user_name: value.userName,
                first_name: value.firstName,
                class_id: classId,
                class_name: className,
                section_id: sectionId,
                section_name: sectionName,
                latitude: body.latitude,
                longitude: body.longitude,
                map_location: body.mapLocation,
                is_mandatory: body.isMandatory,
                attachments: attachmentsObj,
                /*media_name: body.MediaName,*/
                updated_username: headers.user_name,
                updated_date: currentDate,
                updated_by: headers.user_id,
                created_date: currentDate,
                created_by: headers.user_id,
                created_firstname: headers.user_name,
                status: body.status,
            });
            var saveObj = eventDetails.save({return_query: true});
            array.push(saveObj);
        });
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

exports.updateDetailsAttachmentsObj = function(req, data, callback) {
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);

        var array = data.batchObj || [];
        var eventDetails = data.eventDetails;
        var attachmentsObj = baseService.getMapFromFormattedMap(body.attachments);

        _.forEach(eventDetails, function(value, key){
            var queryObj = { event_detail_id: value.event_detail_id, tenant_id: tenantId, school_id: schoolId, academic_year : headers.academic_year };
            var updateValues = { attachments: {'$add' : attachmentsObj} };

            var updateObj = models.instance.SchoolEventsDetails.update(queryObj, updateValues, {return_query: true});
            array.push(updateObj);
        });

        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};


exports.calendarDataSaveObj = function(req, data, callback) {
    try {
        var body = req.body;
        var headers = baseService.getHeaders(req);
        var tenantId = models.timeuuidFromString(headers.tenant_id);
        var schoolId = models.uuidFromString(headers.school_id);
        var currentDate = new Date();
        var eventDetailId = models.uuid();
        var array = data.batchObj || [];

        var eventDate = body.date;
        var date1 = eventDate.split('-')[0];
        var date2 = eventDate.split('-')[1];
        var startDate = baseService.getFormattedDate(date1);
        var endDate = baseService.getFormattedDate(date2);
        var id = models.uuid();
        var eventObj = { event_id: data.event_id, event_name: body.eventName, start_date: startDate,
            end_date: endDate, start_time: body.startTime, end_time: body.endTime
        };
        var eventDetailObj = { event_id: data.event_id, event_name: body.eventName, start_date: models.datatypes.LocalDate.fromDate(startDate),
            end_date: models.datatypes.LocalDate.fromDate(endDate), start_time: body.startTime, end_time: body.endTime
        };
        var saveQuery = {
            id: id,
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year : headers.academic_year,
            events: eventObj,
            created_date: currentDate,
            updated_username: headers.user_name,
            updated_date: currentDate,
            updated_by: headers.user_id,
        }

        var calendarDetails = new models.instance.CalendarData({
            id: id,
            tenant_id: tenantId,
            school_id: schoolId,
            academic_year : headers.academic_year,
            events: eventObj,
            created_date: currentDate,
            updated_username: headers.user_name,
            updated_date: currentDate,
            updated_by: headers.user_id
        });

        var saveObj = calendarDetails.save({return_query: true});
        array.push(saveObj);
        data.batchObj = array;
        data.calendarData = saveQuery;
        callback(null, data);
    } catch (err) {
        callback(err, null);
    }
};

exports.getCreateEventTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var eventDate = body.date;
    var startDate = eventDate.split('-')[0];
    var endDate = eventDate.split('-')[1];
    var eventVenues = body.venue;
    var eventVenue = [];
    _.forEach(eventVenues, function(value, key){
        _.compact(eventVenue.push(value.name));
    });
    var params = {event_name: body.eventName,  start_date: startDate, end_date: endDate, venue_name: eventVenue};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        callback(err, result);
    })
};

exports.getDeleteTemplateObj = function(req, templates, callback) {
    var body =  req.body;
    var params = {event_name: body.eventName};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        callback(err, result);
    });
};

exports.getTodayEveObj = function(req, templates, callback) {
    var body =  req.body;
    var eventDate = body.date;
    var startDate = eventDate.split('-')[0];
    var endDate = eventDate.split('-')[1];
    var eventVenues = body.venue;
    var eventVenue = [];
    _.forEach(eventVenues, function(value, key){
        _.compact(eventVenue.push(value.name));
    });
    var params = {event_name: body.eventName,  start_date: startDate, end_date: endDate, venue_name: eventVenue};
    templateConverter.buildTemplateObj(templates, params, function(err, result) {
        callback(err, result);
    })
};

function throwConverterErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.EVENTS_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwConverterErr = throwConverterErr;
