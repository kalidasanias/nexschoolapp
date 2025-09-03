module.exports = {
	fields: {
	template_id: {
		type: "uuid",
		},
	tenant_id: {
		type: "timeuuid"
	},
	school_id: {
		type: "uuid"
	},
	school_name: {
		type: "varchar"
	},
	template_title: {
		type: "varchar"
		},
	template_message: {
			type: "varchar"
		},
	status: {
		type: "varchar"
	    },
	created_date: {
		type: "timestamp"
	    },
	updated_date: {
		type: "timestamp"
		},
	},
	key: ["template_id", "tenant_id", "school_id"],
	table_name: "school_template"
}