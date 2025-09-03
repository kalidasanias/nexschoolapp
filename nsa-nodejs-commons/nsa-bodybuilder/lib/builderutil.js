/**
 * Created by senthil on 10/02/17.
 */
'use strict';

var bodybuilder = require('bodybuilder');
var commons = require('@nsa/nsa-commons');
var models = require('@nsa/nsa-cassandra').Models;
var baseService = require('../../nsa-cassandra/src/services/common/base.service');
var _ = require('lodash');
var options;

// Constructor builderutil
var builderutil = function f(options) {
    var self = this;
    self.options = options;
};

builderutil.constructIndex = function(req) {
    var constructIndex = { index: global.config.elasticSearch.index.userIndex };
    return constructIndex;
};

builderutil.createIndexWithMappings = function(req) {
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
            student:{
                properties: {
                    tenant_id: { type: "string"},
                    school_id: { type: "string" },
                    school_name: { type: "string" },
                    academic_year: { type: "string" },
                    id: { type: "string" },
                    primary_phone: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                    user_name: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                    short_name: { type: "string" },
                    user_code: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                    date_of_joining: { type: "string" },
                    user_type: { type: "string" },
                    name: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                    first_name: { type : "completion",
                        contexts: [
                            { name: "userContext", type: "category", path: "user_type" },
                            { name: "schoolContext", type: "category", path: "school_id" },
                            { name: "tenantContext", type: "category", path: "tenant_id" }
                        ]
                    },
                    active: {type : "boolean"},
                    classes : {
                        type : "object",
                        properties : {
                            class_id : {type : "string", index : "not_analyzed"},
                            section_id : {type : "string", index : "not_analyzed"},
                            class_name : {type : "string", analyzer: "keyword_lowercase", fielddata: true},
                            section_name : {type : "string", analyzer: "keyword_lowercase", fielddata: true},
                            class_code : {type : "string", index : "not_analyzed"},
                            section_code : {type : "string", index : "not_analyzed"}
                        }
                    },
                    preclasses : {
                        type : "object",
                        properties : {
                            class_id : {type : "string", index : "not_analyzed"},
                            section_id : {type : "string", index : "not_analyzed"},
                            class_name : {type : "string", analyzer: "keyword_lowercase", fielddata: true},
                            section_name : {type : "string", analyzer: "keyword_lowercase", fielddata: true},
                            class_code : {type : "string", index : "not_analyzed"},
                            section_code : {type : "string", index : "not_analyzed"}
                        }
                    },
                    languages : {
                        type : "object",
                        properties : {
                            language_type : {type: "string"},
                            language_id : {type : "string", index : "not_analyzed"},
                            language_name : {type : "string", index : "not_analyzed"}
                        }
                    },
                    deviceToken: {
                        type : "object",
                        properties : {
                            registration_id : {type : "string", index : "not_analyzed"},
                            endpoint_arn : {type : "string", index : "not_analyzed"}
                        }
                    },
                    route_name: {type : "string"},
                    pickup_location: {
                        properties: {
                            location: { type: "geo_point" }
                        }
                    },
                    roles: {
                        type : "object",
                        properties : {
                            role_id: {type : "string", index : "not_analyzed"},
                            role_name: {type : "string", index : "not_analyzed"}
                        }
                    },
                    promoted: {type: "boolean"},
                    is_hostel: {type : "boolean"},
                    last_name : { type : "string", index : "not_analyzed"},
                    middle_name : { type : "string", index : "not_analyzed"},
                    gender : { type : "string", index : "not_analyzed"},
                    date_of_birth : { type : "string", index : "not_analyzed"},
                    place_of_birth : { type : "string", index : "not_analyzed"},
                    nationality : { type : "string", index : "not_analyzed"},
                    community : { type : "string", index : "not_analyzed"},
                    mother_tongue : { type : "string", index : "not_analyzed"},
                    profile_picture : { type : "string", index : "not_analyzed"},
                    blood_group : { type : "string", index : "not_analyzed"},
                    height : { type : "string", index : "not_analyzed"},
                    weight : { type : "string", index : "not_analyzed"},
                    attachments : { type : "string", index : "not_analyzed"},
                    parent_info  : {
                        type : "object",
                        properties : {
                            father_name : { type : "string", analyzer: "keyword_lowercase", fielddata: true},
                            father_qualification : { type : "string", index : "not_analyzed"},
                            father_occupation : { type : "string", index : "not_analyzed"},
                            father_email : { type : "string", index : "not_analyzed"},
                            father_phone : { type : "string", analyzer: "keyword_lowercase", fielddata: true},
                            father_income : { type : "string", index : "not_analyzed"},
                            mother_name : { type : "string", analyzer: "keyword_lowercase", fielddata: true},
                            mother_qualification : { type : "string", index : "not_analyzed"},
                            mother_occupation : { type : "string", index : "not_analyzed"},
                            mother_email : { type : "string", index : "not_analyzed"},
                            mother_phone : { type : "string", analyzer: "keyword_lowercase", fielddata: true},
                            mother_income : { type : "string", index : "not_analyzed"}
                        }
                    },
                    address_info  : {
                        type : "object",
                        properties  : {
                            street_address1 : { type : "string", index : "not_analyzed"},
                            street_address2 : { type : "string", index : "not_analyzed"},
                            city : { type : "string", index : "not_analyzed"},
                            state : { type : "string", index : "not_analyzed"},
                            pincode : { type : "string", index : "not_analyzed"},
                            country : { type : "string", index : "not_analyzed"},
                            present_street_address1 : { type : "string", index : "not_analyzed"},
                            present_street_address2 : { type : "string", index : "not_analyzed"},
                            present_city : { type : "string", index : "not_analyzed"},
                            present_state : { type : "string", index : "not_analyzed"},
                            present_pincode : { type : "string", index : "not_analyzed"}
                        }
                    },
                    additional_contact_info  : {
                        type : "object",
                        properties  : {
                            additional_contact1_name : { type : "string", analyzer: "keyword_lowercase", fielddata: true},
                            additional_contact1_relation : { type : "string", index : "not_analyzed"},
                            additional_contact1_address : { type : "string", index : "not_analyzed"},
                            additional_contact1_phone : { type : "string", index : "not_analyzed"},
                            additional_contact2_name : { type : "string", analyzer: "keyword_lowercase", fielddata: true},
                            additional_contact2_relation : { type : "string", index : "not_analyzed"},
                            additional_contact2_address : { type : "string", index : "not_analyzed"},
                            additional_contact2_phone : { type : "string", index : "not_analyzed"}
                        }
                    },
                    medical_info : {
                        type : "object",
                        properties : {
                            health : {type : "string", index : "not_analyzed"},
                            medical_data : {type : "string", index : "not_analyzed"}
                        }
                    }
                }
            },
            "employee":{
                properties: {
                    tenant_id: { type: "string"},
                    school_id: { type: "string" },
                    school_name: { type: "string" },
                    academic_year: { type: "string" },
                    id: { type: "string" },
                    primary_phone: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                    user_name: { type: "string", analyzer: "keyword_lowercase", fielddata: true},
                    short_name: { type: "string" },
                    user_code: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                    user_type: { type: "string" },
                    date_of_joining: { type: "string" },
                    name: { type: "string", analyzer: "keyword_lowercase", fielddata: true },
                    first_name: { type : "completion",
                        contexts: [
                            { name: "userContext", type: "category", path: "user_type" },
                            { name: "schoolContext", type: "category", path: "school_id" },
                            { name: "tenantContext", type: "category", path: "tenant_id" }
                        ]
                    },
                    active: {type : "boolean"},
                    classes : {
                        type : "object",
                        properties : {
                            class_id : {type : "string", index : "not_analyzed"},
                            section_id : {type : "string", index : "not_analyzed"},
                            class_name : {type : "string", analyzer: "keyword_lowercase", fielddata: true},
                            section_name : {type : "string", analyzer: "keyword_lowercase", fielddata: true},
                            class_code : {type : "string", index : "not_analyzed"},
                            section_code : {type : "string", index : "not_analyzed"}
                        }
                    },
                    dept: {
                        properties : {
                            "dept_id" : {type : "string", index : "not_analyzed"},
                            "dept_name": {type : "string", index : "not_analyzed"}
                        }
                    },
                    desg: {
                        properties : {
                            "desg_id" : {type : "string", index : "not_analyzed"},
                            "desg_name": {type : "string", index : "not_analyzed"}
                        }
                    },
                    subjects: {
                        properties : {
                            "subject_id" : {type : "string", index : "not_analyzed"},
                            "subject_name": {type : "string", index : "not_analyzed"}
                        }
                    },
                    deviceToken: {
                        type : "object",
                        properties : {
                            registration_id : {type : "string", index : "not_analyzed"},
                            endpoint_arn : {type : "string", index : "not_analyzed"}
                        }
                    },
                    roles: {
                        type : "object",
                        properties : {
                            role_id: {type : "string", index : "not_analyzed"},
                            role_name: {type : "string", index : "not_analyzed"}
                        }
                    }
                }
            },
            vehicle: {
                properties: {
                    tenant_id: { type: "string"},
                    school_id: { type: "string" },
                    academic_year: {type: "string"},
                    route : {
                        type : "object",
                        properties : {
                            route_name : {type : "string", index : "not_analyzed"},
                            vehicle_no : {type : "string", index : "not_analyzed"},
                            radius: {type: "integer"},
                            stops : {
                                type : "object",
                                properties : {
                                    location : {type : "string", index : "not_analyzed"},
                                    geopoints : { type: "geo_point" },
                                    user_name: { type: "object" }
                                }
                            }
                        }
                    }
                }
            },
          parentInformation: {
              properties: {
                  tenant_id: { type: "string"},
                  id: { type: "string"},
                  user_name: { type: "string", analyzer: "keyword_lowercase", fielddata: true},
                  parent_name: {type: "string" , analyzer: "keyword_lowercase", fielddata: true},
                  childs: {
                      type: "object",
                      properties : {
                          tenant_id: { type: "string"},
                          school_id: { type: "string"},
                          school_name: { type: "string"},
                          member_user_name: {type: "string"},
                          user_name:  {type: "string", index : "not_analyzed"},
                          first_name: {type: "string", index : "not_analyzed"},
                          admission_no: {type: "string", index : "not_analyzed"},
                          user_id: { type:"string", index : "not_analyzed"},
                          class_id : {type : "string", index : "not_analyzed"},
                          section_id : {type : "string", index : "not_analyzed"},
                          class_name : {type : "string", analyzer: "keyword_lowercase"},
                          section_name : {type : "string", analyzer: "keyword_lowercase"},
                          active: {type : "boolean"},
                      }
                  },
                  created_date: {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                  updated_date: {type: "date", format: "dateOptionalTime", index: "not_analyzed"},
                  updated_by: {type: "string", index:"not_analyzed"},
                  created_by: {type: "string", index:"not_analyzed"}
              }
          }
        }
    };
    return {
        index: global.config.elasticSearch.index.userIndex,
        body: JSON.stringify(body)
    };
};

builderutil.getUserSearchQueryParam = function(req) {
    var param = commons.domains.getParamObject(req);
    param.size = commons.constants.DEFAULT_PARAM_SIZE;
    param.userName = req.params.userName;

    return builderutil.getUserByUserNameQuery(req, param);
};

builderutil.getUserByUserType = function(req, data) {
    var param = commons.domains.getParamObject(req);
    param.size = commons.constants.DEFAULT_PARAM_SIZE;
    param.userType = data.userType;
    if(req.params.userName != undefined) {
        param.userName = req.params.userName;
    } else {
        param.userName = req.headers.userInfo.user_name;
    }

    return builderutil.getUserByUserNameAndUserType(req, param);
};

builderutil.getUserByUserNameAndUserType = function(req, param) {
    var body = bodybuilder()
        .size(param.size)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACTIVE, true)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_NAME, param.userName)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year)
        .build();
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: param.userType,
        body: JSON.stringify(body)
    };
};

builderutil.getUsersByUniqueIdsQuery = function(req, userIds) {
    var params = [];
    for (var i = 0; i < userIds.length; i++) {
        params.push(
            {
                "bool": {
                    must: [
                        {"match_phrase": {"active": true}},
                        {"match_phrase": {"id": userIds[i]}},
                        {"match_phrase": {"user_type": commons.constants.EMPLOYEE}},
                        {"match_phrase": {"tenant_id": req.headers.userInfo.tenant_id}},
                        {"match_phrase": {"school_id": req.headers.userInfo.school_id}},
                        {"match_phrase": {"academic_year": (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year}}
                    ]
                }
            }
        )
    };
    return builderutil.getEmpQuery(req, params);
};


builderutil.getEmpQuery = function(req, params) {
    var searchParams = {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.empType,
        body: {
            size: commons.constants.DEFAULT_PARAM_SIZE,
            "query": {
                "bool": {
                    "should": params
                }
            }
        }
    };

    return searchParams;
};


builderutil.getUsersByListsQuery = function(req, data) {
    /*var body = bodybuilder()
     .size(commons.constants.DEFAULT_PARAM_SIZE)
     .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACTIVE, true)
     .query(commons.constants.ES_TERMS, commons.constants.ES_USER_NAME, data.userNames)
     .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
     .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
     .build();


     return {
     index: global.config.elasticSearch.index.userIndex,
     body: JSON.stringify(body)
     };*/
    var userNames = data.userNames;
    var shouldQuery = [];

    for(var i = 0; i < userNames.length; i++) {
        shouldQuery.push(
            {"match_phrase": {"user_name": userNames[i]}}
        )
    };

    var searchParams = {
        index: global.config.elasticSearch.index.userIndex,
        body: {
            size: commons.constants.DEFAULT_PARAM_SIZE,
            "query": {
                "bool": {
                        "must": [
                            {"match_phrase": {"active": true}},
                            {"match_phrase": {"tenant_id": req.headers.userInfo.tenant_id}},
                            {"match_phrase": {"school_id": req.headers.userInfo.school_id}},
                            {"match_phrase": {"academic_year": (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year}},
                            {
                                "bool": {
                                    "should": shouldQuery
                                }
                            }
                        ]

                }
            }
        }
    };
    return searchParams;
};

builderutil.usersByListsQuery = function(data) {
    /*var body = bodybuilder()
        .size(commons.constants.DEFAULT_PARAM_SIZE)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACTIVE, true)
        .query(commons.constants.ES_TERMS, commons.constants.ES_USER_NAME, data.userNames)
        .build();
    return {
        index: global.config.elasticSearch.index.userIndex,
        body: JSON.stringify(body)
    };*/
    var userNames = data.userNames;
    var shouldQuery = [];

    for(var i = 0; i < userNames.length; i++) {
        shouldQuery.push(
            {"match_phrase": {"user_name": userNames[i]}}
        )
    };

    var searchParams = {
        index: global.config.elasticSearch.index.userIndex,
        body: {
            size: commons.constants.DEFAULT_PARAM_SIZE,
            "query": {
                "bool": {
                    "must": [
                        {"match_phrase": {"active": true}},
                        {
                            "bool": {
                                "should": shouldQuery
                            }
                        }
                    ]

                }
            }
        }
    };
    return searchParams;
};

builderutil.getUserByUserNameQuery = function(req, param) {
    var body = bodybuilder()
        .size(param.size)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACTIVE, true)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_NAME, param.userName)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year)
        .build();
    return {
        index: global.config.elasticSearch.index.userIndex,
        body: JSON.stringify(body)
    };
};

// Get all student search query param for elastic search
builderutil.getStudentSearchQueryParam = function(req) {
    var param = commons.domains.getParamObject(req);
    if (req.query.start) {
        param.from = req.query.start;
    } else {
        param.from = 0;
    }
    if (req.query.length) {
        param.size = req.query.length;
    } else {
        param.size = commons.constants.DEFAULT_PARAM_SIZE;
    }

    return builderutil.getStudentSearchQuery(req, param);
};

//Get All ParentLogins

builderutil.AllSchoolStudentSearchQuery = function(req) {

    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.studentType,
        size : 8000,
        scroll: '1m',
        body: {query: {"match_all": {}}}
    };
};

builderutil.getParentLoginsQueryParam = function(req) {
    var body = {
        size: commons.constants.DEFAULT_PARAM_SIZE,
        "query": {
            "bool": {
                "must": [
                    {
                        "bool": {
                            must: [
                                {"match_phrase": {"childs.tenant_id": req.headers.userInfo.tenant_id}},
                                {"match_phrase": {"childs.school_id": req.headers.userInfo.school_id}}
                            ]
                        }
                    }
                ]
            }
        }
    };
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.parentType,
        body: body,
    };
};
builderutil.getParentLoginSearchQuery = function(req, param) {
    var body = [];
        try{
        body = bodybuilder()
            .size(param.size)
            .from(param.from ? param.from : 0)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
    }catch (err){
    return err;
    }
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.parentType,
        body: JSON.stringify(body.build())
    };
};


// Get all parent search query param for elastic search
builderutil.getParentSearchQueryParam = function(req, res) {
    var param = commons.domains.getParamObject(req, res);
    param.size = commons.constants.DEFAULT_PARAM_SIZE;

    return builderutil.getParentLoginSearchQuery(req, param);
};

 builderutil.getStudentSearchQuery = function(req, param) {
    // Constructing elastic search query using bodybuilder

    var body, sorting = [], academic_year = req.headers.academicyear ? req.headers.academicyear :  req.headers.userInfo.academic_year ;
    if(req.body.academicYear != undefined) {
        academic_year = req.body.academicYear;
    }

    try {
        body = bodybuilder()
            .size(param.size)
            .from(param.from ? param.from : 0)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, academic_year);

        if (req.query.order) {
            _.forEach(req.query.order, function (order) {
                var column = order.column;
                var orderColumn = req.query.columns[column], sortObj = {};

                if (orderColumn.data === 'userCode') {
                    sortObj['user_code'] = { "order": order.dir }
                } else if (orderColumn.data === 'firstName') {
                    sortObj['name'] = { "order": order.dir }
                } else if (orderColumn.data === 'userName') {
                    sortObj['user_name'] = { "order": order.dir }
                } else if (orderColumn.data === 'primaryPhone') {
                    sortObj['primary_phone'] = { "order": order.dir }
                } else if (orderColumn.data.indexOf('class_name') > -1) {
                    sortObj['classes.class_name'] = { "order": order.dir }
                } else if (orderColumn.data.indexOf('section_name') > -1) {
                    sortObj['classes.section_name'] = { "order": order.dir }
                } else if (orderColumn.data === 'active') {
                    sortObj['active'] = { "order": order.dir }
                }
                sorting.push(sortObj);
            });
        }

        if (!_.isEmpty(sorting))  body.sort(sorting);

        if (req.query.columns) {
            var keywords = _.filter(req.query.columns, function (o) {
                return o.search.value !== '';
            });

            if (!_.isEmpty(keywords)) { //Advance Search
                _.forEach(keywords, function (queryObj) {
                    var esQuery = {}, field = '', queryKey = updateSpecialCharacter(queryObj.search.value.toString().toLowerCase());
                    if (queryObj.data === 'userCode') {
                        /*esQuery['analyze_wildcard'] = true;
                        esQuery['fields'] = ['user_code'];
                        esQuery[commons.constants.ES_QUERY] = queryObj.search.value + '*';*/
                        field = 'user_code:';
                        esQuery[commons.constants.ES_QUERY] = field + '/.*' + queryKey + '.*/';
                    } else if (queryObj.data === 'firstName') {
                        field = 'name:';
                        esQuery[commons.constants.ES_QUERY] = field + '/.*' + queryKey + '.*/';
                    } else if (queryObj.data === 'primaryPhone') {
                        field = 'primary_phone:';
                        esQuery[commons.constants.ES_QUERY] = field + '/.*' + queryKey + '.*/';
                    } if (queryObj.data === 'userName') {
                        field = 'user_name:';
                        esQuery[commons.constants.ES_QUERY] = field + '/.*' + queryKey + '.*/';
                        // esQuery[commons.constants.ES_QUERY] = field + '*' + queryObj.search.value + '*';
                    } else if (queryObj.data.indexOf('class_name') > -1) {
                        field = 'classes.class_name:';
                        esQuery[commons.constants.ES_QUERY] = field + '/.*' + queryKey + '.*/';
                    } else if (queryObj.data.indexOf('section_name') > -1) {
                        field = 'classes.section_name:';
                        esQuery[commons.constants.ES_QUERY] = field + '/.*' + queryKey + '.*/';
                    } else if (queryObj.data === 'active') {
                        if (queryObj.search.value.indexOf('In') > -1) {
                            esQuery[commons.constants.ES_QUERY] = 'active:false';
                        } else if (queryObj.search.value.indexOf('ac') > -1) {
                            esQuery[commons.constants.ES_QUERY] = 'active:true';
                        }
                    }

                    if ( !_.isEmpty(esQuery)) {
                        body.query(commons.constants.ES_QUERY_STRING, esQuery);
                    }

                })
            }
        }
        if (req.query.search && req.query.search.value) {
            var esQuery = {};
            esQuery['fields'] = ["user_name", "user_code", "name", "primary_phone", "classes.class_name", "classes.section_name" ];
            esQuery[commons.constants.ES_QUERY] = '*' + updateSpecialCharacter(req.query.search.value) + '*';
            body.query(commons.constants.ES_QUERY_STRING, esQuery);
        }
    } catch (err) {
        return err;
    }
    // Constructing elastic search search parameter and returning
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.studentType,
        body: JSON.stringify(body.build())
    };
};

function updateSpecialCharacter(str) {
    return str
        .replace(/[\#\@\%\&\*\+\-=~><\"\?\^\${}\(\)\:\!\/[\]\\\s]/g, '\\$&') // replace single character special characters
        .replace(/\|\|/g, '\\||') // replace ||
        .replace(/\&\&/g, '\\&&') ;
}

function getParams(req){
    var param = commons.domains.getParamObject(req);
    param.size = commons.constants.DEFAULT_PARAM_SIZE;
    param.userType = req.body.notifyTo.userType;

return param;
}

// Get all active employees by user_type where user_type from body
builderutil.getActiveEmployeesParam = function(req) {
    var param = getParams(req);
    return builderutil.getActiveEmployees(req, param);
};

//Get all active Students by user_type where user_type form body

builderutil.getActiveStudentsParam = function(req) {
    var param = commons.domains.getParamObject(req);
    param.size = commons.constants.DEFAULT_PARAM_SIZE;
    param.userType = 'Student';
    return builderutil.getActiveStudents(req, param);
};

// Get all employees by user_type where user_type from body
builderutil.getEmpTypeQueryParam = function(req) {
    var param = getParams(req);
    return builderutil.getEmpSearchQuery(req, param);
};

builderutil.getEmpSearchQueryParam = function(req) {
    var param = commons.domains.getParamObject(req);
    param.size = commons.constants.DEFAULT_PARAM_SIZE;

    return builderutil.getEmpSearchQuery(req, param);
};

builderutil.getActiveEmployees = function(req, param) {
    var body;
    try {
        body = bodybuilder()
            .size(param.size)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACTIVE, true)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_TYPE, commons.constants.EMPLOYEE)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .build();
    } catch (err) {
        return err;
    }
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.empType,
        body: JSON.stringify(body)
    };
};



builderutil.getActiveStudents = function(req, param) {
    var body;
    try {
        body = bodybuilder()
            .size(param.size)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACTIVE, true)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_TYPE, commons.constants.STUDENT)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year)
            .build();
    } catch (err) {
        return err;
    }
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.studentType,
        body: JSON.stringify(body)
    };
};



// Get user search query param for elastic search
builderutil.getEmpSearchQuery = function(req, param) {
    // Constructing elastic search query using bodybuilder
    var body;
    try {
        body = bodybuilder()
            .size(param.size)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_TYPE, commons.constants.EMPLOYEE)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .build();
    } catch (err) {
        return err;
    }
    // Constructing elastic search search parameter and returning
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.empType,
        body: JSON.stringify(body)
    };
};

// Get user search query param for elastic search
builderutil.getEmpByDeptQuery = function(req, param) {
    // Constructing elastic search query using bodybuilder
    var body;
    try {
        body = bodybuilder()
            .size(param.size)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACTIVE, true)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_TYPE, commons.constants.EMPLOYEE)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_DEPARMENT_DEPT_ID, param.deptId)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .build();
    } catch (err) {
        return err;
    }
    // Constructing elastic search search parameter and returning
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.empType,
        body: JSON.stringify(body)
    };
};

builderutil.getEmpBySubjectQuery = function(req, param) {
    // Constructing elastic search query using bodybuilder
    var body;
    try {
        body = bodybuilder()
            .size(param.size)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACTIVE, true)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_USER_TYPE, commons.constants.EMPLOYEE)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_SUBJECT_SUB_ID, param.subId)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .build();
    } catch (err) {
        return err;
    }
    // Constructing elastic search search parameter and returning
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.empType,
        body: JSON.stringify(body)
    };
};

builderutil.getStudentsByClassQueryParam = function(req, res) {
    var param = commons.domains.getParamObject(req, res);
    param.size = commons.constants.DEFAULT_PARAM_SIZE;
    param.classId = req.body.classId;

    return builderutil.getStudentsByClassQuery(req, res, param);
};

builderutil.getStudentsByClassQuery = function(req, res, param) {
    try {
        var body = bodybuilder()
            .size(param.size)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACTIVE, true)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_CLASSES_CLASS_ID, param.classId)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year)
            .build();
    } catch (err) {
        return err;
    }
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.studentType,
        body: JSON.stringify(body)
    };

};

builderutil.getDepromotedStudentsByClassQuery = function(req, param) {
    try {
        var body = bodybuilder()
            .size(param.size)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACTIVE, true)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_CLASSES_CLASS_ID, param.classId)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_PROMOTED, param.promoted)
            .build();
    } catch (err) {
        return err;
    }
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.studentType,
        body: JSON.stringify(body)
    };

};

builderutil.getPromotedStudentsByClassSecQuery = function(req, param) {
    try {
        var body = bodybuilder()
            .size(param.size)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACTIVE, true)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_CLASSES_CLASS_ID, param.classId)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_PROMOTED, param.promoted)
            .build();
    } catch (err) {
        return err;
    }
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.studentType,
        body: JSON.stringify(body)
    };

};

builderutil.getStudentsClassSectionQueryParam = function(req) {

    var param = commons.domains.getParamObject(req);
    param.size = commons.constants.DEFAULT_PARAM_SIZE;
    param.classId = req.params.classId;
    param.sectionId = req.params.sectionId;

    return builderutil.getStudentsByClassSectionQuery(req, param);
};

builderutil.getStudentsByClassSectionQuery = function(req, param) {
    try {
        var body = bodybuilder()
            .size(param.size)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACTIVE, true)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_CLASSES_CLASS_ID, param.classId)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_CLASSES_SECTION_ID, param.sectionId)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear : req.headers.userInfo.academic_year)
            .build();
    } catch (err) {
        return err;
    }
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.studentType,
        body: JSON.stringify(body)
    };
};

//TODO : this method have to rework using bodybuilder
builderutil.getUsersByLanguagesQueryParam = function(req) {
    var classs = req.body.classes;
    var languages = req.body.languages;
    var params = [];
    for (var i = 0; i < classs.length; i++) {
        for (var j = 0; j < languages.length; j++) {
            params.push(
                {
                    "bool": {
                        must: [
                            {"match_phrase": {"active": true}},
                            {match_phrase: {"classes.class_id": classs[i].id}},
                            {match_phrase: {tenant_id: req.headers.userInfo.tenant_id}},
                            {match_phrase: {school_id: req.headers.userInfo.school_id}},
                            {match_phrase: {"languages.language_id": languages[j].id}},
                            {match_phrase: {"academic_year": (req.headers.academicyear) ? req.headers.academicyear : req.headers.userInfo.academic_year}},
                        ]
                    }
                }
            )
        }
    };
    return builderutil.getUserQuery(req, params);
};

//TODO : this method have to rework using bodybuilder
builderutil.getUsersByClassSectionsQueryParam = function(req) {
    var classes = req.body.classes;
    var params = [];
    for (var i = 0; i < classes.length; i++) {
        params.push(
            {
                "bool": {
                    must: [
                        {"match_phrase": {"active": true}},
                        {"match_phrase": {"classes.class_id": classes[i].id}},
                        {"terms": {"classes.section_id": classes[i].section}},
                        {"match_phrase": {"academic_year": (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year}},
                        {"match_phrase": {"tenant_id": req.headers.userInfo.tenant_id}},
                        {"match_phrase": {"school_id": req.headers.userInfo.school_id}}
                    ]
                }
            }
        )
    };
    return builderutil.getUserQuery(req, params);
};

builderutil.getDepromotedUsersByClsSec = function(req, classes, promoted) {
    var params = [];
    for (var i = 0; i < classes.length; i++) {
        params.push(
            {
                "bool": {
                    must: [
                        {"match_phrase": {"active": true}},
                        {"match_phrase": {"classes.class_id": classes[i].id}},
                        {"terms": {"classes.section_id": classes[i].section}},
                        {"match_phrase": {"academic_year": (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year}},
                        {"match_phrase": {"tenant_id": req.headers.userInfo.tenant_id}},
                        {"match_phrase": {"school_id": req.headers.userInfo.school_id}},
                        {"match_phrase": {"promoted": promoted}}
                    ]
                }
            }
        )
    };
    return builderutil.getUserQuery(req, params);
};

//TODO : this method have to rework using bodybuilder
builderutil.getUserQuery = function(req, params) {
    var searchParams = {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.studentType,
        body: {
            size: commons.constants.DEFAULT_PARAM_SIZE,
            "query": {
                "bool": {
                    "should": params
                }
            }
        }
    };

    return searchParams;
};

builderutil.updateStudentQueryParam = function(req, data) {
    try {
        var docId = data.user_name;
        var output = [];
        var deviceTokenObj = data.device_token;
        for(var key in deviceTokenObj) {
            output.push({'registration_id':key, 'endpoint_arn': deviceTokenObj[key]})
        };
        var updateParams = {
            index: global.config.elasticSearch.index.userIndex,
            type: global.config.elasticSearch.index.studentType,
            id: docId,
            body: {
                doc: {
                    device_token: output
                }
            }
        };
    } catch (err) {
        return err;
    }
    return updateParams;
};

builderutil.getStudentByName = function(userName){
    var getParams = {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.studentType,
        id: userName
    };
    return getParams;
};

builderutil.getParentById = function(id){
    var params = {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.parentType,
        id: id.toString()
    };
    return params;
};


builderutil.getUsersByAcademic = function(req, users) {
    var body = {
        size: commons.constants.DEFAULT_PARAM_SIZE,
        "query": {
            "bool": {
                "must": [
                    {"terms": {"user_name": users}},
                    {"match_phrase": {"academic_year": (req.headers.userInfo.cyear[0].academicYear) ? req.headers.userInfo.cyear[0].academicYear :  req.headers.userInfo.academic_year}},
                ]
            }
        }
    };
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.studentType,
        body: body,
    };
};

builderutil.updateParentDoc = function(doc) {
    var updateParams = {
        index: {
            "_index": global.config.elasticSearch.index.userIndex,
            "_type": global.config.elasticSearch.index.parentType,
            "_id": doc.id
        }
    };
    return updateParams;
};

builderutil.updateParentParams = function(doc){
    var updateParams = {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.parentType,
        id: doc.id,
        body: {
            doc: doc,
            doc_as_upsert: true
        }
    };
 return updateParams;
}

builderutil.updateSiblingsQueryParam = function(req, data) {
    var updateParams;
    try {
        var outputDoc = [];
        _.forEach(data, function(user, key){
            var output = [];
            var docId = user.user_name;
            var deviceTokenObj = user.device_token;
            for(var key in deviceTokenObj) {
                output.push({'registration_id':key, 'endpoint_arn': deviceTokenObj[key]})
            };

            var docId = user.user_name;
            outputDoc.push(
                { update: { _index: global.config.elasticSearch.index.userIndex, _type: global.config.elasticSearch.index.studentType, _id: docId }},
                { doc: { device_token: output } });
        });

        updateParams= {
            body: outputDoc
        }
    } catch (err) {
        return err;
    }
    return updateParams;

};

builderutil.updateEmpQueryParam = function(req, data) {
    try {
        var docId = data.user_name;
        var output = [];
        var deviceTokenObj = data.device_token;
        for(var key in deviceTokenObj) {
            output.push({'registration_id':key, 'endpoint_arn': deviceTokenObj[key]})
        };
        var updateParams = {
            index: global.config.elasticSearch.index.userIndex,
            type: global.config.elasticSearch.index.empType,
            id: docId,
            body: {
                doc: {
                    device_token: output
                }
            }
        };
    } catch (err) {
        return err;
    }
    return updateParams;
};

builderutil.updateStudentQuery = function(data) {
    var updateParams;
    try {
        var studentObj = data.userESObj;
        var docId = (data._id) ? data._id : (models.uuid()).toString();
        updateParams = {
            index: global.config.elasticSearch.index.userIndex,
            type: global.config.elasticSearch.index.studentType,
            id: docId,
            body: {
                doc: studentObj,
                doc_as_upsert: true
            }
        };
    } catch (err) {
        return err;
    }
    return updateParams;
};

builderutil.updateEmpQuery = function(data) {
    var updateParams;
    try {
        var empObj = data.userESObj;
        var docId = empObj.user_name;
        updateParams = {
            index: global.config.elasticSearch.index.userIndex,
            type: global.config.elasticSearch.index.empType,
            id: docId,
            body: {
                doc: empObj,
                doc_as_upsert: true
            }
        };
    } catch (err) {
        return err;
    }
    return updateParams;
};

builderutil.getSuggestions = function(req, input) {
    var searchParams;
    try {
        searchParams = {
            index: global.config.elasticSearch.index.userIndex,
            body: {
                suggest:  {
                    docsuggest : {
                        prefix : input,
                        completion : {
                            field : "first_name",
                            size: commons.constants.DEFAULT_PARAM_SIZE,
                            contexts: {
                                schoolContext: req.headers.userInfo.school_id,
                                tenantContext: req.headers.userInfo.tenant_id

                            }
                        }
                    }
                }
            }
        };
    } catch (err) {
        return err;
    }
    return searchParams;
};

builderutil.buildVehicleDoc = function(inputDoc) {
    var doc = {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.vehicleType,
        body: inputDoc
    };
    return doc;
};

builderutil.getStopsByVehicle = function(vehicle_no) {
    try {
        var body = bodybuilder()
            .size(commons.constants.DEFAULT_PARAM_SIZE)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_VEHICLE, vehicle_no)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear :  req.headers.userInfo.academic_year)
            .build();
    } catch (err) {
        return err;
    }
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.vehicleType,
        body: JSON.stringify(body)
    };
};


builderutil.getVehiclesQuery = function(req) {
    try {
        var body = bodybuilder()
            .size(commons.constants.DEFAULT_PARAM_SIZE)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_VEHICLE, req.body.reg_no)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, (req.headers.academicyear) ? req.headers.academicyear : req.headers.userInfo.academic_year)
            .build();
    } catch (err) {
        return err;
    }
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.vehicleType,
        body: JSON.stringify(body)
    };
};

builderutil.getVehiclesBySchool = function(value, academic) {
    try {
        var body = bodybuilder()
            .size(commons.constants.DEFAULT_PARAM_SIZE)
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, value.tenant_id.toString())
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, value.school_id.toString())
            .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACADEMIC_YEAR, academic)
            .build();
    } catch (err) {
        return err;
    }
    return {
        index: global.config.elasticSearch.index.userIndex,
        type: global.config.elasticSearch.index.vehicleType,
        body: JSON.stringify(body)
    };
};


builderutil.updateVehicleQueryParam = function(stops, docId) {
    try {
        var docId = docId;
        var updateParams = {
            index: global.config.elasticSearch.index.userIndex,
            type: global.config.elasticSearch.index.vehicleType,
            id: docId,
            body: {
                doc: {
                    "stops" : stops
                }
            }
        };
    } catch (err) {
        return err;
    }
    return updateParams;
};

builderutil.getUsersByRoleQuery = function(req) {
    var body = bodybuilder()
        .size(commons.constants.DEFAULT_PARAM_SIZE)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ACTIVE, true)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.ES_ROLE_ID, req.body.roleId)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.TENANT_ID, req.headers.userInfo.tenant_id)
        .query(commons.constants.ES_MATCH_PHRASE, commons.constants.SCHOOL_ID, req.headers.userInfo.school_id)
        .build();
    return {
        index: global.config.elasticSearch.index.userIndex,
        body: JSON.stringify(body)
    };
};

builderutil.updateEmpsRolesQueryParam = function(req, data, rolesObj) {
    var updateParams;
    try {
        var outputDoc = [];
        _.forEach(data, function(user, key){
            var rolesData = req.body.roles;
            if(rolesObj == 'delete') {
                rolesData = _.differenceBy(user.roles, rolesData, 'id');
                rolesData = changeArrayKeyWithKey(rolesData, 'role_id', 'role_name');
            } else {
                rolesData = changeArrayKeyWithKey(rolesData, 'role_id', 'role_name');
                rolesData = _.concat(user.roles, rolesData);
            }

            var roles = _.unionBy(rolesData, 'role_id');
            var docId = user.userName;
            outputDoc.push(
                { update: { _index: global.config.elasticSearch.index.userIndex, _type: global.config.elasticSearch.index.empType, _id: docId }},
                { doc: { roles: roles } });
        });

        updateParams= {
            body: outputDoc
        }
    } catch (err) {
        return err;
    }
    return updateParams;
};

function changeArrayKeyWithKey(input, key1, key2) {
    // it will unwrap as [{ "id" : "1" , "name" : "name1"}, {"id" : "2", "name" : "name2"}] to [{ "key1" : "1" , "key2" : "name1"}, {"key1" : "2", "key2" : "name2"}]
    var array = []
    if (input != null && input != undefined) {
        input.forEach(function (item){
            var map = {};
            map[key1] = item.id;
            map[key2] = item.name;
            array.push(map);
        });

        return array;
    }

    return input;
};


builderutil.updateEmpRolesQueryParam = function(req, rolesObj) {
    var updateParams;
    var roles = _.unionBy(rolesObj, 'role_id');
    try {
        var outputDoc = [];
        var userName = req.params.id;
        var docId = userName;
        outputDoc.push(
            { update: { _index: global.config.elasticSearch.index.userIndex, _type: global.config.elasticSearch.index.empType, _id: docId }},
            { doc: { roles: roles } });
        updateParams= {
            body: outputDoc
        }
    } catch (err) {
        return err;
    }
    return updateParams;
};

builderutil.updateParentDocQuery = function(req) {
    var body = req.body, childs = [];
    var headers = baseService.getHeaders(req);
    _.forEach(body.childs, function(value, key){
        value.member_user_name = body.NewNumber;
        childs.push(value);
    });
    var doc = {};
    doc.id = body.id.toString();
    doc.father_name = body.father_name;
    doc.childs = childs;
    doc.user_name = body.NewNumber;
    doc.updated_by = headers.user_name;
    doc.updated_date = new Date();

    return builderutil.updateParentQuery(doc);
};

builderutil.updateParentQuery = function(doc){
    var updateParams = {
            index: global.config.elasticSearch.index.userIndex,
            type: global.config.elasticSearch.index.parentType,
            id: doc.id,
            body: {
                doc: doc,
                doc_as_upsert: true
            }
    };
    return updateParams;
}

module.exports = builderutil;
