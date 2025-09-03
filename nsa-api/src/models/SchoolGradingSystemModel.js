module.exports = {
	fields: {
	id: {
		type: "uuid"
		},
	grade_id: {
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
	grade_name: {
		type: "varchar"
		},
	school_name: {
		type: "varchar"
		}
	},
	key: [["id"], "grade_id", "tenant_id", "school_id"],
	table_name: "school_grading_system"
}