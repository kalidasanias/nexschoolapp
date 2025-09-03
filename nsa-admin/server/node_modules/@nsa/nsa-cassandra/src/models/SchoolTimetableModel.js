/**
 * Created by senthil on 3/29/2017.
 */
module.exports = {
    fields: {
        timetable_id: {
            type: "uuid"
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
        timetable_name: {
            type: "text"
        },
        class_id: {
            type: "uuid"
        },
        section_id: {
            type: "uuid"
        },
        period_id: {
            type: "int"
        },
        day_id: {
            type: "int"
        },
        emp_id: {
            type: "text"
        },
        subject_id: {
            type: "uuid"
        },
        sub_emp_association: {
            type: "map",
            typeDef: "<uuid, text>"
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
        created_by: {
            type : "text"
        },
        created_date : {
            type : "timestamp"
        },
        created_firstname: {
            type: "text"
        }
    },
    key: ["timetable_id", "class_id", "section_id", "tenant_id", "school_id", "academic_year"],
    table_name: "school_timetable"
}