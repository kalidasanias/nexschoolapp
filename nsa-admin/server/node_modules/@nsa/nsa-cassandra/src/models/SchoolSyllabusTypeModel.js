module.exports = {
	fields: {
	id: 	{
		type: "uuid"
		},
	type_id: {
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
	school_name: {
		type: "varchar"
		},
	type_name: {
		type: "varchar"
		}
	},
	key: [["id"], "type_id", "tenant_id", "school_id"],
	table_name: "school_syllabus_type"
}