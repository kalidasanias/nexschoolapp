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
        section_id: {
            type: "uuid"
        },
        languages: {
            type: "map",
            typeDef: "<int, uuid>"
        },
        promoted : {
            type: "boolean"
        }
    },
    key: [["tenant_id", "school_id", "academic_year"], "class_id", "user_name"],
    table_name: "user_classification"
}
