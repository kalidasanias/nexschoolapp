/**
 * Created by Kiranmai A on 2/14/2017.
 */

module.exports = {
    fields: {
        fee_trans_id: {
            type: "uuid"
        },
        fee_id: {
            type: "uuid"
        },
        user_name: {
            type: "varchar"
        },
        sub_merchant_id: {
            type: "varchar"
        },
        tracking_id: {
            type: "varchar"
        },
        txn_status: {
            type: "varchar"
        },
        success_msg: {
            type: "varchar"
        },
        failure_msg: {
            type: "varchar"
        },
        payment_mode: {
            type: "varchar"
        },
        card_name: {
            type: "varchar"
        },
        card_holder_name: {
            type: "varchar"
        },
        amount: {
            type: "decimal"
        },
        payment_gateway: {
            type: "varchar"
        },
        raw_response: {
            type: "varchar"
        },
        txn_date: {
            type: "timestamp"
        }
    },
    key: ["fee_trans_id", "fee_id", "user_name"],
	indexes: ["sub_merchant_id"],
    table_name: "fee_transaction_details"
};
