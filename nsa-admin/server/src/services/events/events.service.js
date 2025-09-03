/**
 * Created by Kiranmai A on 4/24/2017.
 */

var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    BaseError = require('@nsa/nsa-commons').BaseError,
    async = require('async'),
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    es = require('../search/elasticsearch/elasticsearch.service'),
    notificationService = require('../sms/notifications/notification.service'),
    nsacu = require('@nsa/nsa-bodybuilder').calendarUtil,
    dateService = require('../../utils/date.service.js'),
    nsaElasticSearch = require('@nsa/nsa-elasticsearch'),
    dateUtils = require('@nsa/nsa-commons').dateUtils,
    taxanomyUtils = require('@nsa/nsa-commons').taxanomyUtils,
    logger = require('../../../config/logger'),
    _ = require('lodash'),
    gallary = require('../gallery/gallery.service');

const myEventsJson = require('../../test/json-data/events/get-my-events.json');
const todayEventsJson = require('../../test/json-data/events/get-today-events.json');
const allLatestEventsJson = require('../../test/json-data/events/get-latest-event.json');
const allPastEventsJson = require('../../test/json-data/events/get-past-events.json');

exports.getEventTypes = function(req, res) {
    nsaCassandra.Events.getEventTypes(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4801));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};


exports.getEventType = function(req, res) {
    nsaCassandra.Events.findEventTypeInEvents(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            nsaCassandra.Events.getEventType(req, function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4802));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    })
};




/*exports.getEventType = function(req, res) {
    nsaCassandra.Events.getEventType(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4802));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};*/

exports.saveEventType = function(req, res) {
    async.waterfall([
        saveEventTypes.bind(null, req),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, req, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4804));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa4803});
        }
    });
};

exports.updateEventType = function(req, res) {
    async.waterfall([
        updateEventTypes.bind(null, req),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, req, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4806));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa4805});
        }
    });
};

exports.deleteEventType = function(req, res) {
    nsaCassandra.Events.findEventTypeInEvents(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            async.waterfall([
                deleteEventTypes.bind(null, req),
                insertAuditLog.bind(),
                executeBatch.bind()
            ], function(err, req, data) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4808));
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa4807});
                }
            });
        }
    })
};

function deleteEventTypes(req, callback) {
    nsaCassandra.Events.deleteEventType(req, function(err, data) {
        data.features = {featureId : constant.EVENTS, actions : constant.DELETE, featureTypeId : data.event_type_id};
        callback(err, req, data);
    })
};
exports.deleteEventTypes = deleteEventTypes;

function deleteEventVenues(req, callback) {
    nsaCassandra.Events.deleteEventVenue(req, function(err, data) {
        data.features = {featureId : constant.EVENTS, actions : constant.DELETE, featureTypeId : data.venue_type_id};
        callback(err, req, data);
    })
};
exports.deleteEventVenues = deleteEventVenues;

function updateEventTypes(req, callback) {
    nsaCassandra.Events.updateEventType(req, function(err, data) {
        data.features = {featureId : constant.EVENTS, actions : constant.UPDATE, featureTypeId : data.event_type_id};
        callback(err, req, data);
    })
};
exports.updateEventTypes = updateEventTypes;


function saveEventTypes(req, callback) {
    nsaCassandra.Events.saveEventType(req, function(err, data) {
        data.features = {featureId : constant.EVENTS, actions : constant.CREATE, featureTypeId : data.event_type_id};
        callback(err, req, data);
    })
};
exports.saveEventTypes = saveEventTypes;

function saveEventVenues(req, callback) {
    nsaCassandra.Events.saveEventVenue(req, function(err, data) {
        data.features = {featureId : constant.EVENTS, actions : constant.CREATE, featureTypeId : data.venue_type_id};
        callback(err, req, data);
    })
};
exports.saveEventVenues = saveEventVenues;

function insertAuditLog(req, data, callback) {
    nsaCassandra.AuditLog.saveLogs(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.insertAuditLog = insertAuditLog;

function executeBatch(req, data, callback) {
    nsaCassandra.Base.baseService.executeBatch(data.batchObj, function(err, result) {
        callback(err, req, data);
    })
};
exports.executeBatch = executeBatch;

exports.getEventVenues = function(req, res) {
    nsaCassandra.Events.getEventVenues(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4809));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};



exports.getEventVenue = function(req, res) {
    nsaCassandra.Events.findEventVenueInEvents(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            nsaCassandra.Events.getEventVenue(req, function (err, result) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4810));
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    })
};



/*exports.getEventVenue = function(req, res) {
    nsaCassandra.Events.getEventVenue(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4810));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};*/

exports.saveEventVenue = function(req, res) {
    async.waterfall([
        saveEventVenues.bind(null, req),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, req, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4804));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa4811});
        }
    });
};

exports.updateEventVenue = function(req, res) {
    async.waterfall([
        updateEventVenues.bind(null, req),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, req, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4814));
        } else {
            events.emit('JsonResponse', req, res, {message: message.nsa4813});
        }
    });
};

function updateEventVenues(req, callback) {
    nsaCassandra.Events.updateEventVenue(req, function(err, data) {
        data.features = {featureId : constant.EVENTS, actions : constant.UPDATE, featureTypeId : data.venue_type_id};
        callback(err, req, data);
    })
};
exports.updateEventTypes = updateEventTypes;

exports.deleteEventVenue = function(req, res) {
    nsaCassandra.Events.findEventVenueInEvents(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4018));
        } else if (!_.isEmpty(result)) {
            events.emit('ErrorJsonResponse', req, res, {message: message.nsa10002});
        } else {
            async.waterfall([
                deleteEventVenues.bind(null, req),
                insertAuditLog.bind(),
                executeBatch.bind()
            ], function(err, req, data) {
                if (err) {
                    logger.debug(err);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4808));
                } else {
                    events.emit('JsonResponse', req, res, {message: message.nsa4807});
                }
            });
        }
    });
};

exports.saveEvent = function(req, res) {
    var data = [];
    async.waterfall([
        buildTaxanomyObj.bind(null, req, data),
        saveEvents.bind(),
        getUsers.bind(),
        saveEventsDetails.bind(),
        saveCalendarDetails.bind(),
        insertAuditLog.bind(),
        executeBatch.bind(),
        saveCalendarDataInES.bind()
    ], function(err, req, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4818));
        } else {
            sendNotification(req, data, function(err1, result){
                if(err1) {
                    logger.debug(err1);
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err1, message.nsa4818));
                } else {
                    result['message'] = message.nsa4817;
                    result['event_id'] = data.event_id;
                    
                    events.emit('JsonResponse', req, res, result);
                }
            })
        }
    });
};

function buildTaxanomyObj(req, data, callback) {
    taxanomyUtils.buildTaxanomyObj(req, function(err, result){
        data['taxanomy'] = result;
        callback(err, req, data)
    })
}
exports.buildTaxanomyObj = buildTaxanomyObj;

exports.updateAttachments = function(req, res) {
    async.waterfall([
        updateAttachment.bind(null, req),
        findEventDetails.bind(),
        updateDetailsAttachments.bind(),
        insertAuditLog.bind(),
        executeBatch.bind(),
    ], function(err, req, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4702));
        } else {
            var output = {message: message.nsa4817};
            events.emit('JsonResponse', req, res, output);
        }
    });
};

exports.updateEventDetails = function(req, res) {
    nsaCassandra.Events.updateEventDetails(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res,  message.nsa4702);
        } else {
            var output = {message: message.nsa4805};
            events.emit('JsonResponse', req, res, output);
        }
    })
};



function updateDetailsAttachments(req, data, callback) {
    nsaCassandra.Events.updateDetailsAttachments(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.updateDetailsAttachments = updateDetailsAttachments;

function updateAttachment(req, callback) {
    nsaCassandra.Events.updateAttachment(req, function(err, result) {
        result.features = {featureId : constant.EVENTS, actions : constant.UPDATE, featureTypeId : result.event_id};
        callback(err, req, result);
    })
};
exports.updateAttachment = updateAttachment;

exports.deleteAttachments = function(req, res) {
    var data = [];
    async.waterfall([
        deleteEventsAttachments.bind(null, req, data),
        findEventDetails.bind(),
        deleteEventDetailsAttachments.bind(),
        deleteAttachmentsInCalendarDetails.bind(),
        insertAuditLog.bind(),
        executeBatch.bind()
    ], function(err, req, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4820));
        } else {
            req.body.seletedImageIds = data.s3DeleteIds;
            gallary.deleteS3Src(req, function(err1, result1){
                if(err1){
                    events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4704));
                }else {
                    var output = { message: message.nsa4703, data: req.body};
                    events.emit('JsonResponse', req, res, output);
                }
            });
        }
    });
};

function deleteEventsAttachments(req,data, callback) {
    nsaCassandra.Events.deleteEventsAttachment(req, data, function(err, result) {
        result.features = {featureId : constant.EVENTS, actions : constant.UPDATE, featureTypeId : result.event_id};
        callback(err, req, result);
    })
};
exports.deleteEventsAttachments = deleteEventsAttachments;

function deleteEventDetailsAttachments(req, data, callback) {
    nsaCassandra.Events.deleteEventDetailsAttachment(req, data, function(err, result) {
        callback(err, req, result);
    });
};
exports.deleteEventDetailsAttachments = deleteEventDetailsAttachments;

function deleteAttachmentsInCalendarDetails(req, data, callback) {
    nsaCassandra.Events.deleteAttachmentInCalendarDetails(req, data, function(err, result) {
        callback(err, req, result);
    });
};
exports.deleteAttachmentsInCalendarDetails = deleteAttachmentsInCalendarDetails;

exports.deleteEvent = function(req, res) {
    async.waterfall([
        deleteEvents.bind(null, req),
        findEventDetails.bind(),
        deleteEventDetails.bind(),
        deleteCalendarDetails.bind(),
        insertAuditLog.bind(),
        executeBatch.bind(),
        deleteCalendarDataInES.bind()
    ], function(err, req, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4820));
        } else {
            if(!_.isEmpty(req.body.attachments)){
                req.body.seletedImageIds  = req.body.attachments.map(function(a) {return a.id;});
                gallary.deleteS3Src(req, function(err1, result1){
                    if(err1){
                        logger.debug(err1);
                        events.emit('ErrorJsonResponse', req, res, {message: message.nsa4820});
                    }else{
                        events.emit('JsonResponse', req, res, {message: message.nsa1213});
                    }
                })
            }else {
                events.emit('JsonResponse', req, res, {message: message.nsa4819});
            }
            /*sendDeleteNotification(req, data, function(err, result){
                if(err) {
                    events.emit('ErrorJsonResponse', req, res, err);
                } else {
                    events.emit('JsonResponse', req, res, result);
                }
            })*/
        }
    });
};

function sendDeleteNotification(req, data, callback) {
    async.waterfall([
            getUserContacts.bind(null, req, data),
            getDeleteFeatureTemplate.bind(),
            getDeleteTemplateObj.bind(),
            buildFeatureNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind()
        ],
        function (err, data) {
            callback(err, data)
        }
    )
};
exports.sendDeleteNotification = sendDeleteNotification;

function getUserContacts(req, data, callback) {
    var userNames = _.map(data.eventDetails, 'user_name');
    data['userNames'] = userNames;
    es.getUsersByLists(req, data, function(err, result){
        callback(err, req, result);
    })
};
exports.getUserContacts = getUserContacts;

function getDeleteFeatureTemplate(req, users, callback) {
    var data = {featureId : constant.EVENTS, subFeatureId: constant.DELETE_EVENTS, action: constant.DELETE_ACTION, userType: constant.STUDENT};
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getDeleteFeatureTemplate = getDeleteFeatureTemplate;

function getDeleteTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.eventsbase.getDeleteTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getDeleteTemplateObj = getDeleteTemplateObj;

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;


function deleteCalendarDataInES(req, data, callback) {
    var updateParams = nsacu.deleteEventsDocParams(req);
    nsaElasticSearch.delete.deleteDoc(updateParams, function (err, result) {
        callback(err, req, data);
    })
};
exports.deleteCalendarDataInES = deleteCalendarDataInES;

function findCalendarDataObjs(req, data, callback) {
    nsaCassandra.Events.findCalendarDataObjs(req, data, function(err, result){
        callback(err, req, result);
    })
};

function deleteCalendarDetails(req, data, callback) {
    nsaCassandra.Events.deleteCalendarDetails(req, data, function(err, result){
        callback(err, req, result);
    })
};
exports.deleteCalendarDetails = deleteCalendarDetails;

function deleteEventDetails(req, data, callback) {
    nsaCassandra.Events.deleteEventDetails(req, data, function(err, result) {
        callback(err, req, result);
    });
};
exports.deleteEventDetails = deleteEventDetails;

function findEventDetails(req, data, callback) {
    nsaCassandra.Events.findEventDetail(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.findEventDetails = findEventDetails;

function deleteEvents(req, callback) {
    nsaCassandra.Events.deleteEvent(req, function(err, result) {
        result.features = {featureId : constant.EVENTS, actions : constant.DELETE, featureTypeId : result.event_id};
        callback(err, req, result);
    })
};
exports.deleteEvents = deleteEvents;

exports.getAllEventsByActivity = function(req, res) {
    async.parallel({
        myEvents : nsaCassandra.Events.getUserEventsByActivity.bind(null, req),
        today: nsaCassandra.Events.getTodayEventsByActivity.bind(null, req),
        latest: nsaCassandra.Events.getLatestEventsByActivity.bind(null, req),
        week: nsaCassandra.Events.getWeekEventsByActivity.bind(null, req)
    }, function(err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4821));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

exports.getAllEvents = function(req, res) {
    async.parallel({
        myEvents : nsaCassandra.Events.getUserEvents.bind(null, req),
        today: nsaCassandra.Events.getTodayEvents.bind(null, req),
        latest: nsaCassandra.Events.getLatestEvents.bind(null, req),
        week: nsaCassandra.Events.getWeekEvents.bind(null, req)
    }, function(err, data){
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4821));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

exports.getEveDetailsByEveId = function(req, res) {
    async.parallel({
        events: getEveById.bind(null, req),
        eventDetails: getEveDetailsById.bind(null, req)
    }, function(err, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4821));
        } else {
            getEveDetails(req, res, data)
        }
    });
};

function getEveById(req, callback) {
    nsaCassandra.Events.getEventById(req, function(err, result) {
        callback(err, result);
    })
};
exports.getEveById = getEveById;

function getEveDetailsById(req, callback) {
    nsaCassandra.Events.getEveDetailsById(req, function(err, result) {
        callback(err, result);
    })
};
exports.getEveDetailsById = getEveDetailsById;

function getEveDetails(req, res, data) {
    var eventDetails = {}
    if(!_.isEmpty(data.events)) {
        eventDetails['events'] = data.events;
        eventDetails['eventDetails'] = data.eventDetails;
        if(!_.isEmpty(data.eventDetails)) {
            var registered = _.filter(data.eventDetails, 'is_registered');
            var declined = _.filter(data.eventDetails, ['is_registered', false]);
            var notResponded = data.eventDetails.length - (registered.length + declined.length);
            eventDetails['registered'] = registered.length;
            eventDetails['declined'] = declined.length;
            eventDetails['notResponded'] = notResponded;
        }
        events.emit('JsonResponse', req, res, eventDetails);
    } else {
        events.emit('JsonResponse', req, res, eventDetails);
    }
}

function sendNotification(req, data, callback) {
    async.waterfall([
            buildTaxanomyObj.bind(null, req, data),
            getFeatureTemplate.bind(),
            getCreateEventTemplateObj.bind(),
            buildFeatureNotificationObj.bind(),
            notificationService.sendAllNotification.bind(),
            notificationService.saveNotificationInfo.bind()
        ],
        function (err, data) {
            callback(err, data)
        }
    )
};
exports.sendNotification = sendNotification;

function getFeatureTemplate(req, users, callback) {
    var data = {featureId : constant.EVENTS, subFeatureId: constant.CREATE_EVENTS, action: constant.CREATE_ACTION, userType: constant.STUDENT};
    nsaCassandra.Feature.getFeatureTemplate(req, data, function(err, result){
        callback(err, req, users, result);
    })
};
exports.getFeatureTemplate = getFeatureTemplate;

function getCreateEventTemplateObj(req, users, templates, callback) {
    nsaCassandra.Base.eventsbase.getCreateEventTemplateObj(req, templates, function(err, templateObj) {
        callback(err, req, users, templateObj);
    })
};
exports.getCreateEventTemplateObj = getCreateEventTemplateObj;

function buildFeatureNotificationObj(req, users, templateObj, callback) {
    nsaCassandra.NotificationConverter.buildFeatureNotificationObj(req, users, templateObj, function(err, notificationObj) {
        callback(err, req, notificationObj);
    })
};
exports.buildFeatureNotificationObj = buildFeatureNotificationObj;

function saveCalendarDataInES(req, data, callback) {
    var updateParams = nsacu.buildEventsDocQuery(req, data);
    nsaElasticSearch.update.updateDoc(updateParams, function (err, result) {
        callback(err, req, data);
    })
};
exports.saveCalendarDataInES = saveCalendarDataInES;

function saveCalendarDetails(req, data, callback) {
    nsaCassandra.Events.saveCalendarData(req, data, function(err, result){
        callback(err, req, result);
    })
};
exports.saveCalendarDetails = saveCalendarDetails;

function getUsers(req, data, callback) {
    notificationService.getContacts(req, function(err, result) {
        data['users'] = result;
        data['students'] = req.body.students || null;
        callback(err, req, data);
    });
};
exports.getUsers = getUsers;

function saveEvents(req, data, callback) {
    nsaCassandra.Events.saveEvent(req, data, function(err, result) {
        result.features = {featureId : constant.EVENTS, actions : constant.CREATE, featureTypeId : result.event_id};
        callback(err, req, result);
    })
};
exports.saveEvents = saveEvents;

function saveEventsDetails(req, data, callback) {
    nsaCassandra.Events.saveEventDetails(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.saveEventsDetails = saveEventsDetails;

exports.getEventsByMonthOfYear = function(req, res) {
    getMonthOfYearUserEvents(req, function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4821));
        } else {
            events.emit('JsonResponse', req, res, buildCalendarObj(result));
        }
    });
};

function getMonthOfYearUserEvents(req, callback) {
    var queryParams = req.query;
    var monthNo = queryParams.monthNo;  // Ex: 17
    var year = queryParams.year;   //Ex: 2017
    var dates = dateUtils.getDatesByMonthOfYear(monthNo, year);
    var params = {};
    params.startDate = dates.startDate;
    params.endDate = dates.endDate;
    var searchParams = nsacu.getDatesRangeQueryParam(req, params);
    nsaElasticSearch.search.getCalendarObjs(searchParams, function (err, result) {
        if (err) {
            logger.debug(err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};
exports.getMonthOfYearUserEvents = getMonthOfYearUserEvents;

function buildCalendarObj(result) {
    var calendarObjs = [];
    try{
        if(!_.isEmpty(result)) {
            _.forEach(result, function(value, key){
                var dates = []
                var startDate = value.events.start_date;
                var endDate = value.events.end_date;
                var startTime = value.events.start_time;
                var endTime = value.events.end_time;
                var sDate1 = dateService.getFormattedDateWithDay(startDate)
                var eDate1 = dateService.getFormattedDateWithDay(endDate)
                dates = dateUtils.getDatesBetweenTwoDates(new Date(startDate.toString()), new Date(endDate.toString()));
                var calendarObj = {};

                var sTime = dateUtils.convertTo24Hour(startTime.toLowerCase());
                var eTime = dateUtils.convertTo24Hour(endTime.toLowerCase());
                var sDate = dateUtils.setTimeToDate(startDate, sTime);
                var eDate = dateUtils.setTimeToDate(endDate, eTime);
                calendarObj['title'] = value.events.event_name;
                var eventDesc = value.events.event_name;
                var dateTime =  sDate1 + ','  + dateUtils.convertTo12Hour(startTime.toString()) +  ' - ' + eDate1 + ',' + dateUtils.convertTo12Hour(endTime.toString())
                calendarObj['description'] = {'Event Name' : eventDesc, 'Date & Time': dateTime};
                calendarObj['start'] = sDate;
                calendarObj['end'] = eDate;
                calendarObj['event_id'] = value.events.event_id;
                calendarObj['calendar_id'] = value.id;
                calendarObj['created_date'] = value.created_date;
                calendarObjs.push(calendarObj);
            });
        }
    } catch (err) {
        logger.debug(err);
        return buildErrResponse(err, message.nsa4821);
    }
    return calendarObjs;
};
exports.buildCalendarObj = buildCalendarObj;

exports.getUserEvents = function(req, res) {
    nsaCassandra.Events.getUserEvents(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4810));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getTodayEvents = function(req, res) {
    nsaCassandra.Events.getTodayEvents(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4821));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getAllLatestEvents = function(req, res) {
    nsaCassandra.Events.getLatestEvents(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4821));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getDateEvents = function(req, res) {
    nsaCassandra.Events.getDateEvents(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4821));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getAllPastEvents = function(req, res) {
    nsaCassandra.Events.getAllPastEvents(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4821));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.getAllUserClassEvents = function(req, res) {
    var data = [];
    async.waterfall([
        getEmpClasses.bind(null, req, data),
        getClsEveDetails.bind(),
    ], function(err, req, data) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4821));
        } else {
            events.emit('JsonResponse', req, res, data);
        }
    });
};

function getEmpClasses(req, data, callback) {
    nsaCassandra.UserClassify.getEmployeeClasses(req, function(err, result) {
        callback(err, req, result);
    })
};
exports.getEmpClasses = getEmpClasses;

function getClsEveDetails(req, data, callback) {
    nsaCassandra.Events.getClassEvents(req, data, function(err, result) {
        callback(err, req, result);
    })
};
exports.getClsEveDetails = getClsEveDetails;



exports.getAllActivityTypes = function(req, res) {
    nsaCassandra.Events.getAllActivityTypes(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4831));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.getActivityType = function (req, res) {
    nsaCassandra.Events.getActivityType(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4831));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

exports.saveActivityType = function(req, res) {
    nsaCassandra.Events.saveActivityType(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4832));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.updateActivityType = function(req, res) {
    nsaCassandra.Events.updateActivityType(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4836));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

exports.deleteActivityType = function(req, res) {
    nsaCassandra.Events.deleteActivityType(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4838));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};

//For IOS Start
exports.getEvents = function(req, res) {
    nsaCassandra.Events.getEvents(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4821));
        } else {
            events.emit('JsonResponse', req, res, convertEvents(result));
        }
    })
};

exports.getPastEvents = function(req, res) {
    nsaCassandra.Events.getPastEvents(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4821));
        } else {
            events.emit('JsonResponse', req, res, convertEvents(result));
        }
    })
};

exports.getUserEventsByEventId = function(req, res) {
    nsaCassandra.Events.getUserEventsByEventId(req, function(err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa4821));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    })
};

function convertEvents(events) {
    var obj = _.groupBy(events, 'startDate');
    var result = _.map(_.toPairs(obj), function (value) {
        return _.fromPairs([value]);
    });
    return result;
}
exports.convertEvents = convertEvents;
//For IOS End

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.EVENTS_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST)
};
exports.buildErrResponse = buildErrResponse;

function throwEventsErr(err, message) {
    throw new BaseError(responseBuilder.buildResponse(constant.EVENTS_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST));
};
exports.throwEventsErr = throwEventsErr;