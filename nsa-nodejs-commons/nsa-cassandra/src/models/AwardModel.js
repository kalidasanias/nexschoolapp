/**
 * Created by intellishine on 9/12/2017.
 */
module.exports  = {
    fields: {
        id: {
            type: "uuid"
        },
        description: {
            type: "varchar"
        },
        name: {
            type: "varchar"
        }
    },
    key: ["id"],
    table_name: "award"
};