/**
 * Created by kiranmai on 9/2/17.
 */

'use strict';

var bodybuilder = require('bodybuilder');
var commons = require('@nsa/nsa-commons');
var _ = require('lodash');
var options;

// Constructor builderutil
var assessmentUtil = function f(options) {
    var self = this;
    self.options = options;
};

assessmentUtil.constructAssessmentIndex = function(req) {
    var constructIndex = { index: global.config.elasticSearch.index.assessmentIndex };
    return constructIndex;
};

assessmentUtil.createAssessmentIndexWithMappings = function(req) {
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
                marks: {
                    properties: {
                        tenant_id: { type: "string"},
                        school_id: { type: "string" },
                        academic_year: { type: "string" },
                        user_name: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                        first_name: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                        class_id : {type : "string", index : "not_analyzed"},
                        section_id : {type : "string", index : "not_analyzed"},
                        class_name : {type : "string", analyzer: "keyword_lowercase", fielddata: true},
                        section_name : {type : "string", analyzer: "keyword_lowercase", fielddata: true},
                        mark_list_id: {type: "string", index: "not_analyzed"},
                        mark_list_detail_id: {type: "string", index: "not_analyzed"},
                        exam_schedule_id: {type: "string", index: "not_analyzed"},
                        written_exam_id: {type: "string", index: "not_analyzed"},
                        written_exam_name: {type: "string", index: "not_analyzed"},
                        subject_mark_details: {
                            type:"nested",
                            properties:{
                                subject_id:{type:"string", index:"not_analyzed"},
                                subject_name: {type: "string",index: "not_analyzed"},
                                marks_obtained: {type: "string",index: "not_analyzed"},
                                marks_obtained_value: {type: "float", index: "not_analyzed"},
                                max_marks: {type: "integer", index: "not_analyzed"},
                                grade_id: {type:"string", index:"not_analyzed"},
                                grade_name: {type:"string", index:"not_analyzed"},
                                cgpa_value: {type: "float", index: "not_analyzed"}
                            }
                        },
                        total_marks_obtained: {type: "float", index: "not_analyzed"},
                        total_max_marks: {type: "float", index: "not_analyzed"},
                        total_grade_id: {type:"string", index:"not_analyzed"},
                        total_grade_name: {type:"string", index:"not_analyzed"},
                        total_cgpa_value: {type:"float", index:"not_analyzed"},
                        remarks: {type: "string", index: "not_analyzed"}
                    }

                }
            }
        };
    return {
        index: global.config.elasticSearch.index.assessmentIndex,
        body: JSON.stringify(body)
    };
};

assessmentUtil.getMarksStatisticsQueryParam = function(req, data) {
    var cgpaValues = _.map(data.grades, 'cgpa_value');
    var higherRange = _.max(cgpaValues);
    var lowerRange;
    var endRange = higherRange;
    var array = [];
    var difNum = commons.constants.DIFF_NUM;
    for (var i = 0; i < endRange; i++) {
        var lowerRange = (higherRange-difNum) + 0.1;
        array.push({"key": lowerRange + '-' + higherRange, "from" : lowerRange, "to" : (higherRange + 0.1)});
        higherRange = higherRange-difNum;
    }

    var params = {
        "size": 0,
        "query": { "bool": { "must": {"match_phrase": {"mark_list_id": req.params.id}}} },
        "aggs" : {
            "marks_obtained" : {
                "range" : {
                    "field" : "total_cgpa_value",
                    "keyed" : true,
                    "ranges" : array
                }
            }
        }
    };

    return assessmentUtil.getMarksStatisticsQuery(req, params);
};

assessmentUtil.getMarksStatsBySubQueryParam = function(req) {

    var params = {
        "size" : 0,
        "query":{ "match": { "mark_list_id": req.params.id } },
        "aggs": {
            "nestedDocs": {
                "nested": { "path": "subject_mark_details" },
                "aggs":{
                    "subDetails": {
                        "filter": { "term": { "subject_mark_details.subject_id": req.params.subId } },
                        "aggs": {  "gradeDetails":{ "terms": { "field": "subject_mark_details.grade_name"} } ,
                            "grades_stats": { "stats" : { "field" : "subject_mark_details.marks_obtained_value" }}}
                    }
                }
            }
        }
    };

    return assessmentUtil.getMarksStatisticsQuery(req, params);
};

assessmentUtil.getRankDetailQueryParam = function(req, params) {
    var mustQuery = [{ match: {mark_list_id: req.params.id} }];

    if(!_.isEmpty(params) && params != null) {
        mustQuery.push({ range: { total_cgpa_value: {"gte": params.startRange, "lte": params.endRange} }})
    }

    var params = {
        size: commons.constants.DEFAULT_PARAM_SIZE,
        sort : [{ total_cgpa_value : {"order" : "asc"}}],
        query: {
            bool: { must : mustQuery }
        }
    };

    return assessmentUtil.getMarksStatisticsQuery(req, params);
};

assessmentUtil.getRankDetailBySubQueryParam = function(req, params) {
    var reqParams = req.params;
    var query = req.query;
    var mustQuery = [];
    mustQuery.push(
        { match: {"subject_mark_details.subject_id" : reqParams.subId} }
    );

    if(query.grade != null) {
        mustQuery.push({ match: {"subject_mark_details.grade_name": query.grade} })
    };
    var params = {
        size: commons.constants.DEFAULT_PARAM_SIZE,
        query: { bool: { must: [
            { match: {"mark_list_id": reqParams.id} },
            { nested: {
                path: "subject_mark_details",
                query: { bool: { must: mustQuery } } }
            } ] } },
        sort: {
            "subject_mark_details.marks_obtained_value": {
                order: "desc",
                nested_path: "subject_mark_details",
                nested_filter: {
                    match: {
                        "subject_mark_details.subject_id": reqParams.subId
                    }
                }
            }
        }
    };

    return assessmentUtil.getMarksStatisticsQuery(req, params);
};

assessmentUtil.getMarksStatisticsQuery = function(req, params) {
    var searchParams = {
        index: global.config.elasticSearch.index.assessmentIndex,
        type: global.config.elasticSearch.index.marksType,
        body: params
    };

    return searchParams;
};

assessmentUtil.buildMarksDeleteQueryParams = function(req, ids) {
    var bulkParams = [];
    ids.forEach(function (id) {
        var bulkDoc = {
            delete: {
                "_index": global.config.elasticSearch.index.assessmentIndex,
                "_type": global.config.elasticSearch.index.marksType,
                "_id": id.toString()
            }
        }
        bulkParams.push(bulkDoc);
    });

    return {body: bulkParams};
};

module.exports = assessmentUtil;