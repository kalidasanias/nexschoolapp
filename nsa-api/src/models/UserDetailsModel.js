module.exports = {
	fields: {
		user_name: {
			type: "varchar"
		},
		blood_group: {
			type: "varchar"
		},
		first_name: {
			type: "varchar"
		},
		last_name: {
			type: "varchar"
		},
		middle_name: {
			type: "varchar"
		},
		gender: {
			type: "varchar"
		},
		date_of_birth: {
			type: "timestamp"
		},
		nationality: {
			type: "varchar"
		},
		profile_picture: {
			type: "varchar"
		},
		title: {
			type: "varchar"
		}
	},
	key: ["user_name"],
	table_name: "user_details"
};