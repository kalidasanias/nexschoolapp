/**
 * Created by magesh on 1/16/17.
 */
module.exports = {
    fields: {
        fee_type_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        fee_type_name: {
            type: "varchar"
        },
        fee_desc: {
            type: "varchar"
        },
        deposit: {
            type: "boolean"
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
        default : {
            type : "boolean"
        },
        status : {
            type : "boolean"
        }

    },
    key: ["fee_type_id", "created_date", "tenant_id", "school_id"],
    clustering_order: {"created_date": "desc"},
    table_name: "school_fee_type"
}
