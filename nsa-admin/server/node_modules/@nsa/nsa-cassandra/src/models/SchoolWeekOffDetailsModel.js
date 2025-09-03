/**
 * Created by Kiranmai A on 5/24/2017.
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
        saturday: {
            type: "list",
            typeDef: "<int>"
        },
        sunday: {
            type: "list",
            typeDef: "<int>"
        },
        updated_by: {
            type: "text"
        },
        updated_first_name: {
            type: "text"
        },
        updated_date: {
            type: "timestamp"
        }
    },
    key: [["tenant_id", "school_id"], "id"],
    table_name: "school_week_off_details"
};
