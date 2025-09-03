/**
 * Created by Kiranmai A on 4/24/2017.
 */

var express = require('express')
    , baseService = require('../common/base.service')
    , constants = require('../../common/constants/constants')
    , models = require('../../models')
    , _ = require('lodash')
    , async = require('async')
    , eventConverter = require('../../converters/events.converter')
    , message = require('@nsa/nsa-commons').messages
    , responseBuilder = require('@nsa/nsa-commons').responseBuilder
    , constant = require('@nsa/nsa-commons').constants
    , dateUtils = require('@nsa/nsa-commons').dateUtils
    , eventTypeDomain = require('../common/eventsbase.service')
    , logger = require('../../../../../../config/logger');

var Events = function f(options) {
    var self = this;
};

Events.getEventTypes = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.EVENTS_TYPES_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.EVENTS_TYPES_PERMISSIONS);

        models.instance.SchoolEventType.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, eventConverter.convertEventTypeObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

Events.getEventType = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var eventTypeId = req.params.typeId;
    models.instance.SchoolEventType.findOne({
        event_type_id: models.uuidFromString(eventTypeId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Events.saveEventType = function(req, callback) {
    eventTypeDomain.eventTypeSaveObj(req, function(err, data){
        callback(err, data);
    });
};

Events.updateEventType = function(req, callback) {
    eventTypeDomain.eventTypeUpdateObj(req, function(err, data){
        callback(err, data);
    });
};

Events.deleteEventType = function(req, callback) {
    eventTypeDomain.eventTypeDeleteObj(req, function(err, data){
        callback(err, data);
    });
};

Events.findEventTypeInEvents = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var id = req.params.typeId;
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        event_type_id: models.uuidFromString(id)
    };
    models.instance.SchoolEvents.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Events.getEventVenues = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.EVENTS_VENUES_PERMISSIONS);
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.EVENTS_VENUES_PERMISSIONS);

        models.instance.SchoolVenueType.find(findQuery, {allow_filtering: true}, function(err, result){
            callback(err, eventConverter.convertEventVenueObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

Events.getEventVenue = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var venueTypeId = req.params.venueId;
    models.instance.SchoolVenueType.findOne({
        venue_type_id: models.uuidFromString(venueTypeId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Events.saveEventVenue = function(req, callback) {
    eventTypeDomain.eventVenueSaveObj(req, function(err, data){
        callback(err, data);
    });
};

Events.updateEventVenue = function(req, callback) {
    eventTypeDomain.eventVenueUpdateObj(req, function(err, data){
        callback(err, data);
    });
};

Events.deleteEventVenue = function(req, callback) {
    eventTypeDomain.eventVenueDeleteObj(req, function(err, data){
        callback(err, data);
    });
};

Events.findEventVenueInEvents = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var id = req.params.venueId;
    var findQuery = { tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        event_venue: {'$contains_key' :models.uuidFromString(id)}
    };
    models.instance.SchoolEvents.find(findQuery, {allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Events.saveEvent = function(req, data, callback) {
    eventTypeDomain.eventSaveObj(req, data, function(err, result){
        callback(err, result);
    });
};

Events.updateAttachment = function(req, callback) {
    eventTypeDomain.attachmentUpdateObj(req, function(err, result){
        callback(err, result);
    });
};

Events.deleteEvent = function(req, callback) {
    eventTypeDomain.eventDeleteObj(req, function(err, result){
        callback(err, result);
    });
};

Events.findCalendarDataObjs = function(req, data, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var eventId = data.event_id;
        var events = {};
        events['event_id'] = eventId
        var findQuery = { events: events,
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id)
        };
        models.instance.CalendarData.find(findQuery, { allow_filtering: true}, function(err, result){
            data['calendarObjs'] = result;
            callback(err, data);
        });
    } catch (err) {
        logger.debug(err);
    }

};

Events.deleteCalendarDetails = function(req, data, callback) {
    eventTypeDomain.calendarDataDeleteObj(req, data, function(err, result){
        callback(err, result);
    });
};

Events.deleteEventDetails = function(req, data, callback) {
    eventTypeDomain.eventDetailsDeleteObj(req, data, function(err, result){
        callback(err, result);
    });
};

Events.findEventDetail = function(req, data, callback) {
    try{
        var headers = baseService.getHeaders(req);
        var findQuery = baseService.getFindQuery(req);
        findQuery.event_id = data.event_id;
        models.instance.SchoolEventsDetails.find(findQuery,{ allow_filtering: true}, function(err, result){
            data['eventDetails'] = result;
            callback(null, data);
        });
    }catch (err){
        logger.debug(err);
        callback(err, null);
    }
};

Events.getEventById = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var eventId = req.params.id;
    models.instance.SchoolEvents.findOne({
        event_id: models.uuidFromString(eventId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        callback(err, eventConverter.eventObj(result));
    });
};

Events.getEveDetailsById = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var eventId = req.params.id;
    models.instance.SchoolEventsDetails.find({
        event_id: models.uuidFromString(eventId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id)
    }, { allow_filtering: true}, function(err, result){
        callback(err, result);
    });
};

Events.saveEventDetails = function(req, data, callback) {
    eventTypeDomain.eventDetailsSaveObj(req, data, function(err, result){
        callback(err, result);
    });
};

Events.updateEventDetails = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var eventDetailId = req.params.id;
    var query = { event_detail_id: models.uuidFromString(eventDetailId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year
    }

    var updateValues = {
        is_registered: req.body.isRegistered
    }
    models.instance.SchoolEventsDetails.update(query, updateValues, function(err, result){
        callback(err, result);
    });
};

Events.updateDetailsAttachments = function(req, data, callback) {
    eventTypeDomain.updateDetailsAttachmentsObj(req, data, function(err, result){
        callback(err, result);
    });
};

Events.saveCalendarData = function(req, data, callback) {
    eventTypeDomain.calendarDataSaveObj(req, data, function(err, result){
        callback(err, result);
    });
};


Events.getTodayEventsByActivity = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        activity_type_id: models.uuidFromString(req.params.activityId),
        academic_year: headers.academic_year,
        start_date : { '$lte':  models.datatypes.LocalDate.fromDate(new Date())},
        end_date: {'$gte': models.datatypes.LocalDate.fromDate(new Date())}
    }
    models.instance.SchoolEvents.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, eventConverter.todayEventObj(_.sortBy(result, 'updated_date').reverse()));
    });

};


Events.getTodayEvents = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        start_date : { '$lte':  models.datatypes.LocalDate.fromDate(new Date())},
        end_date: {'$gte': models.datatypes.LocalDate.fromDate(new Date())}
    }
    models.instance.SchoolEvents.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, eventConverter.todayEventObj(_.sortBy(result, 'updated_date').reverse()));
    });

};

Events.getLatestEventsByActivity = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        activity_type_id: models.uuidFromString(req.params.activityId),
        academic_year: headers.academic_year,
        start_date : { '$gt':  models.datatypes.LocalDate.fromDate(new Date())},
        end_date: {'$gt': models.datatypes.LocalDate.fromDate(new Date())}
    }
    models.instance.SchoolEvents.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, eventConverter.latestEvents(_.sortBy(result, 'updated_date').reverse()));
    });
};

Events.getLatestEvents = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        start_date : { '$gt':  models.datatypes.LocalDate.fromDate(new Date())},
        end_date: {'$gt': models.datatypes.LocalDate.fromDate(new Date())}
    }
    models.instance.SchoolEvents.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, eventConverter.latestEvents(_.sortBy(result, 'updated_date').reverse()));
    });
};

Events.getDateEvents = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var date = req.params.date;
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        start_date : { '$lte':  models.datatypes.LocalDate.fromString(date)},
        end_date: {'$gte': models.datatypes.LocalDate.fromString(date)}
    }
    models.instance.SchoolEvents.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, eventConverter.todayEventObj(_.sortBy(result, 'updated_date').reverse()));
    });

};


Events.getWeekEvents = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var date = new Date();
    var weekNo = dateUtils.getCurrentWeekNo(date);
    var dates = dateUtils.getDatesByYearOfWeek(weekNo, date.getFullYear());
    var weekDetails = [];
    async.map(dates, function (member, callback) {
        var findQuery = {
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id),
            academic_year: headers.academic_year,
            start_date : { '$lte':  models.datatypes.LocalDate.fromDate(member)},
            end_date: {'$gte': models.datatypes.LocalDate.fromDate(member)}
        }
        models.instance.SchoolEvents.find(findQuery, { allow_filtering: true}, function(err, result){
            if(err) {
                callback(err, null);
            } else {
                weekDetails.push(eventConverter.latestEvents(_.sortBy(result, 'updated_date').reverse()));
                callback(null, weekDetails);
            }

        });
    }, function allDone() {
        callback(null, _.flatten(weekDetails));
    }, callback);
};

Events.getWeekEventsByActivity = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var date = new Date();
    var weekNo = dateUtils.getCurrentWeekNo(date);
    var dates = dateUtils.getDatesByYearOfWeek(weekNo, date.getFullYear());
    var weekDetails = [];
    async.map(dates, function (member, callback) {
        var findQuery = {
            tenant_id: models.timeuuidFromString(headers.tenant_id),
            school_id: models.uuidFromString(headers.school_id),
            activity_type_id: models.uuidFromString(req.params.activityId),
            academic_year: headers.academic_year,
            start_date : { '$lte':  models.datatypes.LocalDate.fromDate(member)},
            end_date: {'$gte': models.datatypes.LocalDate.fromDate(member)}
        }
        models.instance.SchoolEvents.find(findQuery, { allow_filtering: true}, function(err, result){
            if(err) {
                callback(err, null);
            } else {
                weekDetails.push(eventConverter.latestEvents(result));
                callback(null, weekDetails);
            }

        });
    }, function allDone() {
        callback(null, _.flatten(weekDetails));
    }, callback);
};

Events.getAllPastEvents = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        start_date : { '$lt':  models.datatypes.LocalDate.fromDate(new Date())},
        end_date: {'$lt': models.datatypes.LocalDate.fromDate(new Date())}
    }
    models.instance.SchoolEvents.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, eventConverter.latestEvents(result));
    });

};

Events.getUserEventsByActivity = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        activity_type_id: models.uuidFromString(req.params.activityId),
        user_name: req.params.userId
    }
    models.instance.SchoolEventsDetails.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, eventConverter.latestEvents(result));
    });

};

Events.getUserEvents = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        user_name: req.params.userId
    }
    models.instance.SchoolEventsDetails.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, eventConverter.latestEvents(result));
    });

};

Events.getClassEvents = function(req, data, callback) {
    var headers = baseService.getHeaders(req);
    var data1 = [];
    if (data != null) {
        async.map(data.class_associations, function (member, callback) {
            var findQuery = {
                tenant_id: models.timeuuidFromString(headers.tenant_id),
                school_id: models.uuidFromString(headers.school_id),
                academic_year: headers.academic_year,
                class_id: models.uuidFromString(member.id),
                section_id: member.name

            }
            models.instance.SchoolEventsDetails.find(findQuery, { allow_filtering: true}, function(err, result){
                if(err) {
                    callback(err, null);
                } else {
                    data1.push(eventConverter.latestEvents(result));
                    callback(null, data1);
                }

            });
        }, function allDone() {
             data1 = _.uniqBy(_.flatten(data1), 'eventIdFormated');
            callback(null, data1);
        }, callback);
    } else {
        callback(null, data1);
    }
};


Events.getAllActivityTypes = function(req, callback) {
    var havePermissions = baseService.haveAnyPermissions(req, constant.ACTIVITY_TYPES_PERMISSIONS);
    havePermissions = true;
    if(havePermissions) {
        var findQuery = baseService.getFindAllQuery(req, false, constant.ACTIVITY_TYPES_PERMISSIONS);

        models.instance.SchoolActivityType.find(findQuery, {allow_filtering: true}, function(err, result) {
            callback(err, eventConverter.convertActivityTypeObjs(req, result));
        });
    } else {
        callback(null, []);
    }
};

Events.getActivityType = function(req, callback) {
    var queryObject = baseService.getFindQuery(req);
    queryObject['activity_type_id'] = models.uuidFromString(req.params.id);
    models.instance.SchoolActivityType.findOne(queryObject, {allow_filtering: true}, function(err, result) {
        callback(err, result);
    });
};

Events.saveActivityType = function(req, callback) {
    var activityTypeObj = req.body;
    activityTypeObj = baseService.updateIdsFromHeader(req, activityTypeObj, false);
    activityTypeObj.activity_type_id = models.uuid();
    var leaveType = new models.instance.SchoolActivityType(activityTypeObj);
    leaveType.save(function (err, result) {
        result['message'] = message.nsa4833;
        callback(err, result);
    });
};

Events.updateActivityType = function(req, callback) {
    var activityTypeObj = req.body, queryObject = baseService.getFindQuery(req);
    activityTypeObj = baseService.updateIdsFromHeader(req, activityTypeObj, false);
    queryObject['activity_type_id'] = models.uuidFromString(req.params.id);
    delete activityTypeObj.school_id;
    delete activityTypeObj.tenant_id;
    delete activityTypeObj.activity_type_id;
    delete activityTypeObj.created_firstname;
    models.instance.SchoolActivityType.update(queryObject, activityTypeObj, function(err, result) {
        result['message'] = message.nsa4835;
        callback(err, result);
    });
};


Events.deleteActivityType = function(req, callback) {
    var queryObject = baseService.getFindQuery(req);
    queryObject['activity_type_id'] = models.uuidFromString(req.params.id);
    models.instance.SchoolActivityType.findOne(queryObject, {allow_filtering: true}, function(err, result){
        if(_.isEmpty(result)) {
            callback(err, message.nsa4831);
        } else {
            models.instance.SchoolActivityType.delete(queryObject, function(err, delResult){
                delResult['message'] = message.nsa4837;
                callback(err, delResult);
            });
        }
    });
};

Events.getCalendarData = function (req, callback) {
    models.instance.CalendarData.find({}, function (err, result) {
        callback(err, result)
    })
};

function getFindQuery(req){
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;

    return findQuery;
}

Events.deleteEventsAttachment = function(req, data, callback) {
    try{
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var findQuery = getFindQuery(req);
        findQuery.event_id = models.uuidFromString(req.params.id);
        var existingFiles = baseService.getExistingFiles(body);
        req.body.attachments = existingFiles;
        var updateValues = { updated_by : headers.user_id, updated_username : headers.user_name, attachments: baseService.getMapFromFormattedMap(existingFiles)};
        var updateQuery = models.instance.SchoolEvents.update(findQuery, updateValues,{return_query: true});
        data.batchObj = [updateQuery];
        data.event_id = findQuery.event_id;
        data.s3DeleteIds = [req.body.curentFile];
        callback(null, data);
    }catch (err){
        callback(err, null)
    }
};


Events.deleteEventDetailsAttachment = function(req, data, callback) {
    try{
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var findQuery = getFindQuery(req);
        if(_.isEmpty(data.eventDetails)){
            callback(null, data);
        }else {
            var array = data.batchObj;
            var existingFiles = baseService.getExistingFiles(body);
            var updateValues = { updated_by : headers.user_id, updated_username : headers.user_name, attachments: baseService.getMapFromFormattedMap(existingFiles)};
            _.forEach(data.eventDetails, function(value, key) {
                findQuery.event_detail_id = value.event_detail_id;
                var updateQuery = models.instance.SchoolEventsDetails.update(findQuery, updateValues, {return_query: true});
                array.push(updateQuery);
                if (data.eventDetails.length -1 === key) {
                    data.batchObj = array;
                    callback(null, data);
                }
            });
        }
    }catch (err){
        logger.debug(err);
        callback(err, null);
    }
};

Events.deleteAttachmentInCalendarDetails = function(req, data, callback) {
    try {
        var headers = baseService.getHeaders(req);
        var body = req.body;
        var array = data.batchObj;
        var existingFiles = baseService.getExistingFiles(body);
        var queryObj = {id: models.uuidFromString(body.calendarData.calendar_id), created_date: body.calendarData.created_date};
        var updateValues = { updated_by : headers.user_id, updated_username : headers.user_name, attachments: baseService.getMapFromFormattedMap(existingFiles)};
        var deleteObj = models.instance.CalendarData.update(queryObj, updateValues, {return_query: true});
        array.push(deleteObj);
        data.batchObj = array;
        callback(null, data);
    } catch (err) {
        logger.debug(err);
        callback(err, null);
    }
};

//For IOS Start
//this method have to reuse from above getLatestEvents method
Events.getEvents = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.start_date = { '$gte':  models.datatypes.LocalDate.fromDate(new Date())};
    findQuery.end_date = {'$gte': models.datatypes.LocalDate.fromDate(new Date())};
    if(req.query.activityTypeId) {
        findQuery.activity_type_id = models.uuidFromString(req.query.activityTypeId);
    }
    models.instance.SchoolEvents.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, eventConverter.latestEvents(_.sortBy(result, 'start_date')));
    });
};

//this method have to reuse from above getAllPastEvents method
Events.getPastEvents = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = baseService.getFindQuery(req);
    findQuery.academic_year = headers.academic_year;
    findQuery.start_date = { '$lt':  models.datatypes.LocalDate.fromDate(new Date())};
    findQuery.end_date = {'$lt': models.datatypes.LocalDate.fromDate(new Date())};
    models.instance.SchoolEvents.find(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, eventConverter.latestEvents(_.sortBy(result, 'updated_date').reverse()));
    });
};

Events.getUserEventsByEventId = function(req, callback) {
    var headers = baseService.getHeaders(req);
    var findQuery = {
        event_id: models.uuidFromString(req.params.eventId),
        tenant_id: models.timeuuidFromString(headers.tenant_id),
        school_id: models.uuidFromString(headers.school_id),
        academic_year: headers.academic_year,
        user_name: req.params.userId
    }
    models.instance.SchoolEventsDetails.findOne(findQuery, { allow_filtering: true}, function(err, result){
        callback(err, result);
    });

};
//For IOS End

module.exports = Events;
