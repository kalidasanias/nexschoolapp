/**
 * Created by Kiranmai A on 1/24/2017.
 */

module.exports = {
    fields: {
        class_id: {
            type: "uuid"
        },
        class_name: {
            type: "text"
        },
        class_code: {
            type: "text"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year: {
            type: "text"
        },
        course:{
            type:"text"
        },
        updated_by:{
            type:"text"
        },
        updated_username:{
            type:"text"
        },
        updated_date:{
            type : "timestamp"
        },
        created_by: {
            type : "varchar"
        },
        created_date : {
            type : "timestamp"
        },
        created_firstname: {
            type: "varchar"
        },
        status:{
            type:"boolean"
        },
        order_by:{
            type: "int"
        }
    },
    key: [["tenant_id", "school_id", "academic_year"], "class_id"],
    table_name: "school_class_details"
};