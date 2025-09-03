/**
 * Created by intellishine on 12/19/2017.
 */

module.exports = {
    fields:{
        tenant_id:{
          type: "timeuuid"
        },
        id:{
            type: "uuid"
        },
        user_name: {
            type: "text"
        }
    },
    key: ["tenant_id", "user_name"],
    table_name: "school_parent_logins"
};
