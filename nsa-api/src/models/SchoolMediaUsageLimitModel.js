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
	feature_id: {
	    type: "uuid"
	},
	media_id: {
		type: "int"
		},
	academic_year: {
		type: "varchar"
		},
	available_limit: {
		type: "int"
		},
	media_name: {
		type: "varchar"
		},
	school_name: {
		type: "varchar"
		},
	used_count: {
		type: "int"
		}
	},
	key: ["id", "tenant_id", "school_id", "media_id"],
	table_name: "school_media_usage_limit"
}