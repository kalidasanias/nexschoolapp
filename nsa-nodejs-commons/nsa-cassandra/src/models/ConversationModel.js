/**
 * Created by Kiranmai A on 3/7/2017.
 */


module.exports = {
    fields: {
        conversation_id: {
            type: "uuid"
        },
        feature_id: {
            type: "uuid"
        },
        feature_detail_id: {
            type: "uuid"
        },
        admission_no: {
            type: "varchar"
        },
        user_name: {
            type: "varchar"
        },
        name: {
            type: "varchar"
        },
        class_id: {
            type: "uuid"
        },
        class_name: {
            type: "varchar"
        },
        section_id: {
            type: "uuid"
        },
        section_name: {
            type: "varchar"
        },
        message: {
            type: "varchar"
        },
        message_read: {
            type: "boolean"
        },
        message_date: {
            type: "timestamp"
        }
    },
    key: ["feature_detail_id", "user_name", "message_date"],
    indexes: ["feature_id"],
    table_name: "conversation"
}