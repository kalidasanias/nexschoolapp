/**
 * Created by kiranmai on 7/11/17.
 */

module.exports = {
    fields: {
        mark_list_detail_id: {
            type: "uuid"
        },
        mark_list_id: {
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
        exam_schedule_id: {
            type: "uuid"
        },
        written_exam_id: {
            type: "uuid"
        },
        written_exam_name: {
            type:  "text"
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
        user_name: {
            type: "text"
        },
        user_code: {
            type: "text"
        },
        first_name: {
            type: "text"
        },
        primary_phone: {
            type: "text"
        },
        subject_mark_details: {
            type: "frozen",
            typeDef: "<set <user_subject_mark_details>>"
        },
        total_marks: {
            type: "float"
        },
        total_max_marks: {
            type: "float"
        },
        total_grade_id: {
            type: "uuid"
        },
        total_grade_name: {
            type: "text"
        },
        total_cgpa_value: {
            type: "float"
        },
        examination_date: {
            type : "timestamp"
        },
        media_name: {
            type: "set",
            typeDef: "<text>"
        },
        updated_by: {
            type : "text"
        },
        updated_date : {
            type : "timestamp"
        },
        updated_firstname: {
            type: "text"
        },
        created_by: {
            type : "text"
        },
        created_date : {
            type : "timestamp"
        },
        created_firstname: {
            type: "text"
        },
        status: {
            type: "boolean"
        },
        remarks: {
            type: "text"
        }
    },
    key: ["mark_list_detail_id", "tenant_id", "school_id", "academic_year"],
    indexes: ["mark_list_id"],
    table_name: "school_mark_list_details"
};
