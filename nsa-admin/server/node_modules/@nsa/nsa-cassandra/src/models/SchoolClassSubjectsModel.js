/**
 * Created by Britto on 4/7/2017.
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
        class_id: {
            type: "uuid"
        },
        section_id: {
            type: "uuid"
        },
        subject_id: {
            type: "uuid"
        },
        subject_type: {
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
        }
    },
    key: [["tenant_id", "school_id", "academic_year"], "class_id", "section_id", "subject_id"],
    table_name: "school_class_subjects"
};