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
        reg_no: {
            type: "text"
        },
        vehicle_type: {
            type: "text"
        },
        seating_capacity: {
            type: "int"
        },
        vehicle_reg_date: {
            type: "timestamp"
        },
        vehicle_fc_date: {
            type: "timestamp"
        },
        is_hired: {
            type: "boolean"
        },
        vehicle_owner_name: {
            type: "text"
        },
        vehicle_owner_address: {
            type: "text"
        },
        vehicle_owner_city: {
            type: "text"
        },
        vehicle_owner_state: {
            type: "text"
        },
        vehicle_owner_phone: {
            type: "text"
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
        },
        active: {
            type: "boolean"
        }
    },
    key: ["tenant_id", "school_id", "reg_no"],
    table_name: "school_vehicle_details"
};
