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
			type: "text"
			},
		grade_name: {
			type: "text"
			},
		start_range: {
            type: "float"
			},
        end_range: {
            type: "float"
			},
        cgpa_value: {
            type: "float"
			},
        color: {
            type: "text"
			}
	},
	key: [["id"], "tenant_id", "school_id"],
	indexes: ["grade_id"],
	table_name: "school_grading_system"
}