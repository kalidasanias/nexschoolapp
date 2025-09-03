/**
 * Created by bharatkumarr A on 7/01/2017.
 */

module.exports = {
    fields: {
        academic_year : {
            type: "varchar"
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
        status: {
            type: "boolean"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
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
    key: [["written_exam_id", "tenant_id", "school_id"], "academic_year"],
    table_name: "school_written_exam_type"
};