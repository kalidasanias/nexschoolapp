module.exports = {
	fields: {
		role_id: {
			type: "int"
		},
		tenant_id: {
			type: "timeuuid"
		},
		school_id: {
			type: "uuid"
		},
		academic_year: {
			type: "varchar"
		},
		user_id:{
			type: "text"
		},
		role_name: {
			type: "varchar"
		},
		primary_phone: {
			type: "varchar"
		}
	},
	key: [["role_id"], "tenant_id", "school_id", "user_id", "primary_phone"],
	custom_indexes: [
		{
			on: 'primary_phone',
			using: 'org.apache.cassandra.index.sasi.SASIIndex',
			options: {
				'analyzed' : 'true',
				'analyzer_class' : 'org.apache.cassandra.index.sasi.analyzer.NonTokenizingAnalyzer',
				'case_sensitive' : 'false',
				'mode' : 'CONTAINS'
			}
		}
	],
	table_name: "users_by_role"
}