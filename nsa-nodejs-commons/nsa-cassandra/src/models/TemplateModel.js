module.exports = {
	fields: {
		id: {
			type: "uuid"
		},
		message: {
			type: "varchar"
		},
		title: {
			type: "varchar"
		}
	},
	key: ["id"],
	table_name: "template"
}