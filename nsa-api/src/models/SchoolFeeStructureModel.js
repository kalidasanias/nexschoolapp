/**
 * Created by magesh on 1/16/17.
 */
module.exports = {
    fields: {
        fee_structure_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year : {
            type :  "varchar"
        },
        fee_structure_name: {
            type: "varchar"
        },
        fee_structure_desc: {
            type: "varchar"
        },
        applicable_terms: {
            type: "map",
            typeDef: "<uuid, text>"
        },
        applicable_fee_types: {
            type: "map",
            typeDef: "<uuid, text>"
        },
        created_date : {
            type : "timestamp"
        },
        updated_date: {
            type: "timestamp"
        },
        created_by : {
            type : "varchar"
        },
        status : {
            type : "boolean"
        }
    },
    key: ["fee_structure_id", "created_date", "tenant_id", "school_id", "academic_year"],
    clustering_order: {"created_date": "desc"},
    table_name: "school_fee_structure"
};

