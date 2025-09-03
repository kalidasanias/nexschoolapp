use nsa;

// For SRV School Start
INSERT INTO school_sender_type("sender_id", "tenant_id", "school_id", "academic_year", "media_id", "media_name", "sender_name") VALUES (fed830f3-e14e-4259-92b2-b5df95df5cc9, 258d86d0-4838-11e7-a107-07cfd493dd84, 34e6bb25-9d8d-434d-b42f-0e825057ed59, '2017-2018', 1, 'sms', 'SRVCBE');

INSERT INTO nsa.taxanomy (tenant_id,school_id,academic_year,category_id,description,id,name,order_by,parent_category_id,status,"type") VALUES (
258d86d0-4838-11e7-a107-07cfd493dd84,34e6bb25-9d8d-434d-b42f-0e825057ed59,'2017-2018',3b77f066-c2c3-4276-8840-f3e33cafa3f7,NULL,c0b8c806-76c5-424c-9880-16be04b4fa24,'Social Studies',15,389fc5ed-5e5d-4e55-89f6-05698e82501e,true,'O');

insert into role_type(id, name) values (fbb9a600-ea2b-11e6-8b3a-9d7cc28d7ccd, 'SchoolAdmin');
insert into role_type(id, name) values (b3a187e5-7f14-4a6e-a4dc-432e61832e03, 'ClassTeacher');
insert into role_type(id, name) values (346e08d8-4012-44b4-8d01-df59b1760024, 'ReportingManager');


insert into nsa.school_holiday_types(holiday_type_id,holiday_type,description, tenant_id, school_id, updated_by, updated_username, updated_date, academic_year) VALUES (d0284f97-be2a-4753-a7c9-5ca50484c6d5, 'National Holidays','NH',258d86d0-4838-11e7-a107-07cfd493dd84,34e6bb25-9d8d-434d-b42f-0e825057ed59, 'Admin', 'Admin', toTimeStamp(now()), '2017-2018'); 
insert into nsa.school_holiday_types(holiday_type_id,holiday_type,description, tenant_id, school_id, updated_by, updated_username, updated_date, academic_year) VALUES (eb8cf80a-e4b9-481f-97d5-cf017074f409, 'School Holidays','SH',258d86d0-4838-11e7-a107-07cfd493dd84,34e6bb25-9d8d-434d-b42f-0e825057ed59, 'Admin', 'Admin', toTimeStamp(now()), '2017-2018');
insert into nsa.school_holiday_types(holiday_type_id,holiday_type,description, tenant_id, school_id, updated_by, updated_username, updated_date, academic_year) VALUES (4d61a7eb-09d0-4d8f-9ae4-aa50ea02b991, 'Vacations','VC',258d86d0-4838-11e7-a107-07cfd493dd84,34e6bb25-9d8d-434d-b42f-0e825057ed59, 'Admin', 'Admin', toTimeStamp(now()), '2017-2018');
insert into nsa.school_holiday_types(holiday_type_id,holiday_type,description, tenant_id, school_id, updated_by, updated_username, updated_date, academic_year) VALUES (b638d17e-3539-4b32-b036-557acd1e618f, 'Emergency Leaves','EL',258d86d0-4838-11e7-a107-07cfd493dd84,34e6bb25-9d8d-434d-b42f-0e825057ed59, 'Admin', 'Admin', toTimeStamp(now()), '2017-2018');
insert into nsa.school_holiday_types(holiday_type_id,holiday_type,description, tenant_id, school_id, updated_by, updated_username, updated_date, academic_year) VALUES (c88c2650-f5ce-476b-a99d-eaefa5da787f, 'Study Holidays','SH',258d86d0-4838-11e7-a107-07cfd493dd84,34e6bb25-9d8d-434d-b42f-0e825057ed59, 'Admin', 'Admin', toTimeStamp(now()), '2017-2018');


// For SRV School End