/**
 * Created by Kiranmai A on 1/24/2017.
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
        id: {
            type: "uuid"
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
        student_intake: {
            type: "int"
        },
        status: {
            type: "boolean"
        },
        updated_by: {
            type: "text"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_firstname: {
            type: "text"
        },
        created_by: {
            type: "text"
        },
        created_date: {
            type: "timestamp"
        },
        created_firstname: {
            type: "text"
        },
        promoted: {
            type: "boolean"
        },
        promoted_class_id: {
            type: "uuid"
        },
        promoted_class_name: {
            type: "text"
        },
        promoted_section_id: {
            type: "uuid"
        },
        promoted_section_name: {
            type: "text"
        },

    },
    key: [["tenant_id", "school_id", "academic_year"], "class_id", "section_id"],
    indexes: ["id"],
    table_name: "school_class_section_details"
};