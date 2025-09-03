/**
 * Created by Kiran on 6/13/2017.
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
        role_id: {
            type: "uuid"
        },
        role_name: {
            type: "text"
        },
        permission_id: {
            type: "map",
            typeDef: "<uuid, text>"
        },
        updated_by: {
            type: "text"
        },
        updated_username: {
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
    key: [["tenant_id", "school_id"], "role_id"],
    table_name: "school_role_permissions"
};