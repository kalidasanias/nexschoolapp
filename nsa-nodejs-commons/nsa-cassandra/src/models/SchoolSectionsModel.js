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
        updated_date: {
            type: "timestamp"
        },
        updated_by: {
            type: "text"
        },
        updated_username: {
            type: "text"
        },
        section_id: {
            type: "uuid"
        },
        section_name: {
            type: "text"
        },
        section_code: {
            type: "text"
        },
        status: {
            type: "boolean"
        },
        created_by: {
            type : "varchar"
        },
        created_date : {
            type : "timestamp"
        },
        created_firstname: {
            type: "varchar"
        }
    },
    key: [["tenant_id", "school_id", "academic_year"], "section_id"],
    table_name: "school_sections"
};