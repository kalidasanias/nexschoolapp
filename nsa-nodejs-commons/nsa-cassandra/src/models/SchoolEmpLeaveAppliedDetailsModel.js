/**
 * Created by Kiranmai A on 5/24/2017.
 */

module.exports = {
    fields: {
        applied_leave_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year: {
            type: "text"
        },
        reporting_emp_id: {
            type: "text"
        },
        emp_id: {
            type: "text"
        },
        leave_type_id: {
            type: "uuid"
        },
        from_date: {
            type : "timestamp"
        },
        to_date: {
            type : "timestamp"
        },
        leaves_count: {
            type: "int"
        },
        leave_reason: {
            type: "text"
        },
        status: {
            type: "text"
        },
        updated_by: {
            type: "text"
        },
        updated_first_name: {
            type: "text"
        },
        updated_date : {
            type : "timestamp"
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
    key: [["tenant_id", "school_id", "academic_year"], "applied_leave_id"],
    indexes: ["emp_id", "from_date", "to_date", "status"],
    table_name: "school_emp_leave_applied_details"
};
