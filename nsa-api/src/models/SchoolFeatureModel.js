module.exports = {
	fields: {
		feature_id: {
			type: "uuid"
		},
		tenant_id: {
			type: "timeuuid"
		},
		school_id: {
			type: "uuid"
		},
		activated_date: {
			type: "timestamp"
		},
		description: {
			type: "varchar"
		},
		expire_date: {
			type: "timestamp"
		},
		feature_name: {
			type: "varchar"
		},
		icon: {
			type: "text"
		},
		school_name: {
			type: "varchar"
		},
		status: {
			type: "boolean"
		}
	},
	key: ["feature_id", "tenant_id", "school_id"],
	table_name: "school_feature"
}