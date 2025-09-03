use nsa;


DROP TABLE IF EXISTS nsa.school_role_type;
CREATE TABLE nsa.school_role_type(
tenant_id timeuuid,
school_id uuid,
id uuid,
name text,
description text,
updated_by text,
updated_username text,
updated_date timestamp,
created_by text,
created_date timestamp,
created_firstname text,
default_value boolean,
is_enable boolean,
status boolean,
PRIMARY KEY ((tenant_id, school_id), id)
);
CREATE CUSTOM INDEX name_prefix ON school_role_type (name) USING 'org.apache.cassandra.index.sasi.SASIIndex'WITH OPTIONS = {'mode': 'CONTAINS', 'analyzer_class': 'org.apache.cassandra.index.sasi.analyzer.NonTokenizingAnalyzer', 'case_sensitive': 'false'};

DROP TABLE IF EXISTS nsa.permissions;
CREATE TABLE nsa.permissions(
id uuid PRIMARY KEY,
feature_id uuid,
name text,
description text,
);
CREATE INDEX on nsa.permissions(feature_id);

DROP TABLE IF EXISTS nsa.school_role_permissions;
CREATE TABLE nsa.school_role_permissions(
id uuid,
tenant_id timeuuid,
school_id uuid,
role_id uuid,
role_name text,
permission_id map<uuid, text>,
updated_by text,
updated_date timestamp,
updated_username text,
created_by text,
created_date timestamp,
created_firstname text,
PRIMARY KEY ((tenant_id, school_id), role_id)
);

alter table school_vehicle_details add active boolean;
alter table school_vehicle_route_details drop radius ;
alter table school_vehicle_stop_details add place_id text;
alter table school_vehicle_stop_details add reg_no text;
alter table school_vehicle_stop_details add radius int;

alter table nsa.school_assignment_type add created_date timestamp;
alter table nsa.school_assignment_type add created_by text;
alter table nsa.school_assignment_type add created_firstname text;

alter table nsa.school_assignment add created_date timestamp;
alter table nsa.school_assignment add created_by text;
alter table nsa.school_assignment add created_firstname text;

alter table nsa.school_assignment_details add created_date timestamp;
alter table nsa.school_assignment_details add created_by text;
alter table nsa.school_assignment_details add created_firstname text;

alter table nsa.school_notifications add created_date timestamp;
alter table nsa.school_notifications add created_by text;
alter table nsa.school_notifications add created_firstname text;

alter table nsa.school_media_usage_log add created_date timestamp;
alter table nsa.school_media_usage_log add created_by text;
alter table nsa.school_media_usage_log add created_firstname text;

alter table nsa.school_fee_type add created_date timestamp;
alter table nsa.school_fee_type add created_by text;
alter table nsa.school_fee_type add created_firstname text;

alter table nsa.school_scholarship_type add created_date timestamp;
alter table nsa.school_scholarship_type add created_by text;
alter table nsa.school_scholarship_type add created_firstname text;

alter table nsa.school_fee_structure add created_date timestamp;
alter table nsa.school_fee_structure add created_by text;
alter table nsa.school_fee_structure add created_firstname text;

alter table nsa.school_fee_assignment add created_date timestamp;
alter table nsa.school_fee_assignment add created_by text;
alter table nsa.school_fee_assignment add created_firstname text;

alter table nsa.school_fee_assignment_details add created_date timestamp;
alter table nsa.school_fee_assignment_details add created_by text;
alter table nsa.school_fee_assignment_details add created_firstname text;

alter table nsa.school_class_details add created_date timestamp;
alter table nsa.school_class_details add created_by text;
alter table nsa.school_class_details add created_firstname text;

alter table nsa.school_sections add created_date timestamp;
alter table nsa.school_sections add created_by text;
alter table nsa.school_sections add created_firstname text;

alter table nsa.school_aspects add created_date timestamp;
alter table nsa.school_aspects add created_by text;
alter table nsa.school_aspects add created_firstname text;

alter table nsa.school_subjects add created_date timestamp;
alter table nsa.school_subjects add created_by text;
alter table nsa.school_subjects add created_firstname text;

alter table nsa.school_department add created_date timestamp;
alter table nsa.school_department add created_by text;
alter table nsa.school_department add created_firstname text;

alter table nsa.school_designation add created_date timestamp;
alter table nsa.school_designation add created_by text;
alter table nsa.school_designation add created_firstname text;

alter table nsa.school_leave_type add created_date timestamp;
alter table nsa.school_leave_type add created_by text;
alter table nsa.school_leave_type add created_firstname text;

alter table nsa.school_attendance add created_date timestamp;
alter table nsa.school_attendance add created_by text;
alter table nsa.school_attendance add created_firstname text;

alter table nsa.school_attendance_details add created_date timestamp;
alter table nsa.school_attendance_details add created_by text;
alter table nsa.school_attendance_details add created_firstname text;

alter table nsa.school_leave_history_details add created_date timestamp;
alter table nsa.school_leave_history_details add created_by text;
alter table nsa.school_leave_history_details add created_firstname text;

alter table nsa.school_timetable_configuration add created_date timestamp;
alter table nsa.school_timetable_configuration add created_by text;
alter table nsa.school_timetable_configuration add created_firstname text;

alter table nsa.school_timetable add created_date timestamp;
alter table nsa.school_timetable add created_by text;
alter table nsa.school_timetable add created_firstname text;

alter table nsa.swap_timetable add created_date timestamp;
alter table nsa.swap_timetable add created_by text;
alter table nsa.swap_timetable add created_firstname text;

alter table nsa.class_timetable add created_date timestamp;
alter table nsa.class_timetable add created_by text;
alter table nsa.class_timetable add created_firstname text;


alter table nsa.calendar_data add created_by text;
alter table nsa.calendar_data add created_firstname text;

alter table nsa.school_leave_assign_details add created_date timestamp;
alter table nsa.school_leave_assign_details add created_by text;
alter table nsa.school_leave_assign_details add created_firstname text;

alter table nsa.school_holiday_types add created_date timestamp;
alter table nsa.school_holiday_types add created_by text;
alter table nsa.school_holiday_types add created_firstname text;

alter table nsa.school_holidays add created_date timestamp;
alter table nsa.school_holidays add created_by text;
alter table nsa.school_holidays add created_firstname text;

alter table nsa.school_vehicle_details add created_date timestamp;
alter table nsa.school_vehicle_details add created_by text;
alter table nsa.school_vehicle_details add created_firstname text;

alter table nsa.school_driver_details add created_date timestamp;
alter table nsa.school_driver_details add created_by text;
alter table nsa.school_driver_details add created_firstname text;

alter table nsa.school_vehicle_route_details add created_date timestamp;
alter table nsa.school_vehicle_route_details add created_by text;
alter table nsa.school_vehicle_route_details add created_firstname text;

alter table nsa.school_vehicle_user_allocation add created_date timestamp;
alter table nsa.school_vehicle_user_allocation add created_by text;
alter table nsa.school_vehicle_user_allocation add created_firstname text;

alter table nsa.school_event_type add created_date timestamp;
alter table nsa.school_event_type add created_by text;
alter table nsa.school_event_type add created_firstname text;

alter table nsa.school_venue_type add created_date timestamp;
alter table nsa.school_venue_type add created_by text;
alter table nsa.school_venue_type add created_firstname text;

alter table nsa.school_events add created_date timestamp;
alter table nsa.school_events add created_by text;
alter table nsa.school_events add created_firstname text;

alter table nsa.school_events_details add created_date timestamp;
alter table nsa.school_events_details add created_by text;
alter table nsa.school_events_details add created_firstname text;

alter table nsa.school_emp_leave_master add created_date timestamp;
alter table nsa.school_emp_leave_master add created_by text;
alter table nsa.school_emp_leave_master add created_firstname text;

alter table nsa.school_emp_reporting_manager add created_date timestamp;
alter table nsa.school_emp_reporting_manager add created_by text;
alter table nsa.school_emp_reporting_manager add created_firstname text;

alter table nsa.school_emp_leave_applied_details add created_by text;
alter table nsa.school_emp_leave_applied_details add created_firstname text;

alter table nsa.school_emp_leave_applied_logs add created_date timestamp;
alter table nsa.school_emp_leave_applied_logs add created_by text;
alter table nsa.school_emp_leave_applied_logs add created_firstname text;

alter table nsa.school_emp_leave_history_details add created_date timestamp;
alter table nsa.school_emp_leave_history_details add created_by text;
alter table nsa.school_emp_leave_history_details add created_firstname text;

alter table nsa.school_week_off_details add created_date timestamp;
alter table nsa.school_week_off_details add created_by text;
alter table nsa.school_week_off_details add created_firstname text;

alter table nsa.school_class_section_details add updated_date timestamp;
alter table nsa.school_class_section_details add updated_by text;
alter table nsa.school_class_section_details add updated_firstname text;
alter table nsa.school_class_section_details add created_date timestamp;
alter table nsa.school_class_section_details add created_by text;
alter table nsa.school_class_section_details add created_firstname text;

alter table nsa.school_class_subjects add updated_date timestamp;
alter table nsa.school_class_subjects add updated_by text;
alter table nsa.school_class_subjects add updated_firstname text;
alter table nsa.school_class_subjects add created_date timestamp;
alter table nsa.school_class_subjects add created_by text;
alter table nsa.school_class_subjects add created_firstname text;

alter table nsa.school_class_details add class_code text;
