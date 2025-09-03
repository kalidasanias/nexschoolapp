/**
 * Created by Kiranmai A on 3/3/2017.
 */

module.exports = {
    fields: {
        assignment_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year : {
            type:  "varchar"
        },
        media_name: {
            type: "list",
            typeDef: "<varchar>"
        },
        assignment_name: {
            type: "varchar"
        },
        assignment_type_id: {
            type: "uuid"
        },
        assignment_type_name: {
            type: "varchar"
        },
        assignment_desc: {
            type: "varchar"
        },
        notified_categories: {
            type: "varchar"
        },
        subject_id: {
            type: "uuid"
        },
        subject_name: {
            type: "varchar"
        },
        subjects: {
            type: "map",
            typeDef: "<uuid, text>"
        },
        due_date: {
            type : "timestamp"
        },
        repeat_option_id: {
            type: "uuid"
        },
        repeat_option: {
            type: "varchar"
        },
        priority: {
            type: "int"
        },
        notify_to: {
            type: "varchar"
        },
        attachments: {
            type: "map",
            typeDef: "<text, text>"
        },
        updated_by: {
            type : "varchar"
        },
        updated_date : {
            type : "timestamp"
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
        },
        status : {
            type : "boolean"
        }
    },
    key: ["assignment_id", "tenant_id", "school_id", "academic_year"],
    table_name: "school_assignment"
};