/**
 * Created by Sai Deepak on 24-Jan-17.
 */
module.exports = {
    fields: {
        fee_assignment_id: {
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
        fee_assignment_name: {
            type: "varchar"
        },
        applicable_classes: {
            type: "map",
            typeDef: "<uuid, varchar>"
        },
        applicable_languages: {
            type: "map",
            typeDef: "<uuid, varchar>"
        },
        media_type: {
            type: "map",
            typeDef: "<uuid, varchar>"
        },
        applicable_fee_types: {
            type: "map",
            typeDef: "<uuid, varchar>"
        },
        fee_types_amount: {
            type: "map",
            typeDef: "<uuid, decimal>"
        },
        refundable_percentage: {
            type: "map",
            typeDef: "<uuid, int>"
        },
        total_fee_amount: {
            type: "decimal"
        },
        due_date: {
            type : "timestamp"
        },
        created_date : {
            type : "timestamp"
        },
        updated_date : {
            type : "timestamp"
        },
        created_by : {
            type : "varchar"
        },
        status : {
            type : "boolean"
        },
        assigned_categories : {
            type: "varchar"
        }
    },
    key: ["fee_assignment_id", "created_date", "tenant_id", "school_id", "academic_year"],
    clustering_order: {"created_date": "desc"},
    table_name: "school_fee_assignment"
};