ALTER TABLE nsa.school_media_usage_log ADD deactivated boolean;

ALTER TABLE nsa.school_assignment ADD subjects map<uuid, text>;
ALTER TABLE nsa.school_assignment_details ADD subjects map<uuid, text>;

ALTER TABLE nsa.employee_classification ADD taxanomy_departments list<text>;

ALTER TABLE nsa.school_timetable ADD sub_emp_association map<uuid, text>;
ALTER TABLE nsa.swap_timetable ADD sub_emp_association map<uuid, text>;

ALTER TABLE nsa.school_details ADD app_link text;
ALTER TABLE nsa.school_details ADD password text;
