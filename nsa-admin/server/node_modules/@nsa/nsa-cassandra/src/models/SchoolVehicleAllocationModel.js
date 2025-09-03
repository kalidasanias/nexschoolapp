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
        academic_year: {
            type: "text"
        },
        route_id: {
            type: "uuid"
        },
        reg_no: {
            type: "text"
        },
        first_name: {
            type: "text"
        },
        user_name: {
            type: "text"
        },
        user_code: {
            type: "text"
        },
        class_id: {
            type: "uuid"
        },
        class_name: {
            type: "text"
        },
        section_name: {
            type: "text"
        },
        section_id: {
            type: "uuid"
        },
        pickup_location: {
            type: "text"
        },
        pickup_location_index: {
            type: "int"
        },
        notify_distance: {
            type: "int"
        },
        notify_type: {
            type: "text"
        },
        id: {
            type: "uuid"
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
    key: ["id", "tenant_id", "school_id", "academic_year"],
    table_name: "school_vehicle_user_allocation"
};
