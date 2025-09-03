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
		}
	},
	key: ["id"],
	table_name: "course_type"
}