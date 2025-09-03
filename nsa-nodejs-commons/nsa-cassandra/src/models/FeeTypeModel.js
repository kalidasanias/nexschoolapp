/**
 * Created by magesh on 1/16/17.
 */
module.exports = {
    fields: {
        fee_type_id: {
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
        default_value : {
            type : "boolean"
        },
        status : {
            type : "boolean"
        }

    },
    key: ["fee_type_id", "created_date"],
    table_name: "fee_type"
}
