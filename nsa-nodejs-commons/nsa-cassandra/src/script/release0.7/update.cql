//For Marks List Feature

CREATE INDEX ON nsa.school_exam_schedule(written_exam_id);

DROP TABLE IF EXISTS nsa.school_mark_list;
CREATE TABLE nsa.school_mark_list(
mark_list_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
exam_schedule_id uuid,
written_exam_id uuid,
written_exam_name text,
class_id uuid,
class_name text,
section_id uuid,
section_name text,
subjects map<uuid, text>,
media_name set<text>,
updated_by text,
updated_firstname text,
updated_date timestamp,
created_by text,
created_firstname text,
created_date timestamp,
status boolean,
PRIMARY KEY(mark_list_id, tenant_id, school_id, academic_year));
CREATE INDEX ON nsa.school_mark_list(exam_schedule_id);

DROP TABLE IF EXISTS nsa.school_mark_list_details;
DROP TYPE IF EXISTS nsa.user_subject_mark_details;
CREATE TYPE nsa.user_subject_mark_details(
subject_id uuid,
subject_name text,
marks_obtained text,
max_marks int,
);

CREATE TABLE nsa.school_mark_list_details (
mark_list_detail_id uuid,
mark_list_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
exam_schedule_id uuid,
written_exam_id uuid,
written_exam_name text,
class_id uuid,
class_name text,
section_id uuid,
section_name text,
user_name text,
user_code text,
first_name text,
primary_phone text,
subject_mark_details set<frozen<user_subject_mark_details>>,
total_marks float,
examination_date timestamp,
media_name set<text>,
updated_by text,
updated_firstname text,
updated_date timestamp,
created_by text,
created_firstname text,
created_date timestamp,
status boolean,
remarks text,
PRIMARY KEY(mark_list_detail_id, tenant_id, school_id, academic_year));
CREATE INDEX ON nsa.school_mark_list_details(mark_list_id);
CREATE INDEX ON nsa.school_mark_list_details(class_id);
CREATE INDEX ON nsa.school_mark_list_details(section_id);
CREATE INDEX ON nsa.school_mark_list_details(exam_schedule_id);

ALTER TABLE nsa.school_details ADD (about_us text, contact_us text, latitude double, longitude double);