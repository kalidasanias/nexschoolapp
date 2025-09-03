/**
 * Created by praga on 7/26/2017.
 */
module.exports = {
    fields: {
        feedback_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        feedback_desc: {
            type: "varchar"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_by : {
            type : "varchar"
        },
        updated_username: {
            type : "varchar"
        },
        first_name:{
            type : "varchar"
        },
        class_name: {
            type : "varchar"
        },
        class_id : {
            type : "uuid"
        },
        section_name: {
            type: "varchar"
        },
        section_id : {
            type : "uuid"
        },
        feature_id: {
            type : "uuid"
        },
        feature_name: {
            type: "varchar"
        }
    },
    key: ["feedback_id", "tenant_id", "school_id"],
    table_name: "school_feedback_details"
}