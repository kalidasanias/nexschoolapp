/**
 * Created by senthil on 4/29/2017.
 */

var requestParam = require('../common/domains/RequestParam');
var featureDomain = require('../common/domains/Feature'),
    baseService = require('../services/common/base.service'),
    _ = require('lodash'),
    dateService = require('../utils/date.service'),
    logger = require('../../../../../config/logger'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants;

exports.convertEventTypeObjs = function(req, result) {
    var eventTypeObjs = [];
    try {
        if(!_.isEmpty(result)) {
            result.forEach(function (eventType) {
                var eventTypeObj = {};
                    eventTypeObj.event_type_id= eventType['event_type_id'] || 0,
                    eventTypeObj.event_type_name = eventType['event_type_name'] || '',
                    eventTypeObj.description = eventType['description'] || '',
                    eventTypeObj.tenant_id = eventType['tenant_id'] || 0,
                    eventTypeObj.school_id = eventType['school_id'] || 0,
                    eventTypeObj.updated_by = eventType['updated_by'] || '',
                    eventTypeObj.updated_username = eventType['updated_username'] || '',
                    eventTypeObj.updated_date = dateService.getFormattedDateWithoutTime(eventType['updated_date']) || '',
                    eventTypeObj.editPermissions = baseService.havePermissionsToEdit(req, constant.EVENTS_TYPES_PERMISSIONS, eventType['created_by']);
                eventTypeObjs.push(eventTypeObj);
            });
        }
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4821);
    }
    return eventTypeObjs;
};

exports.convertActivityTypeObjs = function(req, result) {
    var activityTypeObjs = [];
    try {
        if(!_.isEmpty(result)) {
            result.forEach(function (eventType) {
                var activityTypeObj = {};
                activityTypeObj.activity_type_id= eventType['activity_type_id'] || 0,
                    activityTypeObj.activity_type_name = eventType['activity_type_name'] || '',
                    activityTypeObj.description = eventType['description'] || '',
                    activityTypeObj.tenant_id = eventType['tenant_id'] || 0,
                    activityTypeObj.school_id = eventType['school_id'] || 0,
                    activityTypeObj.updated_by = eventType['updated_by'] || '',
                    activityTypeObj.updated_username = eventType['updated_username'] || '',
                    activityTypeObj.updated_date = dateService.getFormattedDateWithoutTime(eventType['updated_date']) || '',
                    activityTypeObj.editPermissions = baseService.havePermissionsToEdit(req, constant.ACTIVITY_TYPES_PERMISSIONS, eventType['created_by']);
                activityTypeObjs.push(activityTypeObj);
            });
        }
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4831);
    }
    return activityTypeObjs;
};

exports.convertEventVenueObjs = function(req, result) {
    var eventVenueObjs = [];
    try {
        if(!_.isEmpty(result)) {
            result.forEach(function (eventVenue) {
                var eventVenueObj = {};
                    eventVenueObj.venue_type_id= eventVenue['venue_type_id'] || 0,
                    eventVenueObj.venue_type_name = eventVenue['venue_type_name'] || '',
                    eventVenueObj.location = eventVenue['location'] || '',
                    eventVenueObj.tenant_id = eventVenue['tenant_id'] || 0,
                    eventVenueObj.school_id = eventVenue['school_id'] || 0,
                    eventVenueObj.updated_by = eventVenue['updated_by'] || '',
                    eventVenueObj.updated_username = eventVenue['updated_username'] || '',
                    eventVenueObj.updated_date = dateService.getFormattedDateWithoutTime(eventVenue['updated_date']) || '',
                    eventVenueObj.editPermissions = baseService.havePermissionsToEdit(req, constant.EVENTS_VENUES_PERMISSIONS, eventVenue['created_by']);
                eventVenueObjs.push(eventVenueObj);
            });
        }
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4821);
    }
    return eventVenueObjs;
};

exports.todayEventObj = function(result) {
    var todayEventObjs = [];
    try {
        if(!_.isEmpty(result)) {
            result.forEach(function (todayEvent) {

                var todayEventObj = {};
                var date = dateService.getMonthAndDate(new Date());
                var attachmentsObj = baseService.getFormattedMap(todayEvent['attachments']);
                if(!_.isEmpty(attachmentsObj)) {
                    _.forEach(attachmentsObj, function(val){
                        var fileName = val.id.split('/');
                        val['fileName'] = fileName[2];
                    })
                }
                    todayEventObj.attachments= attachmentsObj,
                    todayEventObj.eventId= todayEvent['event_id'],
                    todayEventObj.eventName = todayEvent['event_name'],
                    todayEventObj.eventTypeName = todayEvent['event_type_name'],
                    todayEventObj.eventTypeId = todayEvent['event_type_id'],
                    todayEventObj.activityTypeName = todayEvent['activity_type_name'],
                    todayEventObj.activityTypeId = todayEvent['activity_type_id'],
                    todayEventObj.startDate = dateService.getFormattedDate(todayEvent['start_date']),
                    todayEventObj.endDate = dateService.getFormattedDate(todayEvent['end_date']),
                    todayEventObj.eventDesc = todayEvent['description'],
                    todayEventObj.startTime = todayEvent['start_time'],
                    todayEventObj.endTime = todayEvent['end_time'],
                    todayEventObj.month = date.month,
                    todayEventObj.date = date.day,
                    todayEventObj.latitude = todayEvent['latitude'],
                    todayEventObj.longitude = todayEvent['longitude'],
                    todayEventObj.mapLocation = todayEvent['map_location'],
                    todayEventObj.updatedUserName =  todayEvent['updated_username'],
                    todayEventObj.updatedBy = todayEvent['updated_by'],
                    todayEventObj.updatedDate = dateService.getFormattedDate(todayEvent['updated_date'])
                todayEventObjs.push(todayEventObj);
            });
        }
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4821);
    }
    return todayEventObjs;
};

exports.eventObj = function(event) {
    var eventObj = {};
    try {
        if(!_.isEmpty(event)) {
            var venue = baseService.getFormattedMap(event['event_venue']);
            var attachmentsObj = baseService.getFormattedMap(event['attachments']);
            if(!_.isEmpty(attachmentsObj)) {
                _.forEach(attachmentsObj, function(val){
                    var fileName = val.id.split('/');
                    val['fileName'] = fileName[2];
                })
            }
            eventObj.attachments= attachmentsObj,
                eventObj.eventId= event['event_id'],
                eventObj.eventName = event['event_name'],
                eventObj.eventTypeName = event['event_type_name'],
                eventObj.eventTypeId = event['event_type_id'],
                eventObj.activityTypeName = event['activity_type_name'],
                eventObj.activityTypeId = event['activity_type_id'],
                eventObj.startDate = dateService.getFormattedDateWithoutTime(event['start_date']),
                eventObj.endDate = dateService.getFormattedDateWithoutTime(event['end_date']),
                eventObj.startTime = event['start_time'],
                eventObj.endTime = event['end_time'],
                eventObj.venues = venue,
                eventObj.eventDesc = event['description'],
                eventObj.latitude = event['latitude'],
                eventObj.longitude = event['longitude'],
                eventObj.mapLocation = event['map_location'],
                eventObj.updatedUserName =  event['updated_username'],
                eventObj.isMandatory =  event['is_mandatory'],
                eventObj.updatedBy = event['updated_by'],
                eventObj.updatedDate = dateService.getFormattedDate(event['updated_date'])
        }

    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4821);
    }
    return eventObj;
};

exports.latestEvents = function(result) {
    var latestEventsObjs = [];
    try {
        if(!_.isEmpty(result)) {
            result.forEach(function (todayEvent) {
                var todayEventObj = {};
                var date = dateService.getMonthAndDate(new Date(todayEvent['start_date'] != null ? todayEvent['start_date'].toString() : null));
                var attachmentsObj = baseService.getFormattedMap(todayEvent['attachments']);
                if(!_.isEmpty(attachmentsObj)) {
                    _.forEach(attachmentsObj, function(val){
                        var fileName = val.id.split('/');
                        val['fileName'] = fileName[2];
                    })
                }
                todayEventObj.attachments= attachmentsObj,
                    todayEventObj.eventId= todayEvent['event_id'],
                    todayEventObj.eventName = todayEvent['event_name'],
                    todayEventObj.eventTypeName = todayEvent['event_type_name'],
                    todayEventObj.eventTypeId = todayEvent['event_type_id'],
                    todayEventObj.activityTypeId = todayEvent['activity_type_id'],
                    todayEventObj.activityTypeName = todayEvent['activity_type_name'],
                    todayEventObj.startDate = dateService.getFormattedDate(todayEvent['start_date']),
                    todayEventObj.endDate = dateService.getFormattedDate(todayEvent['end_date']),
                    todayEventObj.eventDesc = todayEvent['description'],
                    todayEventObj.startTime = todayEvent['start_time'],
                    todayEventObj.endTime = todayEvent['end_time'],
                    todayEventObj.month = date.month,
                    todayEventObj.date = date.day,
                    todayEventObj.latitude = todayEvent['latitude'],
                    todayEventObj.longitude = todayEvent['longitude'],
                    todayEventObj.mapLocation = todayEvent['map_location'],
                    todayEventObj.updatedUserName =  todayEvent['updated_username'],
                    todayEventObj.updatedBy = todayEvent['updated_by'],
                    todayEventObj.updatedDate = dateService.getFormattedDate(todayEvent['updated_date']),
                    todayEventObj.eventIdFormated = (todayEvent['event_id']).toString();
                latestEventsObjs.push(todayEventObj);
            });
        }
    }
    catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4821);
    }
    return latestEventsObjs;
};

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.EVENTS_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;
