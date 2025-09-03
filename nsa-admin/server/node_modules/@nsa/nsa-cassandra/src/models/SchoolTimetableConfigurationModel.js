/**
 * Created by senthil on 3/29/2017.
 */

module.exports = {
    fields: {
        timetable_config_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        applicable_class: {
            type: "uuid"
        },
        working_days: {
            type: "set",
            typeDef: "<int>"
        },
        school_hours: {
            type: "map",
            typeDef: "<text, time>"
        },
        school_periods: {
            type: "set",
            typeDef: "<uuid>"
        },
        school_breaks: {
            type: "set",
            typeDef: "<uuid>"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_by: {
            type: "text"
        },
        updated_username: {
            type: "text"
        },
        academic_year: {
            type : "text"
        },
        created_by: {
            type : "varchar"
        },
        created_date : {
            type : "timestamp"
        },
        created_firstname: {
            type: "varchar"
        }
    },
    key: ["timetable_config_id", "tenant_id", "school_id", "academic_year"],
    table_name: "school_timetable_configuration"
}