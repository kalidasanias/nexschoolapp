/**
 * Created by Kiranmai A on 3/13/2017.
 */


module.exports = {
    fields: {
        attendance_detail_id: {
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
        attendance_id: {
            type: "uuid"
        },
        media_name: {
            type: "list",
            typeDef: "<varchar>"
        },
        user_name: {
            type: "varchar"
        },
        admission_no:{
            type: "varchar"
        },
        first_name: {
            type: "varchar"
        },
        class_id: {
            type: "uuid"
        },
        class_name: {
            type: "varchar"
        },
        section_id: {
            type: "uuid"
        },
        section_name: {
            type: "varchar"
        },
        is_present: {
            type: "boolean"
        },
        is_hostel: {
            type: "boolean"
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
        },
        remarks: {
            type: "varchar"
        }
    },
    key: ["attendance_detail_id", "tenant_id", "school_id", "academic_year"],
    indexes: ["attendance_id", "user_name", "class_id", "section_id", "is_present", "attendance_date"],
    table_name: "school_attendance_details"
};