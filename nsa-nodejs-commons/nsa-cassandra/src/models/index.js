/**
 *  created by kiranmai on 27/12/2016
 **/
var models = require('express-cassandra');

//Tell express-cassandra to use the models-directory, and
//use bind() to load the models using cassandra configurations.
models.setDirectory( __dirname ).bind(
    {
        clientOptions: {
            contactPoints:  global.config.cassandra.contactPoints,
            protocolOptions: global.config.cassandra.protocolOptions,
            keyspace: global.config.cassandra.keyspace,
            queryOptions: global.config.cassandra.queryOptions,
            authProvider: new models.driver.auth.DsePlainTextAuthProvider(global.config.cassandra.username, global.config.cassandra.password)
        },
        ormOptions: {
            udts: {
                class_association: {
                    section_id: 'uuid',
                    subject_id: 'list<uuid>'
                },
                attachment_type: {
                    attachment: 'map<text, text>',
                    description: 'text',
                    updated_by: 'text',
                    updated_username: 'text'
                },
                events_type: {
                    event_id: 'uuid',
                    event_name: 'text',
                    start_date: 'date',
                    end_date: 'date',
                    start_time: 'time',
                    end_time: 'time',
                    updated_by: 'text',
                    updated_username: 'text'
                },
                school_subject_schedule: {
                    subject_id: "uuid",
                    subject_name: "text",
                    mark: "int",
                    exam_start_time: "timestamp",
                    exam_end_time: "timestamp"
                },
                exams_type: {
                    written_exam_name: 'text',
                    class_name: 'text',
                    exam_schedule_id: 'uuid',
                    sections: 'text',
                    subject_details: 'text'
                },
                album_content_metadata: {
                    height: 'int',
                    width: 'int',
                    file_size: 'float'
                },
                user_subject_mark_details: {
                    subject_id: 'uuid',
                    subject_name: 'text',
                    marks_obtained: 'text',
                    max_marks: 'int',
                    grade_id: 'uuid',
                    grade_name: 'text',
                    cgpa_value: 'float'
                }
            }
        }
    },
    function(err) {
        if(err) console.log(err);
        else console.log(models.uuid());
    }

);

module.exports = models;