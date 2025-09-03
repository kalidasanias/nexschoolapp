//For IOS Start
ALTER TABLE nsa.school_assignment_details ADD deactivated boolean;
ALTER TABLE nsa.school_assignment_details ADD is_read boolean;

ALTER TABLE nsa.school_media_usage_log ADD is_read boolean;

ALTER TABLE nsa.school_feature ADD screen text;

ALTER TABLE nsa.school_feedback_details ADD feature_name text;
ALTER TABLE nsa.school_feedback_details ADD feature_id uuid;

ALTER TABLE nsa.school_details ADD raw_aboutus text;

//For IOS End