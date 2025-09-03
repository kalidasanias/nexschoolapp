/**
 * Created by Kiranmai A on 3/31/2017.
 */

module.exports = {
    fields: {
        id: {
            type: "uuid"
        },
        class_id: {
            type: "uuid"
        },
        section_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year: {
            type: "text"
        },
        class_teacher_id: {
            type: "text"
        },
        updated_by: {
            type: "text"
        },
        updated_username: {
            type: "text"
        },
        updated_date: {
            type: "timestamp"
        }
    },
    key: ["class_id", "section_id", "tenant_id" , "school_id", "academic_year"],
    indexes: ["class_teacher_id"],
    table_name: "class_timetable"
};