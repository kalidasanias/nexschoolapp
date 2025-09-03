/**
 * Created by bharatkumarr on 17/04/17.
 */

module.exports = {
    fields: {
        id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        emp_id: {
            type: "text"
        },
        emp_first_name: {
            type: "text"
        },
        leave_type_id: {
            type: "uuid"
        },
        leave_type_name: {
            type: "text"
        },
        no_of_leaves: {
            type: "int"
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
    key: [["tenant_id", "school_id"], "emp_id", "leave_type_id"],
    table_name: "school_emp_leave_master"
};
