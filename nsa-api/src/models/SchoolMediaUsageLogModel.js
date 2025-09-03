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
		sent_by: {
			type: "varchar"
		},
		employee_username: {
			type: "varchar"
		},
		user_name: {
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
		message: {
			type: "varchar"
		},
		message_title: {
			type: "varchar"
		},
		title: {
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
		trans_date: {
			type: "timestamp"
		}
	},
	key: [["id"], "trans_date" , "notification_id", "tenant_id", "school_id", "user_name"],
	clustering_order: {"trans_date": "desc"},
	table_name: "school_media_usage_log"
}