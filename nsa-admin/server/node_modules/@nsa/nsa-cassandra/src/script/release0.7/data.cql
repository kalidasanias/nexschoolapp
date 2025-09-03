//permissions
INSERT INTO nsa.permissions (id,description,feature_id,name) VALUES (e10dd7f2-b106-4c69-a7e1-2115e82b8e9b,'marks_upload_manageAll',dc1c8fb4-c39c-4972-8c01-36b8912b8c0b,'marks_upload_manageAll');
INSERT INTO nsa.permissions (id,description,feature_id,name) VALUES (de83c615-e7ce-4dde-837e-706eb742cbbe,'marks_upload_manage',dc1c8fb4-c39c-4972-8c01-36b8912b8c0b,'marks_upload_manage');
INSERT INTO nsa.permissions (id,description,feature_id,name) VALUES (2afb79b6-bfaf-483f-a39d-1a7dcd3cb7bb,'marks_upload_view',dc1c8fb4-c39c-4972-8c01-36b8912b8c0b,'marks_upload_view');
INSERT INTO nsa.permissions (id,description,feature_id,name) VALUES (7c8660b1-b5f9-49ee-a87f-75f621d17bdd,'marks_upload_viewAll',dc1c8fb4-c39c-4972-8c01-36b8912b8c0b,'marks_upload_viewAll');


//staloysious
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (d04943a0-d175-11e6-a2c8-c95cdbee5e46, 92f7300e-a0b0-4828-b405-a2406b139941,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

//vmpublic
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, f39d3093-4e7b-4369-864f-9dcb21a0e129,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES
(8eb846a0-4549-11e7-9543-276f818a8422, f39d3093-4e7b-4369-864f-9dcb21a0e129,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

//sea school
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, 59f6ba32-ea46-435a-ade5-17e980589092,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES
(8eb846a0-4549-11e7-9543-276f818a8422, 59f6ba32-ea46-435a-ade5-17e980589092,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

//brilliant
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (1ad449f0-63da-11e7-a5e6-ebc8461edbdf, d6936224-2a4f-4ef1-b4ee-45c2a1878c26,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES
(1ad449f0-63da-11e7-a5e6-ebc8461edbdf, d6936224-2a4f-4ef1-b4ee-45c2a1878c26,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

//stpatricks dindigul
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (32aaa410-51d4-11e7-8dc1-3b9c08d048b3, f5a5e341-0700-4ed1-b591-76807ae1e4d1,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES
(32aaa410-51d4-11e7-8dc1-3b9c08d048b3, f5a5e341-0700-4ed1-b591-76807ae1e4d1,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

//mahss
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (ac8989d0-557c-11e7-a9da-618c0b66b59e, 68306a4b-a57c-418a-be07-f82ac044b5c5,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES
(ac8989d0-557c-11e7-a9da-618c0b66b59e, 68306a4b-a57c-418a-be07-f82ac044b5c5,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

//stritas
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (214a6e60-4da8-11e7-8abe-adec971199c2, 81f43ec4-a62c-4809-b8d4-c638f01d875f,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES
(214a6e60-4da8-11e7-8abe-adec971199c2, 81f43ec4-a62c-4809-b8d4-c638f01d875f,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

//auxilium
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (be3184d0-500e-11e7-9f5f-87d439384c1d, 6833e9cd-a70b-4a63-ab6c-0cdaef4a440c,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES
(be3184d0-500e-11e7-9f5f-87d439384c1d, 6833e9cd-a70b-4a63-ab6c-0cdaef4a440c,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');


//nexschool
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, 4e3d3bf5-e262-4e7a-9a02-ef542107f6e7,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES
(8eb846a0-4549-11e7-9543-276f818a8422, 4e3d3bf5-e262-4e7a-9a02-ef542107f6e7,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

//lmet
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, fdd97764-bf68-479a-89ee-16e509a98a6e,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES
(8eb846a0-4549-11e7-9543-276f818a8422, fdd97764-bf68-479a-89ee-16e509a98a6e,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

//SRV
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (258d86d0-4838-11e7-a107-07cfd493dd84, 34e6bb25-9d8d-434d-b42f-0e825057ed59,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES
(258d86d0-4838-11e7-a107-07cfd493dd84, 34e6bb25-9d8d-434d-b42f-0e825057ed59,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');


//kannammal
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, c0dc5593-5973-4968-b91c-b5a77b5674f0,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES
(8eb846a0-4549-11e7-9543-276f818a8422, c0dc5593-5973-4968-b91c-b5a77b5674f0,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');


//godson
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (8eb846a0-4549-11e7-9543-276f818a8422, 1535aa60-1ec6-4b99-848c-515fc2b63de8,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES
(8eb846a0-4549-11e7-9543-276f818a8422, 1535aa60-1ec6-4b99-848c-515fc2b63de8,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');

//bashyam
INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES (85834430-5d87-11e7-8234-4be92e1eb721, 362ec4b7-a7f0-44e0-9c98-01dce9cd70a1,74abb0f0-1f3b-11e7-b336-f7ef66d0e9d4,'Admin',toTimestamp(now()),'Admin',48e0b251-6f57-40ef-9c3e-d89adb2e3573,{040a54a9-184c-41db-b631-e208bc4e7047: 'assign_roles_manageAll', 046b783a-5843-49de-b337-b194d3ac28af: 'roles_manageAll', 0dcc3957-32e2-4efb-a499-eb5e9d0078a0: 'route_manageAll', 17f2cbed-add9-4984-9fc7-385bd026afa6: 'create_timetable_manageAll', 180bbfaa-a251-43ff-807f-c3333881c81e: 'vehicle_manageAll', 1a29494a-a2c1-42b4-8ef9-68adf4ec404c: 'fee_scholarship_manageAll', 1a65da58-f0c6-4b24-9a41-9b40b94ecd44: 'class_manageAll', 1b017307-5294-4e78-8b53-f5b87b19da9a: 'employees_manageAll', 25765a21-cd3e-4b2a-adc3-572338bc5ca5: 'transport_allocation_manageAll', 2d342d37-bd98-4aab-9cdb-614f2cbea234: 'leave_types_manageAll', 2d501587-26a5-4d30-8f22-834c0c9c57c7: 'assignment_types_manageAll', 351869d9-95d0-4373-91a9-b6f936f0479a: 'create_events_manageAll', 3ba2cc83-0588-47ea-8d4a-ac797e8d8cd1: 'departments_manageAll', 3cb5f2f5-70a1-4595-a594-8ce41b7b42c3: 'my_leaves_manageAll', 3ddb543e-f705-4551-9e5a-2f5179ca0bc3: 'section_allocation_manageAll', 3df0baa2-7900-4457-8e6a-b0e2240bd09b: 'leaves_approval_manageAll', 46ba373f-165d-4c94-978d-807fca587afa: 'event_venues_manageAll', 4df74882-c023-40d6-9dcb-cf7bb080ac01: 'attendance_history_manageAll', 583f47a9-31df-4497-996d-0e7962c39da8: 'academic_year_manageAll', 5a43a827-acf7-4cbf-8c6a-ff459bb6b042: 'holidays_manageAll', 5d3a2dc5-76a1-4dbf-a8fe-eaedd1fc9a34: 'subject_allocation_manageAll', 5e6354db-a0cf-452a-8c19-8617b2ba2c70: 'event_types_manageAll', 65a871d4-65ba-438f-b915-92c3e8e1b563: 'students_manageAll', 6ee801d2-b55e-41c8-beb6-02c215c5ee1d: 'fee_types_manageAll', 729b71b6-4999-47b0-b9a9-87a7ae41cfd6: 'tracking_manageAll', 73194fd8-dfb5-4995-b561-f25ca65586e2: 'timetable_configuration_manageAll', 8170e05b-fe13-45c4-b28b-133e844df02f: 'attendance_information_manageAll', 949c4f77-ef3a-4ed5-ba5f-027227430473: 'section_list_manageAll', 9d00d852-5a6e-4b32-a0cb-c015f13c749a: 'holiday_types_manageAll', a3898cf2-56ef-4e70-91d6-423627cf033a: 'fee_structure_manageAll', a43e1dee-a243-48c7-9b1c-2845d3fc0c73: 'communication_manageAll', a545c1ea-a880-48da-8f6e-9becc2469913: 'assign_fees_manageAll', b320b1af-95d4-4d46-8780-70f0734aaad8: 'notification_manageAll', b3a25588-4200-4eda-9bf1-0911388d90e1: 'leave_assignments_manageAll', bf68b080-ece1-426c-8745-b64964ffb9d3: 'driver_manageAll', c62d8b16-cfdb-4fe9-b1dd-4e9626992fdf: 'special_timetable_manageAll', e256be5f-8a01-4698-846e-cd89a5ee6e9f: 'create_assignments_manageAll', e4aac4e1-e188-45cd-8ef5-04a6c66398ea: 'designation_manageAll', f6ac09b8-97a0-48ac-a28e-1b99dc85f18c: 'subject_list_manageAll', 5e80413c-57cd-420c-8290-4ee0a9ea65fa:'employee_timetable_manageAll',981a9ec1-9f28-4a9f-98af-b5ab9c329c4a: 'gallery_manageAll', 96949050-5d9c-498a-aff9-0680265e5820:'activity_types_manageAll',19f5e7d6-60bd-4d13-bb61-1d07cd8456f9:'written_exam_type_manageAll',0451596b-abbb-4b21-9cea-ec8aa3e1ecb2:'exam_schedule_manageAll', e10dd7f2-b106-4c69-a7e1-2115e82b8e9b:'marks_upload_manageAll'},'SchoolAdmin','Admin',toTimestamp(now()),'Admin');

INSERT INTO nsa.school_role_permissions (tenant_id,school_id,role_id,created_by,created_date,created_firstname,id,permission_id,role_name,updated_by,updated_date,updated_username) VALUES
(85834430-5d87-11e7-8234-4be92e1eb721, 362ec4b7-a7f0-44e0-9c98-01dce9cd70a1,dec10422-931b-47bc-9dce-ddd3245c4816,'admin','2017-06-24 16:22:04','Admin',8a7c5669-c447-4c52-9998-437b953fac49,
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
780b68e2-f039-456a-9b32-0fea55589596:'activity_types_viewAll',03ed306e-b14f-4d1e-8b12-e8f54c1e95a3:'activity_types_manage',
54550780-ac86-4e56-880d-e294f4159a7f:'written_exam_type_manage',b91a362f-8fcc-4d89-9b52-5427bbedcd9e:'written_exam_type_viewAll',
24e72095-e154-4e24-b917-0fb47439ce78:'exam_schedule_manage',e126adb8-985b-41d0-978c-32f887cb155d:'exam_schedule_viewAll',
de83c615-e7ce-4dde-837e-706eb742cbbe:'marks_upload_manage', 7c8660b1-b5f9-49ee-a87f-75f621d17bdd:'marks_upload_viewAll'},
'Faculty Manager','admin','2017-06-24 16:22:04','Admin');


update nsa.school_feature set help_text = 'Written examinations in the system can be used for maintaining a consolidated list of written tests/exams conducted in school. Any new exams can be added by clicking on "Add Written Exam". Examinations can be scheduled by clicking on the next tab "Exam Schedule". Exam timings for each subject can be specified along with maximum marks. Exam timetable will be notified to parents only after publishing the schedule.' , mobile_priority = 9 where tenant_id = d04943a0-d175-11e6-a2c8-c95cdbee5e46 and school_id = 92f7300e-a0b0-4828-b405-a2406b139941
and id = 8a7c5b0e-d98e-4573-8c5d-cb0c7e83349b;

update nsa.school_feature set help_text = 'Written examinations in the system can be used for maintaining a consolidated list of written tests/exams conducted in school. Any new exams can be added by clicking on "Add Written Exam". Examinations can be scheduled by clicking on the next tab "Exam Schedule". Exam timings for each subject can be specified along with maximum marks. Exam timetable will be notified to parents only after publishing the schedule.' , mobile_priority = 9 where tenant_id = 32aaa410-51d4-11e7-8dc1-3b9c08d048b3 and school_id = f5a5e341-0700-4ed1-b591-76807ae1e4d1
and id = 8a7c5b0e-d98e-4573-8c5d-cb0c7e83349b;

update nsa.school_feature set help_text = 'Written examinations in the system can be used for maintaining a consolidated list of written tests/exams conducted in school. Any new exams can be added by clicking on "Add Written Exam". Examinations can be scheduled by clicking on the next tab "Exam Schedule". Exam timings for each subject can be specified along with maximum marks. Exam timetable will be notified to parents only after publishing the schedule.' , mobile_priority = 9 where tenant_id = ac8989d0-557c-11e7-a9da-618c0b66b59e and school_id = 68306a4b-a57c-418a-be07-f82ac044b5c5
and id = 8a7c5b0e-d98e-4573-8c5d-cb0c7e83349b;

update nsa.school_feature set help_text = 'Written examinations in the system can be used for maintaining a consolidated list of written tests/exams conducted in school. Any new exams can be added by clicking on "Add Written Exam". Examinations can be scheduled by clicking on the next tab "Exam Schedule". Exam timings for each subject can be specified along with maximum marks. Exam timetable will be notified to parents only after publishing the schedule.' , mobile_priority = 9 where tenant_id = 214a6e60-4da8-11e7-8abe-adec971199c2 and school_id = 81f43ec4-a62c-4809-b8d4-c638f01d875f
and id = 8a7c5b0e-d98e-4573-8c5d-cb0c7e83349b;

update nsa.school_feature set help_text = 'Written examinations in the system can be used for maintaining a consolidated list of written tests/exams conducted in school. Any new exams can be added by clicking on "Add Written Exam". Examinations can be scheduled by clicking on the next tab "Exam Schedule". Exam timings for each subject can be specified along with maximum marks. Exam timetable will be notified to parents only after publishing the schedule.' , mobile_priority = 9 where tenant_id = be3184d0-500e-11e7-9f5f-87d439384c1d and school_id = 6833e9cd-a70b-4a63-ab6c-0cdaef4a440c
and id = 8a7c5b0e-d98e-4573-8c5d-cb0c7e83349b;

update nsa.school_feature set help_text = 'Written examinations in the system can be used for maintaining a consolidated list of written tests/exams conducted in school. Any new exams can be added by clicking on "Add Written Exam". Examinations can be scheduled by clicking on the next tab "Exam Schedule". Exam timings for each subject can be specified along with maximum marks. Exam timetable will be notified to parents only after publishing the schedule.' , mobile_priority = 9 where tenant_id = 8eb846a0-4549-11e7-9543-276f818a8422 and school_id = 4e3d3bf5-e262-4e7a-9a02-ef542107f6e7
and id = 8a7c5b0e-d98e-4573-8c5d-cb0c7e83349b;

update nsa.school_feature set help_text = 'Written examinations in the system can be used for maintaining a consolidated list of written tests/exams conducted in school. Any new exams can be added by clicking on "Add Written Exam". Examinations can be scheduled by clicking on the next tab "Exam Schedule". Exam timings for each subject can be specified along with maximum marks. Exam timetable will be notified to parents only after publishing the schedule.' , mobile_priority = 9 where tenant_id = 8eb846a0-4549-11e7-9543-276f818a8422 and school_id = fdd97764-bf68-479a-89ee-16e509a98a6e
and id = 8a7c5b0e-d98e-4573-8c5d-cb0c7e83349b;

update nsa.school_feature set help_text = 'Written examinations in the system can be used for maintaining a consolidated list of written tests/exams conducted in school. Any new exams can be added by clicking on "Add Written Exam". Examinations can be scheduled by clicking on the next tab "Exam Schedule". Exam timings for each subject can be specified along with maximum marks. Exam timetable will be notified to parents only after publishing the schedule.' , mobile_priority = 9 where tenant_id = 258d86d0-4838-11e7-a107-07cfd493dd84 and school_id = 34e6bb25-9d8d-434d-b42f-0e825057ed59
and id = 8a7c5b0e-d98e-4573-8c5d-cb0c7e83349b;

update nsa.school_feature set help_text = 'Written examinations in the system can be used for maintaining a consolidated list of written tests/exams conducted in school. Any new exams can be added by clicking on "Add Written Exam". Examinations can be scheduled by clicking on the next tab "Exam Schedule". Exam timings for each subject can be specified along with maximum marks. Exam timetable will be notified to parents only after publishing the schedule.' , mobile_priority = 9 where tenant_id = 8eb846a0-4549-11e7-9543-276f818a8422 and school_id = 1535aa60-1ec6-4b99-848c-515fc2b63de8
and id = 8a7c5b0e-d98e-4573-8c5d-cb0c7e83349b;

update nsa.school_feature set help_text = 'Written examinations in the system can be used for maintaining a consolidated list of written tests/exams conducted in school. Any new exams can be added by clicking on "Add Written Exam". Examinations can be scheduled by clicking on the next tab "Exam Schedule". Exam timings for each subject can be specified along with maximum marks. Exam timetable will be notified to parents only after publishing the schedule.' , mobile_priority = 9 where tenant_id = 85834430-5d87-11e7-8234-4be92e1eb721 and school_id = 362ec4b7-a7f0-44e0-9c98-01dce9cd70a1
and id = 8a7c5b0e-d98e-4573-8c5d-cb0c7e83349b;

update nsa.school_feature set help_text = 'Written examinations in the system can be used for maintaining a consolidated list of written tests/exams conducted in school. Any new exams can be added by clicking on "Add Written Exam". Examinations can be scheduled by clicking on the next tab "Exam Schedule". Exam timings for each subject can be specified along with maximum marks. Exam timetable will be notified to parents only after publishing the schedule.' , mobile_priority = 9 where tenant_id = 4cdbd690-24d1-11e7-9a7c-1108ffd2d102 and school_id = 7ca3fad4-a571-495e-be1b-ac25de3a2009
and id = 8a7c5b0e-d98e-4573-8c5d-cb0c7e83349b;


update nsa.school_feature set help_text = 'Examination marks can be entered subject wise for each student and the total is calculated. Choose class, section and exam name, a mark list with student names is populated. Click on plus icon beside the student name for entering marks for additional subjects. "Update" against each student to compute the total. The mark list will be generated for the entire class. Click on "Publish" to send marks to all parents.' where tenant_id = d04943a0-d175-11e6-a2c8-c95cdbee5e46 and school_id = 92f7300e-a0b0-4828-b405-a2406b139941
and id = 28116ffb-42bc-471b-9345-bac4adc2ddf7;

update nsa.school_feature set help_text = 'Examination marks can be entered subject wise for each student and the total is calculated. Choose class, section and exam name, a mark list with student names is populated. Click on plus icon beside the student name for entering marks for additional subjects. "Update" against each student to compute the total. The mark list will be generated for the entire class. Click on "Publish" to send marks to all parents.' where tenant_id = 32aaa410-51d4-11e7-8dc1-3b9c08d048b3 and school_id = f5a5e341-0700-4ed1-b591-76807ae1e4d1
and id = 28116ffb-42bc-471b-9345-bac4adc2ddf7;

update nsa.school_feature set help_text = 'Examination marks can be entered subject wise for each student and the total is calculated. Choose class, section and exam name, a mark list with student names is populated. Click on plus icon beside the student name for entering marks for additional subjects. "Update" against each student to compute the total. The mark list will be generated for the entire class. Click on "Publish" to send marks to all parents.' where tenant_id = ac8989d0-557c-11e7-a9da-618c0b66b59e and school_id = 68306a4b-a57c-418a-be07-f82ac044b5c5
and id = 28116ffb-42bc-471b-9345-bac4adc2ddf7;

update nsa.school_feature set help_text = 'Examination marks can be entered subject wise for each student and the total is calculated. Choose class, section and exam name, a mark list with student names is populated. Click on plus icon beside the student name for entering marks for additional subjects. "Update" against each student to compute the total. The mark list will be generated for the entire class. Click on "Publish" to send marks to all parents.' where tenant_id = 214a6e60-4da8-11e7-8abe-adec971199c2 and school_id = 81f43ec4-a62c-4809-b8d4-c638f01d875f
and id = 28116ffb-42bc-471b-9345-bac4adc2ddf7;

update nsa.school_feature set help_text = 'Examination marks can be entered subject wise for each student and the total is calculated. Choose class, section and exam name, a mark list with student names is populated. Click on plus icon beside the student name for entering marks for additional subjects. "Update" against each student to compute the total. The mark list will be generated for the entire class. Click on "Publish" to send marks to all parents.' where tenant_id = be3184d0-500e-11e7-9f5f-87d439384c1d and school_id = 6833e9cd-a70b-4a63-ab6c-0cdaef4a440c
and id = 28116ffb-42bc-471b-9345-bac4adc2ddf7;

update nsa.school_feature set help_text = 'Examination marks can be entered subject wise for each student and the total is calculated. Choose class, section and exam name, a mark list with student names is populated. Click on plus icon beside the student name for entering marks for additional subjects. "Update" against each student to compute the total. The mark list will be generated for the entire class. Click on "Publish" to send marks to all parents.' where tenant_id = 8eb846a0-4549-11e7-9543-276f818a8422 and school_id = 4e3d3bf5-e262-4e7a-9a02-ef542107f6e7
and id = 28116ffb-42bc-471b-9345-bac4adc2ddf7;

update nsa.school_feature set help_text = 'Examination marks can be entered subject wise for each student and the total is calculated. Choose class, section and exam name, a mark list with student names is populated. Click on plus icon beside the student name for entering marks for additional subjects. "Update" against each student to compute the total. The mark list will be generated for the entire class. Click on "Publish" to send marks to all parents.' where tenant_id = 8eb846a0-4549-11e7-9543-276f818a8422 and school_id = fdd97764-bf68-479a-89ee-16e509a98a6e
and id = 28116ffb-42bc-471b-9345-bac4adc2ddf7;

update nsa.school_feature set help_text = 'Examination marks can be entered subject wise for each student and the total is calculated. Choose class, section and exam name, a mark list with student names is populated. Click on plus icon beside the student name for entering marks for additional subjects. "Update" against each student to compute the total. The mark list will be generated for the entire class. Click on "Publish" to send marks to all parents.' where tenant_id = 258d86d0-4838-11e7-a107-07cfd493dd84 and school_id = 34e6bb25-9d8d-434d-b42f-0e825057ed59
and id = 28116ffb-42bc-471b-9345-bac4adc2ddf7;

update nsa.school_feature set help_text = 'Examination marks can be entered subject wise for each student and the total is calculated. Choose class, section and exam name, a mark list with student names is populated. Click on plus icon beside the student name for entering marks for additional subjects. "Update" against each student to compute the total. The mark list will be generated for the entire class. Click on "Publish" to send marks to all parents.' where tenant_id = 8eb846a0-4549-11e7-9543-276f818a8422 and school_id = 1535aa60-1ec6-4b99-848c-515fc2b63de8
and id = 28116ffb-42bc-471b-9345-bac4adc2ddf7;

update nsa.school_feature set help_text = 'Examination marks can be entered subject wise for each student and the total is calculated. Choose class, section and exam name, a mark list with student names is populated. Click on plus icon beside the student name for entering marks for additional subjects. "Update" against each student to compute the total. The mark list will be generated for the entire class. Click on "Publish" to send marks to all parents.' where tenant_id = 85834430-5d87-11e7-8234-4be92e1eb721 and school_id = 362ec4b7-a7f0-44e0-9c98-01dce9cd70a1
and id = 28116ffb-42bc-471b-9345-bac4adc2ddf7;

update nsa.school_feature set help_text = 'Examination marks can be entered subject wise for each student and the total is calculated. Choose class, section and exam name, a mark list with student names is populated. Click on plus icon beside the student name for entering marks for additional subjects. "Update" against each student to compute the total. The mark list will be generated for the entire class. Click on "Publish" to send marks to all parents.' where tenant_id = 4cdbd690-24d1-11e7-9a7c-1108ffd2d102 and school_id = 7ca3fad4-a571-495e-be1b-ac25de3a2009
and id = 28116ffb-42bc-471b-9345-bac4adc2ddf7;


INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us, latitude, longitude) VALUES (
d04943a0-d175-11e6-a2c8-c95cdbee5e46,92f7300e-a0b0-4828-b405-a2406b139941,'2017-06-07 20:44:22',NULL,'Kerala',NULL,NULL,'AIzaSyAzTP-zka6uPkFWZ2e5zBPoycaLvL79bPk',NULL,NULL,NULL,NULL,NULL,'201925306539',100,'ST. ALOYSIUS CONVENT ISC SCHOOL','AAAALwOvqKs:APA91bG9tR4nB3pTM87sNK6V7OOTgvAPm_OSw3pLFba01tDuEzv7JexHCstVxpYLaOYB5amMaei_9Zh3PWnB9U84ZSnHbvMqiadJIK3WG_fajn5Toe0IM40uwyNrUHdnB2ykrHDQldpJ',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'<center><b> ST ALOYSIUS </b></center></br>St. Aloysius Convent ISC School is a co-educational
institution managed by the Sisters of the Congregation of the Carmelite Religious. It is a catholic
minority school, open to a, castes and creed, especially to the poor of this locality. our school is
affiliated to the council for the Indian school certificate Examinations and the students are presented
to the ICSE (Std. X) and ISC (Std. Xil) Examinations.</br></br>Established in the year 1981 we
launched out with a vision and an aim, to impart a Sound education through a wide training, which
shall develop the character and personality of each pupil. As a catholic institution, we have not only
tried to instil values into our students, but have whole heartedly worked for their upliftment in the
socio-economic rearms, so that they are better equipped to face rife and build brighter societies in
lndia.</br>', '<b> ST. ALOYSIUS CONVENT I.S.C. SCHOOL </b></br>P.D. ROAD</br>PALLURUTHY</br>KOCHI - 682
006 </br>Contact Us : 0484-2232726 </br>', 9.919939, 76.266437);
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us, latitude, longitude) VALUES (
8eb846a0-4549-11e7-9543-276f818a8422,f39d3093-4e7b-4369-864f-9dcb21a0e129,'2017-07-18 15:10:06',NULL,'Chennai',NULL,NULL,'AIzaSyBCBe-5SzamC24GpIN2G6UDOveOKZelR7I',NULL,NULL,NULL,NULL,NULL,'268489962138',109,'VM Public School','AAAAPoM_spo:APA91bGiLQfvmW8qVFhIrXkzhT4rozL7LahEujQ_caiuwvqrYNJKBGCW-bYjiImTN2bgsxebDlYLL8v4ZfwLTTCwhcifpTtQiMqiSM2AhWHnkmb2gf2T9pmMUqH74spb6PAVOZaTkcmi',NULL,NULL,NULL,'125202',NULL,NULL,NULL,NULL,'<center><b>Nexrise Technologies</b></center></br>NexSchoolApp is a feature-rich, complete
school management system. School management software opens a wide range of opportunities to
systematise the laborious paperwork and error prone manual inputs. With our proposed end to end
connectivity aided software, the management can more effectively interact with the teachers,
parents and students as they develop skills and character for success.</br>', '</br><b> Nexrise Technologies</b></br>PMR Towers,</br>Menambedu Main Road</br>Chennai-
600098 </br>Ambattur Industrial Estate,</br>044-65664477, 044-65664488</br>admin@nexrise.in
</br>http://www.nexrisetech.com</br>', 13.100125, 80.170255);
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us, latitude, longitude) VALUES (
8eb846a0-4549-11e7-9543-276f818a8422,59f6ba32-ea46-435a-ade5-17e980589092,'2017-07-18 15:10:07',NULL,'Chennai',NULL,NULL,'AIzaSyBCBe-5SzamC24GpIN2G6UDOveOKZelR7I',NULL,NULL,NULL,NULL,NULL,'268489962138',110,'SEA School','AAAAPoM_spo:APA91bGiLQfvmW8qVFhIrXkzhT4rozL7LahEujQ_caiuwvqrYNJKBGCW-bYjiImTN2bgsxebDlYLL8v4ZfwLTTCwhcifpTtQiMqiSM2AhWHnkmb2gf2T9pmMUqH74spb6PAVOZaTkcmi',NULL,NULL,NULL,'125202',NULL,NULL,NULL,NULL,'<center><b>Nexrise Technologies</b></center></br>NexSchoolApp is a feature-rich, complete
school management system. School management software opens a wide range of opportunities to
systematise the laborious paperwork and error prone manual inputs. With our proposed end to end
connectivity aided software, the management can more effectively interact with the teachers,
parents and students as they develop skills and character for success.</br>', '</br><b> Nexrise Technologies</b></br>PMR Towers,</br>Menambedu Main Road</br>Chennai-
600098 </br>Ambattur Industrial Estate,</br>044-65664477, 044-65664488</br>admin@nexrise.in
</br>http://www.nexrisetech.com</br>', 13.100125, 80.170255);
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us, latitude, longitude) VALUES (
1ad449f0-63da-11e7-a5e6-ebc8461edbdf,d6936224-2a4f-4ef1-b4ee-45c2a1878c26,'2017-07-10 20:54:52',NULL,'',NULL,NULL,'AIzaSyCkcLlqI7ZpB2_muzC9mWGKmwalW38CPA4',NULL,NULL,NULL,NULL,NULL,'148753873008',108,'BRILLIANT MATRIC HIGHER SEC SCHOOL','AAAAIqJr-HA:APA91bHMcK0XlGR2pabeMbRvOGvz-l2Yvauf53-hXzy4Zbp7ld8bXHxxHehfGEX0fQ5O1IDnnNIvAGGlaamXtMQPqNE2wgmo5En4v90l9_q6EPAQRT6UmlgKe4emVsBALHUXTJgvOt_o',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'<center><b> Brilliant Matric Hr. Secondary School </b></center></br>Our school was started as
Brilliant English School on 16th June, 1986 at Dr.Salihus hospital building for rent  by our
Correspondent Al-Haj. A. Muhammed Yakub., M.A., B.Sc., B.T., by the grace of the Almighty and with
his vision for imparting Quality education irrespective of caste and greed not only for this area but
also for all near by areas as a pioneer institution in presence of Hon. N. Sundaresa Thevar the
Ex-MLC. It is being  duly sponsored by K. A. Allah Pitchai Rowther Trust founded by our
correspondent under the capacity of Founder Trustee.</br></br> The school was  then named as
Brilliant Matriculation School and started with higher classes right from Std. VI. and upgraded up to
Std. X in the year 1993. The school made so many toppers in Std. X in district level and then and then
honoured by the Educational Ministers.</br></br>The profound experience (more than 45 years in
Academic side from various places) of our correspondent and the tireless support of his sons (the
Secretary and Asst. Secretary) towards the development of the school has led the school towards the
path of excellence.', '<b> Brilliant Matric Hr. Secondary School </b></br>PKT ROAD,</br> MUTHUPET - POST,</br>
THIRUTHURAIPOONDI - TK,</br>THIRUVARUR - DIST,</br>PIN - 614704.</br>LANDLINE -
04369-260576,</br>CELL: 88835-31999, 88835-32999.</br>', 10.395938, 79.487328);
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us, latitude, longitude) VALUES (
32aaa410-51d4-11e7-8dc1-3b9c08d048b3,f5a5e341-0700-4ed1-b591-76807ae1e4d1,'2017-06-16 20:12:52',NULL,'DINDIGUL',NULL,NULL,'AIzaSyD1gY5hbN8pH5wP_qLGAyrCZwO7W8rAJm8',NULL,NULL,NULL,NULL,NULL,'424970851839',105,'ST.PATRICKS ACADEMY HR. SEC. SCHOOL, DINDIGUL','AAAAYvI8lf8:APA91bEbXH_U-KFnH7jqW53Oyslo6eX5V_pJLpywQiDGkkle81yg8WTtBGznaXOTBi7djeArNtQ3MMZDaBU0hDWOUkNuJpflX4MULFM1y-tETsCffs4A_YzQaZjKvQXhGJsDjGfOXJsB',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'</br>We believe that a congenial environment is vital for an effective teaching - learning process to
take place. We will create such a conducive atmosphere by making the welfare of the child our top
priority.</br>
</br>While academic excellence will be our primary focus, our curriculum will be so designed as to
develop the physical, mental, emotional, aesthetic, social and spiritual dimensions of the child"s
personality thus making him/her confident to face the challenges of the future. </br>
</br>We also believe that a value-based education is of paramount importance in achieving the
goals of education. Therefore the inculcation of such values like compassion, sharing, honesty,
concern for the weaker sections of society especially of those in our own neighborhood and care for
the environment will form the CORE of all our endeavors. </br>
</br>Consequently, an ideal "PATRICIAN" will be a Prayerful, Affectionate, Trustworthy, Responsible,
Inspirational, Courageous, Intelligent, Attentive and Noble citizen of our great motherland. </br>', '
</br>Patrick Nagar, </br>Kalanampatty Post, </br> NH44, Kakkthoppu, </br>Tamil Nadu 624622
</br>Ph no 04551 262 036</br>website stpatricksdgl.com</br>EMail principal@stpatricksdgl.com,
spadgl@gmail.com', 10.487960, 77.946399);
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us, latitude, longitude) VALUES (
ac8989d0-557c-11e7-a9da-618c0b66b59e,68306a4b-a57c-418a-be07-f82ac044b5c5,'2017-06-21 21:43:16',NULL,'Kodinhi',NULL,NULL,'AIzaSyA-Mkd26zQGFIjp_ai4janeuR-P8TjPmvE',NULL,NULL,NULL,NULL,NULL,'674297906211',106,'Madrasathul Anwar  Higher Secondary School Kodinhi','AAAAnP9JhCM:APA91bFu3DSctTrnwCkYkVxe72BTMTZQQztbO2alRkC-ww663kjZmpvo8ZJEyy5x2rKuQqSizHBaqG4sPr7HTe23WT-SrVzGj7VLuEKaIF9yo45IgR7AfAXHXwkhb2amkwyhTGp02OLU',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'<b>GEOGRAPHY AND HISTORY</b></br>Kodinhi is a small village in Nannambra Pachayat, Tirurangadi Taluk of Malappuram Dist with its world fame for the number of twin’s
birth.Madrasathul  Anwar Higher Secondary School (MAHSS) situated in the heart of Kodinhi, near
Erukulam – Cheruppara. Now the area known as Anwar Nagar.</br>It was founded in 1998 , by a
group of community leaders  under Sunni Education Centre managing Committee. The progressive
leaders aimed to eradicate the educational backwardness of the geographical area, by establishing a
high standard, quality educational institution, which can torch light in the dark areas of the
society.</br><b>ACADEMIC</b></br> "MAHSS” classes ranging  from LKG to plus two with more
than 1400 students. It follows Central  scheme in KG and LP sections and State scheme in UP,HS and
HSS sections. Since last 8 years, it sustains its "100% result in SSLC Examinations, with prominent
number of full A pluses, which makes the school one among the best school in the
"Malappuram District. In higher secondary, Humanities and Commerce streams are offered in batch
of 50 students each.</br><b>CO-CURRICULAR</b></br>School keeps the monopoly in District Junior
and Senior OPPANA , in the arts festival. Several times , it kept the rolling trophy for sub dist Junior
and Senior foot ball . Scout, guide , JRC, Karate, Abacus clubs are working for the physical and mental
development of the students. Also </br>planning to start SPC , Bulbul and Cub units in near future.
School is equipped with smart room, Lab, Library and Computer Lab and a children’s Park. All its KG
class rooms are smart class rooms, with </br>modest seating arrangements. School is still in the
improvement path, by executing modern technologies and adapting latest trends in education…', '</br><b> Madrasathul Anwar Higher Secondary School</b></br>Anwar Nagar</br>Post : KODINHI
676309</br>Malappuram Dist. Kerala</br>Ph: 0494 2481185 , 0494 2119323</br>Mob :
9809037881 , 9746855287 </br>Email : mahsskodinhi@yahoo.com,</br>mahsskodinhi@gmail.com
</br>', 11.021617, 75.910614);
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us, latitude, longitude) VALUES (
214a6e60-4da8-11e7-8abe-adec971199c2,81f43ec4-a62c-4809-b8d4-c638f01d875f,'2017-06-12 22:06:47',NULL,'Kochi',NULL,NULL,'AIzaSyDaD_SXWlfwA2CX36SeOosYwiBXLidgBHw',NULL,NULL,NULL,NULL,NULL,'945515151730',103,'ST RITAS','AAAA3CUYQXI:APA91bFx9lJaY5R16wHo7qUKYKFe_IdvN3QnsIQ7kv7lDKD8M6RZYt1Od7D84sew-xh6MrDRP1smsn5J6PmhjJi2JINuycpcEpnaAzCSFhGQKNnISHCwMXlts8yKtRRUFLtVTlHoA1SW',NULL,NULL,NULL,'125202',NULL,NULL,NULL,NULL,'</br>St Rita"s Public School, started in 1998, and is managed by the congregation of the Augustinian
Sisters of the Most Holy Annunciation. </br></br> (St Augustine Convent, MLA Road Palluruthy,
Kochi - 682006) </br></br>It maintains a high standard of disciplice. </br></br>This institution aims
at the promotion and uplift of the overall improvement of the young generation. </br></br> The
Moto "Love & Serve" will inspire the students to impart their knowledge ino their life and help to
mould them into God fearing, worthy and noble citizens of our country. </br>', '</br>MLA Road, Palluruthy</br> Kochi - 682006 </br>Phone: 0484 2236360, 9497679360</br>
Email: stritaspublicschool@gmail.com</br>',  9.913073, 76.276876);
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us, latitude, longitude) VALUES (
be3184d0-500e-11e7-9f5f-87d439384c1d,6833e9cd-a70b-4a63-ab6c-0cdaef4a440c,'2017-06-14 20:52:55',NULL,'Kerala',NULL,NULL,'AIzaSyCCtVFYAj7G-RxcHXXSzDCPPzazyZ6cu10',NULL,NULL,NULL,NULL,NULL,'358503597805',104,'Auxilium English Medium School','AAAAU3h6xu0:APA91bF0VNhAq0zsT4e9Y1oAOzcGNy1QZ2UNrrTxICzAHSMr91DQ7WvBStefPcP6HL95GOvfEHXP26hGKqvSG0Q3I_kuteoRNsd_Ztl2tnej-Y32MLpy36xfjDd80BUPtp-keSYPxjJy',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'</br>Auxilium English Medium School was founded in 1992 by the Daughters of Mary Help of
Christians commonly known as the Salesian Sisters of Don Bosco. It is a minority institution
established and administered by them primarily for the education of the Catholic Community. But
the members of other communities are also admitted irrespective of case and creed and their rights
of conscience are respected.</br></br>The School follows the educative system of Don Bosco based
on reason, religion and loving-kindness, where the pupil is the protagonist of his/her own formation.
The Educative Community consisting of parents, teachers, pupils and management work together for
the ‘holistic’ development of the pupil in a family atmosphere.</br>', '</br><b>Address:</b></br> Binni Road, Palluruthy, Kochi, Kerala 682006</br>Phone: 0484 - 223
8722</br> Email :auxipal94@yahoo.in', 9.925117, 76.276306);
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us, latitude, longitude) VALUES (
8eb846a0-4549-11e7-9543-276f818a8422,4e3d3bf5-e262-4e7a-9a02-ef542107f6e7,'2017-06-28 21:53:54',NULL,'Chennai',NULL,NULL,'AIzaSyCg1_ZxBZa-fB3n6uRfkZ4HvVVR_b6zve0',NULL,NULL,NULL,NULL,NULL,'268489962138',99,'NEXSCHOOLAPP','AAAAPoM_spo:APA91bGiLQfvmW8qVFhIrXkzhT4rozL7LahEujQ_caiuwvqrYNJKBGCW-bYjiImTN2bgsxebDlYLL8v4ZfwLTTCwhcifpTtQiMqiSM2AhWHnkmb2gf2T9pmMUqH74spb6PAVOZaTkcmi',NULL,NULL,NULL,'125202',NULL,NULL,NULL,NULL,'<center><b>Nexrise Technologies</b></center></br>NexSchoolApp is a feature-rich, complete
school management system. School management software opens a wide range of opportunities to
systematise the laborious paperwork and error prone manual inputs. With our proposed end to end
connectivity aided software, the management can more effectively interact with the teachers,
parents and students as they develop skills and character for success.</br>', '</br><b> Nexrise Technologies</b></br>PMR Towers,</br>Menambedu Main Road</br>Chennai-
600098 </br>Ambattur Industrial Estate,</br>044-65664477, 044-65664488</br>admin@nexrise.in
</br>http://www.nexrisetech.com</br>', 13.100125, 80.170255);
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us, latitude, longitude) VALUES (
8eb846a0-4549-11e7-9543-276f818a8422,fdd97764-bf68-479a-89ee-16e509a98a6e,'2017-07-10 21:22:11',NULL,'Chennai',NULL,NULL,'AIzaSyCg1_ZxBZa-fB3n6uRfkZ4HvVVR_b6zve0',NULL,NULL,NULL,NULL,NULL,'268489962138',97,'LMET INTERNATIONAl SCHOOL.','AAAAPoM_spo:APA91bGiLQfvmW8qVFhIrXkzhT4rozL7LahEujQ_caiuwvqrYNJKBGCW-bYjiImTN2bgsxebDlYLL8v4ZfwLTTCwhcifpTtQiMqiSM2AhWHnkmb2gf2T9pmMUqH74spb6PAVOZaTkcmi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'<center><b>Nexrise Technologies</b></center></br>NexSchoolApp is a feature-rich, complete
school management system. School management software opens a wide range of opportunities to
systematise the laborious paperwork and error prone manual inputs. With our proposed end to end
connectivity aided software, the management can more effectively interact with the teachers,
parents and students as they develop skills and character for success.</br>', '</br><b> Nexrise Technologies</b></br>PMR Towers,</br>Menambedu Main Road</br>Chennai-
600098 </br>Ambattur Industrial Estate,</br>044-65664477, 044-65664488</br>admin@nexrise.in
</br>http://www.nexrisetech.com</br>', 13.100125, 80.170255);
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us, latitude, longitude) VALUES (
258d86d0-4838-11e7-a107-07cfd493dd84,34e6bb25-9d8d-434d-b42f-0e825057ed59,'2017-06-12 22:06:49',NULL,'Coimbatore',NULL,NULL,'AIzaSyCgXwedaqItYfOT2Gi1eR4ycjVSzcqQCX8',NULL,NULL,NULL,NULL,NULL,'183259244832',101,'Saraswathi Ramachandran Vidyalaya Matric Higher Secondary School','AAAAKqsaKSA:APA91bEvdTGAVFLD0qaP2oFrUgvdbrjy_Mz5gkDPKa5T5BB4t4Eu9fgI-w3kEH7BFaQvba27GEpbr2TsKW08mOWQKwsaj9h_hvwgvJ546suTpFnT0yAkMQcARnpEmwQoTSnmRKQqxKeq',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,
'<center><b>SRV MATRIC HR SEC SCHOOL</b></center></br>Saraswathi Ramachandran Vidyalaya
Matric Hr Sec School stands solid reflecting the soul and long cherished dream of Shirimathi
Saraswathiammal late was found by  Thiru K. Ramachandran  ayya avl in the year 1990.. It marches
triumphantly under the able guidance of correspondent Shri R.Santhanagopal and SRV Charitable
members Thiru R. Rajendiran and Thiru R. Raveendran keeping aloft the motto Duty Discipline
Dignity Our mission the formation of individuals in to social person fully human with all devotion and
fully alive...</br></br>Philanthropic attitude towards the highest altitude .it is a co- educational
school at the sprawling and pristine educational campus...25 years passed by, now the school with
pre. Kg to 12 standards with high standard along with devoted teaching staff and good students with
unquenched desire to learn everything and any thing</br>', '</br> No. 216, Saraswathi Ramachandran School Street</br>Edayarpalaym Main
Road,</br>Menambedu Main Road</br>Sun Garden, Edayarpalayam,
Kuniamuthur</br>Coimbatore, Tamil Nadu 641008</br>0422 647 3731 </br>E-mail :
srvschool.yahoo.co.in</br>', 10.954039, 76.961966);
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us, latitude, longitude) VALUES (
8eb846a0-4549-11e7-9543-276f818a8422,c0dc5593-5973-4968-b91c-b5a77b5674f0,'2017-07-18 15:10:08',NULL,'Chennai',NULL,NULL,'AIzaSyBCBe-5SzamC24GpIN2G6UDOveOKZelR7I',NULL,NULL,NULL,NULL,NULL,'268489962138',111,'Kannammal International School','AAAAPoM_spo:APA91bGiLQfvmW8qVFhIrXkzhT4rozL7LahEujQ_caiuwvqrYNJKBGCW-bYjiImTN2bgsxebDlYLL8v4ZfwLTTCwhcifpTtQiMqiSM2AhWHnkmb2gf2T9pmMUqH74spb6PAVOZaTkcmi',NULL,NULL,NULL,'125202',NULL,NULL,NULL,NULL,'<center><b>Nexrise Technologies</b></center></br>NexSchoolApp is a feature-rich, complete
school management system. School management software opens a wide range of opportunities to
systematise the laborious paperwork and error prone manual inputs. With our proposed end to end
connectivity aided software, the management can more effectively interact with the teachers,
parents and students as they develop skills and character for success.</br>', '</br><b> Nexrise Technologies</b></br>PMR Towers,</br>Menambedu Main Road</br>Chennai-
600098 </br>Ambattur Industrial Estate,</br>044-65664477, 044-65664488</br>admin@nexrise.in
</br>http://www.nexrisetech.com</br>', 13.100125, 80.170255);
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us, latitude, longitude) VALUES (
8eb846a0-4549-11e7-9543-276f818a8422,1535aa60-1ec6-4b99-848c-515fc2b63de8,'2017-07-10 21:22:11',NULL,'Chennai',NULL,NULL,'AIzaSyCg1_ZxBZa-fB3n6uRfkZ4HvVVR_b6zve0',NULL,NULL,NULL,NULL,NULL,'268489962138',98,'GODSON PUBLIC SCHOOL.','AAAAPoM_spo:APA91bGiLQfvmW8qVFhIrXkzhT4rozL7LahEujQ_caiuwvqrYNJKBGCW-bYjiImTN2bgsxebDlYLL8v4ZfwLTTCwhcifpTtQiMqiSM2AhWHnkmb2gf2T9pmMUqH74spb6PAVOZaTkcmi',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'<center><b>Nexrise Technologies</b></center></br>NexSchoolApp is a feature-rich, complete
school management system. School management software opens a wide range of opportunities to
systematise the laborious paperwork and error prone manual inputs. With our proposed end to end
connectivity aided software, the management can more effectively interact with the teachers,
parents and students as they develop skills and character for success.</br>', '</br><b> Nexrise Technologies</b></br>PMR Towers,</br>Menambedu Main Road</br>Chennai-
600098 </br>Ambattur Industrial Estate,</br>044-65664477, 044-65664488</br>admin@nexrise.in
</br>http://www.nexrisetech.com</br>', 13.100125, 80.170255);
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url,about_us, contact_us) VALUES (
85834430-5d87-11e7-8234-4be92e1eb721,362ec4b7-a7f0-44e0-9c98-01dce9cd70a1,'2017-07-03 21:56:27',NULL,'Guntur',NULL,NULL,'AIzaSyBzEJOJZZ08QB_OuZclcCMQe6GdassT9HA',NULL,NULL,NULL,NULL,NULL,'1038360472986',107,'BHASHYAM BLOOMS','AAAA8cMbbZo:APA91bGVy_YLk2Imb_2PnAnn8EAx7lRBqPEzL0h9bqSz-PiDcZhCJcJyq5JLEUQxZ50TDp78PYArArStziVc2C_t4yY8z47GF1VivnvH0wJw0lBEh8g2lepXdSGBaszlEQ4VUr3x_aQB',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,
'<center><b> BHASHYAM BLOOMS </b></center></br>I am on a constant search to discover what
the world of education is up to within the country and globally. Many models in learning and
methodologies have become inspiration for us to figure out ways of achieving the same results, and
we have been adapting them. Eventually, we would want our students to be prepared for the world
that is soon to be theirs so that they can build it responsibly. </br></br> <b>Bhashyam Rama
Krishna</b></br> <b>Chairman</b><b>Bhashyam RamaKrishna</b></br> <b>Chairman</b>', '<b> Bhashyam Blooms Administrative Block: </b></br>Bhashyam Blooms Road</br> 3rd Lane,
Chandramouli Nagar,</br>Ring Road, Guntur, </br>Andhra Pradesh - 522007. </br>Phone Number:
0863 - 2246015, 0863 - 2256939, </br>Mobile: 098485 36968, 98487 11189</br></br>
<b>Secondary Campus:</b></br>Mobile: 098487 11196</br>Email:
blooms@bhashyam.in</br></br> <b>Bhashyam Toddlers:</b></br>Mobile: 80968 28888</br>
Email: bloomstoddlers@bhashyam.in</br/></br><b>App Related queries:</b></br>Mobile: 98487
78355.');
INSERT INTO nsa.school_details (tenant_id,school_id,created_date,app_key,city,email,fax,google_key,logo,merchant_id,package_name,phone_number,pincode,project_id,school_code,school_name,server_api_key,state,street_address_1,street_address_2,sub_merchant_id,total_employee_strength,total_student_strength,updated_date,website_url) VALUES (
4cdbd690-24d1-11e7-9a7c-1108ffd2d102,7ca3fad4-a571-495e-be1b-ac25de3a2009,'2017-06-10 20:51:40',NULL,'Guntur',NULL,NULL,'AIzaSyCWW4saJZDzZqw7IXyUx1BzPHqGUaHITHw',NULL,NULL,NULL,NULL,NULL,'402828838113',102,'BHASHYAM BLOOMS','AAAAXcp4ROE:APA91bGcBOQ5ZFZToHiiEdMxzhfqlMNdoCYG4WP-2LOb5AJGp3CUrAYuNyJDPv1L-Snv9ChkxcX_lNHuEzPDko6owpGZjJQXZyqT0JUy1aIJuurgz5wxDfnafYKVzIfZJu-Bsj52XLBJ',NULL,NULL,NULL,'',NULL,NULL,NULL,NULL);
