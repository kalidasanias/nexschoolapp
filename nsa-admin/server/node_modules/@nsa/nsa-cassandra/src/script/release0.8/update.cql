
ALTER TABLE nsa.calendar_data DROP exams;
ALTER TABLE nsa.calendar_data ADD exam_details map<uuid,frozen<exams_type>>;

//existing alter the type
ALTER TYPE exams_type RENAME exams_name TO written_exam_name;
ALTER TYPE exams_type ADD exam_schedule_id uuid;
ALTER TYPE exams_type RENAME subject_name TO class_name;
ALTER TYPE exams_type ADD sections text;
ALTER TYPE exams_type ADD subject_details text;

DROP TABLE IF EXISTS nsa.school_exam_portions;
CREATE TABLE nsa.school_exam_portions (
id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
exam_schedule_id uuid,
attachments frozen<attachment_type>,
portion_details text,
media_name set<text>,
created_date timestamp,
created_by text,
created_firstname text,
updated_date timestamp,
updated_by text,
updated_username text,
PRIMARY KEY(id, exam_schedule_id));

DROP TABLE IF EXISTS nsa.school_feedback_details;
CREATE TABLE nsa.school_feedback_details (
feedback_id uuid,
tenant_id timeuuid,
school_id uuid,
feedback_desc text,
updated_date timestamp,
updated_by text,
updated_username text,
class_id uuid,
class_name text,
first_name text,
section_id uuid,
section_name text,
PRIMARY KEY (feedback_id, tenant_id, school_id)
);

DROP TABLE IF EXISTS nsa.album;
CREATE TABLE nsa.album (
  tenant_id timeuuid,
  school_id uuid,
  academic_year text,
  album_id uuid,
  category list<text>,
  category_objs text,
  name varchar,
  description varchar,
  preview_thumbnails map<text,text>,
  viewed_count int,
  viewed_by set<text>,
  no_of_files_contains int,
  shared_to set<text>,
  created_by text,
  created_date timestamp,
  updated_by text,
  updated_date timestamp,
  PRIMARY KEY (album_id, tenant_id, school_id, academic_year)
) WITH CLUSTERING ORDER BY (tenant_id ASC, school_id ASC, academic_year ASC);

CREATE INDEX category_idx ON nsa.album(category);

DROP TABLE IF EXISTS nsa.album_content_details;
CREATE TABLE nsa.album_content_details (
   content_id uuid,
   tenant_id timeuuid,
   school_id uuid,
   academic_year text,
   album_id uuid,
   file_type text,
   file_url text,
   file_name text,
   mimetype text,
   metadata frozen<album_content_metadata>,
   tags set<varchar>,
   created_by text,
   created_date timestamp,
   shared_to set<text>,
   PRIMARY KEY (content_id, tenant_id, school_id, academic_year)
);

ALTER TABLE nsa.school_exam_schedule ADD count int;



