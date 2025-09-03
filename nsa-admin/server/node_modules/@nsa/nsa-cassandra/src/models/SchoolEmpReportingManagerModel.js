/**
 * Created by Kiranmai A on 5/24/2017.
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
        reporting_emp_id: {
            type: "text"
        },
        emp_id: {
            type: "text"
        },
        updated_by: {
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
    key: [["tenant_id", "school_id"], "emp_id"],
    indexes: ["reporting_emp_id"],
    table_name: "school_emp_reporting_manager"
};
