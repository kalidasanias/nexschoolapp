DROP TABLE IF EXISTS nsa.school_parent_logins;
CREATE TABLE nsa.school_parent_logins(
id uuid,
user_name text,
tenant_id timeuuid,
PRIMARY KEY (tenant_id, user_name)
);