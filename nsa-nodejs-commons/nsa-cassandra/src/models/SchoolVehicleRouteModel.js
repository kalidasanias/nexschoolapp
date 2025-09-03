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
        conductor_name: {
            type: "text"
        },
        conductor_phone: {
            type: "text"
        },
        conductor_address   : {
            type: "text"
        },
        destination: {
            type: "text"
        },
        driver_id: {
            type: "uuid"
        },
        orgin: {
            type: "text"
        },
        reg_no: {
            type: "text"
        },
        route_desc: {
            type: "text"
        },
        route_name: {
            type: "text"
        },
        from_lat: {
            type: "text"
        },
        from_lng: {
            type: "text"
        },
        to_lat: {
            type: "text"
        },
        to_lng: {
            type: "text"
        },
        overview_path: {
            type: "text"
        },
        updated_by: {
            type: "text"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_username: {
            type: "text"
        },
        waypoints: {
            type: "list",
            typeDef: "<text>"
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
    key: ["id", "tenant_id", "school_id"],
    table_name: "school_vehicle_route_details"
};
