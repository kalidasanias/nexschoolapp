/**
 * Created by magesh on 1/16/17.
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
            type :  "text"
        },
        fee_assignment_name: {
            type: "text"
        },
        fee_assignment_desc: {
            type: "text"
        },
        applicable_classes: {
            type: "map",
            typeDef: "<uuid, text>"
        },
        applicable_fee_types: {
            type: "map",
            typeDef: "<uuid, text>"
        },
        fee_types_amount : {
            type: "map",
            typeDef: "<uuid, decimal>"
        },
        total_fee_amount : {
            type : "decimal"
        },
        refundable_percentage : {
            type : "decimal"
        },
        net_amount : {
            type : "decimal"
        },
        due_date : {
            type : "timestamp"
        },
        created_date : {
            type : "timestamp"
        },
    },
    key: [["fee_assignment_id"], "created_date", "tenant_id", "school_id", "academic_year"],
    clustering_order: {"created_date": "desc"},
    table_name: "school_fee_assignment"
}

