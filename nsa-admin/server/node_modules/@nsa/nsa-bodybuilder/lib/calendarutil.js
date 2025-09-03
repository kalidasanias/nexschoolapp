/**
 * Created by senthil on 10/02/17.
 */
'use strict';

var bodybuilder = require('bodybuilder');
var commons = require('@nsa/nsa-commons');
var _ = require('lodash');
var options;

// Constructor calendarUtil
var calendarUtil = function f(options) {
    var self = this;
    self.options = options;
};

calendarUtil.constructCalendarIndex = function(req) {
    var constructIndex = { index: global.config.elasticSearch.index.calendarIndex };
    return constructIndex;
};


//TODO : have to rework using builder
calendarUtil.constructMappings = function(req) {
    var body = {
        mappings: {
            notes: {
                properties: {
                    tenant_id: {type: "string"},
                    school_id: {type: "string"},
                    school_name: {type: "string"},
                    academic_year: {type: "string"},
                    class_id: {type: "string"},
                    section_id: {type: "string"},
                    day_no: {type: "integer"},
                    week_no: {type: "integer"},
                    month_no: {type: "integer"},
                    year_no: {type: "integer"},
                    period_id: {type: "integer"},
                    day_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ"},
                    notes: {
                        type: "object",
                        properties: {
                            note: {type: "string", store: "yes", index: "not_analyzed"},
                            tag_name: {type: "string", index: "not_analyzed"},
                            description: {type: "string", index: "not_analyzed"},
                            updated_by: {type: "string", index: "not_analyzed"},
                            updated_username: {type: "string", index: "not_analyzed"}
                        }
                    },
                    created_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ss.SSSZ"},
                    updated_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ"},
                    updated_by: {type: "string", "index": "not_analyzed"},
                    updated_username: {type: "string", "index": "not_analyzed"}
                }
            },
            events: {
                properties: {
                    tenant_id: {type: "string"},
                    school_id: {type: "string"},
                    school_name: {type: "string"},
                    academic_year: {type: "string"},
                    class_id: {type: "string"},
                    section_id: {type: "string"},
                    day_no: {type: "integer"},
                    week_no: {type: "integer"},
                    month_no: {type: "integer"},
                    year_no: {type: "integer"},
                    period_id: {type: "integer"},
                    day_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ"},
                    events: {
                        type: "object",
                        properties: {
                            event_id: {type: "string", index: "not_analyzed"},
                            event_name: {type: "string", index: "not_analyzed"},
                            activity_type: {type: "string", index: "not_analyzed"},
                            start_date: {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                            end_date: {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                            start_time: {type: "string",index: "not_analyzed"},
                            end_time: {type: "string",index: "not_analyzed"},
                            updated_by: {type: "string", index: "not_analyzed"},
                            updated_username: {type: "string", index: "not_analyzed"}
                        }
                    },
                    created_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ss.SSSZ"},
                    updated_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ"},
                    updated_by: {type: "string", "index": "not_analyzed"},
                    updated_username: {type: "string", "index": "not_analyzed"}
                }
            },
            exams: {
                properties: {
                    tenant_id: {type: "string"},
                    school_id: {type: "string"},
                    school_name: {type: "string"},
                    academic_year: {type: "string"},
                    class_id: {type: "string"},
                    section_id: {type: "string"},
                    day_no: {type: "integer"},
                    week_no: {type: "integer"},
                    month_no: {type: "integer"},
                    year_no: {type: "integer"},
                    period_id: {type: "integer"},
                    day_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ"},
                    exam: {
                        type: "object",
                        properties: {
                            exams_name: {type: "string", index: "not_analyzed"},
                            subject_name: {type: "string", index: "not_analyzed"}
                        }
                    },
                    exams: {
                        type: "object",
                        properties: {
                            exam_schedule_id: {type: "string", index: "not_analyzed"},
                            exam_name: {type: "string", index: "not_analyzed"},
                            class_name: {type: "string", index: "not_analyzed"},
                            sections: {
                                type:"object",
                                properties:{
                                    section_id: {type: "string", index: "not_analyzed"},
                                    section_name: {type: "string", index: "not_analyzed"},
                                }
                            },
                            subject_details:{
                                type:"object",
                                properties:{
                                    exam_date: {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                                    exam_start_time: {type: "string",index: "not_analyzed"},
                                    exam_end_time: {type: "string",index: "not_analyzed"},
                                    subject_name: {type: "string",index: "not_analyzed"},
                                    subject_id:{type:"string", index:"not_analyzed"}
                                }
                            }
                        }
                    },
                    created_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ss.SSSZ"},
                    updated_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ"},
                    updated_by: {type: "string", "index": "not_analyzed"},
                    updated_username: {type: "string", "index": "not_analyzed"}
                }
            },
            assignments: {
                properties: {
                    tenant_id: {type: "string"},
                    school_id: {type: "string"},
                    school_name: {type: "string"},
                    academic_year: {type: "string"},
                    class_id: {type: "string"},
                    section_id: {type: "string"},
                    day_no: {type: "integer"},
                    week_no: {type: "integer"},
                    month_no: {type: "integer"},
                    year_no: {type: "integer"},
                    period_id: {type: "integer"},
                    day_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ"},
                    assignment: {
                        type: "object",
                        properties: {

                            media_name: {type: "string", store: "yes", index: "not_analyzed"},
                            assignment_name: {type: "string", index: "not_analyzed"},
                            assignment_type_id : {type: "string", index: "not_analyzed"},
                            assignment_type_name : {type: "string", index: "not_analyzed"},
                            assignment_desc : {type: "string", index: "not_analyzed"},
                            notified_categories : {type: "string", index: "not_analyzed"},
                            subject_id : {type: "string", index: "not_analyzed"},
                            subject_name : {type: "string", index: "not_analyzed"},
                            due_date : {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ", index: "not_analyzed"},
                            repeat_option_id : {type: "string", index: "not_analyzed"},
                            repeat_option : {type: "string", index: "not_analyzed"},
                            priority : {type: "integer", index: "not_analyzed"},
                            notify_to : {type: "string", index: "not_analyzed"},
                            attachment : {type: "string", store: "yes", index: "not_analyzed"},
                            updated_by  : {type: "string", index: "not_analyzed"},
                            updated_date  : {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ", index: "not_analyzed"},
                            updated_username  : {type: "string", index: "not_analyzed"},
                            status  : {type: "boolean", index: "not_analyzed"},
                        }
                    },
                    created_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ss.SSSZ"},
                    updated_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ"},
                    updated_by: {type: "string", "index": "not_analyzed"},
                    updated_username: {type: "string", "index": "not_analyzed"}
                }
            },
            attendance: {
                properties: {
                    tenant_id: {type: "string"},
                    school_id: {type: "string"},
                    school_name: {type: "string"},
                    academic_year: {type: "string"},
                    class_id: {type: "string"},
                    section_id: {type: "string"},
                    day_no: {type: "integer"},
                    week_no: {type: "integer"},
                    month_no: {type: "integer"},
                    year_no: {type: "integer"},
                    period_id: {type: "integer"},
                    day_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ"},
                    exam: {
                        type: "object",
                        properties: {


                            media_name : {type: "string", store: "yes", index: "not_analyzed"},
                            class_id: {type: "string", index: "not_analyzed"},
                            class_name : {type: "string", index: "not_analyzed"},
                            section_id : {type: "string", index: "not_analyzed"},
                            section_name : {type: "string", index: "not_analyzed"},
                            total_strength : {type: "integer", index: "not_analyzed"},
                            no_of_present : {type: "integer", index: "not_analyzed"},
                            no_of_absent : {type: "integer", index: "not_analyzed"},
                            present_percent : {type: "integer", index: "not_analyzed"},
                            attendance_date : {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ", index: "not_analyzed"},
                            recorded_date : {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ", index: "not_analyzed"},
                            recorded_by : {type: "string", index: "not_analyzed"},
                            recorded_username : {type: "string", index: "not_analyzed"},
                            updated_by : {type: "string", index: "not_analyzed"},
                            updated_username : {type: "string", index: "not_analyzed"},
                            updated_date : {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ", index: "not_analyzed"}
                        }
                    },
                    created_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ss.SSSZ"},
                    updated_date: {type: "date", format: "YYYY-MM-DD'T'HH:mm:ssZ"},
                    updated_by: {type: "string", "index": "not_analyzed"},
                    updated_username: {type: "string", "index": "not_analyzed"}


                }
            }
        }
    };

    return {
        index: global.config.elasticSearch.index.calendarIndex,
        body: JSON.stringify(body)
    };
};

calendarUtil.buildEventsDocQuery = function(req, data) {
    try {
        var calendarDataObj = data.calendarData;
        var eventsObj = calendarDataObj.events;
        var calendarEventsObj = {
            event_id: eventsObj.event_id.toString(), event_name: eventsObj.event_name,
            activity_type: eventsObj.activity_type,
            start_date : eventsObj.start_date, end_date: eventsObj.end_date,
            start_time: eventsObj.start_time, end_time: eventsObj.end_time,
            updated_by: eventsObj.updated_by, updated_username: eventsObj.updated_username };
        var doc = {};
        doc.id = calendarDataObj.id.toString();
        doc.tenant_id = calendarDataObj.tenant_id.toString();
        doc.school_id = calendarDataObj.school_id.toString();
        doc.academic_year = calendarDataObj.academic_year;
        doc.events = calendarEventsObj;
        doc.created_date = calendarDataObj.created_date;
    } catch (err) {
        return err;
    }
    return calendarUtil.updateEventsDoc(req, doc);
};

calendarUtil.buildExamDocQuery = function(req, data){
    try {
        var calendarDataObj = data.calendarData;
        var subjectDetails= [];
        var sectionDetails= [];
        var examsObj = calendarDataObj.exam_details;
        var subjects = {};
        _.forEach(examsObj, function(value , key){
            subjects = value
        });
        var sectionObject = JSON.parse(subjects.sections);
        for(var j = 0; j < sectionObject.length; j++){
            var sections  ={};
            sections.section_id = sectionObject[j].id;
            sections.section_name = sectionObject[j].name;
            sectionDetails.push(sections);
        }
        var examsSubjects = JSON.parse(subjects.subject_details);
        for(var i= 0; i < examsSubjects.length; i++){
            var subjectDetail  ={};
            subjectDetail.exam_date = examsSubjects[i].exam_date;
            subjectDetail.exam_start_time = examsSubjects[i].exam_start_time;
            subjectDetail.exam_end_time = examsSubjects[i].exam_end_time;
            subjectDetail.subject_name = examsSubjects[i].subject_name;
            subjectDetails.push(subjectDetail);
        }
        var calendarExamsObj = {
            exam_schedule_id: subjects.exam_schedule_id.toString(), exam_name: subjects.written_exam_name,
            class_name: subjects.class_name, sections: sectionDetails,
            subject_details: subjectDetails,
            updated_by: calendarDataObj.updated_by, updated_username: calendarDataObj.updated_username };
        var doc = {};
        doc.id = calendarDataObj.id.toString();
        doc.tenant_id = calendarDataObj.tenant_id.toString();
        doc.school_id = calendarDataObj.school_id.toString();
        doc.class_id = calendarDataObj.class_id.toString();
        doc.academic_year = calendarDataObj.academic_year;
        doc.exams = calendarExamsObj;
        doc.created_date = calendarDataObj.created_date;
    }catch(err){
        return err;
    }
    return calendarUtil.updateExamsDoc(req, doc);
};

calendarUtil.deleteExamDoc = function(req, doc){
    try {
        var deleteParams = {
            index: global.config.elasticSearch.index.calendarIndex,
            type: global.config.elasticSearch.index.examsType,
            id: doc.id // doc indexed id
        };
    } catch (err) {
        return err;
    }
    return deleteParams;
};

calendarUtil.getDatesRangeQueryParam = function(req, params) {
    var mustQuery = [];
    var body = {
        size: commons.constants.DEFAULT_PARAM_SIZE,
        "query": {
            "bool": {
                "must": [
                    {
                        "bool": {
                            must: [
                                {"match_phrase": {"tenant_id": req.headers.userInfo.tenant_id}},
                                {"match_phrase": {"school_id": req.headers.userInfo.school_id}},
                                {"match_phrase": {"academic_year": (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year}}
                            ]
                        }
                    },
                    {
                        "bool": {
                            should: [
                                {"range": {"events.start_date": { "gte" : params.startDate }}},
                                {"range": {"events.end_date": { "gte" : params.startDate }}}
                            ]
                        }
                    },
                    {
                        "bool": {
                            should: [
                                {"range": {"events.start_date": { "lte" : params.endDate }}},
                                {"range": {"events.end_date": { "lte" : params.endDate }}}
                            ]
                        }
                    }
                ]
            }
        }
    };

    return {
        index: global.config.elasticSearch.index.calendarIndex,
        type: global.config.elasticSearch.index.eventsType,
        body: body
    };
};

calendarUtil.getExamsDatesRangeQueryParam = function(req, params) {
    var mustQuery = [];
    var body = {
        size: commons.constants.DEFAULT_PARAM_SIZE,
        "query": {
            "bool": {
                "must": [
                    {
                        "bool": {
                            must: [
                                {"match_phrase": {"tenant_id": req.headers.userInfo.tenant_id}},
                                {"match_phrase": {"school_id": req.headers.userInfo.school_id}}
                            ]
                        }
                    },
                    {
                        "bool": {
                            must: [
                                {"range": {"exams.subject_details.exam_date": { "gte" : params.startDate }}},
                                {"range": {"exams.subject_details.exam_date": { "lte" : params.endDate}}}
                            ]
                        }
                    }
                ]
            }
        }
    };
    return {
        index: global.config.elasticSearch.index.calendarIndex,
        type: global.config.elasticSearch.index.examsType,
        body: body,
    };
};

calendarUtil.getExamsByClassId = function(req, params){
    var body = {
        size: commons.constants.DEFAULT_PARAM_SIZE,
        "query": {
            "bool": {
                "must": [
                    {
                        "bool": {
                            must: [
                                {"match_phrase": {"tenant_id": req.headers.userInfo.tenant_id}},
                                {"match_phrase": {"school_id": req.headers.userInfo.school_id}},
                                {"match_phrase": {"class_id": params.classId}},
                                {"match_phrase": {"exams.sections.section_id": params.sectionId}},
                                {"range": {"exams.subject_details.exam_date": { "gte" : params.startDate }}},
                                {"range": {"exams.subject_details.exam_date": { "lte" : params.endDate}}}
                            ]
                        }
                    }
                ]
            }
        }
    };
    return {
        index: global.config.elasticSearch.index.calendarIndex,
        type: global.config.elasticSearch.index.examsType,
        body: body,
    };

}

//TODO : this method have to rework using bodybuilder
calendarUtil.updateEventsDoc = function(req, doc) {
    var docId = doc.id;
    var updateParams = {
        index: global.config.elasticSearch.index.calendarIndex,
        type: global.config.elasticSearch.index.eventsType,
        id: docId,
        body: {
            doc: doc,
            doc_as_upsert: true
        }
    };
    return updateParams;
};

calendarUtil.deleteEventsDocParams = function(req) {
    try {
        var deleteParams = {
            index: global.config.elasticSearch.index.calendarIndex,
            type: global.config.elasticSearch.index.eventsType,
            id: req.body.calendar_id // doc indexed id
        };
    } catch (err) {
        return err;
    }
    return deleteParams;
};

calendarUtil.updateExamsDoc = function(req, doc) {
    var docId = doc.id;
    var updateParams = {
        index: global.config.elasticSearch.index.calendarIndex,
        type: global.config.elasticSearch.index.examsType,
        id: docId,
        body: {
            doc: doc,
            doc_as_upsert: true
        }
    };
    return updateParams;
};

module.exports = calendarUtil;