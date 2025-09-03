/**
 * Created by bharatkumarr on 20/03/17.
 */


module.exports = {
    fields: {
        stop_id: {
            type: "int"
        },
        route_id: {
            type: "uuid"
        },
        lat: {
            type: "float"
        },
        lng: {
            type: "float"
        },
        location: {
            type: "text"
        },
        reg_no: {
            type: "text"
        },
        place_id: {
            type: "text"
        },
        radius: {
            type: "int"
        }
    },
    key: ["route_id", "stop_id"],
    table_name: "school_vehicle_stop_details"
};
