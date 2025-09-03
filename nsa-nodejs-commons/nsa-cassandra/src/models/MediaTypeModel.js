module.exports = {
	fields: {
	media_id: {
		type: "int"
		},
	is_channel: {
		type: "boolean"
		},
	limit_value: {
		type: "int"
		},
	media_name: {
		type: "varchar"
		}
	},
	key: ["media_id"],
	table_name: "media_type"
}