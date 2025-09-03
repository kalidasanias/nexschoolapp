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
	email: {
		type: "text"
		},
	phone_number: {
		type: "map",
		typeDef: "<text, text>"
		},
	school_name: {
		type: "varchar"
		}
	},
	key: ["id", "tenant_id", "school_id"],
	table_name: "school_primary_contact"
}