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
			type: "varchar"
		},
		academic_year: {
			type: "varchar"
		},
		media_id: {
			type: "int"
		},
		media_name: {
			type: "varchar"
		},
		media_package_id: {
			type: "uuid"
		},
		topup_amount: {
			type: "decimal"
		},
		topup_count: {
			type: "int"
		},
		trans_date: {
			type: "timestamp"
		},
	},
	key: [["id", "tenant_id", "school_id", "media_id"], "trans_date"],
	clustering_order: {"trans_date": "desc"},
	table_name: "school_media_topup_log"
}