module.exports = {
	fields: {
	media_package_id: {
			type: "uuid"
			},
	media_id: {
			type: "int"
		},
	media_name:{
		type: "varchar"
		},
	package_size: {
		type: "bigint"
			},
	price: {
		type: "decimal",
		}
	},
	key: [["media_package_id"],"media_id"],
	table_name: "media_package"
}


		