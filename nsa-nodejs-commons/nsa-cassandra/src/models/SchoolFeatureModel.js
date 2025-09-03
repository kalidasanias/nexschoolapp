module.exports = {
	fields: {
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
		id: {
            type: "uuid"
		},
        academic_year: {
            type: "text"
        },
		feature_id: {
			type: "uuid"
		},
        feature_name: {
            type: "varchar"
        },
        parent_feature_id: {
            type: "uuid"
		},
		activated_date: {
			type: "timestamp"
		},
        expire_date: {
            type: "timestamp"
        },
		description: {
			type: "varchar"
		},
		icon: {
			type: "varchar"
		},
		school_name: {
			type: "varchar"
		},
        mobile_priority: {
            type: "int"
        },
		sms: {
        	type: "boolean"
		},
        email: {
            type: "boolean"
        },
        push: {
            type: "boolean"
        },
        notify_hostelers: {
            type: "boolean"
        },
        is_channels:{
          type:"boolean"
        },
        is_override:{
            type:"boolean"
        },
        help_text:{
          type:"varchar"
        },
        order_by: {
            type: "int"
		},
		title: {
            type: "varchar"
		},
        doc_desc: {
            type: "varchar"
		},
        content: {
            type: "varchar"
		},
        link: {
            type: "varchar"
		},
        asset_url: {
            type: "varchar"
		},
        keywords: {
			type: "list",
			typeDef: "<text>"
		},
        user_types: {
            type: "list",
            typeDef: "<text>"
        },
        tags: {
            type: "list",
            typeDef: "<text>"
		},
        additional_links: {
            type: "map",
            typeDef: "<text, text>"
		},
        images: {
            type: "varchar"
		},
		status: {
			type: "boolean"
		}
	},
    key: [["tenant_id", "school_id", "academic_year"], "id"],
    indexes: ["parent_feature_id", "user_types", "status", "expire_date"],
	table_name: "school_feature"
};