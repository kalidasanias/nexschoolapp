/**
 * Created by Kiran on 6/13/2017.
 */


module.exports = {
    fields: {
        id: {
            type: "uuid"
        },
        feature_id: {
            type: "uuid"
        },
        name: {
            type: "text"
        },
        description: {
            type: "text"
        }
    },
    key: ["id"],
    indexes: ["feature_id"],
    table_name: "permissions"
};