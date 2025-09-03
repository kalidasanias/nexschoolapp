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
        }
    },
    key: [["tenant_id", "school_id", "academic_year"], "class_id", "section_id"],
    table_name: "school_class_section_details"
};