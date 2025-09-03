/**
 * Created by Kiranmai A on 3/3/2017.
 */


module.exports = {
    fields: {
        id: {
            type: "uuid"
        },
        description: {
            type: "varchar"
        },
        name: {
            type: "varchar"
        },
        code: {
            type: "varchar"
        },
        colour: {
            type: "varchar"
        }
    },
    key: ["id"],
    table_name: "subjects"
}