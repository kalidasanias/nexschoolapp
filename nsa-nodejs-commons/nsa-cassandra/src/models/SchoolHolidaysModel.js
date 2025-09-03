module.exports = {
    fields: {
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year: {
            type: "text"
        },
        holiday_id: {
            type: "uuid"
        },
        holiday_type_id: {
            type: "uuid"
        },
        holiday_type: {
            type: "text"
        },
        holiday_name: {
            type: "text"
        },
        start_date:{
            type:"timestamp"
        },
        end_date:{
            type:"timestamp"
        },
        updated_by: {
            type: "text"
        },
        updated_username: {
            type: "text"
        },
        updated_date: {
            type: "timestamp"
        },
        created_by: {
            type: "text"
        },
        created_firstname: {
            type: "text"
        },
        created_date: {
            type: "timestamp"
        }
    },
    key: [["tenant_id" , "school_id", "academic_year"],"holiday_id"],
    table_name: "school_holidays"
};