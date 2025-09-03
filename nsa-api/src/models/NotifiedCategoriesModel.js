/**
 * Created by Kiranmai A on 2/2/2017.
 */

module.exports = {
    fields: {
        id: {
          type: "uuid"
        },
        notification_id: {
            type: "uuid"
        },
        category_id: {
            type: "uuid"
        },
        category_name: {
            type: "text"
        },
        parent_category_id: {
            type: "uuid"
        }
    },
    key: ["notification_id"],
    table_name: "notified_categories"
};