module.exports = {
	fields: {
		id: {
			type: "uuid"
			},
		tenant_id: {
			type: "timeuuid"
			},
		school_id: {
			type: "uuid"
			},
		ac_year: {
			type: "varchar"
			},
		end_date: {
			type: "timestamp"
		},
		start_date: {
			type: "timestamp"
		},
        created_date: {
            type: "timestamp"
        },
		terms: {
			type: "map",
			typeDef: "<uuid, varchar>"
		},
		is_current_year : {
			type: "boolean"
		}
	},
	key: ["id", "created_date"],
	indexes: ["ac_year"],
	table_name: "academic_year"
};