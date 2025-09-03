/**
 * Created by Kiranmai A on 2/14/2017.
 */

module.exports = {
    fields: {
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        payment_gateway_id: {
            type: "uuid"
        },
        payment_gateway: {
            type: "text"
        },
        gateway_details: {
            type: "map",
            typeDef: "<text, text>"
        },
        status: {
            type: "boolean"
        }

    },
    key: ["tenant_id", "school_id", "payment_gateway_id"],
    table_name: "payment_gateway"
};