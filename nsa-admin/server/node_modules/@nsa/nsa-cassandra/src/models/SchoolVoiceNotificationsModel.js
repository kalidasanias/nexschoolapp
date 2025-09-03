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
		audio_id: {
            type: "int"
        },
		campaign_name: {
            type: "varchar"
		},
        retry_condition: {
            type: "list",
            typeDef: "<varchar>"
        },
		retry_times: {
            type: "int"
		},
        retry_interval: {
            type: "int"
        },
		notified_mobile_numbers: {
		    type: "list",
			typeDef: "<varchar>"
		},
		notified_categories: {
		     type: "varchar"
		},
        notified_students: {
            type: "text"
        },
		count: {
			type: "int"
		},
		schedule_date: {
            type: "timestamp"
		},
		priority: {
			type: "int"
		},
		status: {
			type: "varchar"
		},
        feature_id: {
            type: "uuid"
        },
        object_id: {
            type: "uuid"
        },
        audio_uuid: {
            type: "uuid"
        },
        download_link: {
            type: "text"
        },
		is_app_notification: {
			type: "boolean"
		},
		updated_date: {
		    type: "timestamp"
		},
		updated_by: {
			type: "varchar"
		},
		updated_username: {
			type: "varchar"
		},
		created_by: {
			type : "varchar"
		},
		created_date : {
			type : "timestamp"
		},
		created_firstname: {
			type: "varchar"
		}
	},
	key: ["notification_id", "tenant_id", "school_id", "academic_year"],
	table_name: "school_voice_notifications"
}
