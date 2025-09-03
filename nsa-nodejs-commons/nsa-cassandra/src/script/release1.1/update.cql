DROP TABLE IF EXISTS nsa.award;
create table nsa.award(
id uuid PRIMARY KEY,
name text,
description text
);

DROP TABLE IF EXISTS nsa.school_award;
create table nsa.school_award(
id uuid,
tenant_id timeuuid,
school_id uuid,
award_id uuid,
award_name text,
academic_year text,
status boolean,
description text,
PRIMARY KEY ((tenant_id, school_id), id)
);

DROP TABLE IF EXISTS nsa.school_hall_of_fame;
CREATE TABLE nsa.school_hall_of_fame (
id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
award_name text,
award_id uuid,
notified_students text,
date_of_issue date,
description text,
status boolean,
media_name list<text>,
number_of_students int,
updated_date timestamp,
updated_by text,
updated_firstname text,
created_by text,
created_date timestamp,
created_firstname text,
PRIMARY KEY (id, tenant_id, school_id, academic_year));

DROP TABLE IF EXISTS nsa.school_hall_of_fame_details;
CREATE TABLE nsa.school_hall_of_fame_details (
hall_of_fame_id uuid,
hall_of_fame_details_id uuid,
tenant_id timeuuid,
school_id uuid,
academic_year text,
award_name text,
award_id uuid,
user_name text,
first_name text,
class_id uuid,
class_name text,
section_id uuid,
section_name text,
media_name list<text>,
date_of_issue date,
description text,
status boolean,
updated_date timestamp,
updated_by text,
updated_firstname text,
created_by text,
created_date timestamp,
created_firstname text,
PRIMARY KEY (hall_of_fame_details_id, tenant_id, school_id, academic_year));
CREATE INDEX ON nsa.school_hall_of_fame_details (user_name);

ALTER TABLE nsa.school_fee_assignment_details ADD paid_amount decimal;
ALTER TABLE nsa.school_fee_assignment_details ADD is_partial boolean;


DROP TABLE nsa.fee_transaction_details ;
CREATE TABLE nsa.fee_transaction_details (
fee_trans_id uuid,
fee_id uuid,
user_name text,
amount decimal,
card_holder_name text,
card_name text,
failure_msg text,
payment_gateway text,
payment_mode text,
raw_response text,
sub_merchant_id text,
success_msg text,
tracking_id text,
txn_date timestamp,
txn_status text,
PRIMARY KEY (fee_id, user_name, fee_trans_id)
);
CREATE INDEX ON nsa.fee_transaction_details (sub_merchant_id);

ALTER TABLE nsa.school_notifications ADD notified_students text;
ALTER TABLE nsa.school_events DROP notified_students;
ALTER TABLE nsa.school_events ADD notified_students text;