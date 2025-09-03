/**
 * Created by Kiranmai A on 4/27/2017.
 */

module.exports = {
    fields : {
        event_detail_id: {
            type: "uuid"
        },
        event_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year : {
            type:  "text"
        },
        event_name: {
            type: "text"
        },
        start_date: {
            type: "date"
        },
        end_date:{
            type:"date"
        },
        start_time: {
            type: "time"
        },
        end_time: {
            type: "time"
        },
        event_type_id: {
            type: "uuid"
        },
        event_type_name: {
            type: "text"
        },
        activity_type_id: {
            type: "uuid"
        },
        activity_type_name: {
            type: "text"
        },
        event_venue: {
            type: "map",
            typeDef: "<uuid, text>"
        },
        description: {
            type: "text"
        },
        user_name: {
            type: "text"
        },
        first_name: {
            type: "text"
        },
        class_id: {
            type: "uuid"
        },
        class_name: {
            type: "text"
        },
        section_id: {
            type: "uuid"
        },
        section_name: {
            type: "text"
        },
        latitude: {
            type: "double"
        },
        longitude: {
            type: "double"
        },
        map_location: {
            type: "text"
        },
        is_mandatory: {
            type: "boolean"
        },
        attachments: {
            type: "map",
            typeDef: "<text, text>"
        },
        media_name: {
            type: "list",
            typeDef: "<text>"
        },
        updated_username: {
            type: "text"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_by:{
            type: "text"
        },
        status: {
            type: "boolean"
        },
        is_registered: {
            type: "boolean"
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

    key: ["event_detail_id", "tenant_id", "school_id","academic_year"],
    indexes: ["user_name"],
    table_name: "school_events_details"
};