/**
 * Created by senthil on 28/06/17.
 */
module.exports = {
    fields: {
        tag: {
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
        },
        tagged_date: {
            type: "timestamp"
        }
    },
    key: ["tag", "content_id"],
    table_name: "album_contents_by_tag"
};