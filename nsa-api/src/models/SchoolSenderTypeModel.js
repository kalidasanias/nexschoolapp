module.exports = {
	fields: {
		sender_id: {
			type: "uuid"
		},
		sender_name: {
			type: "varchar"
		},
		tenant_id: {
			type: "timeuuid"
		},
		school_id: {
			type: "uuid"
		},
		academic_year: {
			type: "text"
		},
		media_id: {
			type: "int"
		},
		media_name: {
			type: "text"
		}
	},
	key: [["sender_id"], "tenant_id", "school_id"],
	table_name: "school_sender_type"
};