module.exports = {
	fields: {
	id: 	{
		type: "uuid"
		},
	tenant_id: {
		type: "timeuuid"
		},
	school_id: {
		type: "uuid"
		},
	latitude: {
		type: "float"
		},
	longitude: {
		type: "float"
		},
	school_name: {
		type: "varchar"
		},
	},
	key: ["id", "tenant_id", "school_id"],
	table_name: "school_map"
}