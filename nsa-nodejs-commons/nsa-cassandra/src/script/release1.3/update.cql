ALTER TABLE nsa.school_members_xref ADD father_name text;
ALTER TABLE nsa.school_members_xref ADD updated_date timestamp;
ALTER TABLE nsa.school_members_xref ADD updated_by text;
ALTER TABLE nsa.school_members_xref ADD updated_first_name text;
ALTER TABLE nsa.school_members_xref ADD created_date timestamp;
ALTER TABLE nsa.school_members_xref ADD created_by text;

alter table school_mark_list add uploaded_marklist text;

alter table nsa.school_details add image_url map<text, text>;

alter table nsa.school_media_usage_log add attachments map<text, text>;

alter table nsa.school_notifications add attachments map<text, text>;
alter table nsa.school_notifications add media_status text;

ALTER TABLE nsa.school_members ADD tenant_id timeuuid;