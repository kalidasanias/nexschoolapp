use nsa;

INSERT INTO nsa.permissions (id,description,feature_id,name) VALUES ( 
5e0a4084-9c60-4f8b-9ef4-378238b644c0,'gallery_viewAll',a25005f0-c7d7-47cd-a747-c7227848343f,'gallery_viewAll');
INSERT INTO nsa.permissions (id,description,feature_id,name) VALUES (
7d98d088-edd9-47a7-9e9d-affa70dce611,'gallery_view',a25005f0-c7d7-47cd-a747-c7227848343f,'gallery_view');
INSERT INTO nsa.permissions (id,description,feature_id,name) VALUES (
8e6e1ec1-bb8c-4fcd-8062-04e79dffb74e,'gallery_manage',a25005f0-c7d7-47cd-a747-c7227848343f,'gallery_manage');
INSERT INTO nsa.permissions (id,description,feature_id,name) VALUES (981a9ec1-9f28-4a9f-98af-b5ab9c329c4a,'gallery_manageAll',a25005f0-c7d7-47cd-a747-c7227848343f,'gallery_manageAll');




//For ST Aloysious Start

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES ( d04943a0-d175-11e6-a2c8-c95cdbee5e46, 92f7300e-a0b0-4828-b405-a2406b139941,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (
d04943a0-d175-11e6-a2c8-c95cdbee5e46, 92f7300e-a0b0-4828-b405-a2406b139941,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
{05152ab9-5ad8-48e7-8bcb-788d5e561821:'fee_structure_viewAll', 08664b30-0505-44d5-ab2e-45515d3c5f18:'leave_types_viewAll', 095294c9-4afb-4fc8-89b6-6491bf5c93f1:'fee_scholarship_viewAll',
 0984dbac-09cb-4801-924f-5c613bcb2525:'event_venues_viewAll', 0f734127-341b-4200-8bff-782481c08090:'my_leaves_viewAll', 1de0f9c9-2a99-40e4-8b57-0279fa303d6b:'designation_viewAll',
  21931a6c-2d9a-4337-89d1-7633ad329e33:'holidays_viewAll',
 23cf970e-cc44-43cd-8867-feeee53c9bb6:'timetable_configuration_manage', 2468f067-a431-4c27-8514-611fd20d4575:'leaves_approval_manage',
 24827e96-7ca1-43a2-86fd-9dac87abddc4:'attendance_history_manage', 2fc09cc1-a7f8-4877-acfc-3b9feb10d228:'route_viewAll',
  34929530-f20a-4a7b-a7af-f1bd30fbba4a:'timetable_configuration_viewAll', 39034235-d161-433a-92a4-bd91b17df2d3:'attendance_information_viewAll',
  3a618470-afd7-49c3-9d37-763051f7ac54:'create_assignments_viewAll', 3acc394b-c375-4d57-8387-723edbe2aab1:'route_manage',
   4132c89f-b267-4dd5-870f-9e0d074d6a8e:'holiday_types_viewAll', 46e50339-7c6a-42c5-bcb2-f734d9baab98:'assign_fees_viewAll',
   4bc16ed9-1911-4788-af72-48fe911600d6:'event_venues_manage', 4d085c04-4e24-4826-aa57-ed60f427ea01:'create_events_manage',
4d108a51-381c-49c3-802f-4689049dfadb:'notification_viewAll',
52a0ffbc-d794-43d8-b3b4-f77963ccb02c:'tracking_manage', 564e30fe-f3ba-402c-a728-aeb19ae193f8:'communication_viewAll',
5e95f6ef-c96b-44dc-a664-080be05600d7:'class_viewAll', 621c77c0-baba-4803-b409-fd7ea5920f47:'special_timetable_manage',
 6a0d0f00-7b97-499c-b5e2-69fa680d1e0b:'leave_assignments_viewAll',
 6e0ca880-2ab1-4048-a807-7340c6bf0a6f:'leaves_approval_viewAll', 7926f20d-d293-4b45-8f0b-6ffe5369cbc4:'vehicle_viewAll',
 7b0e797d-c196-4e2b-86aa-72b1d423079e:'notification_manage', 7dcc58ff-1c91-4f73-bae9-754e0b732911:'vehicle_manage',
 7ead6aa6-d4da-4788-b084-824f72808ddd:'subject_list_viewAll', 802a5cab-a376-4350-a017-abf4dba63fa1:'my_leaves_manage',
  803f4ec8-fa98-43cf-8316-b33d8804b592:'employees_viewAll', 80663430-9909-4145-aae1-c121a93d2acb:'fee_structure_manage',
  8db7451c-d3ad-4cb1-abbe-c9158479a5ba:'employee_timetable_manage', 95379f58-6577-4ba1-9f10-a50df961f64f:'driver_viewAll',
   9ead9b9e-ae47-4bb6-b790-6657f69d10c6:'driver_manage', a038a1a1-4868-4769-9329-5f23667e68f1:'employee_timetable_viewAll',
   ac43c5e7-d07d-4e79-9957-22f6e527fc78:'academic_year_viewAll',
    ae653bb5-96a8-46c5-9c4d-241c6db6d7f6:'create_assignments_manage', aef641c9-26a6-437b-bd87-6494a03e2b56:'attendance_information_manage',
    af35a8a1-c303-4f28-9168-a5eb2a869c57:'students_viewAll', b0013d92-4230-4f56-92db-0757a2568689:'event_types_manage',
    b1659bba-0eba-4749-82ce-3d5cda43bb61:'fee_scholarship_manage',
     bfc25d7f-8398-4514-8d8a-8485d1cfae4b:'fee_types_manage', c0032fa7-196c-4413-bd25-be68a32d4234:'transport_allocation_viewAll',
     c45e1f8c-af95-4e56-9b6c-aad4cb94e55a:'roles_viewAll',
     cbf8bbcb-ed61-4a5c-affa-682a71c51c8b:'create_events_viewAll', cc5bedf5-b6b9-4f35-91d8-37fc1f710ffe:'assignment_types_manage',
     cc8491e5-c937-4d9e-acf9-18f46a7c58e2:'section_list_viewAll', cd80cf94-8908-4ba1-85d0-543a2044f418:'employee_timetable_manage',
     ce9e4499-a634-49bb-a357-77dbc57024d4:'create_timetable_manage', cf20acc6-cff1-4637-9224-137ec930540f:'transport_allocation_manage',
     d2d1a73d-c7ee-4fec-a35c-938168a8a536:'event_types_viewAll', d5d2bb7c-be5c-4c8c-8de3-ddaacf7176a4:'create_timetable_viewAll',
     d82461b5-3f0c-4c98-ae0e-c52ffe774c86:'assign_roles_manage',
      dbcb3b81-2e14-4b8d-9c35-2c9055cedd14:'roles_manage', e01524b2-c6e3-467c-ae20-d9743c2b412c:'special_timetable_viewAll',
      e0f26b04-e23d-414f-bafb-76e03b86c3df:'fee_types_viewAll', e5db9fa9-80f0-4fef-9583-04ee16d4cc85:'employee_timetable_viewAll',
      ed03c990-65bf-4305-8e77-ac16d0444b88:'section_allocation_viewAll', ede69e8d-1828-4bc3-8f69-266cdbb34295:'subject_allocation_viewAll',
      ee84f394-449e-402f-91e9-193bc7935333:'departments_viewAll', f23e2b48-6c14-4432-9a81-14731f8beba5:'assign_fees_manage',
      f3b3b387-1aab-46cd-b4fc-3fb391c6379c:'tracking_viewAll', f47b0095-476b-4744-b9d3-5a1565ea37db:'assignment_types_viewAll',
f56d3b5c-8b3d-4e74-8e37-0e910fe84e5e:'academic_year_manage', fb377446-9a34-4eb0-ae5f-afe556d5364a:'communication_manage',
fc2e90aa-7a91-413a-9176-2bd48491afc1:'attendance_history_viewAll', fd0569c5-e40a-43da-865f-fcddd16d458b:'assign_roles_viewAll',
8e6e1ec1-bb8c-4fcd-8062-04e79dffb74e:'gallery_manage', 5e0a4084-9c60-4f8b-9ef4-378238b644c0: 'gallery_viewAll',
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

INSERT INTO nsa.school_feature (tenant_id,school_id,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text) VALUES ( d04943a0-d175-11e6-a2c8-c95cdbee5e46, 92f7300e-a0b0-4828-b405-a2406b139941,f4a8991a-2638-49fd-a0a2-a61bf06228b3,3,'2017-05-03 16:23:50',NULL,'439b6d5b-c081-4077-b1f0-4875e9532c64/f4a8991a-2638-49fd-a0a2-a61bf06228b3/',NULL,NULL,NULL,false,'2018-12-31 16:23:50',7cb5d88f-2bf2-48b2-a6aa-f4c86168197a,'Activity Types','icon-medal',NULL,NULL,'./activity-types',439b6d5b-c081-4077-b1f0-4875e9532c64,true,'ST ALOYSIOUS CONVENT ISC SCHOOL',true,false,NULL,'Activity Types',['Employee', 'SchoolAdmin'],true,false,'');

//For ST Aloysious End


//For SRV Start

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES ( 258d86d0-4838-11e7-a107-07cfd493dd84,34e6bb25-9d8d-434d-b42f-0e825057ed59,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (
258d86d0-4838-11e7-a107-07cfd493dd84,34e6bb25-9d8d-434d-b42f-0e825057ed59,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
{05152ab9-5ad8-48e7-8bcb-788d5e561821:'fee_structure_viewAll', 08664b30-0505-44d5-ab2e-45515d3c5f18:'leave_types_viewAll', 095294c9-4afb-4fc8-89b6-6491bf5c93f1:'fee_scholarship_viewAll',
 0984dbac-09cb-4801-924f-5c613bcb2525:'event_venues_viewAll', 0f734127-341b-4200-8bff-782481c08090:'my_leaves_viewAll', 1de0f9c9-2a99-40e4-8b57-0279fa303d6b:'designation_viewAll',
  21931a6c-2d9a-4337-89d1-7633ad329e33:'holidays_viewAll',
 23cf970e-cc44-43cd-8867-feeee53c9bb6:'timetable_configuration_manage', 2468f067-a431-4c27-8514-611fd20d4575:'leaves_approval_manage',
 24827e96-7ca1-43a2-86fd-9dac87abddc4:'attendance_history_manage', 2fc09cc1-a7f8-4877-acfc-3b9feb10d228:'route_viewAll',
  34929530-f20a-4a7b-a7af-f1bd30fbba4a:'timetable_configuration_viewAll', 39034235-d161-433a-92a4-bd91b17df2d3:'attendance_information_viewAll',
  3a618470-afd7-49c3-9d37-763051f7ac54:'create_assignments_viewAll', 3acc394b-c375-4d57-8387-723edbe2aab1:'route_manage',
   4132c89f-b267-4dd5-870f-9e0d074d6a8e:'holiday_types_viewAll', 46e50339-7c6a-42c5-bcb2-f734d9baab98:'assign_fees_viewAll',
   4bc16ed9-1911-4788-af72-48fe911600d6:'event_venues_manage', 4d085c04-4e24-4826-aa57-ed60f427ea01:'create_events_manage',
4d108a51-381c-49c3-802f-4689049dfadb:'notification_viewAll',
52a0ffbc-d794-43d8-b3b4-f77963ccb02c:'tracking_manage', 564e30fe-f3ba-402c-a728-aeb19ae193f8:'communication_viewAll',
5e95f6ef-c96b-44dc-a664-080be05600d7:'class_viewAll', 621c77c0-baba-4803-b409-fd7ea5920f47:'special_timetable_manage',
 6a0d0f00-7b97-499c-b5e2-69fa680d1e0b:'leave_assignments_viewAll',
 6e0ca880-2ab1-4048-a807-7340c6bf0a6f:'leaves_approval_viewAll', 7926f20d-d293-4b45-8f0b-6ffe5369cbc4:'vehicle_viewAll',
 7b0e797d-c196-4e2b-86aa-72b1d423079e:'notification_manage', 7dcc58ff-1c91-4f73-bae9-754e0b732911:'vehicle_manage',
 7ead6aa6-d4da-4788-b084-824f72808ddd:'subject_list_viewAll', 802a5cab-a376-4350-a017-abf4dba63fa1:'my_leaves_manage',
  803f4ec8-fa98-43cf-8316-b33d8804b592:'employees_viewAll', 80663430-9909-4145-aae1-c121a93d2acb:'fee_structure_manage',
  8db7451c-d3ad-4cb1-abbe-c9158479a5ba:'employee_timetable_manage', 95379f58-6577-4ba1-9f10-a50df961f64f:'driver_viewAll',
   9ead9b9e-ae47-4bb6-b790-6657f69d10c6:'driver_manage', a038a1a1-4868-4769-9329-5f23667e68f1:'employee_timetable_viewAll',
   ac43c5e7-d07d-4e79-9957-22f6e527fc78:'academic_year_viewAll',
    ae653bb5-96a8-46c5-9c4d-241c6db6d7f6:'create_assignments_manage', aef641c9-26a6-437b-bd87-6494a03e2b56:'attendance_information_manage',
    af35a8a1-c303-4f28-9168-a5eb2a869c57:'students_viewAll', b0013d92-4230-4f56-92db-0757a2568689:'event_types_manage',
    b1659bba-0eba-4749-82ce-3d5cda43bb61:'fee_scholarship_manage',
     bfc25d7f-8398-4514-8d8a-8485d1cfae4b:'fee_types_manage', c0032fa7-196c-4413-bd25-be68a32d4234:'transport_allocation_viewAll',
     c45e1f8c-af95-4e56-9b6c-aad4cb94e55a:'roles_viewAll',
     cbf8bbcb-ed61-4a5c-affa-682a71c51c8b:'create_events_viewAll', cc5bedf5-b6b9-4f35-91d8-37fc1f710ffe:'assignment_types_manage',
     cc8491e5-c937-4d9e-acf9-18f46a7c58e2:'section_list_viewAll', cd80cf94-8908-4ba1-85d0-543a2044f418:'employee_timetable_manage',
     ce9e4499-a634-49bb-a357-77dbc57024d4:'create_timetable_manage', cf20acc6-cff1-4637-9224-137ec930540f:'transport_allocation_manage',
     d2d1a73d-c7ee-4fec-a35c-938168a8a536:'event_types_viewAll', d5d2bb7c-be5c-4c8c-8de3-ddaacf7176a4:'create_timetable_viewAll',
     d82461b5-3f0c-4c98-ae0e-c52ffe774c86:'assign_roles_manage',
      dbcb3b81-2e14-4b8d-9c35-2c9055cedd14:'roles_manage', e01524b2-c6e3-467c-ae20-d9743c2b412c:'special_timetable_viewAll',
      e0f26b04-e23d-414f-bafb-76e03b86c3df:'fee_types_viewAll', e5db9fa9-80f0-4fef-9583-04ee16d4cc85:'employee_timetable_viewAll',
      ed03c990-65bf-4305-8e77-ac16d0444b88:'section_allocation_viewAll', ede69e8d-1828-4bc3-8f69-266cdbb34295:'subject_allocation_viewAll',
      ee84f394-449e-402f-91e9-193bc7935333:'departments_viewAll', f23e2b48-6c14-4432-9a81-14731f8beba5:'assign_fees_manage',
      f3b3b387-1aab-46cd-b4fc-3fb391c6379c:'tracking_viewAll', f47b0095-476b-4744-b9d3-5a1565ea37db:'assignment_types_viewAll',
f56d3b5c-8b3d-4e74-8e37-0e910fe84e5e:'academic_year_manage', fb377446-9a34-4eb0-ae5f-afe556d5364a:'communication_manage',
fc2e90aa-7a91-413a-9176-2bd48491afc1:'attendance_history_viewAll', fd0569c5-e40a-43da-865f-fcddd16d458b:'assign_roles_viewAll',
8e6e1ec1-bb8c-4fcd-8062-04e79dffb74e:'gallery_manage', 5e0a4084-9c60-4f8b-9ef4-378238b644c0: 'gallery_viewAll',
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

INSERT INTO nsa.school_feature (tenant_id,school_id,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text) VALUES ( 258d86d0-4838-11e7-a107-07cfd493dd84,34e6bb25-9d8d-434d-b42f-0e825057ed59,f4a8991a-2638-49fd-a0a2-a61bf06228b3,3,'2017-05-03 16:23:50',NULL,'439b6d5b-c081-4077-b1f0-4875e9532c64/f4a8991a-2638-49fd-a0a2-a61bf06228b3/',NULL,NULL,NULL,false,'2018-12-31 16:23:50',7cb5d88f-2bf2-48b2-a6aa-f4c86168197a,'Activity Types','icon-medal',NULL,NULL,'./activity-types',439b6d5b-c081-4077-b1f0-4875e9532c64,true,'Saraswathi Ramachandran Vidyalaya Matric Higher Secondary School',true,false,NULL,'Activity Types',['Employee', 'SchoolAdmin'],true,false,'');

//For SRV End


//For Bashyam Start

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES ( 4cdbd690-24d1-11e7-9a7c-1108ffd2d102,7ca3fad4-a571-495e-be1b-ac25de3a2009,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (
4cdbd690-24d1-11e7-9a7c-1108ffd2d102,7ca3fad4-a571-495e-be1b-ac25de3a2009,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
{05152ab9-5ad8-48e7-8bcb-788d5e561821:'fee_structure_viewAll', 08664b30-0505-44d5-ab2e-45515d3c5f18:'leave_types_viewAll', 095294c9-4afb-4fc8-89b6-6491bf5c93f1:'fee_scholarship_viewAll',
 0984dbac-09cb-4801-924f-5c613bcb2525:'event_venues_viewAll', 0f734127-341b-4200-8bff-782481c08090:'my_leaves_viewAll', 1de0f9c9-2a99-40e4-8b57-0279fa303d6b:'designation_viewAll',
  21931a6c-2d9a-4337-89d1-7633ad329e33:'holidays_viewAll',
 23cf970e-cc44-43cd-8867-feeee53c9bb6:'timetable_configuration_manage', 2468f067-a431-4c27-8514-611fd20d4575:'leaves_approval_manage',
 24827e96-7ca1-43a2-86fd-9dac87abddc4:'attendance_history_manage', 2fc09cc1-a7f8-4877-acfc-3b9feb10d228:'route_viewAll',
  34929530-f20a-4a7b-a7af-f1bd30fbba4a:'timetable_configuration_viewAll', 39034235-d161-433a-92a4-bd91b17df2d3:'attendance_information_viewAll',
  3a618470-afd7-49c3-9d37-763051f7ac54:'create_assignments_viewAll', 3acc394b-c375-4d57-8387-723edbe2aab1:'route_manage',
   4132c89f-b267-4dd5-870f-9e0d074d6a8e:'holiday_types_viewAll', 46e50339-7c6a-42c5-bcb2-f734d9baab98:'assign_fees_viewAll',
   4bc16ed9-1911-4788-af72-48fe911600d6:'event_venues_manage', 4d085c04-4e24-4826-aa57-ed60f427ea01:'create_events_manage',
4d108a51-381c-49c3-802f-4689049dfadb:'notification_viewAll',
52a0ffbc-d794-43d8-b3b4-f77963ccb02c:'tracking_manage', 564e30fe-f3ba-402c-a728-aeb19ae193f8:'communication_viewAll',
5e95f6ef-c96b-44dc-a664-080be05600d7:'class_viewAll', 621c77c0-baba-4803-b409-fd7ea5920f47:'special_timetable_manage',
 6a0d0f00-7b97-499c-b5e2-69fa680d1e0b:'leave_assignments_viewAll',
 6e0ca880-2ab1-4048-a807-7340c6bf0a6f:'leaves_approval_viewAll', 7926f20d-d293-4b45-8f0b-6ffe5369cbc4:'vehicle_viewAll',
 7b0e797d-c196-4e2b-86aa-72b1d423079e:'notification_manage', 7dcc58ff-1c91-4f73-bae9-754e0b732911:'vehicle_manage',
 7ead6aa6-d4da-4788-b084-824f72808ddd:'subject_list_viewAll', 802a5cab-a376-4350-a017-abf4dba63fa1:'my_leaves_manage',
  803f4ec8-fa98-43cf-8316-b33d8804b592:'employees_viewAll', 80663430-9909-4145-aae1-c121a93d2acb:'fee_structure_manage',
  8db7451c-d3ad-4cb1-abbe-c9158479a5ba:'employee_timetable_manage', 95379f58-6577-4ba1-9f10-a50df961f64f:'driver_viewAll',
   9ead9b9e-ae47-4bb6-b790-6657f69d10c6:'driver_manage', a038a1a1-4868-4769-9329-5f23667e68f1:'employee_timetable_viewAll',
   ac43c5e7-d07d-4e79-9957-22f6e527fc78:'academic_year_viewAll',
    ae653bb5-96a8-46c5-9c4d-241c6db6d7f6:'create_assignments_manage', aef641c9-26a6-437b-bd87-6494a03e2b56:'attendance_information_manage',
    af35a8a1-c303-4f28-9168-a5eb2a869c57:'students_viewAll', b0013d92-4230-4f56-92db-0757a2568689:'event_types_manage',
    b1659bba-0eba-4749-82ce-3d5cda43bb61:'fee_scholarship_manage',
     bfc25d7f-8398-4514-8d8a-8485d1cfae4b:'fee_types_manage', c0032fa7-196c-4413-bd25-be68a32d4234:'transport_allocation_viewAll',
     c45e1f8c-af95-4e56-9b6c-aad4cb94e55a:'roles_viewAll',
     cbf8bbcb-ed61-4a5c-affa-682a71c51c8b:'create_events_viewAll', cc5bedf5-b6b9-4f35-91d8-37fc1f710ffe:'assignment_types_manage',
     cc8491e5-c937-4d9e-acf9-18f46a7c58e2:'section_list_viewAll', cd80cf94-8908-4ba1-85d0-543a2044f418:'employee_timetable_manage',
     ce9e4499-a634-49bb-a357-77dbc57024d4:'create_timetable_manage', cf20acc6-cff1-4637-9224-137ec930540f:'transport_allocation_manage',
     d2d1a73d-c7ee-4fec-a35c-938168a8a536:'event_types_viewAll', d5d2bb7c-be5c-4c8c-8de3-ddaacf7176a4:'create_timetable_viewAll',
     d82461b5-3f0c-4c98-ae0e-c52ffe774c86:'assign_roles_manage',
      dbcb3b81-2e14-4b8d-9c35-2c9055cedd14:'roles_manage', e01524b2-c6e3-467c-ae20-d9743c2b412c:'special_timetable_viewAll',
      e0f26b04-e23d-414f-bafb-76e03b86c3df:'fee_types_viewAll', e5db9fa9-80f0-4fef-9583-04ee16d4cc85:'employee_timetable_viewAll',
      ed03c990-65bf-4305-8e77-ac16d0444b88:'section_allocation_viewAll', ede69e8d-1828-4bc3-8f69-266cdbb34295:'subject_allocation_viewAll',
      ee84f394-449e-402f-91e9-193bc7935333:'departments_viewAll', f23e2b48-6c14-4432-9a81-14731f8beba5:'assign_fees_manage',
      f3b3b387-1aab-46cd-b4fc-3fb391c6379c:'tracking_viewAll', f47b0095-476b-4744-b9d3-5a1565ea37db:'assignment_types_viewAll',
f56d3b5c-8b3d-4e74-8e37-0e910fe84e5e:'academic_year_manage', fb377446-9a34-4eb0-ae5f-afe556d5364a:'communication_manage',
fc2e90aa-7a91-413a-9176-2bd48491afc1:'attendance_history_viewAll', fd0569c5-e40a-43da-865f-fcddd16d458b:'assign_roles_viewAll',
8e6e1ec1-bb8c-4fcd-8062-04e79dffb74e:'gallery_manage', 5e0a4084-9c60-4f8b-9ef4-378238b644c0: 'gallery_viewAll',
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

INSERT INTO nsa.school_feature (tenant_id,school_id,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text) VALUES ( 4cdbd690-24d1-11e7-9a7c-1108ffd2d102,7ca3fad4-a571-495e-be1b-ac25de3a2009,f4a8991a-2638-49fd-a0a2-a61bf06228b3,3,'2017-05-03 16:23:50',NULL,'439b6d5b-c081-4077-b1f0-4875e9532c64/f4a8991a-2638-49fd-a0a2-a61bf06228b3/',NULL,NULL,NULL,false,'2018-12-31 16:23:50',7cb5d88f-2bf2-48b2-a6aa-f4c86168197a,'Activity Types','icon-medal',NULL,NULL,'./activity-types',439b6d5b-c081-4077-b1f0-4875e9532c64,true,'BHASHYAM BLOOMS',true,false,NULL,'Activity Types',['Employee', 'SchoolAdmin'],true,false,'');

//For Bashyam End

//For ST RITAS Start

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES ( 214a6e60-4da8-11e7-8abe-adec971199c2, 81f43ec4-a62c-4809-b8d4-c638f01d875f,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (
214a6e60-4da8-11e7-8abe-adec971199c2, 81f43ec4-a62c-4809-b8d4-c638f01d875f,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
{05152ab9-5ad8-48e7-8bcb-788d5e561821:'fee_structure_viewAll', 08664b30-0505-44d5-ab2e-45515d3c5f18:'leave_types_viewAll', 095294c9-4afb-4fc8-89b6-6491bf5c93f1:'fee_scholarship_viewAll',
 0984dbac-09cb-4801-924f-5c613bcb2525:'event_venues_viewAll', 0f734127-341b-4200-8bff-782481c08090:'my_leaves_viewAll', 1de0f9c9-2a99-40e4-8b57-0279fa303d6b:'designation_viewAll',
  21931a6c-2d9a-4337-89d1-7633ad329e33:'holidays_viewAll',
 23cf970e-cc44-43cd-8867-feeee53c9bb6:'timetable_configuration_manage', 2468f067-a431-4c27-8514-611fd20d4575:'leaves_approval_manage',
 24827e96-7ca1-43a2-86fd-9dac87abddc4:'attendance_history_manage', 2fc09cc1-a7f8-4877-acfc-3b9feb10d228:'route_viewAll',
  34929530-f20a-4a7b-a7af-f1bd30fbba4a:'timetable_configuration_viewAll', 39034235-d161-433a-92a4-bd91b17df2d3:'attendance_information_viewAll',
  3a618470-afd7-49c3-9d37-763051f7ac54:'create_assignments_viewAll', 3acc394b-c375-4d57-8387-723edbe2aab1:'route_manage',
   4132c89f-b267-4dd5-870f-9e0d074d6a8e:'holiday_types_viewAll', 46e50339-7c6a-42c5-bcb2-f734d9baab98:'assign_fees_viewAll',
   4bc16ed9-1911-4788-af72-48fe911600d6:'event_venues_manage', 4d085c04-4e24-4826-aa57-ed60f427ea01:'create_events_manage',
4d108a51-381c-49c3-802f-4689049dfadb:'notification_viewAll',
52a0ffbc-d794-43d8-b3b4-f77963ccb02c:'tracking_manage', 564e30fe-f3ba-402c-a728-aeb19ae193f8:'communication_viewAll',
5e95f6ef-c96b-44dc-a664-080be05600d7:'class_viewAll', 621c77c0-baba-4803-b409-fd7ea5920f47:'special_timetable_manage',
 6a0d0f00-7b97-499c-b5e2-69fa680d1e0b:'leave_assignments_viewAll',
 6e0ca880-2ab1-4048-a807-7340c6bf0a6f:'leaves_approval_viewAll', 7926f20d-d293-4b45-8f0b-6ffe5369cbc4:'vehicle_viewAll',
 7b0e797d-c196-4e2b-86aa-72b1d423079e:'notification_manage', 7dcc58ff-1c91-4f73-bae9-754e0b732911:'vehicle_manage',
 7ead6aa6-d4da-4788-b084-824f72808ddd:'subject_list_viewAll', 802a5cab-a376-4350-a017-abf4dba63fa1:'my_leaves_manage',
  803f4ec8-fa98-43cf-8316-b33d8804b592:'employees_viewAll', 80663430-9909-4145-aae1-c121a93d2acb:'fee_structure_manage',
  8db7451c-d3ad-4cb1-abbe-c9158479a5ba:'employee_timetable_manage', 95379f58-6577-4ba1-9f10-a50df961f64f:'driver_viewAll',
   9ead9b9e-ae47-4bb6-b790-6657f69d10c6:'driver_manage', a038a1a1-4868-4769-9329-5f23667e68f1:'employee_timetable_viewAll',
   ac43c5e7-d07d-4e79-9957-22f6e527fc78:'academic_year_viewAll',
    ae653bb5-96a8-46c5-9c4d-241c6db6d7f6:'create_assignments_manage', aef641c9-26a6-437b-bd87-6494a03e2b56:'attendance_information_manage',
    af35a8a1-c303-4f28-9168-a5eb2a869c57:'students_viewAll', b0013d92-4230-4f56-92db-0757a2568689:'event_types_manage',
    b1659bba-0eba-4749-82ce-3d5cda43bb61:'fee_scholarship_manage',
     bfc25d7f-8398-4514-8d8a-8485d1cfae4b:'fee_types_manage', c0032fa7-196c-4413-bd25-be68a32d4234:'transport_allocation_viewAll',
     c45e1f8c-af95-4e56-9b6c-aad4cb94e55a:'roles_viewAll',
     cbf8bbcb-ed61-4a5c-affa-682a71c51c8b:'create_events_viewAll', cc5bedf5-b6b9-4f35-91d8-37fc1f710ffe:'assignment_types_manage',
     cc8491e5-c937-4d9e-acf9-18f46a7c58e2:'section_list_viewAll', cd80cf94-8908-4ba1-85d0-543a2044f418:'employee_timetable_manage',
     ce9e4499-a634-49bb-a357-77dbc57024d4:'create_timetable_manage', cf20acc6-cff1-4637-9224-137ec930540f:'transport_allocation_manage',
     d2d1a73d-c7ee-4fec-a35c-938168a8a536:'event_types_viewAll', d5d2bb7c-be5c-4c8c-8de3-ddaacf7176a4:'create_timetable_viewAll',
     d82461b5-3f0c-4c98-ae0e-c52ffe774c86:'assign_roles_manage',
      dbcb3b81-2e14-4b8d-9c35-2c9055cedd14:'roles_manage', e01524b2-c6e3-467c-ae20-d9743c2b412c:'special_timetable_viewAll',
      e0f26b04-e23d-414f-bafb-76e03b86c3df:'fee_types_viewAll', e5db9fa9-80f0-4fef-9583-04ee16d4cc85:'employee_timetable_viewAll',
      ed03c990-65bf-4305-8e77-ac16d0444b88:'section_allocation_viewAll', ede69e8d-1828-4bc3-8f69-266cdbb34295:'subject_allocation_viewAll',
      ee84f394-449e-402f-91e9-193bc7935333:'departments_viewAll', f23e2b48-6c14-4432-9a81-14731f8beba5:'assign_fees_manage',
      f3b3b387-1aab-46cd-b4fc-3fb391c6379c:'tracking_viewAll', f47b0095-476b-4744-b9d3-5a1565ea37db:'assignment_types_viewAll',
f56d3b5c-8b3d-4e74-8e37-0e910fe84e5e:'academic_year_manage', fb377446-9a34-4eb0-ae5f-afe556d5364a:'communication_manage',
fc2e90aa-7a91-413a-9176-2bd48491afc1:'attendance_history_viewAll', fd0569c5-e40a-43da-865f-fcddd16d458b:'assign_roles_viewAll',
8e6e1ec1-bb8c-4fcd-8062-04e79dffb74e:'gallery_manage', 5e0a4084-9c60-4f8b-9ef4-378238b644c0: 'gallery_viewAll',
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

INSERT INTO nsa.school_feature (tenant_id,school_id,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text) VALUES ( 214a6e60-4da8-11e7-8abe-adec971199c2, 81f43ec4-a62c-4809-b8d4-c638f01d875f,f4a8991a-2638-49fd-a0a2-a61bf06228b3,3,'2017-05-03 16:23:50',NULL,'439b6d5b-c081-4077-b1f0-4875e9532c64/f4a8991a-2638-49fd-a0a2-a61bf06228b3/',NULL,NULL,NULL,false,'2018-12-31 16:23:50',7cb5d88f-2bf2-48b2-a6aa-f4c86168197a,'Activity Types','icon-medal',NULL,NULL,'./activity-types',439b6d5b-c081-4077-b1f0-4875e9532c64,true,'ST RITAS',true,false,NULL,'Activity Types',['Employee', 'SchoolAdmin'],true,false,'');

//For ST RITAS End


//For auxilium Start

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES ( be3184d0-500e-11e7-9f5f-87d439384c1d,6833e9cd-a70b-4a63-ab6c-0cdaef4a440c,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (
be3184d0-500e-11e7-9f5f-87d439384c1d,6833e9cd-a70b-4a63-ab6c-0cdaef4a440c,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
{05152ab9-5ad8-48e7-8bcb-788d5e561821:'fee_structure_viewAll', 08664b30-0505-44d5-ab2e-45515d3c5f18:'leave_types_viewAll', 095294c9-4afb-4fc8-89b6-6491bf5c93f1:'fee_scholarship_viewAll',
 0984dbac-09cb-4801-924f-5c613bcb2525:'event_venues_viewAll', 0f734127-341b-4200-8bff-782481c08090:'my_leaves_viewAll', 1de0f9c9-2a99-40e4-8b57-0279fa303d6b:'designation_viewAll',
  21931a6c-2d9a-4337-89d1-7633ad329e33:'holidays_viewAll',
 23cf970e-cc44-43cd-8867-feeee53c9bb6:'timetable_configuration_manage', 2468f067-a431-4c27-8514-611fd20d4575:'leaves_approval_manage',
 24827e96-7ca1-43a2-86fd-9dac87abddc4:'attendance_history_manage', 2fc09cc1-a7f8-4877-acfc-3b9feb10d228:'route_viewAll',
  34929530-f20a-4a7b-a7af-f1bd30fbba4a:'timetable_configuration_viewAll', 39034235-d161-433a-92a4-bd91b17df2d3:'attendance_information_viewAll',
  3a618470-afd7-49c3-9d37-763051f7ac54:'create_assignments_viewAll', 3acc394b-c375-4d57-8387-723edbe2aab1:'route_manage',
   4132c89f-b267-4dd5-870f-9e0d074d6a8e:'holiday_types_viewAll', 46e50339-7c6a-42c5-bcb2-f734d9baab98:'assign_fees_viewAll',
   4bc16ed9-1911-4788-af72-48fe911600d6:'event_venues_manage', 4d085c04-4e24-4826-aa57-ed60f427ea01:'create_events_manage',
4d108a51-381c-49c3-802f-4689049dfadb:'notification_viewAll',
52a0ffbc-d794-43d8-b3b4-f77963ccb02c:'tracking_manage', 564e30fe-f3ba-402c-a728-aeb19ae193f8:'communication_viewAll',
5e95f6ef-c96b-44dc-a664-080be05600d7:'class_viewAll', 621c77c0-baba-4803-b409-fd7ea5920f47:'special_timetable_manage',
 6a0d0f00-7b97-499c-b5e2-69fa680d1e0b:'leave_assignments_viewAll',
 6e0ca880-2ab1-4048-a807-7340c6bf0a6f:'leaves_approval_viewAll', 7926f20d-d293-4b45-8f0b-6ffe5369cbc4:'vehicle_viewAll',
 7b0e797d-c196-4e2b-86aa-72b1d423079e:'notification_manage', 7dcc58ff-1c91-4f73-bae9-754e0b732911:'vehicle_manage',
 7ead6aa6-d4da-4788-b084-824f72808ddd:'subject_list_viewAll', 802a5cab-a376-4350-a017-abf4dba63fa1:'my_leaves_manage',
  803f4ec8-fa98-43cf-8316-b33d8804b592:'employees_viewAll', 80663430-9909-4145-aae1-c121a93d2acb:'fee_structure_manage',
  8db7451c-d3ad-4cb1-abbe-c9158479a5ba:'employee_timetable_manage', 95379f58-6577-4ba1-9f10-a50df961f64f:'driver_viewAll',
   9ead9b9e-ae47-4bb6-b790-6657f69d10c6:'driver_manage', a038a1a1-4868-4769-9329-5f23667e68f1:'employee_timetable_viewAll',
   ac43c5e7-d07d-4e79-9957-22f6e527fc78:'academic_year_viewAll',
    ae653bb5-96a8-46c5-9c4d-241c6db6d7f6:'create_assignments_manage', aef641c9-26a6-437b-bd87-6494a03e2b56:'attendance_information_manage',
    af35a8a1-c303-4f28-9168-a5eb2a869c57:'students_viewAll', b0013d92-4230-4f56-92db-0757a2568689:'event_types_manage',
    b1659bba-0eba-4749-82ce-3d5cda43bb61:'fee_scholarship_manage',
     bfc25d7f-8398-4514-8d8a-8485d1cfae4b:'fee_types_manage', c0032fa7-196c-4413-bd25-be68a32d4234:'transport_allocation_viewAll',
     c45e1f8c-af95-4e56-9b6c-aad4cb94e55a:'roles_viewAll',
     cbf8bbcb-ed61-4a5c-affa-682a71c51c8b:'create_events_viewAll', cc5bedf5-b6b9-4f35-91d8-37fc1f710ffe:'assignment_types_manage',
     cc8491e5-c937-4d9e-acf9-18f46a7c58e2:'section_list_viewAll', cd80cf94-8908-4ba1-85d0-543a2044f418:'employee_timetable_manage',
     ce9e4499-a634-49bb-a357-77dbc57024d4:'create_timetable_manage', cf20acc6-cff1-4637-9224-137ec930540f:'transport_allocation_manage',
     d2d1a73d-c7ee-4fec-a35c-938168a8a536:'event_types_viewAll', d5d2bb7c-be5c-4c8c-8de3-ddaacf7176a4:'create_timetable_viewAll',
     d82461b5-3f0c-4c98-ae0e-c52ffe774c86:'assign_roles_manage',
      dbcb3b81-2e14-4b8d-9c35-2c9055cedd14:'roles_manage', e01524b2-c6e3-467c-ae20-d9743c2b412c:'special_timetable_viewAll',
      e0f26b04-e23d-414f-bafb-76e03b86c3df:'fee_types_viewAll', e5db9fa9-80f0-4fef-9583-04ee16d4cc85:'employee_timetable_viewAll',
      ed03c990-65bf-4305-8e77-ac16d0444b88:'section_allocation_viewAll', ede69e8d-1828-4bc3-8f69-266cdbb34295:'subject_allocation_viewAll',
      ee84f394-449e-402f-91e9-193bc7935333:'departments_viewAll', f23e2b48-6c14-4432-9a81-14731f8beba5:'assign_fees_manage',
      f3b3b387-1aab-46cd-b4fc-3fb391c6379c:'tracking_viewAll', f47b0095-476b-4744-b9d3-5a1565ea37db:'assignment_types_viewAll',
f56d3b5c-8b3d-4e74-8e37-0e910fe84e5e:'academic_year_manage', fb377446-9a34-4eb0-ae5f-afe556d5364a:'communication_manage',
fc2e90aa-7a91-413a-9176-2bd48491afc1:'attendance_history_viewAll', fd0569c5-e40a-43da-865f-fcddd16d458b:'assign_roles_viewAll',
8e6e1ec1-bb8c-4fcd-8062-04e79dffb74e:'gallery_manage', 5e0a4084-9c60-4f8b-9ef4-378238b644c0: 'gallery_viewAll',
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

INSERT INTO nsa.school_feature (tenant_id,school_id,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text) VALUES ( be3184d0-500e-11e7-9f5f-87d439384c1d,6833e9cd-a70b-4a63-ab6c-0cdaef4a440c,f4a8991a-2638-49fd-a0a2-a61bf06228b3,3,'2017-05-03 16:23:50',NULL,'439b6d5b-c081-4077-b1f0-4875e9532c64/f4a8991a-2638-49fd-a0a2-a61bf06228b3/',NULL,NULL,NULL,false,'2018-12-31 16:23:50',7cb5d88f-2bf2-48b2-a6aa-f4c86168197a,'Activity Types','icon-medal',NULL,NULL,'./activity-types',439b6d5b-c081-4077-b1f0-4875e9532c64,true,'Auxilium English Medium School',true,false,NULL,'Activity Types',['Employee', 'SchoolAdmin'],true,false,'');

//For auxilium End


//For stpatric Start

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES ( 32aaa410-51d4-11e7-8dc1-3b9c08d048b3,f5a5e341-0700-4ed1-b591-76807ae1e4d1,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (
32aaa410-51d4-11e7-8dc1-3b9c08d048b3,f5a5e341-0700-4ed1-b591-76807ae1e4d1,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
{05152ab9-5ad8-48e7-8bcb-788d5e561821:'fee_structure_viewAll', 08664b30-0505-44d5-ab2e-45515d3c5f18:'leave_types_viewAll', 095294c9-4afb-4fc8-89b6-6491bf5c93f1:'fee_scholarship_viewAll',
 0984dbac-09cb-4801-924f-5c613bcb2525:'event_venues_viewAll', 0f734127-341b-4200-8bff-782481c08090:'my_leaves_viewAll', 1de0f9c9-2a99-40e4-8b57-0279fa303d6b:'designation_viewAll',
  21931a6c-2d9a-4337-89d1-7633ad329e33:'holidays_viewAll',
 23cf970e-cc44-43cd-8867-feeee53c9bb6:'timetable_configuration_manage', 2468f067-a431-4c27-8514-611fd20d4575:'leaves_approval_manage',
 24827e96-7ca1-43a2-86fd-9dac87abddc4:'attendance_history_manage', 2fc09cc1-a7f8-4877-acfc-3b9feb10d228:'route_viewAll',
  34929530-f20a-4a7b-a7af-f1bd30fbba4a:'timetable_configuration_viewAll', 39034235-d161-433a-92a4-bd91b17df2d3:'attendance_information_viewAll',
  3a618470-afd7-49c3-9d37-763051f7ac54:'create_assignments_viewAll', 3acc394b-c375-4d57-8387-723edbe2aab1:'route_manage',
   4132c89f-b267-4dd5-870f-9e0d074d6a8e:'holiday_types_viewAll', 46e50339-7c6a-42c5-bcb2-f734d9baab98:'assign_fees_viewAll',
   4bc16ed9-1911-4788-af72-48fe911600d6:'event_venues_manage', 4d085c04-4e24-4826-aa57-ed60f427ea01:'create_events_manage',
4d108a51-381c-49c3-802f-4689049dfadb:'notification_viewAll',
52a0ffbc-d794-43d8-b3b4-f77963ccb02c:'tracking_manage', 564e30fe-f3ba-402c-a728-aeb19ae193f8:'communication_viewAll',
5e95f6ef-c96b-44dc-a664-080be05600d7:'class_viewAll', 621c77c0-baba-4803-b409-fd7ea5920f47:'special_timetable_manage',
 6a0d0f00-7b97-499c-b5e2-69fa680d1e0b:'leave_assignments_viewAll',
 6e0ca880-2ab1-4048-a807-7340c6bf0a6f:'leaves_approval_viewAll', 7926f20d-d293-4b45-8f0b-6ffe5369cbc4:'vehicle_viewAll',
 7b0e797d-c196-4e2b-86aa-72b1d423079e:'notification_manage', 7dcc58ff-1c91-4f73-bae9-754e0b732911:'vehicle_manage',
 7ead6aa6-d4da-4788-b084-824f72808ddd:'subject_list_viewAll', 802a5cab-a376-4350-a017-abf4dba63fa1:'my_leaves_manage',
  803f4ec8-fa98-43cf-8316-b33d8804b592:'employees_viewAll', 80663430-9909-4145-aae1-c121a93d2acb:'fee_structure_manage',
  8db7451c-d3ad-4cb1-abbe-c9158479a5ba:'employee_timetable_manage', 95379f58-6577-4ba1-9f10-a50df961f64f:'driver_viewAll',
   9ead9b9e-ae47-4bb6-b790-6657f69d10c6:'driver_manage', a038a1a1-4868-4769-9329-5f23667e68f1:'employee_timetable_viewAll',
   ac43c5e7-d07d-4e79-9957-22f6e527fc78:'academic_year_viewAll',
    ae653bb5-96a8-46c5-9c4d-241c6db6d7f6:'create_assignments_manage', aef641c9-26a6-437b-bd87-6494a03e2b56:'attendance_information_manage',
    af35a8a1-c303-4f28-9168-a5eb2a869c57:'students_viewAll', b0013d92-4230-4f56-92db-0757a2568689:'event_types_manage',
    b1659bba-0eba-4749-82ce-3d5cda43bb61:'fee_scholarship_manage',
     bfc25d7f-8398-4514-8d8a-8485d1cfae4b:'fee_types_manage', c0032fa7-196c-4413-bd25-be68a32d4234:'transport_allocation_viewAll',
     c45e1f8c-af95-4e56-9b6c-aad4cb94e55a:'roles_viewAll',
     cbf8bbcb-ed61-4a5c-affa-682a71c51c8b:'create_events_viewAll', cc5bedf5-b6b9-4f35-91d8-37fc1f710ffe:'assignment_types_manage',
     cc8491e5-c937-4d9e-acf9-18f46a7c58e2:'section_list_viewAll', cd80cf94-8908-4ba1-85d0-543a2044f418:'employee_timetable_manage',
     ce9e4499-a634-49bb-a357-77dbc57024d4:'create_timetable_manage', cf20acc6-cff1-4637-9224-137ec930540f:'transport_allocation_manage',
     d2d1a73d-c7ee-4fec-a35c-938168a8a536:'event_types_viewAll', d5d2bb7c-be5c-4c8c-8de3-ddaacf7176a4:'create_timetable_viewAll',
     d82461b5-3f0c-4c98-ae0e-c52ffe774c86:'assign_roles_manage',
      dbcb3b81-2e14-4b8d-9c35-2c9055cedd14:'roles_manage', e01524b2-c6e3-467c-ae20-d9743c2b412c:'special_timetable_viewAll',
      e0f26b04-e23d-414f-bafb-76e03b86c3df:'fee_types_viewAll', e5db9fa9-80f0-4fef-9583-04ee16d4cc85:'employee_timetable_viewAll',
      ed03c990-65bf-4305-8e77-ac16d0444b88:'section_allocation_viewAll', ede69e8d-1828-4bc3-8f69-266cdbb34295:'subject_allocation_viewAll',
      ee84f394-449e-402f-91e9-193bc7935333:'departments_viewAll', f23e2b48-6c14-4432-9a81-14731f8beba5:'assign_fees_manage',
      f3b3b387-1aab-46cd-b4fc-3fb391c6379c:'tracking_viewAll', f47b0095-476b-4744-b9d3-5a1565ea37db:'assignment_types_viewAll',
f56d3b5c-8b3d-4e74-8e37-0e910fe84e5e:'academic_year_manage', fb377446-9a34-4eb0-ae5f-afe556d5364a:'communication_manage',
fc2e90aa-7a91-413a-9176-2bd48491afc1:'attendance_history_viewAll', fd0569c5-e40a-43da-865f-fcddd16d458b:'assign_roles_viewAll',
8e6e1ec1-bb8c-4fcd-8062-04e79dffb74e:'gallery_manage', 5e0a4084-9c60-4f8b-9ef4-378238b644c0: 'gallery_viewAll',
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

INSERT INTO nsa.school_feature (tenant_id,school_id,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text) VALUES ( 32aaa410-51d4-11e7-8dc1-3b9c08d048b3,f5a5e341-0700-4ed1-b591-76807ae1e4d1,f4a8991a-2638-49fd-a0a2-a61bf06228b3,3,'2017-05-03 16:23:50',NULL,'439b6d5b-c081-4077-b1f0-4875e9532c64/f4a8991a-2638-49fd-a0a2-a61bf06228b3/',NULL,NULL,NULL,false,'2018-12-31 16:23:50',7cb5d88f-2bf2-48b2-a6aa-f4c86168197a,'Activity Types','icon-medal',NULL,NULL,'./activity-types',439b6d5b-c081-4077-b1f0-4875e9532c64,true,'ST.PATRICKS ACADEMY HR. SEC. SCHOOL, DINDIGUL',true,false,NULL,'Activity Types',['Employee', 'SchoolAdmin'],true,false,'');

//For stpatric End

//For mahss Start

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES ( ac8989d0-557c-11e7-a9da-618c0b66b59e, 68306a4b-a57c-418a-be07-f82ac044b5c5,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (
ac8989d0-557c-11e7-a9da-618c0b66b59e, 68306a4b-a57c-418a-be07-f82ac044b5c5,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
{05152ab9-5ad8-48e7-8bcb-788d5e561821:'fee_structure_viewAll', 08664b30-0505-44d5-ab2e-45515d3c5f18:'leave_types_viewAll', 095294c9-4afb-4fc8-89b6-6491bf5c93f1:'fee_scholarship_viewAll',
 0984dbac-09cb-4801-924f-5c613bcb2525:'event_venues_viewAll', 0f734127-341b-4200-8bff-782481c08090:'my_leaves_viewAll', 1de0f9c9-2a99-40e4-8b57-0279fa303d6b:'designation_viewAll',
  21931a6c-2d9a-4337-89d1-7633ad329e33:'holidays_viewAll',
 23cf970e-cc44-43cd-8867-feeee53c9bb6:'timetable_configuration_manage', 2468f067-a431-4c27-8514-611fd20d4575:'leaves_approval_manage',
 24827e96-7ca1-43a2-86fd-9dac87abddc4:'attendance_history_manage', 2fc09cc1-a7f8-4877-acfc-3b9feb10d228:'route_viewAll',
  34929530-f20a-4a7b-a7af-f1bd30fbba4a:'timetable_configuration_viewAll', 39034235-d161-433a-92a4-bd91b17df2d3:'attendance_information_viewAll',
  3a618470-afd7-49c3-9d37-763051f7ac54:'create_assignments_viewAll', 3acc394b-c375-4d57-8387-723edbe2aab1:'route_manage',
   4132c89f-b267-4dd5-870f-9e0d074d6a8e:'holiday_types_viewAll', 46e50339-7c6a-42c5-bcb2-f734d9baab98:'assign_fees_viewAll',
   4bc16ed9-1911-4788-af72-48fe911600d6:'event_venues_manage', 4d085c04-4e24-4826-aa57-ed60f427ea01:'create_events_manage',
4d108a51-381c-49c3-802f-4689049dfadb:'notification_viewAll',
52a0ffbc-d794-43d8-b3b4-f77963ccb02c:'tracking_manage', 564e30fe-f3ba-402c-a728-aeb19ae193f8:'communication_viewAll',
5e95f6ef-c96b-44dc-a664-080be05600d7:'class_viewAll', 621c77c0-baba-4803-b409-fd7ea5920f47:'special_timetable_manage',
 6a0d0f00-7b97-499c-b5e2-69fa680d1e0b:'leave_assignments_viewAll',
 6e0ca880-2ab1-4048-a807-7340c6bf0a6f:'leaves_approval_viewAll', 7926f20d-d293-4b45-8f0b-6ffe5369cbc4:'vehicle_viewAll',
 7b0e797d-c196-4e2b-86aa-72b1d423079e:'notification_manage', 7dcc58ff-1c91-4f73-bae9-754e0b732911:'vehicle_manage',
 7ead6aa6-d4da-4788-b084-824f72808ddd:'subject_list_viewAll', 802a5cab-a376-4350-a017-abf4dba63fa1:'my_leaves_manage',
  803f4ec8-fa98-43cf-8316-b33d8804b592:'employees_viewAll', 80663430-9909-4145-aae1-c121a93d2acb:'fee_structure_manage',
  8db7451c-d3ad-4cb1-abbe-c9158479a5ba:'employee_timetable_manage', 95379f58-6577-4ba1-9f10-a50df961f64f:'driver_viewAll',
   9ead9b9e-ae47-4bb6-b790-6657f69d10c6:'driver_manage', a038a1a1-4868-4769-9329-5f23667e68f1:'employee_timetable_viewAll',
   ac43c5e7-d07d-4e79-9957-22f6e527fc78:'academic_year_viewAll',
    ae653bb5-96a8-46c5-9c4d-241c6db6d7f6:'create_assignments_manage', aef641c9-26a6-437b-bd87-6494a03e2b56:'attendance_information_manage',
    af35a8a1-c303-4f28-9168-a5eb2a869c57:'students_viewAll', b0013d92-4230-4f56-92db-0757a2568689:'event_types_manage',
    b1659bba-0eba-4749-82ce-3d5cda43bb61:'fee_scholarship_manage',
     bfc25d7f-8398-4514-8d8a-8485d1cfae4b:'fee_types_manage', c0032fa7-196c-4413-bd25-be68a32d4234:'transport_allocation_viewAll',
     c45e1f8c-af95-4e56-9b6c-aad4cb94e55a:'roles_viewAll',
     cbf8bbcb-ed61-4a5c-affa-682a71c51c8b:'create_events_viewAll', cc5bedf5-b6b9-4f35-91d8-37fc1f710ffe:'assignment_types_manage',
     cc8491e5-c937-4d9e-acf9-18f46a7c58e2:'section_list_viewAll', cd80cf94-8908-4ba1-85d0-543a2044f418:'employee_timetable_manage',
     ce9e4499-a634-49bb-a357-77dbc57024d4:'create_timetable_manage', cf20acc6-cff1-4637-9224-137ec930540f:'transport_allocation_manage',
     d2d1a73d-c7ee-4fec-a35c-938168a8a536:'event_types_viewAll', d5d2bb7c-be5c-4c8c-8de3-ddaacf7176a4:'create_timetable_viewAll',
     d82461b5-3f0c-4c98-ae0e-c52ffe774c86:'assign_roles_manage',
      dbcb3b81-2e14-4b8d-9c35-2c9055cedd14:'roles_manage', e01524b2-c6e3-467c-ae20-d9743c2b412c:'special_timetable_viewAll',
      e0f26b04-e23d-414f-bafb-76e03b86c3df:'fee_types_viewAll', e5db9fa9-80f0-4fef-9583-04ee16d4cc85:'employee_timetable_viewAll',
      ed03c990-65bf-4305-8e77-ac16d0444b88:'section_allocation_viewAll', ede69e8d-1828-4bc3-8f69-266cdbb34295:'subject_allocation_viewAll',
      ee84f394-449e-402f-91e9-193bc7935333:'departments_viewAll', f23e2b48-6c14-4432-9a81-14731f8beba5:'assign_fees_manage',
      f3b3b387-1aab-46cd-b4fc-3fb391c6379c:'tracking_viewAll', f47b0095-476b-4744-b9d3-5a1565ea37db:'assignment_types_viewAll',
f56d3b5c-8b3d-4e74-8e37-0e910fe84e5e:'academic_year_manage', fb377446-9a34-4eb0-ae5f-afe556d5364a:'communication_manage',
fc2e90aa-7a91-413a-9176-2bd48491afc1:'attendance_history_viewAll', fd0569c5-e40a-43da-865f-fcddd16d458b:'assign_roles_viewAll',
8e6e1ec1-bb8c-4fcd-8062-04e79dffb74e:'gallery_manage', 5e0a4084-9c60-4f8b-9ef4-378238b644c0: 'gallery_viewAll',
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

INSERT INTO nsa.school_feature (tenant_id,school_id,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override,help_text) VALUES ( ac8989d0-557c-11e7-a9da-618c0b66b59e, 68306a4b-a57c-418a-be07-f82ac044b5c5,f4a8991a-2638-49fd-a0a2-a61bf06228b3,3,'2017-05-03 16:23:50',NULL,'439b6d5b-c081-4077-b1f0-4875e9532c64/f4a8991a-2638-49fd-a0a2-a61bf06228b3/',NULL,NULL,NULL,false,'2018-12-31 16:23:50',7cb5d88f-2bf2-48b2-a6aa-f4c86168197a,'Activity Types','icon-medal',NULL,NULL,'./activity-types',439b6d5b-c081-4077-b1f0-4875e9532c64,true,'Madrasathul Anwar  Higher Secondary School Kodinhi',true,false,NULL,'Activity Types',['Employee', 'SchoolAdmin'],true,false,'');

//For mahss End


//staloysious
update nsa.school_feature set notify_hostelers = true where tenant_id = d04943a0-d175-11e6-a2c8-c95cdbee5e46 and school_id = 92f7300e-a0b0-4828-b405-a2406b139941 and id = bb03c817-92c1-40bf-ad55-4ccee6944097;
update nsa.school_feature set notify_hostelers = true where tenant_id = d04943a0-d175-11e6-a2c8-c95cdbee5e46 and school_id = 92f7300e-a0b0-4828-b405-a2406b139941 and id = 028c3dc5-c789-4c4f-b648-5d1e6ca79483;
update nsa.school_feature set notify_hostelers = true where tenant_id = d04943a0-d175-11e6-a2c8-c95cdbee5e46 and school_id = 92f7300e-a0b0-4828-b405-a2406b139941 and id = 0406595e-bf17-4896-b394-4b81d080526d;

//srv
update nsa.school_feature set notify_hostelers = true where tenant_id = 258d86d0-4838-11e7-a107-07cfd493dd84 and school_id = 34e6bb25-9d8d-434d-b42f-0e825057ed59 and id = bb03c817-92c1-40bf-ad55-4ccee6944097;
update nsa.school_feature set notify_hostelers = true where tenant_id = 258d86d0-4838-11e7-a107-07cfd493dd84 and school_id = 34e6bb25-9d8d-434d-b42f-0e825057ed59 and id = 028c3dc5-c789-4c4f-b648-5d1e6ca79483;
update nsa.school_feature set notify_hostelers = true where tenant_id = 258d86d0-4838-11e7-a107-07cfd493dd84 and school_id = 34e6bb25-9d8d-434d-b42f-0e825057ed59 and id = 0406595e-bf17-4896-b394-4b81d080526d;

//bashyam
update nsa.school_feature set notify_hostelers = false where tenant_id = 4cdbd690-24d1-11e7-9a7c-1108ffd2d102 and school_id = 7ca3fad4-a571-495e-be1b-ac25de3a2009 and id = bb03c817-92c1-40bf-ad55-4ccee6944097;
update nsa.school_feature set notify_hostelers = false where tenant_id = 4cdbd690-24d1-11e7-9a7c-1108ffd2d102 and school_id = 7ca3fad4-a571-495e-be1b-ac25de3a2009 and id = 028c3dc5-c789-4c4f-b648-5d1e6ca79483;
update nsa.school_feature set notify_hostelers = false where tenant_id = 4cdbd690-24d1-11e7-9a7c-1108ffd2d102 and school_id = 7ca3fad4-a571-495e-be1b-ac25de3a2009 and id = 0406595e-bf17-4896-b394-4b81d080526d;


//ritas
update nsa.school_feature set notify_hostelers = true where tenant_id = 214a6e60-4da8-11e7-8abe-adec971199c2 and school_id = 81f43ec4-a62c-4809-b8d4-c638f01d875f and id = bb03c817-92c1-40bf-ad55-4ccee6944097;
update nsa.school_feature set notify_hostelers = true where tenant_id = 214a6e60-4da8-11e7-8abe-adec971199c2 and school_id = 81f43ec4-a62c-4809-b8d4-c638f01d875f and id = 028c3dc5-c789-4c4f-b648-5d1e6ca79483;
update nsa.school_feature set notify_hostelers = true where tenant_id = 214a6e60-4da8-11e7-8abe-adec971199c2 and school_id = 81f43ec4-a62c-4809-b8d4-c638f01d875f and id = 0406595e-bf17-4896-b394-4b81d080526d;


//auxilium
update nsa.school_feature set notify_hostelers = true where tenant_id = be3184d0-500e-11e7-9f5f-87d439384c1d and school_id = 6833e9cd-a70b-4a63-ab6c-0cdaef4a440c and id = bb03c817-92c1-40bf-ad55-4ccee6944097;
update nsa.school_feature set notify_hostelers = true where tenant_id = be3184d0-500e-11e7-9f5f-87d439384c1d and school_id = 6833e9cd-a70b-4a63-ab6c-0cdaef4a440c and id = 028c3dc5-c789-4c4f-b648-5d1e6ca79483;
update nsa.school_feature set notify_hostelers = true where tenant_id = be3184d0-500e-11e7-9f5f-87d439384c1d and school_id = 6833e9cd-a70b-4a63-ab6c-0cdaef4a440c and id = 0406595e-bf17-4896-b394-4b81d080526d;

//patricks
update nsa.school_feature set notify_hostelers = true where tenant_id = 32aaa410-51d4-11e7-8dc1-3b9c08d048b3 and school_id = f5a5e341-0700-4ed1-b591-76807ae1e4d1 and id = bb03c817-92c1-40bf-ad55-4ccee6944097;
update nsa.school_feature set notify_hostelers = true where tenant_id = 32aaa410-51d4-11e7-8dc1-3b9c08d048b3 and school_id = f5a5e341-0700-4ed1-b591-76807ae1e4d1 and id = 028c3dc5-c789-4c4f-b648-5d1e6ca79483;
update nsa.school_feature set notify_hostelers = true where tenant_id = 32aaa410-51d4-11e7-8dc1-3b9c08d048b3 and school_id = f5a5e341-0700-4ed1-b591-76807ae1e4d1 and id = 0406595e-bf17-4896-b394-4b81d080526d;

//mahss
update nsa.school_feature set notify_hostelers = true where tenant_id = ac8989d0-557c-11e7-a9da-618c0b66b59e and school_id = 68306a4b-a57c-418a-be07-f82ac044b5c5 and id = bb03c817-92c1-40bf-ad55-4ccee6944097;
update nsa.school_feature set notify_hostelers = true where tenant_id = ac8989d0-557c-11e7-a9da-618c0b66b59e and school_id = 68306a4b-a57c-418a-be07-f82ac044b5c5 and id = 028c3dc5-c789-4c4f-b648-5d1e6ca79483;
update nsa.school_feature set notify_hostelers = true where tenant_id = ac8989d0-557c-11e7-a9da-618c0b66b59e and school_id = 68306a4b-a57c-418a-be07-f82ac044b5c5 and id = 0406595e-bf17-4896-b394-4b81d080526d;


//staloysious
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (73700598-8fa5-4c68-a445-9c4c24e1151c, 'Events',d04943a0-d175-11e6-a2c8-c95cdbee5e46, 92f7300e-a0b0-4828-b405-a2406b139941, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (96e2e795-5677-4bec-b50d-9958abddde94, 'Competitions',d04943a0-d175-11e6-a2c8-c95cdbee5e46, 92f7300e-a0b0-4828-b405-a2406b139941, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (189648ab-5831-48f9-ad84-a919338fd941, 'Extra-Curricular',d04943a0-d175-11e6-a2c8-c95cdbee5e46, 92f7300e-a0b0-4828-b405-a2406b139941, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (05f66738-919e-46e4-8dca-4a041c133da0, 'Co-Curricular',d04943a0-d175-11e6-a2c8-c95cdbee5e46, 92f7300e-a0b0-4828-b405-a2406b139941, 'Admin', 'Admin', toTimeStamp(now()));

//srv
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (73700598-8fa5-4c68-a445-9c4c24e1151c, 'Events',258d86d0-4838-11e7-a107-07cfd493dd84, 34e6bb25-9d8d-434d-b42f-0e825057ed59, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (96e2e795-5677-4bec-b50d-9958abddde94, 'Competitions',258d86d0-4838-11e7-a107-07cfd493dd84, 34e6bb25-9d8d-434d-b42f-0e825057ed59, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (189648ab-5831-48f9-ad84-a919338fd941, 'Extra-Curricular',258d86d0-4838-11e7-a107-07cfd493dd84, 34e6bb25-9d8d-434d-b42f-0e825057ed59, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (05f66738-919e-46e4-8dca-4a041c133da0, 'Co-Curricular',258d86d0-4838-11e7-a107-07cfd493dd84, 34e6bb25-9d8d-434d-b42f-0e825057ed59, 'Admin', 'Admin', toTimeStamp(now()));

//bashyam
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (73700598-8fa5-4c68-a445-9c4c24e1151c, 'Events',4cdbd690-24d1-11e7-9a7c-1108ffd2d102, 7ca3fad4-a571-495e-be1b-ac25de3a2009, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (96e2e795-5677-4bec-b50d-9958abddde94, 'Competitions',4cdbd690-24d1-11e7-9a7c-1108ffd2d102, 7ca3fad4-a571-495e-be1b-ac25de3a2009, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (189648ab-5831-48f9-ad84-a919338fd941, 'Extra-Curricular',4cdbd690-24d1-11e7-9a7c-1108ffd2d102, 7ca3fad4-a571-495e-be1b-ac25de3a2009, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (05f66738-919e-46e4-8dca-4a041c133da0, 'Co-Curricular',4cdbd690-24d1-11e7-9a7c-1108ffd2d102, 7ca3fad4-a571-495e-be1b-ac25de3a2009, 'Admin', 'Admin', toTimeStamp(now()));


//ritas
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (73700598-8fa5-4c68-a445-9c4c24e1151c, 'Events',214a6e60-4da8-11e7-8abe-adec971199c2, 81f43ec4-a62c-4809-b8d4-c638f01d875f, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (96e2e795-5677-4bec-b50d-9958abddde94, 'Competitions',214a6e60-4da8-11e7-8abe-adec971199c2, 81f43ec4-a62c-4809-b8d4-c638f01d875f, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (189648ab-5831-48f9-ad84-a919338fd941, 'Extra-Curricular',214a6e60-4da8-11e7-8abe-adec971199c2, 81f43ec4-a62c-4809-b8d4-c638f01d875f, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (05f66738-919e-46e4-8dca-4a041c133da0, 'Co-Curricular',214a6e60-4da8-11e7-8abe-adec971199c2, 81f43ec4-a62c-4809-b8d4-c638f01d875f, 'Admin', 'Admin', toTimeStamp(now()));

//auxilium
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (73700598-8fa5-4c68-a445-9c4c24e1151c, 'Events',be3184d0-500e-11e7-9f5f-87d439384c1d, 6833e9cd-a70b-4a63-ab6c-0cdaef4a440c, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (96e2e795-5677-4bec-b50d-9958abddde94, 'Competitions',be3184d0-500e-11e7-9f5f-87d439384c1d, 6833e9cd-a70b-4a63-ab6c-0cdaef4a440c, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (189648ab-5831-48f9-ad84-a919338fd941, 'Extra-Curricular',be3184d0-500e-11e7-9f5f-87d439384c1d, 6833e9cd-a70b-4a63-ab6c-0cdaef4a440c, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (05f66738-919e-46e4-8dca-4a041c133da0, 'Co-Curricular',be3184d0-500e-11e7-9f5f-87d439384c1d, 6833e9cd-a70b-4a63-ab6c-0cdaef4a440c, 'Admin', 'Admin', toTimeStamp(now()));

//patricks
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (73700598-8fa5-4c68-a445-9c4c24e1151c, 'Events',32aaa410-51d4-11e7-8dc1-3b9c08d048b3, f5a5e341-0700-4ed1-b591-76807ae1e4d1, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (96e2e795-5677-4bec-b50d-9958abddde94, 'Competitions',32aaa410-51d4-11e7-8dc1-3b9c08d048b3, f5a5e341-0700-4ed1-b591-76807ae1e4d1, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (189648ab-5831-48f9-ad84-a919338fd941, 'Extra-Curricular',32aaa410-51d4-11e7-8dc1-3b9c08d048b3, f5a5e341-0700-4ed1-b591-76807ae1e4d1, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (05f66738-919e-46e4-8dca-4a041c133da0, 'Co-Curricular',32aaa410-51d4-11e7-8dc1-3b9c08d048b3, f5a5e341-0700-4ed1-b591-76807ae1e4d1, 'Admin', 'Admin', toTimeStamp(now()));


//mahss
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (73700598-8fa5-4c68-a445-9c4c24e1151c, 'Events',ac8989d0-557c-11e7-a9da-618c0b66b59e, 68306a4b-a57c-418a-be07-f82ac044b5c5, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (96e2e795-5677-4bec-b50d-9958abddde94, 'Competitions',ac8989d0-557c-11e7-a9da-618c0b66b59e, 68306a4b-a57c-418a-be07-f82ac044b5c5, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (189648ab-5831-48f9-ad84-a919338fd941, 'Extra-Curricular',ac8989d0-557c-11e7-a9da-618c0b66b59e, 68306a4b-a57c-418a-be07-f82ac044b5c5, 'Admin', 'Admin', toTimeStamp(now()));
insert into nsa.school_activity_type(activity_type_id, activity_type_name, tenant_id, school_id, updated_by, updated_username, updated_date) VALUES (05f66738-919e-46e4-8dca-4a041c133da0, 'Co-Curricular',ac8989d0-557c-11e7-a9da-618c0b66b59e, 68306a4b-a57c-418a-be07-f82ac044b5c5, 'Admin', 'Admin', toTimeStamp(now()));