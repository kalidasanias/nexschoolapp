/**
 * Created by Kiranmai A on 5/24/2017.
 */

module.exports = {
    fields: {
        id: {
            type: "uuid"
        },
        applied_leave_id: {
            type: "uuid"
        },
        media_name: {
            type: "list",
            typeDef: "<text>"
        },
        status: {
            type: "text"
        },
        reason: {
            type: "text"
        },
        updated_by: {
            type: "text"
        },
        updated_first_name: {
            type: "text"
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
    key: ["applied_leave_id", "status"],
    table_name: "school_emp_leave_applied_logs"
};
