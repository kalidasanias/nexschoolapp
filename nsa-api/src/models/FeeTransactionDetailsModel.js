/**
 * Created by Kiranmai A on 2/14/2017.
 */

module.exports = {
    fields: {
        fee_assignment_detail_id: {
            type: "uuid"
        },
        fee_assignment_id: {
            type: "uuid"
        },
        user_name: {
            type: "text"
        },
        txn_status: {
            type: "text"
        },
        txn_id: {
            type: "text"
        },
        pg_txn_no: {
            type: "text"
        },
        pg_response_code: {
            type: "text"
        },
        txn_msg: {
            type: "text"
        },
        amount: {
            type: "decimal"
        },
        auth_id_code: {
            type: "text"
        },
        issuer_ref_no: {
            type: "text"
        },
        payment_mode: {
            type: "text"
        },
        txn_gateway: {
            type: "text"
        },
        currency: {
            type: "text"
        },
        card_holder_name: {
            type: "text"
        },
        txn_date: {
            type: "timestamp"
        }
    },
    key: ["fee_assignment_detail_id", "fee_assignment_id", "user_name"],
    table_name: "fee_transaction_details"
};
