/**
 * Created by Kiranmai A on 2/7/2017.
 */

module.exports = {
    fields : {
        audit_id: {
            type: "uuid"
        },
        feature_id: {
            type: "uuid"
        },
        feature_type_id: {
            type: "uuid"
        },
        updated_by: {
            type: "varchar"
        },
        updated_username: {
            type: "varchar"
        },
        updated_date: {
            type: "timestamp"
        },
        type: {
            type: "varchar"
        }
    },

    key: ["audit_id", "feature_id", "feature_type_id", "type"],
    table_name: "audit_log"
};