/**
 * Created by Kiranmai A on 4/24/2017.
 */

module.exports = {
    fields: {
        venue_type_id:{
            type: "uuid"
        },
        venue_type_name: {
            type: "varchar"
        },
        location: {
            type: "varchar"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_by: {
            type: "varchar"
        },
        updated_username: {
            type: "varchar"
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
    key: [["tenant_id", "school_id"], "venue_type_id"],
    table_name: "school_venue_type"
};