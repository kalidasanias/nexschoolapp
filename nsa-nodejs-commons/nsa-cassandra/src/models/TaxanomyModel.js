/**
 * Created by Sai Deepak on 01-Feb-17.
 */
module.exports = {
    fields: {
        category_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year : {
            type:  "varchar"
        },
        id: {
            type: "uuid"
        },
        name: {
            type: "varchar"
        },
        parent_category_id: {
            type: "uuid"
        },
        description: {
            type: "varchar"
        },
        status: {
            type: "boolean"
        },
        type: {
            type: "varchar"
        },
        order_by: {
            type: "int"
        }
    },
    key: [["tenant_id", "school_id","academic_year"], "category_id"],
    indexes: ["parent_category_id"],
    table_name: "taxanomy"
}