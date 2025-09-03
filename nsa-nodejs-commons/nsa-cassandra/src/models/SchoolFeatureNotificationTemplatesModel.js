/**
 * Created by Kiranmai A on 3/23/2017.
 */

module.exports = {
    fields: {
        feature_id: {
            type: "uuid"
        },
        sub_feature_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
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
    key: ["feature_id", "sub_feature_id", "tenant_id", "school_id", "actions"],
    indexes: ["user_type", "status"],
    table_name: "school_feature_notification_templates"
};