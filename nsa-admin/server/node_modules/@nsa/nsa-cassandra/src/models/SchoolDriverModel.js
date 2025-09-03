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
        id: {
            type: "uuid"
        },
        driver_name: {
            type: "text"
        },
        driver_address: {
            type: "text"
        },
        driver_city: {
            type: "text"
        },
        driver_state: {
            type: "text"
        },
        driver_type: {
            type: "text"
        },
        driver_phone: {
            type: "text"
        },
        driver_dl_validity: {
            type: "timestamp"
        },
        driver_dl_type: {
            type: "text"
        },
        driver_dl_number: {
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
        }
    },
    key: ["tenant_id", "school_id", "id"],
    table_name: "school_driver_details"
};
