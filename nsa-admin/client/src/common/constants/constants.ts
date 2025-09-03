/**
 * Created by SenthilPeriyasamy on 10/28/2016.
 */
'use strict';

import { Injectable } from '@angular/core';

Injectable()
export class Constants {
    //for login
    tocken = 'id_token';
    syear = 'syear';
    cyear = 'cyear';
    defaultUuid = '00000000-0000-0000-0000-000000000000';

    //for content
    content_type = 'Content-Type';
    accept = 'Accept';
    url_encoded = 'application/json';
    json = 'application/json';

    /*jgrowl Notification Class*/
    j_default = 'bg-primary'
    j_danger = 'bg-danger'
    j_success = 'bg-success'
    j_warning = 'bg-warning'
    j_info = 'bg-info'

    /*Notify Notification Class*/
    n_default = 'alert'
    n_danger = 'error'
    n_success = 'success'
    n_warning = 'warning'
    n_info = 'information'

    /*Method*/
    get_method = 'GET'
    post_method = 'POST'
    put_method = 'PUT'
    delete_method = 'DELETE'

    charMinLength = 160;
    clone = 'clone';
    Sent = 'Sent';

    /*Select Options*/
    languageObj: any[] = ['languageName', 'languageId']
    galleryCatObj: any[] = ['name', 'value']
    leaveTypeObj: any[] = ['leave_type_name', 'leave_type_id']
    classObj: any[] = ['className', 'classId']
    templateObjs: any[] = ['template_title', 'template_id']
    feeStructureObj: any[] = ['feeStructureName', 'feeStructureId']
    feeTypeObj: any[] = ['name', 'id']
    termObj: any[] = ['termName', 'id']
    feeScholarObj: any[] = ['name', 'id']
    feeUsersObj: any[] = ['firstName', 'feeAssignmentDetailId','userName']
    generalObj: any[] = ['name', 'id']
    feeStructureId: any = 'feeStructureId'
    subjectObj: any = ['subName', 'subjectId']
    assignmentTypeObj: any = ['name', 'id']
    userObj: any = ['name', 'id']
    userObject: any = ['firstName', 'id', 'userCode']
    sectionObj: any = ['sectionName', 'sectionId']
    sectionsObj: any = ['section_name', 'section_id']
    routeObj: any = ['route_name','id']
    vehicleObj: any = ['reg_no','vehicle_type']
    HallOfFameObject: any = ['award_name','award_id']

	
	subjectAllocationObj: any = ['subName','subjectId']
    empObj: any = ['firstName', 'userName']
    classEmpObj: any = ['first_name', 'user_name']
    sectionSubObj: any = ['subjectName', 'subjectId']
    aspectObj: any = ['aspectName','aspectId']
    roleObj: any = ['name', 'id']
    departmentObj: any=['dept_name','dept_id']
    designationObj:any =['desg_name','desg_id']
    holidayTypesObj:any=['holidayType','holidayTypeId']
	dayObj: any = ['dayName', 'dayId']
	statusValue = ['name', 'value']
    activityTypeObj = ['activity_type_name', 'activity_type_id']
    eventTypeObj = ['event_type_name', 'event_type_id']
    eventVenueObj = ['venue_type_name', 'venue_type_id']
    studentObject: any = ['firstName','id','userName', 'class_name', 'section_name']
    configClassObject: any =['class_name','class_id']
    examSchedule: any =['written_exam_name','exam_schedule_id']
    gradeObj: any =['key','value']
    scheduleObj: any =['subject_name','subject_id']

    /*Feature Ids*/
    Assignment_Id = '213ec4a2-1b04-4894-9098-d4e7f079961c'
    schoolHoliday_Id='213ec4a2-1b04-4894-9098-d4e7f079961c'
    Fee_Id = '213ec4a2-1b04-4894-9098-d4e7f079961c'
    Attendance_Id = '213ec4a2-1b04-4894-9098-d4e7f079961c'
    Event_id = '213ec4a2-1b04-4894-9098-d4e7f079961c'

    Save = 'Save'
    Update = 'Update'
//channel feature object class names
    sms ='.sms'
    email ='.email'
    push ='.push'
    smsChecked ='.smsChecked'
    emailChecked ='.emailChecked'
    pushChecked ='.pushChecked'

    periodValidation = 'Please provide valid timings at  '
    classConfigValidation = 'Class hours not found for this class. Please go to "Timetable Configuration" for setting up class hours.'

    publishHallOfFame = 'Hall of Fame Award has been published.'
    saveHallOfFame = 'Hall of Fame Award has been saved.'
    updateHallOfFame = 'Hall of Fame Award has been updated.'

    promotionValidation = 'Promotions Cannot be Done'
    promotionReportValidation = 'Promotions Report Cannot be Done'

    periods = "Total Period per week is exceeds ";
    selectClass = "Select Class";
    selectCategory = "Select Category"
    selectSection = "Select Section"
    selectClassTeacher = "Select Class Teacher"
    selectSubject = "Select Subject Details"
    selectEmp = "Select Employee Details"
    CANCELLED = 'Cancelled'
    DENY = 'Deny'
    APPROVED = 'Approved'
    PENDING = 'Pending';
    PermissionValdation = 'Permission Not Selected';
    SystemPermissionValdation = 'Dont have pemission to update Admin Roles';
    userValidation = 'User Not Selected'
    defaultValue = 'default_value';
    isEnable = 'is_enable';


    please_wait = 'Please Wait...'
    updating = 'Updating...'
    getReady = 'Getting Ready...'

    unAuthorizedUrl = 'home/failure?errorCode=401&errorMsg=Unauthorized Access! You have no Permission to Access this Page';


//For Permissions
    FEE_TYPE_PERMISSIONS = ['fee_types_manageAll', 'fee_types_manage', 'fee_types_view', 'fee_types_viewAll'];
    FEE_SCHOLARSHIP_PERMISSIONS = ['fee_scholarship_manageAll', 'fee_scholarship_manage', 'fee_scholarship_view', 'fee_scholarship_viewAll'];
    FEE_STRUCTURE_PERMISSIONS = ['fee_structure_manageAll', 'fee_structure_manage', 'fee_structure_view', 'fee_structure_viewAll'];
    FEE_ASSIGN_PERMISSIONS = ['assign_fees_manageAll', 'assign_fees_manage', 'assign_fees_view', 'assign_fees_viewAll'];

    ASSIGNMENT_TYPE_PERMISSIONS = ['assignment_types_manageAll', 'assignment_types_manage', 'assignment_types_view', 'assignment_types_viewAll'];
    ASSIGNMENT_PERMISSIONS = ['create_assignments_manageAll', 'create_assignments_manage', 'create_assignments_view', 'create_assignments_viewAll'];

    ATTENDANCE_INFO_PERMISSIONS = ['attendance_information_manageAll', 'attendance_information_manage', 'attendance_information_view', 'attendance_information_viewAll'];

    TIMETABLE_CONF_PERMISSIONS = ['timetable_configuration_manageAll', 'timetable_configuration_manage', 'timetable_configuration_view', 'timetable_configuration_viewAll'];
    TIMETABLE_PERMISSIONS = ['create_timetable_manageAll', 'create_timetable_manage', 'create_timetable_view', 'create_timetable_viewAll'];
    SPECIAL_TIMETABLE_PERMISSIONS = ['special_timetable_manageAll', 'special_timetable_manage', 'special_timetable_view', 'special_timetable_viewAll'];

    EVENTS_TYPES_PERMISSIONS = ['event_types_manageAll', 'event_types_manage', 'event_types_view', 'event_types_viewAll'];
    ACTIVITY_TYPES_PERMISSIONS = ['activity_types_manageAll', 'activity_types_manage', 'activity_types_view', 'activity_types_viewAll'];
    EVENTS_VENUES_PERMISSIONS = ['event_venues_manageAll', 'event_venues_manage', 'event_venues_view', 'event_venues_viewAll'];
    CREATE_EVENTS_PERMISSIONS = ['create_events_manageAll', 'create_events_manage', 'create_events_view', 'create_events_viewAll'];

    NOTIFICATION_PERMISSIONS = ['notification_manageAll', 'notification_manage', 'notification_view', 'notification_viewAll'];
    VOICE_PERMISSIONS = ['voice_sms_manageAll', 'voice_sms_manage', 'voice_sms_view', 'voice_sms_viewAll'];
    HALLOFFAME_PERMISSIONS = ['hall_of_fame_view','hall_of_fame_viewAll','hall_of_fame_manage','hall_of_fame_manageAll'];

    ACADEMIC_PERMISSIONS = ['academic_year_manageAll', 'academic_year_manage', 'academic_year_view', 'academic_year_viewAll'];

    CLASS_PERMISSIONS = ['class_manageAll', 'class_manage', 'class_view', 'class_viewAll'];

    SECTION_PERMISSIONS = ['section_list_manageAll', 'section_list_manage', 'section_list_view', 'section_list_viewAll'];
    SECTION_ALLOC_PERMISSIONS = ['section_allocation_manageAll', 'section_allocation_manage', 'section_allocation_view', 'section_allocation_viewAll'];

    SUBJECT_PERMISSIONS = ['subject_list_manageAll', 'subject_list_manage', 'subject_list_view', 'subject_list_viewAll'];
    SUBJECT_ALLOC_PERMISSIONS = ['subject_allocation_manageAll', 'subject_allocation_manage', 'subject_allocation_view', 'subject_allocation_viewAll'];

    HOLIDAY_TYPE_PERMISSIONS = ['holiday_types_manageAll', 'holiday_types_manage', 'holiday_types_view', 'holiday_types_viewAll'];
    HOLIDAY_PERMISSIONS = ['holidays_manageAll', 'holidays_manage', 'holidays_view', 'holidays_viewAll'];

    DEPARTMENT_PERMISSIONS = ['departments_manageAll', 'departments_manage', 'departments_view', 'departments_viewAll'];
    DESIGNATION_PERMISSIONS = ['designation_manageAll', 'designation_manage', 'designation_view', 'designation_viewAll'];

    LEAVE_TYPE_PERMISSIONS = ['leave_types_manageAll', 'leave_types_manage', 'leave_types_view', 'leave_types_viewAll'];
    LEAVE_ASSIGN_PERMISSIONS = ['leave_assignments_manageAll', 'leave_assignments_manage', 'leave_assignments_view', 'leave_assignments_viewAll'];

    ADD_STUDENT_PERMISSIONS = ['students_manageAll', 'students_viewAll', 'students_manage', 'students_view'];
    EMPLOYEE_PERMISSIONS = ['employees_manageAll', 'employees_viewAll', 'employees_manage', 'employees_view'];

    VEHICLE_PERMISSIONS = ['vehicle_manageAll', 'vehicle_manage', 'vehicle_view', 'vehicle_viewAll'];
    DRIVER_PERMISSIONS = ['driver_manageAll', 'driver_manage', 'driver_view', 'driver_viewAll'];
    ROUTE_PERMISSIONS = ['route_manageAll', 'route_manage', 'route_view', 'route_viewAll'];
    VEHICLE_ALLOC_PERMISSIONS = ['transport_allocation_manageAll', 'transport_allocation_manage', 'transport_allocation_view', 'transport_allocation_viewAll'];

    EXAM_TYPE_PERMISSIONS = ['written_exam_type_manageAll', 'written_exam_type_manage', 'written_exam_type_view', 'written_exam_type_viewAll'];
    EXAM_SCHEDULE_PERMISSIONS = ['exam_schedule_manageAll', 'exam_schedule_manage', 'exam_schedule_view', 'exam_schedule_viewAll'];
    MARKS_UPLOAD_PERMISSIONS = ['marks_upload_manageAll', 'marks_upload_manage', 'marks_upload_view', 'marks_upload_viewAll'];
    GALLERY_PERMISSIONS = ['gallery_manageAll', 'gallery_manage', 'gallery_view', 'gallery_viewAll'];
    STUDENT_PROMOTIONS_PERMISSIONS = ['student_promotion_view', 'student_promotion_viewAll', 'student_promotion_manage', 'student_promotion_manageAll'];
    SHUFFLE_STUDENT_PERMISSIONS = ['shuffle_student_view', 'shuffle_student_viewAll', 'shuffle_student_manage', 'shuffle_student_manageAll'];

    MANAGE_ALL = 'manageAll';
    MANAGE = 'manage'

    allowFileTypes = ['image/png', 'image/gif', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/x-msdownload','text/plain','text/csv','text/tab-separated-values','text/html', 'application/pdf','application/msword', 'application/vnd.ms-powerpoint','application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.wordprocessingml.template','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-word.document.macroEnabled.12','application/vnd.openxmlformats-officedocument.wordprocessingml.template', 'application/vnd.ms-word.template.macroEnabled.12','xlsx',
        'application/vnd.ms-excel.sheet.macroEnabled.12','application/vnd.ms-excel.sheet.binary.macroEnabled.12','application/vnd.ms-excel.template.macroEnabled.12','application/vnd.ms-excel.addin.macroEnabled.12'];
    allowFiles = ['.png', '.gif', 'jpeg', 'pdf', 'plain', 'csv', '\n tsv', '.html','.pdf', '.doc', '.pot|.pps|.ppt','\n .xla|.xls|.xlt|.xlw','.docx','.xlsx','.pptx','.exe','\n .docm','.dotx','dotm','xlsm','xlsb','xltm','xlam']

    smsOutOfDate = 'Delivery status is available only for 3 days from the date of SMS delivery.';

    parentChangeNumber = "Change the parent mobile number will change the communication number for the associated wards. Do you want to change the parent mobile number?";
    deActiveStudentErr = "Cannot edit the details of a student whose account has been disabled. Please enable the account to edit."
    deActiveEmployeeErr = "Cannot edit the details of an employee whose account has been disabled. Please enable the account to edit."
    NumberExistingErr = "The mobile number you tried to add to the student already exists for a parent. Please go to respective Parent Login and add the Ward.";
    cAcademicYear = '2017-2018';
    nAcademicYear = '2018-2019';
}
