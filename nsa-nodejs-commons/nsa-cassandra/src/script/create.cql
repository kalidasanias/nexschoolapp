DROP KEYSPACE IF EXISTS nsa;
CREATE KEYSPACE nsa WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3'} AND durable_writes = true;

DROP TABLE IF EXISTS nsa.course_departments;
CREATE TABLE nsa.course_departments(
id uuid PRIMARY KEY,
course_id uuid,
course_name text,
course_code text,
class map<uuid, text>,
);

DROP TABLE IF EXISTS nsa.sections;
CREATE TABLE nsa.sections (
id uuid PRIMARY KEY,
name text,
code text,
status boolean,
);

DROP TABLE IF EXISTS nsa.leave_types;
CREATE TABLE nsa.leave_types(
id uuid PRIMARY KEY,
name text,
description text
);

DROP TABLE IF EXISTS nsa.assignment_types;
CREATE TABLE nsa.assignment_types(
id uuid PRIMARY KEY,
name text,
description text
);

DROP TABLE IF EXISTS nsa.event_types;
CREATE TABLE nsa.event_types(
id uuid PRIMARY KEY,
name text,
description text
);

DROP TABLE IF EXISTS nsa.role_type;
CREATE TABLE nsa.role_type (
id uuid PRIMARY KEY,
name text
);

DROP TABLE IF EXISTS nsa.academic_year;
CREATE TABLE nsa.academic_year (
id uuid,
tenant_id timeuuid,
school_id uuid,
ac_year text,
end_date timestamp,
start_date timestamp,
terms map<uuid, text>,
created_date timestamp,
PRIMARY KEY (id, created_date))
WITH CLUSTERING ORDER BY (created_date ASC);
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
name text,
code text
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
user_code text,
short_name text,
date_of_joining timestamp,
device_token map<text, text>,
device_id text,
password text,
school_name text,
user_type text,
email text,
primary_phone text,
roles map<uuid, text>,
blood_group text,
first_name text,
last_name text,
middle_name text,
gender text,
date_of_birth timestamp,
place_of_birth text,
nationality text,
community text,
mother_tongue text,
is_hostel boolean,
profile_picture text,
attachments map<text, text>,
title text,
created_date timestamp,
updated_date timestamp,
active boolean,
transport_required boolean,
medical_info map<text, text>,
height text,
weight text,
PRIMARY KEY(user_name)
);
CREATE INDEX user_indx ON nsa.user (user_type);

DROP TABLE IF EXISTS nsa.user_classification;
CREATE TABLE nsa.user_classification (
user_name text,
tenant_id timeuuid,
school_id uuid,
academic_year text,
class_id uuid,
section_id uuid,
languages map<int, uuid>,
PRIMARY KEY ((tenant_id, school_id, academic_year), class_id, user_name)
);

DROP TABLE IF EXISTS nsa.user_contact_info;
CREATE TABLE nsa.user_contact_info (
user_name text PRIMARY KEY,
father_name text,
father_qualification text,
father_occupation text,
father_email text,
father_phone text,
father_income text,
mother_name text,
mother_qualification text,
mother_occupation text,
mother_email text,
mother_phone text,
mother_income text,
city text,
pincode text,
state text,
street_address1 text,
street_address2 text,
present_city text,
present_pincode text,
present_state text,
present_street_address1 text,
present_street_address2 text,
country text,
additional_contact1_name text,
additional_contact1_relation text,
additional_contact1_address text,
additional_contact1_phone text,
additional_contact2_name text,
additional_contact2_relation text,
additional_contact2_address text,
additional_contact2_phone text,
phone map<text, text>
);

DROP TABLE IF EXISTS nsa.school_details;
CREATE TABLE nsa.school_details (
tenant_id timeuuid,
school_id uuid,
created_date timestamp,
school_code bigint,
project_id text,
merchant_id text,
sub_merchant_id text,
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
google_key text,
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
course_id uuid,
course_name text,
course_code text,
status boolean,
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
CREATE TABLE nsa.school_feature(
id uuid,
tenant_id timeuuid,
school_id uuid,
feature_id uuid,
feature_name text,
parent_feature_id uuid,
activated_date timestamp,
expire_date timestamp,
description text,
mobile_priority int,
icon text,
school_name text,
status boolean,
sms boolean,
email boolean,
push boolean,
order_by int,
is_channels boolean,
is_override boolean,
help_text text,
title text,
doc_desc text,
content text,
link text,
asset_url text,
keywords list<text>, // it stores keywords
user_types list<text>,
tags list<text>,  // it stores tag names
additional_links map<text, text>,    //it stores like video links map<text, text> ----> map<video link url,  video type>
images text,
PRIMARY KEY ((tenant_id, school_id), id)
);
CREATE INDEX on nsa.school_feature(parent_feature_id);
CREATE INDEX on nsa.school_feature(user_types);
CREATE INDEX on nsa.school_feature(status);
CREATE INDEX on nsa.school_feature(expire_date);

DROP TABLE IF EXISTS nsa.school_notifications;
CREATE TABLE nsa.school_notifications (
notification_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
media_name list<text>,
sender_id uuid,
notified_list list<text>,
notified_mobile_numbers list<text>,
notified_categories text,
template_id uuid,
template_title text,
title text,
message text,
email_template_title text,
email_template_message text,
push_template_title text,
push_template_message text,
count int,
notification_type text,
priority int,
status text,
updated_date timestamp,
updated_by text,
updated_username text,
PRIMARY KEY (notification_id, tenant_id, school_id, academic_year))
;

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
employee_username text,
user_name text,
first_name text,
user_type text,
class_id uuid,
section_id uuid,
primary_phone text,
feature_name text,
group_name text,
media_name list<text>,
message text,
template_title text,
title text,
email_template_title text,
email_template_message text,
push_template_title text,
push_template_message text,
count int,
notification_type text,
priority int,
status text,
updated_by text,
updated_date timestamp,
updated_username text,
PRIMARY KEY ((id), notification_id, tenant_id, school_id, user_name))
;

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
default_value boolean,
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
updated_date timestamp,
updated_by text,
updated_username text,
default_value boolean,
status boolean,
PRIMARY KEY (fee_type_id,tenant_id, school_id));

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
updated_date timestamp,
updated_by text,
updated_username text,
status boolean,
PRIMARY KEY (scholarship_id, tenant_id, school_id));

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
updated_by text,
updated_date timestamp,
updated_username text,
PRIMARY KEY (fee_structure_id, tenant_id, school_id,academic_year));

DROP TABLE IF EXISTS nsa.school_fee_assignment;
CREATE TABLE nsa.school_fee_assignment (
fee_assignment_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
fee_structure_id uuid,
fee_assignment_name text,
applicable_classes map<uuid, text>,
applicable_languages map<uuid, text>,
media_type map<uuid, text>,
applicable_fee_types map<uuid, text>,
fee_types_amount map<uuid, decimal>,
total_fee_amount decimal,
refundable_percentage map<uuid, int>,
due_date timestamp,
updated_username text,
updated_date timestamp,
updated_by text,
status boolean,
assigned_categories text,
PRIMARY KEY (fee_assignment_id,tenant_id, school_id,academic_year));

DROP TABLE IF EXISTS nsa.school_fee_assignment_details;
CREATE TABLE nsa.school_fee_assignment_details (
fee_assignment_detail_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
fee_assignment_id uuid,
fee_assignment_name text,
fee_structure_id uuid,
user_name text,
admission_no text,
first_name text,
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
updated_username text,
updated_date timestamp,
updated_by text,
PRIMARY KEY (fee_assignment_detail_id,tenant_id, school_id, academic_year ));
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
course text,
updated_by text,
updated_username text,
updated_date timestamp,
status boolean,
PRIMARY KEY ((tenant_id, school_id, academic_year), class_id)
);

DROP TABLE IF EXISTS nsa.school_sections;
CREATE TABLE nsa.school_sections (
section_id uuid,
section_code text,
section_name text,
tenant_id timeuuid,
school_id uuid,
academic_year text,
updated_date timestamp,
updated_by text,
updated_username text,
status boolean,
PRIMARY KEY ((tenant_id, school_id, academic_year), section_id )
);

DROP TABLE IF EXISTS nsa.school_class_section_details;
CREATE TABLE nsa.school_class_section_details (
id uuid,
section_id uuid,
section_name text,
tenant_id timeuuid,
school_id uuid,
academic_year text,
student_intake int,
status boolean,
class_id uuid,
class_name text,
PRIMARY KEY ((tenant_id, school_id, academic_year), class_id, section_id)
);
CREATE INDEX ON nsa.school_class_section_details (id);

DROP TABLE IF EXISTS nsa.audit_log;
CREATE TABLE nsa.audit_log(
audit_id uuid,
feature_id uuid,
feature_type_id uuid,
updated_by text,
updated_username text,
updated_date timestamp,
type text,
PRIMARY KEY(audit_id, feature_id, feature_type_id, type)
);


DROP TABLE IF EXISTS nsa.school_section;
CREATE TABLE nsa.school_section (
section_id uuid,
section_name text,
tenant_id timeuuid,
school_id uuid,
academic_year text,
PRIMARY KEY ((tenant_id, school_id, academic_year), section_id )
);

DROP TABLE IF EXISTS nsa.school_languages;
CREATE TABLE nsa.school_languages(
language_id uuid,
tenant_id timeuuid,
school_id uuid,
language_name text,
PRIMARY KEY (language_id, tenant_id, school_id)
);

DROP TABLE IF EXISTS nsa.fee_transaction_details;
CREATE TABLE nsa.fee_transaction_details(
fee_id uuid,
user_name text,
sub_merchant_id text,
tracking_id text,
txn_status text,
success_msg text,
failure_msg text,
payment_mode text,
card_name text,
card_holder_name text,
amount decimal,
payment_gateway text,
raw_response text,
txn_date timestamp,
PRIMARY KEY (fee_id, user_name)
);
CREATE INDEX ON nsa.fee_transaction_details(sub_merchant_id);

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

DROP TABLE IF EXISTS nsa.repeat_option;
CREATE TABLE nsa.repeat_option (
id uuid PRIMARY KEY,
name text,
description text
);

DROP TABLE IF EXISTS nsa.aspects;
CREATE TABLE nsa.aspects (
id uuid PRIMARY KEY,
name text,
description text
);

DROP TABLE IF EXISTS nsa.school_aspects;
CREATE TABLE nsa.school_aspects(
aspect_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
aspect_name text,
aspect_desc text,
aspect_code text,
updated_date timestamp,
updated_by text,
updated_username text,
status boolean,
PRIMARY KEY ((tenant_id, school_id, academic_year), aspect_id)
);

DROP TABLE IF EXISTS nsa.subjects;
CREATE TABLE nsa.subjects (
id uuid PRIMARY KEY,
name text,
code text,
colour text,
description text
);

DROP TABLE IF EXISTS nsa.school_subjects;
CREATE TABLE nsa.school_subjects (
subject_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
dept_id uuid,
sub_name text,
sub_desc text,
sub_code text,
sub_colour text,
sub_aspects map<uuid, text>,
updated_date timestamp,
updated_by text,
updated_username text,
default_value boolean,
status boolean,
PRIMARY KEY ((tenant_id, school_id, academic_year), subject_id)
);

DROP TABLE IF EXISTS nsa.department;
CREATE TABLE nsa.department (
id uuid PRIMARY KEY,
name text,
alias text,
);

DROP TABLE IF EXISTS nsa.school_department;
CREATE TABLE nsa.school_department (
dept_id uuid,
tenant_id timeuuid,
school_id uuid,
dept_name text,
dept_alias text,
updated_date timestamp,
updated_by text,
updated_username text,
default_value boolean,
status boolean,
PRIMARY KEY ((tenant_id, school_id), dept_id)
);

DROP TABLE IF EXISTS nsa.designation;
CREATE TABLE nsa.designation (
id uuid PRIMARY KEY,
name text,
alias text,
);

DROP TABLE IF EXISTS nsa.school_designation;
CREATE TABLE nsa.school_designation (
desg_id uuid,
tenant_id timeuuid,
school_id uuid,
desg_name text,
desg_alias text,
updated_date timestamp,
updated_by text,
updated_username text,
default_value boolean,
status boolean,
PRIMARY KEY ((tenant_id, school_id), desg_id)
);

DROP TABLE IF EXISTS nsa.school_leave_type;
CREATE TABLE nsa.school_leave_type (
tenant_id timeuuid,
school_id uuid,
leave_type_id uuid,
description text,
leave_type_name text,
days int,
updated_by text,
updated_date timestamp,
updated_username text,
PRIMARY KEY ((tenant_id, school_id), leave_type_id));

DROP TYPE IF EXISTS nsa.class_association;
CREATE TYPE nsa.class_association (
section_id uuid,
subject_id list<uuid>,
);

DROP TABLE IF EXISTS nsa.employee_classification;
CREATE TABLE nsa.employee_classification (
user_name text,
tenant_id timeuuid,
school_id uuid,
academic_year text,
user_code text,
short_name text,
first_name text,
dept_id list<uuid>,
desg_id uuid,
subjects list<uuid>,
class_associations map<uuid, uuid>,   //class_id as key and section_id as value
selected_categories text,  //For showing dept taxanomy
reporting_manager boolean,
class_teacher boolean,
PRIMARY KEY ((tenant_id, school_id, academic_year), user_name));
CREATE INDEX ON nsa.employee_classification(dept_id);
CREATE INDEX ON nsa.employee_classification(reporting_manager);
CREATE INDEX ON nsa.employee_classification(class_teacher);

DROP TABLE IF EXISTS nsa.school_assignment_type;
CREATE TABLE nsa.school_assignment_type (
assignment_type_id uuid,
tenant_id timeuuid,
school_id uuid,
assignment_type_name text,
assignment_desc text,
updated_date timestamp,
updated_by text,
updated_username text,
default_value boolean,
status boolean,
PRIMARY KEY (assignment_type_id, tenant_id, school_id)
);

DROP TABLE IF EXISTS nsa.school_assignment;
CREATE TABLE nsa.school_assignment (
assignment_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
media_name list<text>,
assignment_name text,
assignment_type_id uuid,
assignment_type_name text,
assignment_desc text,
notified_categories text,
subject_id uuid,
subject_name text,
due_date timestamp,
repeat_option_id uuid,
repeat_option text,
priority int,
notify_to text,
attachments map<text, text>,
updated_by text,
updated_date timestamp,
updated_username text,
status boolean,
PRIMARY KEY (assignment_id, tenant_id, school_id, academic_year));

DROP TABLE IF EXISTS nsa.school_assignment_details;
CREATE TABLE nsa.school_assignment_details (
assignment_detail_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
media_name list<text>,
assignment_id uuid,
assignment_name text,
assignment_desc text,
assignment_type_id uuid,
assignment_type_name text,
user_name text,
first_name text,
class_id uuid,
class_name text,
section_id uuid,
section_name text,
subject_id uuid,
subject_name text,
due_date timestamp,
repeat_option_id uuid,
repeat_option text,
priority int,
attachments map<text, text>,
updated_by text,
updated_date timestamp,
updated_username text,
status boolean,
submitted_date timestamp,
is_submitted boolean,
PRIMARY KEY(assignment_detail_id, tenant_id, school_id, academic_year));
CREATE INDEX ON nsa.school_assignment_details (assignment_id);
CREATE INDEX ON nsa.school_assignment_details (class_id);
CREATE INDEX ON nsa.school_assignment_details (section_id);

DROP TABLE IF EXISTS nsa.conversation;
CREATE TABLE nsa.conversation (
conversation_id uuid,
feature_id uuid,
feature_detail_id uuid,
admission_no text,
user_name text,
name text,
class_id uuid,
class_name text,
section_id uuid,
section_name text,
message text,
message_read boolean,
message_date timestamp,
PRIMARY KEY (feature_detail_id, user_name, message_date)
);
CREATE INDEX ON nsa.conversation (feature_id);

DROP TABLE IF EXISTS nsa.school_attendance;
CREATE TABLE nsa.school_attendance (
attendance_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
media_name list<text>,
class_id uuid,
class_name text,
section_id uuid,
section_name text,
total_strength int,
no_of_present int,
no_of_absent int,
present_percent int,
attendance_date timestamp,
recorded_date timestamp,
recorded_by text,
recorded_username text,
updated_by text,
updated_username text,
updated_date timestamp,
PRIMARY KEY (attendance_id, tenant_id, school_id, academic_year)
);

DROP TABLE IF EXISTS nsa.school_attendance_details;
CREATE TABLE nsa.school_attendance_details (
attendance_detail_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
attendance_id uuid,
media_name list<text>,
user_name text,
admission_no text,
first_name text,
class_id uuid,
class_name text,
section_id uuid,
section_name text,
is_present boolean,
attendance_date timestamp,
recorded_date timestamp,
recorded_by text,
recorded_username text,
updated_by text,
updated_username text,
updated_date timestamp,
remarks text,
PRIMARY KEY (attendance_detail_id, tenant_id, school_id, academic_year));
CREATE INDEX ON nsa.school_attendance_details(attendance_id);
CREATE INDEX ON nsa.school_attendance_details(user_name);
CREATE INDEX ON nsa.school_attendance_details(class_id);
CREATE INDEX ON nsa.school_attendance_details(section_id);
CREATE INDEX ON nsa.school_attendance_details(is_present);
CREATE INDEX ON nsa.school_attendance_details(attendance_date);

DROP TABLE IF EXISTS nsa.school_leave_history_details;
CREATE TABLE nsa.school_leave_history_details (
leave_history_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
user_name text,
user_type text,
from_date timestamp,
to_date timestamp,
leaves_count int,
is_cancelled boolean,
cancelled_date timestamp,
reason text,
updated_by text,
updated_date timestamp,
PRIMARY KEY (leave_history_id, tenant_id, school_id, academic_year));
CREATE INDEX ON nsa.school_leave_history_details(user_name);
CREATE INDEX ON nsa.school_leave_history_details(from_date);
CREATE INDEX ON nsa.school_leave_history_details(to_date);

DROP TABLE IF EXISTS nsa.feature_notification_templates;
CREATE TABLE nsa.feature_notification_templates (
feature_id uuid,
sub_feature_id uuid,
actions int,
user_type text,
sms_template_title text,
sms_template_message text,
email_template_title text,
email_template_message text,
push_template_title text,
push_template_message text,
status boolean,
PRIMARY KEY (feature_id, sub_feature_id, actions)
);
CREATE INDEX ON nsa.feature_notification_templates(user_type);
CREATE INDEX ON nsa.feature_notification_templates(status);

DROP TABLE IF EXISTS nsa.school_feature_notification_templates;
CREATE TABLE nsa.school_feature_notification_templates (
feature_id uuid,
sub_feature_id uuid,
tenant_id timeuuid,
school_id uuid,
actions int,
user_type text,
sms_template_title text,
sms_template_message text,
email_template_title text,
email_template_message text,
push_template_title text,
push_template_message text,
status boolean,
PRIMARY KEY (feature_id, sub_feature_id, tenant_id, school_id, actions)
);
CREATE INDEX ON nsa.school_feature_notification_templates(user_type);
CREATE INDEX ON nsa.school_feature_notification_templates(status);

DROP TABLE IF EXISTS nsa.school_channel_configuration;
CREATE TABLE nsa.school_channel_configuration (
feature_id uuid,
tenant_id timeuuid,
school_id uuid,
sms boolean,
email boolean,
push boolean,
PRIMARY KEY (feature_id, tenant_id, school_id));

DROP TABLE IF EXISTS nsa.sessions;
CREATE TABLE IF NOT EXISTS nsa.sessions (
sid text,
session text,
expires timestamp,
PRIMARY KEY(sid)
);

DROP TABLE IF EXISTS nsa.days;
CREATE TABLE nsa.days (
id int,
name text,
PRIMARY KEY (id, name));

DROP TABLE IF EXISTS nsa.periods;
CREATE TABLE nsa.periods (
id int,
name text,
PRIMARY KEY (id, name));

DROP TABLE IF EXISTS nsa.school_timetable_configuration;
CREATE TABLE nsa.school_timetable_configuration (
timetable_config_id uuid,
tenant_id timeuuid,
school_id uuid,
applicable_class uuid,
working_days set<int>,
school_hours map<text, time>,
school_periods set<uuid>,
school_breaks set<uuid>,
updated_date timestamp,
updated_by text,
updated_username text,
PRIMARY KEY (timetable_config_id, tenant_id, school_id));

DROP TABLE IF EXISTS nsa.school_periods;
CREATE TABLE nsa.school_periods (
school_period_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
class_id uuid,
period_id int,
period_name text,
period_start_time time,
period_end_time time,
is_break boolean,
PRIMARY KEY (school_period_id, tenant_id, school_id, academic_year, class_id));

DROP TABLE IF EXISTS nsa.school_timetable;
CREATE TABLE nsa.school_timetable(
timetable_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
timetable_name text,
class_id uuid,
section_id uuid,
period_id int,
day_id int,
emp_id text,
subject_id uuid,
updated_date timestamp,
updated_by text,
updated_username text,
PRIMARY KEY (timetable_id, class_id, section_id, tenant_id, school_id,academic_year));


DROP TABLE IF EXISTS nsa.swap_timetable;
CREATE TABLE nsa.swap_timetable(
tenant_id timeuuid,
school_id uuid,
academic_year text,
timetable_id uuid,
timetable_name text,
class_id uuid,
section_id uuid,
period_id int,
day_id int,
day_date date,
week_no int,
emp_id text,
subject_id uuid,
updated_by text,
updated_username text,
updated_date timestamp,
is_special_day boolean,
PRIMARY KEY (timetable_id, class_id, section_id, tenant_id, school_id, academic_year));

DROP TABLE IF EXISTS nsa.class_timetable;
CREATE TABLE nsa.class_timetable(
id uuid,
class_id uuid,
section_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
class_teacher_id text,
updated_by text,
updated_username text,
updated_date timestamp,
PRIMARY KEY(class_id, section_id, tenant_id, school_id, academic_year)
);
CREATE INDEX ON nsa.class_timetable(class_teacher_id);

DROP TABLE IF EXISTS nsa.calendar_data;

DROP TYPE IF EXISTS nsa.attachment_type;
CREATE TYPE nsa.attachment_type(
attachment map<text, text>,
description text,
updated_by text,
updated_username text,
);

DROP TYPE IF EXISTS nsa.events_type;
CREATE TYPE nsa.events_type(
event_id uuid,
event_name text,
start_date date,
end_date date,
start_time time,
end_time time,
updated_by text,
updated_username text,
);

DROP TYPE IF EXISTS nsa.exams_type;
CREATE TYPE nsa.exams_type(
exams_name text,
subject_name text
);

CREATE TABLE nsa.calendar_data (
id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
class_id uuid,
section_id uuid,
user_name text,
day_id int,
day_date date,
week_no int,
month_no int,
year_no int,
period_id int,
attachments frozen<attachment_type>,
events frozen<events_type>,
exams frozen<exams_type>,
created_date timestamp,
updated_date timestamp,
updated_by text,
updated_username text,
PRIMARY KEY(id, created_date));

DROP TABLE IF EXISTS nsa.school_leave_assign_details;
CREATE TABLE nsa.school_leave_assign_details (
id uuid,
tenant_id timeuuid,
school_id uuid,
reporting_emp_id text,
reporting_emp_username text,
emp_id text,
emp_username text,
dept_id uuid,
desg_id uuid,
leave_type_id uuid,
leave_type_name text,
no_of_leaves int,
updated_date timestamp,
updated_by text,
updated_username text,
PRIMARY KEY((tenant_id, school_id), emp_id, leave_type_id));
CREATE INDEX ON nsa.school_leave_assign_details(reporting_emp_id);

//holidays tables

DROP TABLE IF EXISTS nsa.school_holiday_types;
CREATE TABLE nsa.school_holiday_types (
tenant_id timeuuid,
school_id uuid,
academic_year text,
holiday_type_id uuid,
holiday_type text,
description text,
updated_date timestamp,
updated_by text,
updated_username text,
PRIMARY KEY ( (tenant_id, school_id, academic_year), holiday_type_id)
);

DROP TABLE IF EXISTS nsa.holiday_types;
CREATE TABLE nsa.holiday_types(
id uuid PRIMARY KEY,
name text,
description text
);

DROP TABLE IF EXISTS nsa.school_holidays;
CREATE TABLE nsa.school_holidays(
tenant_id timeuuid,
school_id uuid,
academic_year text,
holiday_id uuid,
holiday_type text,
holiday_type_id uuid,
holiday_name text,
start_date timestamp,
end_date timestamp,
updated_date timestamp,
updated_by text,
updated_username text,
PRIMARY KEY ( (tenant_id, school_id, academic_year), holiday_id)
);

DROP TABLE IF EXISTS nsa.school_class_subjects;
CREATE TABLE nsa.school_class_subjects (
tenant_id timeuuid,
school_id uuid,
academic_year text,
class_id uuid,
section_id uuid,
subject_id uuid,
subject_type boolean,
PRIMARY KEY ((tenant_id, school_id, academic_year), class_id, section_id, subject_id )
);

DROP TABLE IF EXISTS nsa.school_vehicle_details;
CREATE TABLE nsa.school_vehicle_details (
reg_no text,
vehicle_type text,
seating_capacity int,
vehicle_reg_date timestamp,
vehicle_fc_date timestamp,
is_hired boolean,
vehicle_owner_name text,
vehicle_owner_address text,
vehicle_owner_city text,
vehicle_owner_state text,
vehicle_owner_phone text,
updated_date timestamp,
updated_by text,
updated_username text,
tenant_id timeuuid,
school_id uuid,
PRIMARY KEY (reg_no)
);

DROP TABLE IF EXISTS nsa.school_driver_details;
CREATE TABLE nsa.school_driver_details (
id uuid,
driver_name text,
driver_address text,
driver_city text,
driver_state text,
driver_phone text,
driver_type text,
driver_dl_number text,
driver_dl_type text,
driver_dl_validity timestamp,
updated_date timestamp,
updated_by text,
updated_username text,
tenant_id timeuuid,
school_id uuid,
PRIMARY KEY (tenant_id, school_id, id)
);

DROP TABLE IF EXISTS nsa.school_vehicle_route_details;
CREATE TABLE nsa.school_vehicle_route_details (
id uuid,
route_name text,
route_desc text,
reg_no text,
orgin text,
destination text,
waypoints list<text>,
from_lat text,
from_lng text,
to_lat text,
to_lng text,
radius int,
driver_id uuid,
conductor_name text,
conductor_address text,
conductor_phone text,
overview_path text,
updated_date timestamp,
updated_by text,
updated_username text,
tenant_id timeuuid,
school_id uuid,
PRIMARY KEY (id, tenant_id, school_id)
);

DROP TABLE IF EXISTS nsa.school_vehicle_stop_details;
CREATE TABLE nsa.school_vehicle_stop_details (
route_id uuid,
stop_id int,
lat float,
lng float,
location text,
PRIMARY KEY (route_id, stop_id));

DROP TABLE IF EXISTS nsa.school_vehicle_user_allocation;
CREATE TABLE nsa.school_vehicle_user_allocation (
id uuid,
route_id uuid,
reg_no text,
first_name text,
user_name text,
class_id uuid,
class_name text,
school_id uuid,
section_id uuid,
section_name text,
pickup_location text,
pickup_location_index int,
notify_distance int,
notify_type text,
updated_date timestamp,
updated_by text,
updated_username text,
tenant_id timeuuid,
PRIMARY KEY (id, tenant_id, school_id)
);


// events tables
DROP TABLE IF EXISTS nsa.school_event_type;
CREATE TABLE nsa.school_event_type (
event_type_id uuid,
event_type_name text,
description text,
tenant_id timeuuid,
school_id uuid,
updated_date timestamp,
updated_by text,
updated_username text,
PRIMARY KEY((tenant_id, school_id), event_type_id)
);

DROP TABLE IF EXISTS nsa.school_venue_type;
CREATE TABLE nsa.school_venue_type (
venue_type_id uuid,
venue_type_name text,
location text,
tenant_id timeuuid,
school_id uuid,
updated_date timestamp,
updated_by text,
updated_username text,
PRIMARY KEY((tenant_id, school_id), venue_type_id)
);

DROP TABLE IF EXISTS nsa.school_events;
CREATE TABLE nsa.school_events(
event_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
event_name text,
start_date date,
end_date date,
start_time time,
end_time time,
event_type_id uuid,
event_type_name text,
event_venue map<uuid, text>,
description text,
latitude double,
longitude double,
map_location text,
notified_students list<text>,
notified_categories text,
is_mandatory boolean,
attachments map<text, text>,
media_name list<text>,
updated_date timestamp,
updated_by text,
updated_username text,
status boolean,
PRIMARY KEY (event_id, tenant_id, school_id, academic_year));

DROP TABLE IF EXISTS nsa.school_events_details;
CREATE TABLE nsa.school_events_details(
event_detail_id uuid,
event_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
event_name text,
start_date date,
end_date date,
start_time time,
end_time time,
event_type_id uuid,
event_type_name text,
event_venue map<uuid, text>,
description text,
user_name text,
first_name text,
class_id uuid,
class_name text,
section_id uuid,
section_name text,
latitude double,
longitude double,
map_location text,
is_mandatory boolean,
attachments map<text, text>,
media_name list<text>,
updated_date timestamp,
updated_by text,
updated_username text,
status boolean,
is_registered boolean,
PRIMARY KEY(event_detail_id, tenant_id, school_id, academic_year));
CREATE INDEX ON nsa.school_events_details (user_name);

DROP TABLE IF EXISTS nsa.school_emp_leave_master;
CREATE TABLE nsa.school_emp_leave_master (
id uuid,
tenant_id timeuuid,
school_id uuid,
emp_id text,
emp_first_name text,
leave_type_id uuid,
leave_type_name text,
no_of_leaves int,
updated_date timestamp,
updated_by text,
updated_first_name text,
PRIMARY KEY((tenant_id, school_id), emp_id, leave_type_id));

DROP TABLE IF EXISTS nsa.school_emp_reporting_manager;
CREATE TABLE nsa.school_emp_reporting_manager (
id uuid,
tenant_id timeuuid,
school_id uuid,
reporting_emp_id text,
emp_id text,
updated_by text,
updated_date timestamp,
PRIMARY KEY((tenant_id, school_id), emp_id));
CREATE INDEX ON nsa.school_emp_reporting_manager(reporting_emp_id);

DROP TABLE IF EXISTS nsa.school_emp_leave_applied_details;
CREATE TABLE nsa.school_emp_leave_applied_details (
applied_leave_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
reporting_emp_id text,
emp_id text,  // emp login username
leave_type_id uuid,
from_date timestamp,
to_date timestamp,
leaves_count int,
leave_reason text,
status text,
created_date timestamp,
updated_by text,
updated_first_name text,
updated_date timestamp,
PRIMARY KEY ((tenant_id, school_id, academic_year), applied_leave_id));
CREATE INDEX ON nsa.school_emp_leave_applied_details(emp_id);
CREATE INDEX ON nsa.school_emp_leave_applied_details(from_date);
CREATE INDEX ON nsa.school_emp_leave_applied_details(to_date);
CREATE INDEX ON nsa.school_emp_leave_applied_details(status);


DROP TABLE IF EXISTS nsa.school_emp_leave_applied_logs;
CREATE TABLE nsa.school_emp_leave_applied_logs (
id uuid,
applied_leave_id uuid,
media_name list<text>,
status text,
reason text,
updated_by text,
updated_first_name text,
updated_date timestamp,
PRIMARY KEY (applied_leave_id, status));

DROP TABLE IF EXISTS nsa.school_emp_leave_history_details;
CREATE TABLE nsa.school_emp_leave_history_details (
id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
reporting_emp_id text,
reporting_emp_first_name text,
emp_id text,   // emp login username
emp_first_name text,  //for ui first name
leave_type_id uuid,
leave_type_name text,
from_date timestamp,
to_date timestamp,
leaves_count int,
leave_reason text,
status text,
reason text,
media_name list<text>,
updated_by text,
updated_first_name text,
updated_date timestamp,
PRIMARY KEY ((tenant_id, school_id, academic_year), id));
CREATE INDEX ON nsa.school_emp_leave_history_details(reporting_emp_id);
CREATE INDEX ON nsa.school_emp_leave_history_details(emp_id);

DROP TABLE IF EXISTS nsa.school_week_off_details;
CREATE TABLE nsa.school_week_off_details (
id uuid,
tenant_id timeuuid,
school_id uuid,
saturday list<int>,   //list of saturday week selected days
sunday list<int>,	// list of sunday week selected days
updated_by text,
updated_first_name text,
updated_date timestamp,
PRIMARY KEY ((tenant_id, school_id), id));

DROP TABLE IF EXISTS nsa.session_users;
CREATE TABLE nsa.session_users (
sid text,
user_name text PRIMARY KEY,
);

DROP TABLE IF EXISTS nsa.gps;
CREATE TABLE nsa.gps (
id uuid PRIMARY KEY,
api_key text,
validity int,
created_date timestamp,
expires timestamp
);