module.exports = {
    fields: {
        id: {
            type: "uuid"
        },
        course_id: {
            type: "uuid"
        },
        course_code:{
            type:"varchar"
        },
        course_name: {
            type: "varchar"
        },
        class:{
            type:"map",
            typeDef: "<uuid, text>"
        }
    },
    key: ["id"],
    table_name: "course_departments"
};
