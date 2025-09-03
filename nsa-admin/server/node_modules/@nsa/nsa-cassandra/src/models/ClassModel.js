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
	code: {
		type: "varchar"
		}
	},
	key: ["id"],
	table_name: "class"
}