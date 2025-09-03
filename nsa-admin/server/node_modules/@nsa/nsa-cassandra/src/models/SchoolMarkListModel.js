/**
 * Created by kiranmai  on 7/11/17.
 */

module.exports = {
    fields: {
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
        subjects: {
            type: "map",
            typeDef: "<uuid, text>"
        },
        total_max_marks: {
            type: "float"
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
        uploaded_marklist: {
            type: "text"
        }
    },
    key: ["mark_list_id", "tenant_id", "school_id", "academic_year"],
    table_name: "school_mark_list"
};
