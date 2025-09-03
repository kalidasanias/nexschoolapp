module.exports = {
	fields: {
		id: {
			type: "uuid"
			},
		notification_id: {
			type: "uuid"
			},
		tenant_id: {
			type: "timeuuid"
			},
		school_id: {
			type: "uuid"
			},
		academic_year: {
			type: "varchar"
		},
		sender_id: {
			type: "uuid"
		},
		employee_username: {
			type: "varchar"
		},
		user_name: {
			type: "varchar"
		},
		first_name: {
			type: "varchar"
		},
		user_type: {
			type: "varchar"
		},
		class_id: {
		    type: "uuid"
		},
		section_id: {
		    type: "uuid"
		},
		primary_phone: {
			type: "varchar"
		},
		feature_name: {
			type: "varchar"
		},
		group_name: {
			type: "varchar"
		},
		media_name: {
			type: "list",
			typeDef: "<varchar>"
		},
		template_title: {
			type:"varchar"
		},
		title: {
			type: "varchar"
		},
		message: {
			type: "varchar"
		},
		email_template_title: {
			type: "varchar"
		},
		email_template_message: {
			type: "varchar"
		},
		push_template_title: {
			type: "varchar"
		},
		push_template_message: {
			type: "varchar"
		},
		count: {
		    type: "int"
		},
		notification_type: {
			type: "varchar"
		},
		priority: {
			type: "int"
		},
		status: {
			type: "varchar"
		},
		updated_date: {
			type: "timestamp"
		},
		updated_by: {
			type: "varchar"
		},
		sms_response: {
            type: "varchar"
		},
		updated_username: {
			type: "varchar"
		},
		deactivated: {
			type: "boolean"
		},
		attachments: {
			type: "map",
            typeDef: "<text, text>"
		},
        is_read: {
            type: "boolean"
		}
	},
	key: [["id"], "notification_id", "tenant_id", "school_id", "user_name"],
	table_name: "school_media_usage_log"
}