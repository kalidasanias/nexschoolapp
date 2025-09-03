/**
 * Created by senthil on 28/06/17.
 */
module.exports = {
    fields: {
        content_id: {
            type: "uuid"
        },
        album_id: {
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
        metadata: {
            type: "frozen",
            typeDef: "<album_content_metadata>"
        },
        mimetype: {
            type: "text"
        },
        file_url: {
            type: "varchar"
        },
        file_name: {
            type: "varchar"
        },
        tags: {
            type: "set",
            typeDef: "<text>"
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
    key: ["content_id", "tenant_id", "school_id", "academic_year"],
    table_name: "album_content_details"
};