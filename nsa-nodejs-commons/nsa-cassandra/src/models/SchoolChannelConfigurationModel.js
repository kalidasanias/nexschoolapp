/**
 * Created by Kiranmai A on 3/23/2017.
 */

module.exports = {
    fields: {
        feature_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        sms : {
            type: "boolean"
        },
        email : {
            type: "boolean"
        },
        push : {
            type: "boolean"
        }
    },
    key: ["feature_id", "tenant_id", "school_id"],
    table_name: "school_channel_configuration"
}