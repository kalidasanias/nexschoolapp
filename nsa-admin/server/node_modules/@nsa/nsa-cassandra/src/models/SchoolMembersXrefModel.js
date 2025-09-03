/**
 * Created by senthil on 22/09/17.
 */
module.exports = {
    fields: {
        id: {
            type: "uuid"
        },
        member_id: {
            type: "uuid"
        },
        member_user_name : {
            type: "text"
        },
        user_name: {
            type: "text"
        },
        user_id: {
            type: "uuid"
        },
        first_name: {
            type: "text"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        school_name : {
            type: "text"
        },
        father_name: {
            type: "text"
        },
        updated_by: {
            type : "varchar"
        },
        updated_date : {
            type : "timestamp"
        },
        created_by: {
            type : "varchar"
        },
        created_date : {
            type : "timestamp"
        },
        updated_first_name: {
            type: "varchar"
        },
    },
    key: ["member_user_name", "member_id", "user_id"],
    table_name: "school_members_xref"
}