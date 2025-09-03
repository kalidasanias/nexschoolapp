module.exports = {
	fields: {
	    user_name: {
			type: "bigint"
		},
		city: {
			type: "varchar"
		},
		pincode: {
			type: "varchar"
		},
		father_email: {
			type: "varchar"
		},
		mother_email: {
			type: "varchar"
		},
		state: {
			type: "varchar"
		},
		street_address1: {
			type: "varchar"
		},
		street_address2: {
			type: "varchar"
		},
		country: {
			type: "varchar"
		},
		phone: {
			type: "map",
			typeDef: "<text, text>"
		}
	},
	key: [["user_name"]],
	table_name: "user_details"
}