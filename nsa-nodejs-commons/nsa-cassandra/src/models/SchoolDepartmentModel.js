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
        dept_id: {
            type: "uuid"
        },
        default_value: {
            type: "boolean"
        },
        dept_alias: {
            type: "text"
        },
        dept_name: {
            type: "text"
        },
        status: {
            type: "boolean"
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
    key: [["tenant_id", "school_id"], "dept_id"],
    table_name: "school_department"
};
