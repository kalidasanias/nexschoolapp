/**
 * Created by karthik on 31-01-2017.
 */
module.exports = {
    fields: {
        user_name: {
            type: "text"
        },
        school_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        academic_year: {
            type: "text"
        },
        class_id: {
            type: "uuid"
        },
        class_name: {
            type: "varchar"
        },
        section_id: {
            type: "uuid"
        },
        section_name: {
            type: "varchar"
        }
    },
    key: ["user_name", "class_id", "section_id"],
    table_name: "user_class_section_details"
}