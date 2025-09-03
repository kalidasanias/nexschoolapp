/**
 * Created by Kiran on 6/13/2017.
 */


module.exports = {
    fields: {
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        id: {
            type: "uuid"
        },
        name: {
            type: "text"
        },
        description: {
            type: "text"
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
        },
        default_value: {
            type: "boolean"
        },
        is_enable: {
            type: "boolean"
        },
        status: {
            type: "boolean"
        }
    },
    key: [["tenant_id", "school_id"], "id"],
    custom_indexes: [
        {
            on: 'name',
            using: 'org.apache.cassandra.index.sasi.SASIIndex',
            options: {}
        }
    ],
    table_name: "school_role_type"
};