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
        updated_date: {
            type: "timestamp"
        },
        updated_by : {
            type : "varchar"
        },
        updated_username :{
            type :"varchar"
        },
        status : {
            type : "boolean"
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
    key: ["scholarship_id", "tenant_id", "school_id"],
    table_name: "school_scholarship_type"
}
