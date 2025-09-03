/**
 * Created by intellishine on 9/12/2017.
 */
module.exports = {
    fields: {
        hall_of_fame_details_id: {
            type: "uuid"
        },
        hall_of_fame_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        award_id: {
            type: "uuid"
        },
        award_name: {
            type: "text"
        },
        academic_year: {
            type: "varchar"
        },
        user_name: {
            type: "text"
        },
        first_name: {
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
        },
        media_name: {
            type: "list",
            typeDef: "<varchar>"
        },
        date_of_issue: {
            type: "date"
        },
        description: {
            type: "varchar"
        },
        status: {
            type: "boolean"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_by: {
            type: "varchar"
        },
        updated_firstname: {
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
        }
    },
    key: ["hall_of_fame_details_id", "tenant_id", "school_id", "academic_year"],
    indexes: ["user_name"],
    table_name: "school_hall_of_fame_details"
};