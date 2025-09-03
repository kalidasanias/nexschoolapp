/**
 * Created by Kiranmai A on 2/9/2017.
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
        ac_year: {
            type: "varchar"
        },
        term: {
            type: "varchar"
        },
        end_date: {
            type: "timestamp"
        },
        start_date: {
            type: "timestamp"
        }
    },
    key: [["tenant_id", "school_id", "ac_year"], "id"],
    indexes: ["term"],
    table_name: "school_terms"
};