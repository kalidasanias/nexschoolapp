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
	email: {
		type: "varchar" 
		},
	name: {
		type: "varchar"
		},
	phone_number: {
		type: "varchar" 
		},
	school_name: {
		type: "varchar"
		}
	},
	key: ["id", "tenant_id", "school_id"],
	table_name: "school_technical_contact"
}