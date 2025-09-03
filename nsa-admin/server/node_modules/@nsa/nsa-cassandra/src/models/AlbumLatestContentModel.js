/**
 * Created by senthil on 28/06/17.
 */
module.exports = {
    fields: {
        date: {
            type: "text"
        },
        content_id: {
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
        file_type: {
            type: "text"
        },
        url: {
            type: "varchar"
        },
        name: {
            type: "text"
        },
        shared_to: {
            type: "set",
            typeDef: "<text>"
        },
        created_by: {
            type: "text"
        },
        created_date: {
            type: "timestamp"
        }
    },
    key: ["date", "content_id", "created_date"],
    table_name: "album_latest_contents",
    clustering_order: {created_date: "DESC", content_id: "ASC"},
};