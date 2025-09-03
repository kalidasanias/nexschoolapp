/**
 * Created by intellishine on 9/12/2017.
 */
module.exports = {
    fields: {
        id: {
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
        media_name: {
            type: "list",
            typeDef: "<varchar>"
        },
        notified_students: {
            type: "text"
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
        number_of_students: {
            type: "int"
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
    key: ["id", "tenant_id", "school_id", "academic_year"],
    table_name: "school_hall_of_fame"
}