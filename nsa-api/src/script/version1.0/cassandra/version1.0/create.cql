DROP KEYSPACE IF EXISTS nsa; 
CREATE KEYSPACE nsa WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3'} AND durable_writes = true;

DROP TABLE IF EXISTS nsa.role_type;
CREATE TABLE nsa.role_type (
id uuid PRIMARY KEY,
name text
);

DROP TABLE IF EXISTS nsa.academic_year;
CREATE TABLE nsa.academic_year (
    id uuid PRIMARY KEY,
    tenant_id timeuuid,
    school_id uuid,
    ac_year text,
    end_date timestamp,
    start_date timestamp,
    terms map<uuid, text>
);
CREATE INDEX academic_year_indx ON nsa.academic_year (ac_year);

DROP TABLE IF EXISTS nsa.school_terms;
CREATE TABLE nsa.school_terms (
    id uuid PRIMARY KEY,
    tenant_id timeuuid,
    school_id uuid,
    ac_year text,
    term text,
    end_date timestamp,
    start_date timestamp
);
CREATE INDEX school_terms_indx ON nsa.school_terms (term);

DROP TABLE IF EXISTS nsa.syllabus_type;
CREATE TABLE nsa.syllabus_type (
id uuid PRIMARY KEY,
description text,
name text
);

DROP TABLE IF EXISTS nsa.course_type;
CREATE TABLE nsa.course_type (
id uuid PRIMARY KEY,
description text,
name text
);

DROP TABLE IF EXISTS nsa.class;
CREATE TABLE nsa.class (
id uuid PRIMARY KEY,
description text,
name text
);

DROP TABLE IF EXISTS nsa.examination_pattern;
CREATE TABLE nsa.examination_pattern (
id uuid PRIMARY KEY,
description text,
name text
);


DROP TABLE IF EXISTS nsa.grading_system;
CREATE TABLE nsa.grading_system (
id uuid PRIMARY KEY,
description text,
name text
);


DROP TABLE IF EXISTS nsa.feature;
CREATE TABLE nsa.feature (
id uuid PRIMARY KEY,
description text,
name text,
status boolean
);


DROP TABLE IF EXISTS nsa.template;
CREATE TABLE nsa.template (
id uuid PRIMARY KEY,
message text,
title text
);

DROP TABLE IF EXISTS nsa.media_type;
CREATE TABLE nsa.media_type (
media_id int PRIMARY KEY,
is_channel boolean,
limit_value int,
media_name text
);

DROP TABLE IF EXISTS nsa.media_package;
CREATE TABLE nsa.media_package (
media_package_id uuid,
media_id int,
media_name text,
package_size bigint,
price decimal,
PRIMARY KEY (media_package_id, media_id)
);


DROP TABLE IF EXISTS nsa.notification_type;
CREATE TABLE nsa.notification_type (
id uuid PRIMARY KEY,
description text,
type text
);

DROP TABLE IF EXISTS nsa.school_sender_type;
CREATE TABLE nsa.school_sender_type (
sender_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
sender_name text,
media_id int,
media_name text,
PRIMARY KEY (sender_id, tenant_id, school_id)
);

DROP TABLE IF EXISTS nsa.user;
CREATE TABLE nsa.user (
id uuid,
tenant_id timeuuid,
school_id uuid,
user_name text,
device_token map<text, text>,
device_id text,
password text,
school_name text,
user_type text,
name text,
email text,
primary_phone text,
roles map<uuid, text>,
created_date timestamp,
updated_date timestamp,
active boolean,
PRIMARY KEY(id, user_name)
);
CREATE INDEX user_indx ON nsa.user (user_type);

DROP TABLE IF EXISTS nsa.user_details;
CREATE TABLE nsa.user_details (
user_name text,
blood_group text,
first_name text,
last_name text,
middle_name text,
gender text,
date_of_birth timestamp,
nationality text,
profile_picture text,
title text,
PRIMARY KEY (user_name)
);

DROP TABLE IF EXISTS nsa.user_classification;
CREATE TABLE nsa.user_classification (
user_name text,
tenant_id timeuuid,
school_id uuid,
academic_year text,
class_id uuid,
class_name text,
section_id uuid,
section_name text,
language_id uuid,
language_name text,
PRIMARY KEY (user_name, class_id, section_id, language_id)
);

DROP TABLE IF EXISTS nsa.user_contact_info;
CREATE TABLE nsa.user_contact_info (
user_name text PRIMARY KEY,
city text,
pincode text,
father_email text,
mother_email text,
state text,
street_address1 text,
street_address2 text,
country text,
phone map<text, text>
);

DROP TABLE IF EXISTS nsa.school_details;
CREATE TABLE nsa.school_details (
tenant_id timeuuid,
school_id uuid,
created_date timestamp,
school_code bigint,
project_id text,
server_api_key text,
app_key text,
package_name text,
city text,
email text,
fax text,
phone_number map<text, text>,
pincode text,
school_name text,
state text,
street_address_1 text,
street_address_2 text,
total_employee_strength bigint,
total_student_strength bigint,
updated_date timestamp,
website_url text,
PRIMARY KEY ((tenant_id, school_id), created_date))
WITH CLUSTERING ORDER BY (created_date DESC);
CREATE INDEX school_details_indx ON nsa.school_details (school_name);


DROP TABLE IF EXISTS nsa.school_primary_contact;
CREATE TABLE nsa.school_primary_contact (
id uuid,
tenant_id timeuuid,
school_id uuid,
email text,
phone_number map<text, text>,
school_name text,
PRIMARY KEY (id, tenant_id, school_id)
);


DROP TABLE IF EXISTS nsa.school_map;
CREATE TABLE nsa.school_map (
id uuid,
tenant_id timeuuid,
school_id uuid,
latitude float,
longitude float,
school_name text,
PRIMARY KEY (id, tenant_id, school_id)
);


DROP TABLE IF EXISTS nsa.school_syllabus_type;
CREATE TABLE nsa.school_syllabus_type (
id uuid,
type_id uuid,
tenant_id timeuuid,
school_id uuid,
description text,
school_name text,
type_name text,
PRIMARY KEY (id, type_id, tenant_id, school_id)
);

DROP TABLE IF EXISTS nsa.school_course_department;
CREATE TABLE nsa.school_course_department (
id uuid,
tenant_id timeuuid,
school_id uuid,
school_name text,
course_id uuid,
course_name text,
class map<uuid, text>,
description text,
PRIMARY KEY (id, course_id, tenant_id, school_id)
);


DROP TABLE IF EXISTS nsa.school_examination_pattern;
CREATE TABLE nsa.school_examination_pattern (
id uuid,
pattern_id uuid,
tenant_id timeuuid,
school_id uuid,
description text,
pattern_name text,
school_name text,
PRIMARY KEY (id, pattern_id, tenant_id, school_id)
);

DROP TABLE IF EXISTS nsa.school_grading_system;
CREATE TABLE nsa.school_grading_system (
id uuid,
grade_id uuid,
tenant_id timeuuid,
school_id uuid,
description text,
grade_name text,
school_name text,
PRIMARY KEY (id, grade_id, tenant_id, school_id)
);

DROP TABLE IF EXISTS nsa.school_feature;
CREATE TABLE nsa.school_feature (
feature_id uuid,
tenant_id timeuuid,
school_id uuid,
activated_date timestamp,
description text,
expire_date timestamp,
feature_name text,
icon text,
school_name text,
status boolean,
PRIMARY KEY (feature_id, tenant_id, school_id)
);

DROP TABLE IF EXISTS nsa.school_notifications;
CREATE TABLE nsa.school_notifications (
notification_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
media_name list<text>,
sender_id uuid,
sent_id text,
notified_list list<text>,
notified_mobile_numbers list<text>,
notified_categories text,
template_id uuid,
template_title text,
title text,
message text,
count int,
notification_type text,
priority int,
status text,
created_date timestamp,
updated_date timestamp,
PRIMARY KEY ((tenant_id, school_id, academic_year), created_date))
WITH CLUSTERING ORDER BY (created_date DESC);
CREATE INDEX ON nsa.school_notifications (notification_id);

DROP TABLE IF EXISTS nsa.school_media_usage_limit;
CREATE TABLE nsa.school_media_usage_limit (
id uuid,
tenant_id timeuuid,
school_id uuid,
feature_id uuid,
media_id int,
media_name text,
academic_year text,
available_limit int,
school_name text,
used_count int,
PRIMARY KEY (id, tenant_id, school_id, media_id)
);

DROP TABLE IF EXISTS nsa.school_media_topup_log;
CREATE TABLE nsa.school_media_topup_log (
id uuid,
tenant_id timeuuid,
school_id uuid,
school_name text,
academic_year text,
media_id int,
media_name text,
media_package_id uuid,
topup_amount decimal,
topup_count int,
trans_date timestamp,
PRIMARY KEY ((id, tenant_id, school_id, media_id), trans_date)
)WITH CLUSTERING ORDER BY (trans_date DESC);


DROP TABLE IF EXISTS nsa.school_media_usage_log;
CREATE TABLE nsa.school_media_usage_log (
id uuid,
notification_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
sender_id uuid,
sent_by text,
employee_username text,
user_name text,
user_type text,
class_id uuid,
section_id uuid,
primary_phone text,
feature_name text,
group_name text,
media_name list<text>,
message text,
message_title text,
title text,
count int,
notification_type text,
priority int,
status text,
trans_date timestamp,
PRIMARY KEY ((id), trans_date, notification_id, tenant_id, school_id, user_name))
WITH CLUSTERING ORDER BY (trans_date DESC);

DROP TABLE IF EXISTS nsa.school_template;
CREATE TABLE nsa.school_template (
template_id uuid,
tenant_id timeuuid,
school_id uuid,
school_name text,
template_title text,
template_message text,
status text,
created_date timestamp,
updated_date timestamp,
PRIMARY KEY (template_id, tenant_id, school_id)
);


DROP TABLE IF EXISTS nsa.users_by_role;
CREATE TABLE nsa.users_by_role (
role_id int,
tenant_id timeuuid,
school_id uuid,
user_id text,
academic_year text,
primary_phone text,
role_name text,
PRIMARY KEY (role_id, tenant_id, school_id, user_id, primary_phone)
);
CREATE CUSTOM INDEX user_by_role_primary_phone_idx ON nsa.users_by_role (primary_phone) USING 'org.apache.cassandra.index.sasi.SASIIndex' WITH OPTIONS = {'analyzer_class': 'org.apache.cassandra.index.sasi.analyzer.NonTokenizingAnalyzer', 'case_sensitive': 'false', 'mode': 'CONTAINS', 'analyzed': 'true'};


DROP TABLE IF EXISTS nsa.fee_type;
CREATE TABLE nsa.fee_type (
fee_type_id uuid,
fee_type_name text,
fee_desc text,
deposit boolean,
created_date timestamp,
default boolean,
status boolean,
PRIMARY KEY (fee_type_id, created_date)
);

DROP TABLE IF EXISTS nsa.school_fee_type;
CREATE TABLE nsa.school_fee_type (
fee_type_id uuid,
tenant_id timeuuid,
school_id uuid,
fee_type_name text,
fee_desc text,
deposit boolean,
created_date timestamp,
updated_date timestamp,
created_by text,
default boolean,
status boolean,
PRIMARY KEY (fee_type_id, created_date, tenant_id, school_id))
WITH CLUSTERING ORDER BY (created_date DESC);

DROP TABLE IF EXISTS nsa.school_scholarship_type;
CREATE TABLE nsa.school_scholarship_type (
scholarship_id uuid,
tenant_id timeuuid,
school_id uuid,
scholarship_name text,
scholarship_desc text,
amount float,
attachment blob,
valid_upto timestamp,
created_date timestamp,
updated_date timestamp,
created_by text,
status boolean,
PRIMARY KEY (scholarship_id, created_date, tenant_id, school_id))
WITH CLUSTERING ORDER BY (created_date DESC);

DROP TABLE IF EXISTS nsa.school_fee_structure;
CREATE TABLE nsa.school_fee_structure (
fee_structure_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
fee_structure_name text,
fee_structure_desc text,
applicable_terms map<uuid, text>,
applicable_fee_types map<uuid, text>,
status boolean,
created_date timestamp,
updated_date timestamp,
created_by text,
PRIMARY KEY (fee_structure_id, created_date, tenant_id, school_id,academic_year))
WITH CLUSTERING ORDER BY (created_date DESC);

DROP TABLE IF EXISTS nsa.school_fee_assignment;
CREATE TABLE nsa.school_fee_assignment (
fee_assignment_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
fee_assignment_name text,
applicable_classes map<uuid, text>,
applicable_languages map<uuid, text>,
media_type map<uuid, text>,
applicable_fee_types map<uuid, text>,
fee_types_amount map<uuid, decimal>,
total_fee_amount decimal,
refundable_percentage map<uuid, int>,
due_date timestamp,
created_date timestamp,
updated_date timestamp,
created_by text,
status boolean,
assigned_categories text,
PRIMARY KEY (fee_assignment_id, created_date, tenant_id, school_id,academic_year))
WITH CLUSTERING ORDER BY (created_date DESC);

DROP TABLE IF EXISTS nsa.school_fee_assignment_details;
CREATE TABLE nsa.school_fee_assignment_details (
fee_assignment_detail_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
fee_assignment_id uuid,
fee_assignment_name text,
username text,
term_id uuid,
term_name text,
class_id uuid,
class_name text,
section_id uuid,
section_name text,
applicable_fee_types map<uuid, text>,
fee_types_amount map<uuid, decimal>,
refundable_percentage map<uuid, int>,
net_amount decimal,
due_date timestamp,
scholarship_name map<uuid, text>,
scholarship_amount map<uuid, decimal>,
fee_discount_name text,
fee_discount_amount decimal,
status boolean,
is_paid boolean,
paid_date timestamp,
created_date timestamp,
updated_date timestamp,
PRIMARY KEY (fee_assignment_detail_id, created_date, tenant_id, school_id, academic_year ))
WITH CLUSTERING ORDER BY (created_date DESC);
CREATE INDEX classId_feeAssign_indx ON nsa.school_fee_assignment_details (fee_assignment_id);
CREATE INDEX classId_feeAssignDet_indx ON nsa.school_fee_assignment_details (class_id);
CREATE INDEX sectionId_feeAssignDet_indx ON nsa.school_fee_assignment_details (section_id);
CREATE INDEX termId_feeAssignDet_indx ON nsa.school_fee_assignment_details (term_id);

DROP TABLE IF EXISTS nsa.taxanomy;
CREATE TABLE nsa.taxanomy (
category_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
id uuid,
name text,
parent_category_id uuid,
description text,
status boolean,
type text,
order_by int,
PRIMARY KEY ((tenant_id, school_id, academic_year), category_id)
);
CREATE INDEX on nsa.taxanomy(parent_category_id);

DROP TABLE IF EXISTS nsa.school_class_details;
CREATE TABLE nsa.school_class_details (
class_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
class_name text,
PRIMARY KEY ((tenant_id, school_id, academic_year), class_id)
);

DROP TABLE IF EXISTS nsa.school_class_section_details;
CREATE TABLE nsa.school_class_section_details (
section_id uuid,
section_name text,
tenant_id timeuuid,
school_id uuid,
academic_year text,
class_id uuid,
class_name text,
PRIMARY KEY ( (tenant_id, school_id, academic_year), class_id, section_id )
);

DROP TABLE IF EXISTS nsa.notified_categories;
CREATE TABLE nsa.notified_categories (
id uuid,
notification_id uuid,
category_id uuid,
category_name text,
parent_category_id uuid,
PRIMARY KEY (notification_id)
);

DROP TABLE IF EXISTS nsa.audit_log;
CREATE TABLE nsa.audit_log(
audit_id uuid,
user_name text,
name text,
updated_date timestamp,

PRIMARY KEY(audit_id)
);

DROP TABLE IF EXISTS nsa.school_languages;
CREATE TABLE nsa.school_langauges(
language_id uuid,
tenant_id timeuuid,
school_id uuid,
language_name text,
PRIMARY KEY (language_id, tenant_id, school_id)
);

DROP TABLE IF EXISTS nsa.fee_transaction_details;
CREATE TABLE nsa.fee_transaction_details(
fee_assignment_detail_id uuid,
fee_assignment_id uuid,
user_name text,
txn_status text,
txn_id text,
pg_txn_no text,
pg_response_code text,
txn_msg text,
amount decimal,
auth_id_code text,
issuer_ref_no text,
payment_mode text,
txn_gateway text,
currency text,
card_holder_name text,
txn_date timestamp,
PRIMARY KEY (fee_assignment_detail_id, fee_assignment_id, user_name)
);

DROP TABLE IF EXISTS nsa.payment_gateway;
CREATE TABLE nsa.payment_gateway(
payment_gateway_id uuid,
payment_gateway text,
description text,
status boolean,
PRIMARY KEY(payment_gateway_id)
);

DROP TABLE IF EXISTS nsa.school_payment_configuration;
CREATE TABLE nsa.school_payment_configuration(
tenant_id timeuuid,
school_id uuid,
payment_gateway_id uuid,
payment_gateway text,
gateway_details map<text, text>,
status boolean,
PRIMARY KEY(tenant_id, school_id, payment_gateway_id)
);



