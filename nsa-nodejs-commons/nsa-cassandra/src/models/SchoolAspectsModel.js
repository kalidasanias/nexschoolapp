


module.exports = {
    fields: {
        tenant_id: {
            type: "timeuuid"
        },
        aspect_id:{
            type: "uuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year : {
            type:  "varchar"
        },
        aspect_name: {
            type: "varchar"
        },
        aspect_code: {
            type: "varchar"
        },
        aspect_desc: {
            type: "varchar"
        },
        status: {
            type: "boolean"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_by: {
            type: "varchar"
        },
        updated_username: {
            type: "varchar"
        },
        created_by: {
            type : "varchar"
        },
        created_date : {
            type : "timestamp"
        },
        created_firstname: {
            type: "varchar"
        }
    },
    key: [["tenant_id", "school_id", "academic_year"], "aspect_id"],
    table_name: "school_aspects"
};