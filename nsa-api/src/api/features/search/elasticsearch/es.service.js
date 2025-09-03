/**
 * Created by Kiranmai A on 1/30/2017.
 */

var client = require('./es.config')
    , constants = require('../../common/constants/constants');

client.cluster.health({},function(err,resp,status) {
    /*console.log("-- Client Health --",resp);*/
});

/** Delete an existing index  */
function deleteIndex() {
    return client.indices.delete({index: constants.INDEX_NAME});
}
exports.deleteIndex = deleteIndex;

/**
 * create the index
 */
function createIndex() {
    return client.indices.create({
        index: constants.INDEX_NAME
    });
}
exports.createIndex = createIndex;

/**
 * check if the index exists
 */
function indexExists() {
    return client.indices.exists({
        index: constants.INDEX_NAME
    });
}
exports.indexExists = indexExists;

function initMapping() {
    return client.indices.putMapping({
        index: constants.INDEX_NAME,
        type: constants.TYPE_NAME,
        body: {
            properties: {
                tenant_id: { type: "string"},
                school_id: { type: "string" },
                school_name: { type: "string" },
                academic_year: { type: "string" },
                id: { type: "string" },
                user_id: { type: "string" },
                primary_phone: { type: "string" },
                user_name: { type: "string" },
                "classes" : {
                    "type" : "object",
                    "properties" : {
                        "class_id" : {"type" : "string", "index" : "not_analyzed"},
                        "section_id" : {"type" : "string", "index" : "not_analyzed"},
                        "class_name" : {"type" : "string", "index" : "not_analyzed"},
                        "section_name" : {"type" : "string", "index" : "not_analyzed"}
                    }
                },
                user_type: { type: "string", "index" : "not_analyzed" }
            }
        }
    });
}
exports.initMapping = initMapping;

function searchQuery(searchParams, res, cb) {
    client.search(searchParams, function (error, response, status) {
        if (error){
            res.status(constants.HTTP_BAD_REQUEST).send({success: false, data: error});
        }
        else {
            cb(response, status);
        }
    });
}
exports.search = searchQuery;
