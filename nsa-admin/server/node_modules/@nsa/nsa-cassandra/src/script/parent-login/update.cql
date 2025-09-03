DROP TABLE IF EXISTS nsa.school_members;
CREATE TABLE nsa.school_members (
id uuid,
user_name text,
first_name text,
user_type text,
created_date timestamp,
updated_date timestamp,
password text,
PRIMARY KEY(id));


DROP TABLE IF EXISTS nsa.school_members_xref;
CREATE TABLE nsa.school_members_xref (
id uuid,
member_id uuid,
member_user_name text,
user_name text,
user_id uuid,
first_name text,
tenant_id timeuuid,
school_id uuid,
school_name text,
PRIMARY KEY(member_id, member_user_name, user_id));

ALTER TABLE nsa.school_notifications ADD user_types list<text>;