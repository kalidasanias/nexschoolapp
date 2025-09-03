/**
 * Created by Kiranmai A on 2/3/2017.
 */

module.exports = {
    fields: {
        id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        school_name: {
            type: "text"
        },
        user_name: {
            type: "text"
        },
        device_token : {
            type: "map",
            typeDef: "<text, text>"
        },
        device_id: {
            type: "text"
        },
        password: {
            type: "text"
        },
        user_type: {
            type: "text"
        },
        name: {
            type: "text"
        },
        email: {
            type: "text"
        },
        primary_phone: {
            type: "text"
        },
        roles: {
            type: "map",
            typeDef: "<uuid, text>"
        },
        created_date : {
            type : "timestamp",
        },
        updated_date : {
            type : "timestamp",
        },
        active : {
            type : "boolean"
        }
    },
    key: ["id","user_name"],
    indexes: ["user_type"],
    table_name: "user"
};