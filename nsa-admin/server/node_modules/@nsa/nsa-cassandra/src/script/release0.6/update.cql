use nsa;

alter table nsa.school_details add logo text;

DROP TABLE IF EXISTS nsa.school_written_exam_type;
CREATE TABLE nsa.school_written_exam_type (
tenant_id timeuuid,
school_id uuid,
academic_year text,
written_exam_id uuid,
written_exam_name text,
written_exam_code text,
written_desription text,
updated_date timestamp,
updated_by text,
updated_username text,
status boolean,
created_date timestamp,
created_by text,
created_firstname text,
PRIMARY KEY (written_exam_id, tenant_id, school_id, academic_year)
);

DROP TABLE IF EXISTS nsa.school_exam_schedule;
DROP TYPE IF EXISTS nsa.school_subject_schedule;
CREATE TYPE nsa.school_subject_schedule (
subject_id uuid,
subject_name text,
mark int,
exam_start_time timestamp,
exam_end_time timestamp,
);

CREATE TABLE nsa.school_exam_schedule (
exam_schedule_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
written_exam_id uuid,
written_exam_name text,
class_id uuid,
class_name text,
sections map<text, text>,
schedule set<frozen<school_subject_schedule>>,
total_marks int,
media_name set<text>,
updated_by text,
updated_date timestamp,
updated_username text,
created_date timestamp,
created_by text,
created_firstname text,
status boolean,
PRIMARY KEY (exam_schedule_id, tenant_id, school_id, academic_year)
);

ALTER TABLE nsa.school_media_usage_log ADD sms_response text;
ALTER TABLE nsa.school_notifications ADD feature_id uuid;
ALTER TABLE nsa.school_notifications ADD object_id uuid;
ALTER TABLE nsa.school_notifications ADD sms_raw_response text;