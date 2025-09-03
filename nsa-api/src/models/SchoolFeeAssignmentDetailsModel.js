/**
 * Created by Sai Deepak on 24-Jan-17.
 */

module.exports = {
    fields : {
        fee_assignment_detail_id: {
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
        fee_assignment_id: {
            type: "uuid"
        },
        fee_assignment_name: {
            type: "varchar"
        },
        username: {
            type: "varchar"
        },
        term_id: {
            type: "uuid"
        },
        term_name: {
            type: "varchar"
        },
        class_id: {
            type: "uuid"
        },
        class_name: {
            type: "varchar"
        },
        section_id: {
            type: "uuid"
        },
        section_name: {
            type: "varchar"
        },
        applicable_fee_types: {
            type: "map",
            typeDef: "<uuid, text>"
        },
        fee_types_amount: {
            type: "map",
            typeDef: "<uuid, decimal>"
        },
        refundable_percentage: {
            type: "map",
            typeDef: "<uuid, int>"
        },
        net_amount: {
            type: "decimal"
        },
        due_date: {
            type: "timestamp"
        },
        scholarship_name: {
            type: "map",
            typeDef: "<uuid, varchar>"
        },
        scholarship_amount: {
            type: "map",
            typeDef: "<uuid, decimal>"
        },
        fee_discount_name: {
            type: "varchar"
        },
        fee_discount_amount: {
            type: "decimal"
        },
        status: {
            type: "boolean"
        },
        is_paid: {
            type: "boolean"
        },
        paid_date: {
            type: "timestamp"
        },
        created_date: {
            type: "timestamp"
        },
        updated_date: {
            type: "timestamp"
        }
    },

    key: ["fee_assignment_detail_id", "created_date", "tenant_id", "school_id","academic_year"],
    indexes: ["fee_assignment_id", "class_id", "section_id", "term_id"],
    clustering_order: {"created_date": "desc"},
    table_name: "school_fee_assignment_details"
}