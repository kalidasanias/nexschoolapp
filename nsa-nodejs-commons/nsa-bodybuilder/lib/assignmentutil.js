/**
 * Created by kiranmai on 9/12/17.
 */

'use strict';

var bodybuilder = require('bodybuilder');
var commons = require('@nsa/nsa-commons');
var _ = require('lodash');
var commonUtil = require('./commonutil');
var options;

// Constructor builderutil
var assignmentUtil = function f(options) {
    var self = this;
    self.options = options;
};

assignmentUtil.constructAssignmentsIndex = function(req) {
    var constructIndex = { index: global.config.elasticSearch.index.assignmentsIndex };
    return constructIndex;
};

assignmentUtil.createAssignmentIndexWithMappings = function(req) {
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
                assignment_master: {
                    properties: {
                        assignment_id: {type: "string", index:"not_analyzed"},
                        tenant_id: {type: "string", index:"not_analyzed"},
                        school_id: {type: "string", index:"not_analyzed"},
                        academic_year : {type: "string", index:"not_analyzed"},
                        media_name: {type: "string"},
                        assignment_name: {type: "string", index:"not_analyzed"},
                        assignment_type_id: {type: "string", index:"not_analyzed"},
                        assignment_type_name: {type: "string", index:"not_analyzed"},
                        assignment_desc: {type: "string", index:"not_analyzed"},
                        notified_categories: {type: "binary"},
                        subjects: {
                            type:"nested",
                            properties:{
                                subject_id:{type:"string", index:"not_analyzed"},
                                subject_name: {type: "string",index: "not_analyzed"},
                            }
                        },
                        due_date: {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                        repeat_option_id: {type: "string", index:"not_analyzed"},
                        repeat_option: {type: "string", index:"not_analyzed"},
                        priority: {type: "integer"},
                        notify_to: {type: "string", index:"not_analyzed"},
                        attachments: {
                            type:"nested",
                            properties:{
                                id:{type:"string", index:"not_analyzed"},
                                name: {type: "string",index: "not_analyzed"},
                            }
                        },
                        updated_by: {type: "string", index:"not_analyzed"},
                        updated_date : {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                        updated_username: {type: "string", index:"not_analyzed"},
                        created_by: {type: "string", index:"not_analyzed"},
                        created_date : {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                        created_firstname: {type: "string", index:"not_analyzed"},
                        status : {type : "boolean"}
                    }
                },
                assignment_details: {
                    "_parent": {
                        "type": "assignment_master"
                    },
                    properties: {
                        assignment_detail_id: {type: "string", index:"not_analyzed"},
                        assignment_id: {type: "string", index:"not_analyzed"},
                        tenant_id: {type: "string", index:"not_analyzed"},
                        school_id: {type: "string", index:"not_analyzed"},
                        academic_year : {type: "string", index:"not_analyzed"},
                        media_name: {type: "string"},
                        assignment_name: {type: "string", index:"not_analyzed"},
                        assignment_type_id: {type: "string", index:"not_analyzed"},
                        assignment_type_name: {type: "string", index:"not_analyzed"},
                        assignment_desc: {type: "string", index:"not_analyzed"},
                        user_name: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                        first_name: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                        class_id : {type : "string", index : "not_analyzed"},
                        section_id : {type : "string", index : "not_analyzed"},
                        class_name : {type : "string", analyzer: "keyword_lowercase", fielddata: true},
                        section_name : {type : "string", analyzer: "keyword_lowercase", fielddata: true},
                        subjects: {
                            type:"nested",
                            properties:{
                                subject_id:{type:"string", index:"not_analyzed"},
                                subject_name: {type: "string",index: "not_analyzed"},
                            }
                        },
                        due_date: {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                        repeat_option_id: {type: "string", index:"not_analyzed"},
                        repeat_option: {type: "string", index:"not_analyzed"},
                        priority: {type: "integer"},
                        notify_to: {type: "string", index:"not_analyzed"},
                        attachments: {
                            type:"nested",
                            properties:{
                                id:{type:"string", index:"not_analyzed"},
                                name: {type: "string",index: "not_analyzed"},
                            }
                        },
                        updated_by: {type: "string", index:"not_analyzed"},
                        updated_date : {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                        updated_username: {type: "string", index:"not_analyzed"},
                        created_by: {type: "string", index:"not_analyzed"},
                        created_date : {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                        created_firstname: {type: "string", index:"not_analyzed"},
                        status : {type : "boolean"},
                        submitted_date : {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                        is_submitted : {type : "boolean"},
                        deactivated: {type: "boolean"},
                        is_read: {type: "boolean"}
                    }
                }
            }
        };
    return {
        index: global.config.elasticSearch.index.assignmentsIndex,
        body: JSON.stringify(body)
    };
};

assignmentUtil.getAssignmentQuery = function(req, headers, viewPermission, sortParam) {
    var body = commonUtil.getBodybuilder(req, sortParam);
    body.query(commons.constants.ES_MATCH_PHRASE, 'academic_year', headers.academic_year);

    if (viewPermission) {
        body.query(commons.constants.ES_MATCH_PHRASE, 'created_by', headers.user_id);
    }

    if (req.body.subjectId) {
        body.query(commons.constants.ES_NESTED, { path: commons.constants.ES_SUBJECTS, score_mode: 'avg' }, function(q)  {
            return q.query(commons.constants.ES_MATCH, commons.constants.ES_SUBJECTS_SUBJECT_ID, req.body.subjectId)
        });
    }

    if (body.message) { //error
        return body;
    } else {
        return {
            index: global.config.elasticSearch.index.assignmentsIndex,
            type: global.config.elasticSearch.index.assignmentsMasterType,
            body: JSON.stringify(body.build())
        };
    }
};

assignmentUtil.getAssignmentDetailsQuery = function(req, headers, viewPermission, sortParam) {
    var body = commonUtil.getChildBodybuilder(req, 'assignment_details', headers, viewPermission, sortParam);

    return {
        index: global.config.elasticSearch.index.assignmentsIndex,
        type: global.config.elasticSearch.index.assignmentsMasterType,
        body: JSON.stringify(body.build())
    };
};

assignmentUtil.getAssignmentDetailsQueryByUserName = function(req, headers, viewPermission, sortParam) {
    var body = commonUtil.getBodybuilder(req, sortParam);
    if (headers) {
        body.query(commons.constants.ES_MATCH_PHRASE, 'academic_year', headers.academic_year);
    }

    body.query(commons.constants.ES_MATCH_PHRASE, 'status', true);

    if (viewPermission) {
        body.query(commons.constants.ES_MATCH_PHRASE, 'created_by', headers.user_id);
    }

    if (req.params.id) {
        body.query(commons.constants.ES_MATCH_PHRASE, 'user_name', req.params.id);
    } else {
        body.query(commons.constants.ES_MATCH_PHRASE, 'user_name', headers.user_id);
    }
    body.notFilter(commons.constants.ES_MATCH_PHRASE, 'deactivated', true);

    return {
        index: global.config.elasticSearch.index.assignmentsIndex,
        type: global.config.elasticSearch.index.assignmentDetailsType,
        body: JSON.stringify(body.build())
    };
};

assignmentUtil.updateAssignmentDetailsStatusQuery = function (req, updateValues) {
    var updateParams = {
        index: global.config.elasticSearch.index.assignmentsIndex,
        type: global.config.elasticSearch.index.assignmentDetailsType,
        id: req.params.id,
        parent: req.query.assignment_id,
        body: {
            doc: updateValues
        }
    };
    return updateParams;
};

assignmentUtil.assignmentDeleteQuery = function (req) {
    var array = [];
    var bulkDoc = {
        delete: {
            "_index": global.config.elasticSearch.index.assignmentsIndex,
            "_type": global.config.elasticSearch.index.assignmentsMasterType,
            "_id": req.params.id
        }
    };
    array.push(bulkDoc);
    return array;
};

assignmentUtil.assignmentDetailsDeleteQuery = function (req, data) {
    var array = [];
    data.forEach(function (item) {
        var bulkDoc = {
            delete: {
                "_index": global.config.elasticSearch.index.assignmentsIndex,
                "_type": global.config.elasticSearch.index.assignmentDetailsType,
                "_id": item.assignment_detail_id.toString(),
                "parent": item.assignment_id.toString()
            }
        };
        array.push(bulkDoc);
    })
    return array;
};

assignmentUtil.attachmentsUpdateQuery = function (req, data) {
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
                _index: global.config.elasticSearch.index.assignmentsIndex,
                _type: global.config.elasticSearch.index.assignmentsMasterType,
                _id: data.esAssignmentsObj.assignment_id.toString(),
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

assignmentUtil.attachmentsDetailsUpdateQuery = function (req, data) {
    try {
        var esObjs = data.esAssignmentsDetailObj
        var array = [];
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

            var assignmentId = item.assignment_id || data.assignment_id;
            var bulkDoc = {
                update: {
                    _index: global.config.elasticSearch.index.assignmentsIndex,
                    _type: global.config.elasticSearch.index.assignmentDetailsType,
                    _id: (item.assignment_detail_id == "string") ? item.assignment_detail_id : item.assignment_detail_id.toString(),
                    parent: (assignmentId == "string") ? assignmentId : assignmentId.toString()
                }
            };
            var doc = { doc: {attachments: attachmentsArray} };
            array.push(bulkDoc);
            array.push(doc);
        })
        return array;
    } catch (err) {
        return err;
    }
};

//For IOS Start
assignmentUtil.deactiveStatusUpdateQuery = function (req) {
    var updateParams = {
        index: global.config.elasticSearch.index.assignmentsIndex,
        type: global.config.elasticSearch.index.assignmentDetailsType,
        id: req.params.id,
        parent: req.query.assignment_id,
        body: {
            doc: {deactivated: true}
        }
    };
    return updateParams;
};

assignmentUtil.readStatusUpdateQuery = function (req) {
    var updateParams = {
        index: global.config.elasticSearch.index.assignmentsIndex,
        type: global.config.elasticSearch.index.assignmentDetailsType,
        id: req.params.id,
        parent: req.query.assignment_id,
        body: {
            doc: {is_read: true}
        }
    };
    return updateParams;
};

assignmentUtil.assignmentSubCountQuery = function (req) {
    var searchParams = {
        index: global.config.elasticSearch.index.assignmentsIndex,
        type: global.config.elasticSearch.index.assignmentDetailsType,
        body: {
            "size": 0,
            "query": {
                "bool": {
                    "must": [
                        {"match_phrase": {"tenant_id": req.headers.userInfo.tenant_id}},
                        {"match_phrase": {"school_id": req.headers.userInfo.school_id}},
                        {"match_phrase": {"academic_year": (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year}},
                        {"match_phrase": {"user_name": req.params.id}},
                        {"match_phrase": {"status": true}}
                    ],
                    "must_not" : {
                        "match_phrase": {"deactivated": true}
                    }
                }
            },
            "aggs": {
                "nestedDocs": {
                    "nested": {"path": "subjects"},
                    "aggs": {
                        "subDetails": {
                            "terms": {"field": "subjects.subject_name", "size": commons.constants.ES_100_CHUNK_SIZE}
                        }
                    }
                }
            }
        }
    };
    return searchParams;
};

function getDateRangeQuery(req, rangeParam) {
    var queryRange = {}
    var body = bodybuilder();

    body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_STATUS, true);

    if (req.params.id) {
        body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_NAME, req.params.id);
    } else {
        body.query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_NAME, headers.user_id);
    }

    if (req.query.startDate && req.query.endDate) {
        queryRange[commons.constants.ES_QUERY_GTE] = req.query.startDate;
        queryRange[commons.constants.ES_QUERY_LT] = req.query.endDate;
        body.query(commons.constants.ES_RANGE, rangeParam, queryRange);
    }

    return body;
};
exports.getDateRangeQuery = getDateRangeQuery;

assignmentUtil.getUserAssignmentsByDate = function(req, rangeParam) {
    var body = getDateRangeQuery(req, rangeParam);

    body.notFilter(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_DEACTIVATE, true);

    return {
        index: global.config.elasticSearch.index.assignmentsIndex,
        type: global.config.elasticSearch.index.assignmentDetailsType,
        body: JSON.stringify(body.build())
    };
};

//For IOS End

module.exports = assignmentUtil;
