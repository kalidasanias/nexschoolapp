DROP TABLE IF EXISTS nsa.school_feature; 
CREATE TABLE nsa.school_feature (
    tenant_id timeuuid,
    school_id uuid,
    academic_year text,
    screen text,
    id uuid,
    activated_date timestamp,
    additional_links map<text, text>,
    asset_url text,
    content text,
    description text,
    doc_desc text,
    email boolean,
    expire_date timestamp,
    feature_id uuid,
    feature_name text,
    help_text text,
    icon text,
    images text,
    is_channels boolean,
    is_override boolean,
    keywords list<text>,
    link text,
    mobile_priority int,
    notify_hostelers boolean,
    order_by int,
    parent_feature_id uuid,
    push boolean,
    school_name text,
    sms boolean,
    status boolean,
    tags list<text>,
    title text,
    user_types list<text>,
    PRIMARY KEY ((tenant_id, school_id, academic_year), id)
);
CREATE INDEX school_feature_user_types_idx ON nsa.school_feature (values(user_types));
CREATE INDEX school_feature_parent_feature_id_idx ON nsa.school_feature (parent_feature_id);
CREATE INDEX school_feature_expire_date_idx ON nsa.school_feature (expire_date);
CREATE INDEX school_feature_status_idx ON nsa.school_feature (status);






DROP TABLE IF EXISTS nsa.school_terms;
CREATE TABLE nsa.school_terms (
    id uuid,
    tenant_id timeuuid,
    school_id uuid,
    ac_year text,
    term text,
    end_date timestamp,
    start_date timestamp,
    PRIMARY KEY ((tenant_id, school_id, ac_year), id)
);
CREATE INDEX school_terms_indx ON nsa.school_terms (term);

alter table nsa.user_Classification add promoted boolean;
alter table nsa.school_class_details add order_by int;

alter table nsa.school_class_section_details add promoted boolean;
alter table nsa.school_class_section_details add promoted_class_id uuid;
alter table nsa.school_class_section_details add promoted_class_name text;
alter table nsa.school_class_section_details add promoted_section_id uuid;
alter table nsa.school_class_section_details add promoted_section_name text;
alter table nsa.academic_year add is_current_year boolean;

DROP TABLE IF EXISTS nsa.school_timetable_configuration;
CREATE TABLE nsa.school_timetable_configuration (
timetable_config_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
applicable_class uuid,
created_by text,
created_date timestamp,
created_firstname text,
school_breaks set<uuid>,
school_hours map<text, time>,
school_periods set<uuid>,
updated_by text,
updated_date timestamp,
updated_username text,
working_days set<int>,
PRIMARY KEY (timetable_config_id, tenant_id, school_id, academic_year));


DROP TABLE IF EXISTS nsa.school_vehicle_user_allocation;
CREATE TABLE nsa.school_vehicle_user_allocation (
    id uuid,
    tenant_id timeuuid,
    academic_year text,
    school_id uuid,
    class_id uuid,
    class_name text,
    created_by text,
    created_date timestamp,
    created_firstname text,
    first_name text,
    notify_distance int,
    notify_type text,
    pickup_location text,
    pickup_location_index int,
    reg_no text,
    route_id uuid,
    section_id uuid,
    section_name text,
    updated_by text,
    updated_date timestamp,
    updated_username text,
    user_name text,
    PRIMARY KEY (id, tenant_id, school_id, academic_year));
    
alter table nsa.school_vehicle_user_allocation add user_code text;

DROP TABLE IF EXISTS nsa.employee_classification;
CREATE TABLE nsa.employee_classification (
    tenant_id timeuuid,
    school_id uuid,
    academic_year text,
    user_name text,
    class_associations map<uuid, uuid>,
    class_teacher boolean,
    dept_id list<uuid>,
    desg_id uuid,
    first_name text,
    reporting_manager boolean,
    selected_categories text,
    short_name text,
    subjects list<uuid>,
    taxanomy_departments list<text>,
    user_code text,
    PRIMARY KEY ((tenant_id, school_id), user_name)
) WITH CLUSTERING ORDER BY (user_name ASC);
CREATE INDEX employee_classification_class_teacher_idx ON nsa.employee_classification (class_teacher);
CREATE INDEX employee_classification_reporting_manager_idx ON nsa.employee_classification (reporting_manager);
CREATE INDEX employee_classification_dept_id_idx ON nsa.employee_classification (values(dept_id));


