   /**
 * Created by senthil on 22/09/17.
 */
module.exports = {
    fields: {
        id: {
            type: "uuid"
        },
        user_name: {
            type: "text"
        },
        first_name: {
            type: "text"
        },
        tenant_id: {
            type: "timeuuid"
        },
        password : {
            type: "text"
        },
        user_type : {
            type: "text"
        },
        created_date : {
            type: "timestamp"
        },
        updated_date : {
            type: "timestamp"
        }
    },
    key: ["id"],
    table_name: "school_members"
}