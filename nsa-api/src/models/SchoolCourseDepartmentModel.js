module.exports = {
	fields: {
		id: {
			type: "uuid"
		},
		tenant_id: {
			type: "timeuuid",
		},
		school_id: {
			type: "uuid"
		},
		school_name: {
			type: "varchar"
		},
		course_id: {
			type: "uuid"
		},
		course_name: {
			type: "varchar"
		},
		class: {
			type: "map",
			typeDef: "<uuid, text>"
		},
		description: {
			type: "varchar"
		},
	},
	key: [["id"], "course_id", "tenant_id", "school_id"],
	table_name: "school_course_department"
}	
	