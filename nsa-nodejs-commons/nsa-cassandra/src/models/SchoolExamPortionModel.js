/**
 * Created by bharatkumarr on 25/07/17.
 */

module.exports = {
    fields: {
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        id: {
            type: "uuid"
        },
        exam_schedule_id: {
            type: "uuid"
        },
        portion_details: {
            type: "varchar"
        },
        attachments: {
            type: "frozen",
            typeDef: "<attachment_type>"
        },
        media_name:{
            type: "set",
            typeDef: "<text>"
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
    key: [["id"], "exam_schedule_id"],
    indexes: ["id"],
    table_name: "school_exam_portions"
};
