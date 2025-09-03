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
        fee_structure_id: {
            type: "uuid"
        },
        user_name: {
            type: "varchar"
        },
        first_name:{
          type:"varchar"
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
        paid_amount: {
            type: "decimal"
        },
        is_partial: {
            type: "boolean"
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
        updated_username: {
            type: "varchar"
        },
        admission_no:{
            type:"varchar"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_by:{
            type:"varchar"
        },
        created_by: {
            type : "varchar"
        },
        created_date : {
            type : "timestamp"
        },
        created_firstname: {
            type: "varchar"
        }
    },

    key: ["fee_assignment_detail_id", "tenant_id", "school_id","academic_year"],
    indexes: ["fee_assignment_id", "class_id", "section_id", "term_id"],
    table_name: "school_fee_assignment_details"
}