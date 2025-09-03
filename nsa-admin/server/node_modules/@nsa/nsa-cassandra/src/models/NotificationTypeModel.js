module.exports = {
	fields: {
	id: {
		type: "uuid"
		},
	description: {
		type: "varchar"
		},
	type: {
		type: "varchar"
		}
	},
	key: ["id"],
	table_name: "notification_type"
}