/**
 * Created by Kiranmai A on 3/13/2017.
 */

module.exports = {
    fields: {
        leave_history_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year : {
            type:  "varchar"
        },
        user_name: {
            type: "varchar"
        },
        user_type: {
            type: "varchar"
        },
        from_date: {
            type: "timestamp"
        },
        to_date: {
            type: "timestamp"
        },
        leaves_count: {
            type: "int"
        },
        is_cancelled: {
            type: "boolean"
        },
        cancelled_date : {
            type : "timestamp"
        },
        reason: {
            type: "varchar"
        },
        updated_by: {
            type : "varchar"
        },
        updated_date: {
            type: "timestamp"
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
    key: ["leave_history_id", "tenant_id", "school_id", "academic_year"],
    indexes: ["user_name", "from_date", "to_date"],
    table_name: "school_leave_history_details"
};