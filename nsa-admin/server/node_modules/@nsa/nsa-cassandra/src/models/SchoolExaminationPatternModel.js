module.exports = {
	fields: {
	id: {
		type: "uuid"
		},
	pattern_id: {
		type: "uuid"
		},
	tenant_id: {
		type: "timeuuid"
		},
	school_id: {
		type: "uuid"
		},
	description: {
		type: "varchar"
		},
	pattern_name: {
		type: "varchar"
		},
	school_name: {
		type: "varchar"		
		}
	},
	key: [["id"], "pattern_id", "tenant_id", "school_id"],
	table_name: "school_examination_pattern"
}	
	