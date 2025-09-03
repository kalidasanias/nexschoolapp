use nsa;

alter table school_feature add notify_hostelers boolean;

alter table school_attendance_details add is_hostel boolean;


DROP TABLE IF EXISTS nsa.album;
CREATE TABLE nsa.album (
  tenant_id timeuuid,
  school_id uuid,
  academic_year text,
  album_id uuid,
  category list<text>,
  name varchar,
  description varchar,
  preview_thumbnails map<text,text>,
  viewed_by int,
  no_of_files_contains int,
  shared_to set<text>,
  created_by text,
  created_date timestamp,
  updated_by text,
  updated_date timestamp,
  PRIMARY KEY (album_id, tenant_id, school_id, academic_year, created_date)
) WITH CLUSTERING ORDER BY (tenant_id ASC, school_id ASC, academic_year ASC, created_date DESC);

CREATE INDEX category_idx ON nsa.album(category);

DROP TABLE IF EXISTS nsa.album_content_details;

DROP TYPE IF EXISTS nsa.album_content_metadata;
CREATE TYPE nsa.album_content_metadata (
   height int,
   width int,
   file_size float
);


CREATE TABLE nsa.album_content_details (
   content_id uuid,
   album_id uuid,
   file_type text,
   file_url varchar,
   metadata frozen<album_content_metadata>,
   tags set<varchar>,
   created_by text,
   created_date timestamp,
   shared_to set<text>,
   PRIMARY KEY (content_id, created_date)
) WITH CLUSTERING ORDER BY (created_date DESC);


DROP TABLE IF EXISTS nsa.album_latest_contents;
CREATE TABLE nsa.album_latest_contents (
   date text,
   tenant_id timeuuid,
   school_id uuid,
   academic_year text,
   created_by text,
   created_date timestamp,
   content_id uuid,
   name text,
   file_type text,
   file_url text,
   shared_to set<text>,
   PRIMARY KEY (date, created_date, content_id)
) WITH CLUSTERING ORDER BY (created_date DESC, content_id ASC);

// Index for tag keywords
DROP TABLE IF EXISTS nsa.album_contents_by_tag;
CREATE TABLE nsa.album_contents_by_tag (
   tag text,
   content_id uuid,
   tenant_id timeuuid,
   school_id uuid,
   academic_year text,
   created_by text,
   created_date timestamp,
   name text,
   file_type text,
   file_url text,  
   tagged_date timestamp,
   shared_to set<text>,
   PRIMARY KEY (tag, content_id)
);

alter table nsa.school_events add activity_type_id uuid;
alter table nsa.school_events add activity_type_name text;
alter table nsa.school_events_details add activity_type_id uuid;
alter table nsa.school_events_details add activity_type_name text;

DROP TABLE IF EXISTS nsa.school_activity_type;
CREATE TABLE nsa.school_activity_type (
activity_type_id uuid,
activity_type_name text,
description text,
tenant_id timeuuid,
school_id uuid,
updated_date timestamp,
updated_by text,
updated_username text,
created_date timestamp,
created_by text,
created_firstname text,
PRIMARY KEY((tenant_id, school_id), activity_type_id)
);

