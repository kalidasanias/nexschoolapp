/**
 * Created by Kiranmai A on 2/7/2017.
 */


module.exports = {
    fields: {
        language_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        language_name: {
            type: "text"
        }
    },
    key: ["language_id"],
    table_name: "school_languages"
};