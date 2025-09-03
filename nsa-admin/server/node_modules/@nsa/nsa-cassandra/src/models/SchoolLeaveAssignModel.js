/**
 * Created by bharatkumarr on 17/04/17.
 */
/**
 * Created by bharatkumarr on 20/03/17.
 */


module.exports = {
    fields: {
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        emp_id: {
            type: "text"
        },
        emp_username: {
            type: "text"
        },
        reporting_emp_id: {
            type: "text"
        },
        reporting_emp_username: {
            type: "text"
        },
        leave_type_id: {
            type: "uuid"
        },
        dept_id: {
            type: "uuid"
        },
        desg_id: {
            type: "uuid"
        },
        id: {
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
        updated_username: {
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
    table_name: "school_leave_assign_details"
};
