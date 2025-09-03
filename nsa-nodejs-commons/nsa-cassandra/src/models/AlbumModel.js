/**
 * Created by senthil on 28/06/17.
 */
module.exports = {
    fields: {
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
        category: {
            type: "list",
            typeDef: "<text>"
        },
        category_objs: {
            type: "text"
        },
        name: {
            type: "varchar"
        },
        description: {
            type: "varchar"
        },
        preview_thumbnails: {
            type: "map",
            typeDef: "<text, text>"
        },
        viewed_count: {
            type: "int"
        },
        viewed_by: {
            type: "set",
            typeDef: "<text>"
        },
        no_of_files_contains: {
            type: "int"
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
        updated_by: {
            type: "text"
        },
        updated_date: {
            type: "timestamp"
        }
    },
    key: ["album_id", "tenant_id", "school_id", "academic_year"],
    table_name: "album",
    clustering_order: {tenant_id: "ASC", school_id: "ASC", academic_year: "ASC"},
};