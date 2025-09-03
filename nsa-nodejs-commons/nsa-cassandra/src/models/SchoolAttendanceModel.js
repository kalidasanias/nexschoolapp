/**
 * Created by Kiranmai A on 3/13/2017.
 */


module.exports = {
    fields: {
        attendance_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year : {
            type:  "varchar"
        },
        media_name: {
            type: "list",
            typeDef: "<varchar>"
        },
        class_name: {
            type: "varchar"
        },
        class_id: {
            type: "uuid"
        },
        section_id: {
            type: "uuid"
        },
        section_name: {
            type: "varchar"
        },
        total_strength: {
            type : "int"
        },
        no_of_present: {
            type: "int"
        },
        no_of_absent:{
            type: "int"
        },
        present_percent: {
            type: "int"
        },
        attendance_date: {
            type: "timestamp"
        },
        recorded_date: {
            type: "timestamp"
        },
        recorded_by: {
            type: "varchar"
        },
        recorded_username: {
            type: "varchar"
        },
        updated_by: {
            type : "varchar"
        },
        updated_date : {
            type : "timestamp"
        },
        updated_username: {
            type: "varchar"
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
    key: ["attendance_id", "tenant_id", "school_id", "academic_year"],
    table_name: "school_attendance"
};