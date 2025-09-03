module.exports = {
	fields: {
	id: {
		type: "uuid"
		},
	description: {
		type: "varchar"
		},
	name: {
		type: "varchar"
		},
	status: {
		type: "boolean"
		}
	},
	key: ["id"],
	table_name: "feature"
}