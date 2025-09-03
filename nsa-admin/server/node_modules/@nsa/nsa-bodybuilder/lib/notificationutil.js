/**
 * Created by kiranmai on 9/11/17.
 */

'use strict';

var bodybuilder = require('bodybuilder');
var commons = require('@nsa/nsa-commons');
var _ = require('lodash');
var commonUtil = require('./commonutil');
var options;

// Constructor builderutil
var notificationUtil = function f(options) {
    var self = this;
    self.options = options;
};

notificationUtil.constructNotificationsIndex = function(req) {
    var constructIndex = { index: global.config.elasticSearch.index.notificationsIndex };
    return constructIndex;
};

notificationUtil.createNotificationsIndexWithMappings = function(req) {
    var body =
        {
            settings: {
                analysis: {
                    analyzer: {
                        keyword_whitespace: {
                            type: "custom",
                            tokenizer: "whitespace",
                            filter: [
                                "lowercase"
                            ]
                        },
                        keyword_lowercase: {
                            type: "custom",
                            tokenizer: "keyword",
                            filter: [
                                "lowercase"
                            ]
                        }
                    }
                }
            },
            mappings:{
                notification_master: {
                    properties: {
                        notification_id: {type: "string", index:"not_analyzed"},
                        tenant_id: {type: "string", index:"not_analyzed"},
                        school_id: {type: "string", index:"not_analyzed"},
                        feature_id: {type: "string", index:"not_analyzed"},
                        object_id: {type: "string", index:"not_analyzed"},
                        academic_year: {type: "string", index:"not_analyzed"},
                        media_name: {type: "string"},
                        sender_id: {type: "string", index:"not_analyzed"},
                        notified_mobile_numbers: {type: "string"},
                        notified_categories: {type: "binary"},
                        notified_students: {type: "binary"},
                        template_id:{type: "string", index:"not_analyzed"},
                        sms_raw_response: {type:"string"},
                        attachments: {
                            type:"nested",
                            properties:{
                                id:{type:"string", index:"not_analyzed"},
                                name: {type: "string",index: "not_analyzed"},
                            }
                        },
                        template_title: {type:"string", index:"not_analyzed"},
                        title: {type: "string", index:"not_analyzed"},
                        message: {type: "string", index:"not_analyzed"},
                        email_template_title: {type: "string", index:"not_analyzed"},
                        email_template_message: {type: "string", index:"not_analyzed"},
                        push_template_title: {type: "string", index:"not_analyzed"},
                        push_template_message: {type: "string", index:"not_analyzed"},
                        count: {type: "integer"},
                        notification_type: {type: "string", index:"not_analyzed"},
                        priority: {type: "integer", index:"not_analyzed"},
                        status: {type: "string", index:"not_analyzed"},
                        updated_date: {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                        updated_by: {type: "string", index:"not_analyzed"},
                        updated_username: {type: "string", index:"not_analyzed"},
                        created_by: {type : "string", index:"not_analyzed"},
                        created_date : {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                        created_firstname: {type: "string", index:"not_analyzed"},
                        user_types: {type: "string", index:"not_analyzed"},
                        media_status: {type: "string", index:"not_analyzed"},
                    }
                },
                notification_details: {
                    _parent: {type: "notification_master"},
                    properties: {
                        id: {type: "string", index:"not_analyzed"},
                        notification_id: {type: "string", index:"not_analyzed"},
                        tenant_id: {type: "string", index:"not_analyzed"},
                        school_id: {type: "string", index:"not_analyzed"},
                        feature_id: {type: "string", index:"not_analyzed"},
                        object_id: {type: "string", index:"not_analyzed"},
                        academic_year: {type: "string", index:"not_analyzed"},
                        sender_id: {type: "string", index:"not_analyzed"},
                        employee_username: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                        user_name: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                        first_name: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                        user_type: {type: "string", index:"not_analyzed"},
                        class_id: {type: "string", index:"not_analyzed"},
                        section_id: {type: "string", index:"not_analyzed"},
                        primary_phone: {type: "string", index:"not_analyzed"},
                        feature_name: {type: "string", index:"not_analyzed"},
                        group_name: {type: "string", index:"not_analyzed"},
                        media_name: {type: "string"},
                        template_title: {type:"string", index:"not_analyzed"},
                        title: {type: "string", index:"not_analyzed"},
                        attachments: {
                            type:"nested",
                            properties:{
                                id:{type:"string", index:"not_analyzed"},
                                name: {type: "string",index: "not_analyzed"},
                            }
                        },
                        message: {type: "string", index:"not_analyzed"},
                        email_template_title: {type: "string", index:"not_analyzed"},
                        email_template_message: {type: "string", index:"not_analyzed"},
                        push_template_title: {type: "string", index:"not_analyzed"},
                        push_template_message: {type: "string", index:"not_analyzed"},
                        count: {type: "integer"},
                        notification_type: {type: "string", index:"not_analyzed"},
                        priority: {type: "integer"},
                        status: {type: "string", index:"not_analyzed"},
                        updated_date: {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                        updated_by: {type: "string", index:"not_analyzed"},
                        sms_response: {type: "string", index:"not_analyzed"},
                        updated_username: {type: "string", index:"not_analyzed"},
                        deactivated: {type: "boolean"},
                        is_read: {type: "boolean"}
                    }
                }
            }
        };
    return {
        index: global.config.elasticSearch.index.notificationsIndex,
        body: JSON.stringify(body)
    };
};

notificationUtil.getNotificationLogQuery = function(req) {
    var sortParam = { key: constant.ES_UPDATED_DATE, order: constant.ES_ORDER_DSC };
    var body = commonUtil.getBodybuilder(req, sortParam);
    if (body.message) { //error
        return body;
    } else {
        body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_NAME, req.params.id);
        body.query(commons.constants.ES_MATCH_PHRASE, 'deactivated', false);
        return {
            index: global.config.elasticSearch.index.notificationsIndex,
            type: global.config.elasticSearch.index.notificationDetailsType,
            body: JSON.stringify(body.build())
        };
    }
};

notificationUtil.getVoiceNotificationLogQuery = function(req) {
    var sortParam = { key: constant.ES_UPDATED_DATE, order: constant.ES_ORDER_DSC };
    var body = commonUtil.getBodybuilder(req, sortParam);
    if (body.message) { //error
        return body;
    } else {
        body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_NAME, req.params.id);
        body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.FEATURE_ID, commons.constants.VOICE_MESSAGE);
        body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_DEACTIVATE, false);
        return {
            index: global.config.elasticSearch.index.notificationsIndex,
            type: global.config.elasticSearch.index.notificationDetailsType,
            body: JSON.stringify(body.build())
        };
    }
};

notificationUtil.getNotificationLogByObjectQuery = function(req) {
    var sortParam = { key: constant.ES_UPDATED_DATE, order: constant.ES_ORDER_DSC };
    var body = commonUtil.getParentBodybuilder(req, 'notification_master', sortParam);
    if (body.message) { //error
        return body;
    } else {
        return {
            index: global.config.elasticSearch.index.notificationsIndex,
            type: global.config.elasticSearch.index.notificationDetailsType,
            body: JSON.stringify(body.build())
        };
    }
};


notificationUtil.getNotificationQuery = function(req) {
    var sortParam = { key: constant.ES_UPDATED_DATE, order: constant.ES_ORDER_DSC };
    var body = commonUtil.getBodybuilder(req, sortParam);
    if (body.message) { //error
        return body;
    } else {
        return {
            index: global.config.elasticSearch.index.notificationsIndex,
            type: global.config.elasticSearch.index.notificationsType,
            body: JSON.stringify(body.build())
        };
    }
};

notificationUtil.deactiveStatusUpdateQuery = function (req) {
    var updateParams = {
        index: global.config.elasticSearch.index.notificationsIndex,
        type: global.config.elasticSearch.index.notificationDetailsType,
        id: req.params.id,
        parent: req.query.notification_id,
        body: {
            doc: {deactivated: true}
        }
    };
    return updateParams;
};

notificationUtil.attachmentsUpdateQuery = function (req, data) {
    try {
        var array = [];
        var attachmentObjs = data.attachmentObjs;
        var attachmentsArray = [];
        if(!_.isEmpty(attachmentObjs)) {
            _.forEach(attachmentObjs, function (item, key) {
                attachmentsArray.push({id: key, name: item})
            })
        } else {
            attachmentsArray = null;
        }
        var bulkDoc = {
            update: {
                _index: global.config.elasticSearch.index.notificationsIndex,
                _type: global.config.elasticSearch.index.notificationsType,
                _id: data.esNotificationObj.notification_id.toString(),
            }
        };
        var doc = { doc: {attachments: attachmentsArray} };
        array.push(bulkDoc);
        array.push(doc);
        return array;
    } catch (err) {
        return err;
    }
};

notificationUtil.statusUpdateQuery = function (req, data) {
    try {
        var array = [];
        var bulkDoc = {
            update: {
                _index: global.config.elasticSearch.index.notificationsIndex,
                _type: global.config.elasticSearch.index.notificationsType,
                _id: data.notification_id.toString(),
            }
        };
        var doc = { doc: {media_status: 'Sent'} };
        array.push(bulkDoc);
        array.push(doc);
        return array;
    } catch (err) {
        return err;
    }
};

notificationUtil.attachmentsDetailsUpdateQuery = function (req, data) {
    try {
        var esObjs = data.esMediaLogsObj;
        var array = [];
        if(!_.isEmpty(esObjs)) {
            esObjs.forEach(function (item) {
                var attachmentObjs = data.attachmentObjs;
                var attachmentsArray = [];
                if(!_.isEmpty(attachmentObjs)) {
                    _.forEach(attachmentObjs, function (item, key) {
                        attachmentsArray.push({id: key, name: item})
                    })
                } else {
                    attachmentsArray = null;
                }

                var notificationId = item.notification_id || data.notification_id;
                var bulkDoc = {
                    update: {
                        _index: global.config.elasticSearch.index.notificationsIndex,
                        _type: global.config.elasticSearch.index.notificationDetailsType,
                        _id: (item.id == "string") ? item.id : item.id.toString(),
                        parent: (notificationId == "string") ? notificationId : notificationId.toString()
                    }
                };
                var doc = { doc: {attachments: attachmentsArray} };
                array.push(bulkDoc);
                array.push(doc);
            })
        }

        return array;
    } catch (err) {
        return err;
    }
};

//For IOS Start
notificationUtil.readStatusUpdateQuery = function (req) {
    var updateParams = {
        index: global.config.elasticSearch.index.notificationsIndex,
        type: global.config.elasticSearch.index.notificationDetailsType,
        id: req.params.id,
        parent: req.query.notification_id,
        body: {
            doc: {is_read: true}
        }
    };
    return updateParams;
};

notificationUtil.getNotificationListQuery = function(req) {
    var sortParam = { key: constant.ES_UPDATED_DATE, order: constant.ES_ORDER_DSC };

    var queryRange = {}, esQuery = {}, dateParam;
    var body = getBasicBodybuild(req, sortParam);

    body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year);

    if (req.query.search) {
        req.query.keyword = req.query.search.value.toString();
    }

    if (req.query.dateParam) {
        dateParam = req.query.dateParam;
    } else {
        dateParam = commons.constants.ES_UPDATED_DATE;
    }

    if (req.query.startDate && req.query.endDate) {
        queryRange[commons.constants.ES_QUERY_GTE] = req.query.startDate;
        queryRange[commons.constants.ES_QUERY_LT] = req.query.endDate;
        body.query(commons.constants.ES_RANGE, dateParam, queryRange);
    }

    if (req.query.keyword) {
        esQuery[commons.constants.ES_QUERY] = '*' + req.query.keyword + '*';
        body.query(commons.constants.ES_QUERY_STRING, esQuery);
    }

    return body;
    if (body.message) { //error
        return body;
    } else {
        body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_NAME, req.params.id);
        body.query(commons.constants.ES_MATCH_PHRASE, 'deactivated', false);
        return {
            index: global.config.elasticSearch.index.notificationsIndex,
            type: global.config.elasticSearch.index.notificationDetailsType,
            body: JSON.stringify(body.build())
        };
    }

};

notificationUtil.getUserNotificationsByDate = function(req, rangeParam) {
    var body = getDateRangeQuery(req, rangeParam);

    return {
        index: global.config.elasticSearch.index.notificationsIndex,
        type: global.config.elasticSearch.index.notificationDetailsType,
        body: JSON.stringify(body.build())
    };
};

function getDateRangeQuery(req, rangeParam) {
    var queryRange = {}
    var body = bodybuilder();

    body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year);

    if (req.params.id) {
        body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_NAME, req.params.id);
        body.query(commons.constants.ES_MATCH_PHRASE, 'deactivated', false);
    } else {
        body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_NAME, headers.user_id);
    }

    if (req.query.startDate && req.query.endDate) {
        queryRange[commons.constants.ES_QUERY_GTE] = req.query.startDate;
        queryRange[commons.constants.ES_QUERY_LT] = req.query.endDate;
        body.query(commons.constants.ES_RANGE, commons.constants.ES_UPDATED_DATE, queryRange);
    }

    return body;
};
exports.getDateRangeQuery = getDateRangeQuery;

notificationUtil.getUserNotificationLogQuery = function(req) {
    var body = bodybuilder().size(commons.constants.DEFAULT_PARAM_SIZE);

        body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_NAME, req.params.id)
            .notFilter(commons.constants.ES_MATCH_PHRASE, 'is_read', true)
            .notFilter(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_DEACTIVATE, true);

    return {
        index: global.config.elasticSearch.index.notificationsIndex,
        type: global.config.elasticSearch.index.notificationDetailsType,
        body: JSON.stringify(body.build())
    };
};
//For IOS End

module.exports = notificationUtil;
