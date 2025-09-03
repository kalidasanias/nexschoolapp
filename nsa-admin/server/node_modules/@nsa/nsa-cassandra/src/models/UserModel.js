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
        user_code: {
            type: "text"
        },
        short_name: {
            type: "text"
        },
        date_of_joining: {
            type: "timestamp"
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
        blood_group: {
            type: "text"
        },
        first_name: {
            type: "text"
        },
        last_name: {
            type: "text"
        },
        middle_name: {
            type: "text"
        },
        gender: {
            type: "text"
        },
        date_of_birth: {
            type: "timestamp"
        },
        place_of_birth: {
            type: "text"
        },
        nationality: {
            type: "text"
        },
        community: {
            type: "text"
        },
        mother_tongue: {
            type: "text"
        },
        is_hostel: {
            type: "boolean"
        },
        profile_picture: {
            type: "text"
        },
        attachments: {
            type: "map",
            typeDef: "<text, text>"
        },
        title: {
            type: "text"
        },
        created_date : {
            type : "timestamp"
        },
        updated_date: {
            type : "timestamp"
        },
        active : {
            type : "boolean"
        },
		transport_required: {
			type : "boolean"
		},
        medical_info: {
            type: "map",
            typeDef: "<text, text>"
        },
        height : {
            type : "text"
        },
        weight : {
            type : "text"
        },
    },
    key: ["user_name"],
    indexes: ["user_type"],
    table_name: "user"
};
