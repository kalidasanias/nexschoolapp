/**
 * Created by senthil on 3/29/2017.
 */

module.exports = {
    fields: {
        school_period_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        class_id: {
            type: "uuid"
        },
        academic_year : {
            type: "text"
        },
        period_id: {
            type: "int"
        },
        period_name: {
            type: "text"
        },
        period_start_time: {
            type: "time"
        },
        period_end_time: {
            type: "time"
        },
        is_break: {
            type: "boolean"
        }
    },
    key: ["school_period_id", "tenant_id", "school_id", "academic_year", "class_id"],
    table_name: "school_periods"
}