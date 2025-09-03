/**
 * Created by Kiranmai A on 3/3/2017.
 */

module.exports = {
    fields: {
        assignment_type_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        assignment_type_name: {
            type: "varchar"
        },
        assignment_desc: {
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
        created_by: {
            type : "varchar"
        },
        created_date : {
            type : "timestamp"
        },
        created_firstname: {
            type: "varchar"
        },
        default_value : {
            type : "boolean"
        },
        status : {
            type : "boolean"
        }

    },
    key: ["assignment_type_id", "tenant_id", "school_id"],
    table_name: "school_assignment_type"
}