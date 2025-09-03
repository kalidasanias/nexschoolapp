/**
 * Created by Kiranmai A on 3/3/2017.
 */

module.exports = {
    fields: {
        assignment_detail_id: {
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
        assignment_id: {
            type: "uuid"
        },
        assignment_name: {
            type: "varchar"
        },
        assignment_desc: {
            type: "varchar"
        },
        assignment_type_id: {
            type: "uuid"
        },
        assignment_type_name: {
            type: "varchar"
        },
        user_name: {
            type: "varchar"
        },
        first_name: {
            type: "varchar"
        },
        class_id: {
            type: "uuid"
        },
        class_name: {
            type : "varchar"
        },
        section_id: {
            type: "uuid"
        },
        section_name: {
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
            type: "timestamp"
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
        attachments : {
            type : "map",
            typeDef : "<text, text>"
        },
        updated_by: {
            type: "varchar"
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
        },
        submitted_date: {
            type : "timestamp"
        },
        is_submitted: {
            type : "boolean"
        },
        deactivated: {
            type : "boolean"
        },
        is_read: {
            type : "boolean"
        }
    },
    key: ["assignment_detail_id", "tenant_id", "school_id", "academic_year"],
    indexes: ["assignment_id", "class_id", "section_id"],
    table_name: "school_assignment_details"
};