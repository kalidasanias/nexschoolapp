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
		academic_year: {
			type: "varchar"
		},
		media_name: {
			type: "list",
			typeDef: "<varchar>"
		},
		sender_id: {
			type: "uuid"
		},
		sent_id: {
			type: "varchar"
		},
		notified_list: {
			type: "list",
			typeDef: "<varchar>"
		},
		notified_mobile_numbers: {
		    type: "list",
			typeDef: "<varchar>"
		},
		notified_categories: {
		     type: "varchar"
		},
		template_id:{
		    type: "uuid"
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
		created_date: {
		    type: "timestamp"
		},
		updated_date: {
		    type: "timestamp"
		}
	},
	key: [["tenant_id", "school_id", "academic_year"],"created_date"],
	indexes: ["notification_id"],
	clustering_order: {"created_date": "desc"},
	table_name: "school_notifications"
}