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
        academic_year: {
            type: "varchar"
        },
        award_name: {
            type: "text"
        },
        award_id: {
            type: "text"
        },
        status: {
            type:"boolean"
        },
        description: {
            type: "text"
        }
    },
    key: [["tenant_id", "school_id", "academic_year"], "id"],
    table_name: "school_award"
};