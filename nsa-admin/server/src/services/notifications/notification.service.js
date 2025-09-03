/**
 * Created by Kiranmai A on 2/8/2017.
 */
var nsaCassandra = require('@nsa/nsa-cassandra'),
    events = require('@nsa/nsa-commons').events,
    message = require('@nsa/nsa-commons').messages,
    responseBuilder = require('@nsa/nsa-commons').responseBuilder,
    constant = require('@nsa/nsa-commons').constants,
    nsanu = require('@nsa/nsa-bodybuilder').notificationUtil,
    nsaElasticSearch = require('@nsa/nsa-elasticsearch'),
    logger = require('../../../config/logger'),
    es = require('../../services/search/elasticsearch/elasticsearch.service'),
    moment = require('moment');

exports.getAllUserNotificationLogs = function(req, res) {
    if (req.query.search) {
        req.query.keyword = req.query.search['value'];
    }
    var notificationQuery = nsanu.getNotificationLogQuery(req);
    nsaElasticSearch.search.searchDoc(req, notificationQuery, constant.NOTIFICATION_PERMISSIONS, function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1601));
        } else {
            events.emit('SearchResponse', req, res, result);
        }
    })
};

/*exports.getAllUserNotificationLogs = function(req, res) {
    nsaCassandra.Notifications.getAllUserNotificationLogs(req, function(err, response) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1601));
        } else {
            events.emit('JsonResponse', req, res, response);
        }
    })
};*/

exports.updateNotificationLogs = function(req, res){
    async.parallel([
        nsaCassandra.Notifications.updateNotificationLogs.bind(null, req),
        es.updateDeactiveStatusInES.bind(null, req)
    ], function (err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err,message.nsa1603));
        } else {
            events.emit('JsonResponse', req, res, {message:message.nsa1604});
        }
    });
};

//For IOS Start
exports.updateUserReadStatus = function(req, res){
    async.parallel([
        nsaCassandra.Notifications.updateUserReadStatus.bind(null, req),
        es.updateNotificationReadStatusInES.bind(null, req)
    ], function (err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err,message.nsa1603));
        } else {
            events.emit('JsonResponse', req, res, {message:message.nsa1604});
        }
    });
};

exports.getNotificationOverview = function (req, res) {
    async.parallel({
        list: getListOfNotifications.bind(null, req),
        count: getTodayNotifications.bind(null, req)
    }, function (err, result) {
        if(err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err,message.nsa1603));
        } else {
            events.emit('JsonResponse', req, res, result);
        }
    });
};

function getListOfNotifications(req, callback) {
    if (req.query.search) {
        req.query.keyword = req.query.search['value'];
    }
    var notificationQuery = nsanu.getNotificationLogQuery(req);
    nsaElasticSearch.search.searchDoc(req, notificationQuery, constant.NOTIFICATION_PERMISSIONS, function (err, result) {
        callback(err, result);
    })
};
exports.getListOfNotifications = getListOfNotifications;

function getTodayNotifications(req, callback) {
    req.query.startDate = moment().startOf('day');
    req.query.endDate = moment().endOf('day');
    var searchParams = nsanu.getUserNotificationsByDate(req);
    nsaElasticSearch.search.searchUsers(searchParams, function (err, data) {
        if(err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
};
exports.getTodayNotifications = getTodayNotifications;

exports.getUserUnReadNotifications = function(req, res) {
    var notificationQuery = nsanu.getUserNotificationLogQuery(req);
    nsaElasticSearch.search.searchDoc(req, notificationQuery, constant.NOTIFICATION_PERMISSIONS, function (err, result) {
        if (err) {
            logger.debug(err);
            events.emit('ErrorJsonResponse', req, res, buildErrResponse(err, message.nsa1601));
        } else {
            var count = result ? result.recordsTotal : 0;
            events.emit('SearchResponse', req, res, {count: count});
        }
    })
};
//For IOS End

function buildErrResponse(err, message) {
    return responseBuilder.buildResponse(constant.NOTIFY_NAME, constant.APP_TYPE, message, err.message, constant.HTTP_BAD_REQUEST);
};
exports.buildErrResponse = buildErrResponse;