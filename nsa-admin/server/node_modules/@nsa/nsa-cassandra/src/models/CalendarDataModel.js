/**
 * Created by Kiranmai A on 3/30/2017.
 */

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
        academic_year: {
            type: "varchar"
        },
        user_name: {
            type: "varchar"
        },
        class_id: {
            type: "uuid"
        },
        section_id: {
            type: "uuid"
        },
        day_id:{
            type: "int"
        },
        day_date:{
            type: "date"
        },
        week_no:{
            type: "int"
        },
        month_no: {
            type: "int"
        },
        year_no: {
            type: "int"
        },
        period_id: {
            type: "int"
        },
        attachments: {
            type: "frozen",
            typeDef: "<attachment_type>"
        },
        events: {
            type: "frozen",
            typeDef: "<events_type>"
        },
        exam_details: {
            type: "map",
            typeDef: "<uuid,<exams_type>"
        },
        created_date:{
            type: "timestamp"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_by: {
            type: "varchar"
        },
        updated_username:{
            type: "varchar"
        }
    },
    key: ["id", "created_date"],
    table_name: "calendar_data"
};