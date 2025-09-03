/**
 * Created by Kiranmai A on 3/3/2017.
 */


module.exports = {
    fields: {
        user_name: {
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
        user_code: {
            type: "text"
        },
        short_name: {
            type: "text"
        },
        first_name: {
            type: "text"
        },
        dept_id: {
            type: "list",
            typeDef: "<uuid>"
        },
        taxanomy_departments: {
            type: "list",
            typeDef: "<text>"
        },
        desg_id: {
            type: "uuid"
        },
        subjects: {
            type: "list",
            typeDef: "<uuid>"
        },
        class_associations: {
            type: "map",
            typeDef: "<uuid, uuid>"
        },
        selected_categories: {
            type: "text"
        },
        reporting_manager: {
            type: "boolean"
        },
        class_teacher: {
            type: "boolean"
        }
    },
    key: [["tenant_id", "school_id"], "user_name"],
    indexes: ["dept_id", "reporting_manager", "class_teacher"],
    table_name: "employee_classification"
}