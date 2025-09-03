module.exports = {
	fields: {
	    user_name: {
			type: "varchar"
		},
		father_name: {
			type: "varchar"
		},
		father_qualification: {
			type: "varchar"
		},
		father_occupation: {
			type: "varchar"
		},
		father_email: {
			type: "varchar"
		},
		father_phone: {
			type: "varchar"
		},
        father_income: {
			type: "text"
		},
		mother_name: {
			type: "varchar"
		},
		mother_qualification: {
			type: "varchar"
		},
		mother_occupation: {
			type: "varchar"
		},
		mother_email: {
			type: "varchar"
		},
		mother_phone: {
			type: "varchar"
		},
        mother_income: {
            type: "text"
        },
		city: {
			type: "varchar"
		},
		pincode: {
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
        present_city: {
            type: "varchar"
        },
        present_pincode: {
            type: "varchar"
        },
        present_state: {
            type: "varchar"
        },
        present_street_address1: {
            type: "varchar"
        },
        present_street_address2: {
            type: "varchar"
        },
		country: {
			type: "varchar"
		},
		additional_contact1_name: {
			type: "varchar"
		},
		additional_contact1_relation: {
			type: "varchar"
		},
		additional_contact1_address: {
			type: "varchar"
		},
		additional_contact1_phone: {
			type: "varchar"
		},
		additional_contact2_name: {
			type: "varchar"
		},
		additional_contact2_relation: {
			type: "varchar"
		},
		additional_contact2_address: {
			type: "varchar"
		},
		additional_contact2_phone: {
			type: "varchar"
		},
		phone: {
			type: "map",
			typeDef: "<text, text>"
		}
	},
	key: ["user_name"],
	table_name: "user_contact_info"
};
