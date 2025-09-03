/**
 * Created by senthil-p on 11/05/17.
 */
module.exports = {
    fields: {
        sid: {
            type: "text"
        },
        user_name: {
            type: "text",
        }
    },
    key: ["user_name"],
    table_name: "session_users"
};