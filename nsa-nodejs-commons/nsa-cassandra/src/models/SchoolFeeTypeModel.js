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
        updated_date: {
            type: "timestamp"
        },
        updated_by : {
            type : "varchar"
        },
        updated_username :{
            type : "varchar"
        },
        default_value : {
            type : "boolean"
        },
        status : {
            type : "boolean"
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
    key: ["fee_type_id", "tenant_id", "school_id"],
    table_name: "school_fee_type"
}
