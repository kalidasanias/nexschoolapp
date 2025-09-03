/**
 * Created by Kiranmai A on 1/24/2017.
 */

module.exports = {
    fields: {
        class_id: {
            type: "uuid"
        },
        class_name: {
            type: "text"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year: {
            type: "text"
        }
    },
    key: [["tenant_id", "school_id", "academic_year"], "class_id",],
    table_name: "school_class_details"
};