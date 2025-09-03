/**
 * Created by bharatkumarr on 30/08/17.
 */

module.exports = {
    fields: {
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year: {
            type:  "varchar"
        },
        id: {
            type: "uuid"
        },
        audio_id: {
            type: "varchar"
        },
        name: {
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
        },
        status: {
            type: "varchar"
        },
        is_mobile_recording: {
            type: 'boolean'
        },
        download_link: {
            type: "varchar"
        }
    },
    key: ["id", "tenant_id", "school_id", "academic_year"],
    table_name: "school_audios"
}