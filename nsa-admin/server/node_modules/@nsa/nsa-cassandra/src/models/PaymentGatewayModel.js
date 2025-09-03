/**
 * Created by Kiranmai A on 2/14/2017.
 */


module.exports = {
    fields: {
        payment_gateway_id: {
            type: "uuid"
        },
        payment_gateway: {
            type: "text"
        },
        description: {
            type: "text"
        },
        status: {
            type: "boolean"
        }
    },
    key: ["payment_gateway_id"],
    table_name: "payment_gateway"
};