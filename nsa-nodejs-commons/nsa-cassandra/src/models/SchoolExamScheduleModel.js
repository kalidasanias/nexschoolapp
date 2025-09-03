/**
 * Created by bharatkumarr A on 7/01/2017.
 */

module.exports = {
    fields: {
        exam_schedule_id: {
            type: "uuid"
        },
        written_exam_id: {
            type: "uuid"
        },
        written_exam_name: {
            type: "varchar"
        },
        written_exam_code: {
            type: "varchar"
        },
        written_desription: {
            type: "varchar"
        },
        class_id : {
            type: "uuid"
        },
        class_name: {
            type: "varchar"
        },
        sections: {
            type: "map",
            typeDef: "<text, text>"
        },
        schedule:{
            type: "frozen",
            typeDef: "<set <school_subject_schedule>>"
        },
        total_marks:{
            type: "int"
        },
        media_name:{
            type: "set",
            typeDef: "<text>"
        },
        count:{
            type:"int"
         },
        status: {
            type: "boolean"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year : {
            type: "varchar"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_by: {
            type: "varchar"
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
    key: [["exam_schedule_id", "tenant_id", "school_id"], "academic_year"],
    indexes: ["written_exam_id"],
    table_name: "school_exam_schedule"
};
