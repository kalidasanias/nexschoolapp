//release 1.0

DROP TABLE IF EXISTS nsa.school_grading_system;
CREATE TABLE nsa.school_grading_system (
id uuid,
grade_id uuid,
tenant_id timeuuid,
school_id uuid,
description text,
grade_name text,
start_range float,
end_range float,
cgpa_value float,
color text,
PRIMARY KEY (id, tenant_id, school_id)
);
CREATE INDEX on nsa.school_grading_system(grade_id);

ALTER TYPE nsa.user_subject_mark_details ADD grade_id uuid;
ALTER TYPE nsa.user_subject_mark_details ADD grade_name text;
ALTER TYPE nsa.user_subject_mark_details ADD cgpa_value float;

ALTER TABLE nsa.school_mark_list ADD total_max_marks float;

ALTER TABLE nsa.school_mark_list_details ADD total_grade_id uuid;
ALTER TABLE nsa.school_mark_list_details ADD total_grade_name text;
ALTER TABLE nsa.school_mark_list_details ADD total_max_marks float;
ALTER TABLE nsa.school_mark_list_details ADD total_cgpa_value float;


DROP TABLE IF EXISTS nsa.school_voice_notifications;
CREATE TABLE nsa.school_voice_notifications (
notification_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
audio_id int,
campaign_name text,
retry_condition list<text>,
retry_times int,
retry_interval int,
notified_mobile_numbers list<text>,
notified_categories text,
count int,
schedule_date timestamp,
notification_type text,
priority int,
status text,
object_id uuid,
feature_id uuid,
updated_date timestamp,
updated_by text,
updated_username text,
created_by text,
created_date timestamp,
created_firstname text,
PRIMARY KEY (notification_id, tenant_id, school_id, academic_year))
;

DROP TABLE IF EXISTS nsa.school_audios;
CREATE TABLE IF NOT EXISTS nsa.school_audios (
   id uuid,
   tenant_id timeuuid,
   school_id uuid,
   academic_year text,
   audio_id text,
   name text,
   status text,
   download_link text,
   updated_date timestamp,
   updated_by text,
   updated_username text,
   created_by text,
   created_date timestamp,
   created_firstname text,
   PRIMARY KEY (id, tenant_id, school_id, academic_year)
);