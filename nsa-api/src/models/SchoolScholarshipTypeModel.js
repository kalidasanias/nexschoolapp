/**
 * Created by magesh on 1/16/17.
 */
module.exports = {
    fields: {
        scholarship_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        scholarship_name: {
            type: "varchar"
        },
        scholarship_desc: {
            type: "varchar"
        },
        amount: {
            type: "float"
        },
        attachment : {
            type : "blob"
        },
        valid_upto : {
            type : "timestamp"
        },
        created_date : {
            type : "timestamp"
        },
        updated_date: {
            type: "timestamp"
        },
        created_by : {
            type : "varchar"
        },
        status : {
            type : "boolean"
        }

    },
    key: ["scholarship_id", "created_date", "tenant_id", "school_id"],
    clustering_order: {"created_date": "desc"},
    table_name: "school_scholarship_type"
}
