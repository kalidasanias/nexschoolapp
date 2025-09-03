/**
 * Created by Kiranmai A on 2/7/2017.
 */

module.exports = {
    fields : {
        audit_id: {
            type: "uuid"
        },
        user_name: {
            type: "varchar"
        },
        name: {
            type: "varchar"
        },
        updated_date: {
            type: "timestamp"
        }
    },

    key: ["audit_id"],
    table_name: "audit_log"
};