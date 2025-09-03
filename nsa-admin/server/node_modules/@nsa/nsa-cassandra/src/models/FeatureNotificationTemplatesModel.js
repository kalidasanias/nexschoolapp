/**
 * Created by Kiranmai A on 3/18/2017.
 */

module.exports = {
    fields: {
        feature_id: {
            type: "uuid"
        },
        sub_feature_id: {
            type: "uuid"
        },
        actions: {
            type: "int"
        },
        user_type: {
            type: "varchar"
        },
        sms_template_title: {
            type: "varchar"
        },
        sms_template_message: {
            type: "varchar"
        },
        email_template_title: {
            type: "varchar"
        },
        email_template_message: {
            type: "varchar"
        },
        push_template_title: {
            type: "varchar"
        },
        push_template_message: {
            type: "varchar"
        },
        status: {
            type: "boolean"
        }
    },
    key: ["feature_id", "sub_feature_id", "actions"],
    indexes: ["user_type", "status"],
    table_name: "feature_notification_templates"
};