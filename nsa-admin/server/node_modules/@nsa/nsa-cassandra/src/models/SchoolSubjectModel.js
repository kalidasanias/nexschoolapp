/**
 * Created by Kiranmai A on 3/3/2017.
 */


module.exports = {
    fields: {
        subject_id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        dept_id: {
            type: "uuid"
        },
        academic_year: {
            type: "text"
        },
        sub_name: {
            type: "text"
        },
        sub_desc: {
            type: "text"
        },
        sub_code: {
            type: "text"
        },
        sub_colour: {
            type: "text"
        },
        sub_aspects: {
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
        default_value: {
            type: "boolean"
        },
        status: {
            type: "boolean"
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
    key: [["tenant_id", "school_id", "academic_year"], "subject_id"],
    table_name: "school_subjects"
};