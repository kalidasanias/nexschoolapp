module.exports = {
	fields: {
		notification_id: {
			type: "uuid"
		},
		tenant_id: {
			type: "timeuuid"
		},
		school_id: {
			type: "uuid"
		},
        feature_id: {
            type: "uuid"
        },
        object_id: {
            type: "uuid"
        },
		academic_year: {
			type: "text"
		},
		media_name: {
			type: "list",
			typeDef: "<text>"
		},
		sender_id: {
			type: "uuid"
		},
		notified_list: {
			type: "list",
			typeDef: "<text>"
		},
		notified_mobile_numbers: {
		    type: "list",
			typeDef: "<text>"
		},
		notified_categories: {
		     type: "text"
		},
		template_id:{
		    type: "uuid"
		},
        sms_raw_response: {
            type:"text"
		},
		template_title: {
			type:"text"
		},
		title: {
			type: "text"
		},
		message: {
			type: "text"
		},
		email_template_title: {
			type: "text"
		},
		email_template_message: {
			type: "text"
		},
		push_template_title: {
			type: "text"
		},
		push_template_message: {
			type: "text"
		},
		count: {
			type: "int"
		},
		notification_type: {
			type: "text"
		},
		priority: {
			type: "int"
		},
		status: {
			type: "text"
		},
		updated_date: {
		    type: "timestamp"
		},
		updated_by: {
			type: "text"
		},
		updated_username: {
			type: "text"
		},
		created_by: {
			type : "text"
		},
		created_date : {
			type : "timestamp"
		},
		created_firstname: {
			type: "text"
		},
        notified_students: {
            type: "text"
		},
		user_types: {
			type: "list",
			typeDef: "<text>"
		},
		attachments: {
			type: "map",
			typeDef: "<text, text>"
		},
		media_status : {
            type: "text"
		}
	},
	key: ["notification_id", "tenant_id", "school_id", "academic_year"],
	table_name: "school_notifications"
}