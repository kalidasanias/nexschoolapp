/**
 * Created by senthil on 10/02/17.
 */
'use strict';

var constants = function f(options) {
    var self = this;
};

constants.CONTACT_ADMIN = "Contact Admin";
constants.DEFAULT_PARAM_SIZE = '10000';
constants.ES_CHUNK_SIZE = '5000';
constants.ES_100_CHUNK_SIZE = '100';

constants.HTTP_BAD_REQUEST = '400';

//General Constants For Elastic Search
constants.ES_USER_NAME = 'user_name';
constants.ES_DEPT_ID = 'dept.dept_id';
constants.STUDENT = 'Student';
constants.PARENT = 'Parent';
constants.EMPLOYEE = 'Employee';
constants.TENANT_ID = 'tenant_id';
constants.SCHOOL_ID = 'school_id';
constants.ES_ACTIVE = 'active';
constants.ES_DEACTIVATE = 'deactivated';
constants.ALL_EMPLOYEE = 'All Employee';
constants.ES_ROLE_ID = 'roles.role_id';

constants.DIFF_NUM = 1;

constants.ES_DEPARMENT_DEPT_ID = 'dept.dept_id';
constants.ES_SUBJECT_SUB_ID = 'subjects.subject_id';
constants.ES_CLASSES_CLASS_ID = 'classes.class_id';
constants.ES_CLASSES_SECTION_ID = 'classes.section_id';
constants.ES_ACADEMIC_YEAR = 'academic_year';
constants.ES_CLASS_ID = 'class_id';
constants.ES_OBJECT_ID = 'object_id';
constants.ES_SECTION_ID = 'section_id';
constants.ES_SUBJECTS = 'subjects';
constants.ES_SUBJECTS_SUBJECT_ID = 'subjects.subject_id';
constants.ES_VEHICLE="vehicle_no";
constants.ES_UPDATED_DATE="updated_date";
constants.ES_ORDER="order";
constants.ES_ORDER_DSC="desc";
constants.ES_ORDER_ASC="asc";
constants.ES_STATUS="status";
constants.ES_PROMOTED="promoted";

//Elastic Search Constants
constants.ES_QUERY = 'query';
constants.ES_QUERY_STRING = 'query_string';
constants.ES_TERMS = 'terms';
constants.ES_RANGE = 'range';
constants.ES_USER_TYPE = 'user_type';
constants.ES_MATCH = 'match';
constants.ES_MATCH_PHRASE = 'match_phrase';
constants.ES_QUERY_GTE = 'gte';
constants.ES_QUERY_LT = 'lt';
constants.ES_NESTED = 'nested';
constants.ES_HAS_CHILD = 'has_child';
constants.ES_HAS_PARENT = 'has_parent';

constants.MANAGE_ALL = 'manageAll';
constants.MANAGE =  'manage';
constants.VIEW_All = 'viewAll';
constants.VIEW = 'view';

constants.FEATURE_ID = 'feature_id';

/*Exception Handling*/
constants.APP_TYPE = 'Application';

//Dashboard
constants.DASHBOARD = 'Dashboard';

constants.SCHOOL = 'School Details';

//AUthentication
constants.AUTH_NAME = 'Authentication Failiure';

//Notification
constants.NOTIFY_NAME = 'Notification'

//OnBoardNotification
constants.ONBOARD = 'Onboard'

//User Details
constants.USER_NAME = "User Details"

//Vehicle Details
constants.VEHICLE = "Vehicle Details"

//Driver Details
constants.DRIVER = "Driver Details"

//Route Details
constants.ROUTE = "Route Details"

//Vehicle User Allocation Details
constants.VEHICLE_ALLOCATION = "Vehicle User Allocation"

//Terms
constants.TERM_NAME = "Term Details"

//Template
constants.TEMPLATE_NAME = "Term Details";

//Fee Management
constants.FEE_NAME = 'Fee'

//Course Management
constants.COURSE_MANAGEMENT ='CourseManagement Details'

//Feature Management
constants.FEATURE_NAME = "Feature"

//Language Management
constants.LANG_NAME = "Language Details"

//Assignment
constants.ASSIGNMENT_NAME = 'Assignment'

//Aspects
constants.ASPECTS = 'Aspects'

//Subject
constants.SUB_NAME = 'Subject Details'

//Scheduler
constants.SCHEDULER_NAME = 'Scheduler'

//Classes
constants.CLASS_NAME = 'Class Details'

//Sections
constants.SECTION_NAME = 'Section Details'
constants.SCHOOL_SECTION= 'School Sections'

//Conversation
constants.CONVERSATION_NAME = 'Conversation Details'

//Attendance
constants.ATTENDANCE_NAME = 'Attendance'

//Academic Year
constants.ACADEMIC_NAME = 'Academic Year'

//Department
constants.DEPARTMENT = 'Department'

//Department
constants.DESIGNATION = 'Designation'

//Leave Type
constants.LEAVE_TYPE = 'Leave Type'

//Leave Assign
constants.LEAVE_ASSIGN = 'Assign leave'

//Audit Log
constants.AUDITLOG = 'AuditLog'

//Periods
constants.PERIODS_NAME = 'Periods'
constants.HOLIDAY_NAME = 'Holidays'



//Timetable
constants.TIME_TABLE_NAME = 'Timetable';
constants.CREATE_TIMETABLE_NAME = 'Create_Timetable';

//Events
constants.EVENTS_NAME = 'Events';

//Hall Of Fames
constants.HALLOFFAME = 'HallOfFames'

//Taxanomy
constants.TAXANOMY_NAME = 'Taxanomy';

//Leaves
constants.LEAVES_NAME = 'Leave Details';

constants.ROLES_DETAILS = 'Roles Details';
constants.GALLERY_DETAILS = 'Gallery';

constants.WRITTEN_EXAM = 'Written Exam Type';

//MarkList
constants.MARKLIST_DETAILS = 'Marklist Details';

//Grade Details
constants.GRADE_DETAILS = 'Grade Details'

//Features
constants.NOTIFICATION = '7c76c989-7f45-4724-88df-e59fdd546e2a';
constants.FEE = 'dbb09163-111a-46d9-8c7d-c6f7cb74ad18';
constants.ASSIGNMENT = '222641f1-faa2-4b85-9086-5b467782a178';
constants.ATTENDANCE = '57a6d687-a859-4d86-9a8c-3663ce2ab863';
constants.TIMETABLE = 'a4afff4d-b478-4634-b4dc-cf1f804162ca';
constants.EVENTS = '8ec45a48-2392-46ad-b397-f1477993ae1c';
constants.HOLIDAYS = '42f01fd0-0040-4c54-913c-22baabbe4c79';
constants.TRANSPORT = '6f57fdf2-a978-4ebf-a111-31adeb578884';
constants.EXAM_SCHEDULE = 'b4ee4435-9628-4cbd-ba82-fe204013c5fb';
constants.ACTIVITIES = '54d3d176-1639-4fd8-9519-872057850b7d';

//Sub Features
constants.CREATE_FEE = '634a551a-d1b0-4516-bab8-91ccd9415c47';
constants.CREATE_ASSIGNMENT = '54242065-0ee8-4420-b728-6e719b63c657';
constants.UPDATE_ASSIGNMENT = '44caee0e-9d28-47ae-9395-63d13146b387';
constants.PRESENT_ATTENDANCE = 'a204c780-d405-494d-a8c3-41e2bfaeea72';
constants.ABSENT_ATTENDANCE = '2280dcc7-ffdd-4c0f-a775-323e750706ee';
constants.CREATE_TIMETABLE = '2bbf5823-9384-4b26-bc45-aba1a11b36a0';
constants.CREATE_EVENTS = '8f5d82b5-7de5-46be-857e-1623723ae8e1';
constants.DELETE_EVENTS = 'b52288c7-c80b-4e2c-b879-19b766fea823';
constants.CREATE_HOLIDAYS = '82ccb585-6625-49dc-b978-6570f4a83b9e';
constants.LIVETRACKING = 'eebeb1e5-fb69-4b6f-be9b-c04f18b8cf72';
constants.CREATE_EXAM = 'dc1c8fb4-c39c-4972-8c01-36b8912b8c0b';
constants.SPECIAL_TIMETABLE  = '849525dd-6813-4fd3-aa9d-1b721da04fa7';
constants.HALL_OF_FAME = '5ff5e9c0-2bd6-49c2-84d5-102c5367dd6a';
constants.VOICE_MESSAGE = '61beb5c0-20da-4dfe-8f04-98538b5a9153';

//Actions
constants.CREATE_ACTION = 1;
constants.UPDATE_ACTION = 2;
constants.DELETE_ACTION = 3;
constants.UPLOAD_ACTION = 4;
constants.PRESENT_NOTIFICATION = 1;
constants.ABSENT_NOTIFICATION = 2;

constants.CREATE = 'INSERT';
constants.UPDATE = 'UPDATE';
constants.DELETE = 'DELETE';

// For AWS
constants.NOTES_FOLDER = 'notes';

constants.FIRST_NAME = 'firstName'


//For Leave Status
constants.APPROVED = 'Approved';
constants.PENDING = 'Pending';
constants.DENIED = 'Deny';
constants.CANCELLED = 'Cancelled';

//For Password Reset
constants.PASSWORD_RESET = 'Your {school_name} App password has been reset. Your new password is {password}. Thank you!';
constants.PASSWORD_RESET_TITLE = 'Reset Password';


//For Permissions
constants.GALLERY_PERMISSIONS = ['gallery_manageAll', 'gallery_manage', 'gallery_view', 'gallery_viewAll'];
constants.FEE_TYPE_PERMISSIONS = ['fee_types_manageAll', 'fee_types_manage', 'fee_types_view', 'fee_types_viewAll'];
constants.FEE_SCHOLARSHIP_PERMISSIONS = ['fee_scholarship_manageAll', 'fee_scholarship_manage', 'fee_scholarship_view', 'fee_scholarship_viewAll'];
constants.FEE_STRUCTURE_PERMISSIONS = ['fee_structure_manageAll', 'fee_structure_manage', 'fee_structure_view', 'fee_structure_viewAll'];
constants.FEE_ASSIGN_PERMISSIONS = ['assign_fees_manageAll', 'assign_fees_manage', 'assign_fees_view', 'assign_fees_viewAll'];

constants.ASSIGNMENT_TYPE_PERMISSIONS = ['assignment_types_manageAll', 'assignment_types_manage', 'assignment_types_view', 'assignment_types_viewAll'];
constants.ASSIGNMENT_PERMISSIONS = ['create_assignments_manageAll', 'create_assignments_manage', 'create_assignments_view', 'create_assignments_viewAll'];

constants.ATTENDANCE_INFO_PERMISSIONS = ['attendance_information_manageAll', 'attendance_information_manage', 'attendance_information_view', 'attendance_information_viewAll'];
constants.ATTENDANCE_HISTORY_PERMISSIONS = ['attendance_history_manageAll', 'attendance_history_manage', 'attendance_history_view', 'attendance_history_viewAll'];

constants.TIMETABLE_CONF_PERMISSIONS = ['timetable_configuration_manageAll', 'timetable_configuration_manage', 'timetable_configuration_view', 'timetable_configuration_viewAll'];
constants.TIMETABLE_PERMISSIONS = ['create_timetable_manageAll', 'create_timetable_manage', 'create_timetable_view', 'create_timetable_viewAll'];
constants.EMP_TIMETABLE_PERMISSIONS = ['employee_timetable_manageAll', 'employee_timetable_manage', 'employee_timetable_view', 'employee_timetable_viewAll'];
constants.SPECIAL_TIMETABLE_PERMISSIONS = ['special_timetable_manageAll', 'special_timetable_manage', 'special_timetable_view', 'special_timetable_viewAll'];

constants.EVENTS_TYPES_PERMISSIONS = ['event_types_manageAll', 'event_types_manage', 'event_types_view', 'event_types_viewAll'];
constants.ACTIVITY_TYPES_PERMISSIONS = ['activity_types_manageAll', 'activity_types_manage', 'activity_types_view', 'activity_types_viewAll'];
constants.EVENTS_VENUES_PERMISSIONS = ['event_venues_manageAll', 'event_venues_manage', 'event_venues_view', 'event_venues_viewAll'];
constants.CREATE_EVENTS_PERMISSIONS = ['create_events_manageAll', 'create_events_manage', 'create_events_view', 'create_events_viewAll'];

constants.NOTIFICATION_PERMISSIONS = ['notification_manageAll', 'notification_manage', 'notification_view', 'notification_viewAll'];
constants.VOICE_PERMISSIONS = ['voice_sms_manageAll', 'voice_sms_manage', 'voice_sms_view', 'voice_sms_viewAll'];

constants.ACADEMIC_PERMISSIONS = ['academic_year_manageAll', 'academic_year_manage', 'academic_year_view', 'academic_year_viewAll'];

constants.CLASS_PERMISSIONS = ['class_manageAll', 'class_manage', 'class_view', 'class_viewAll'];

constants.SECTION_PERMISSIONS = ['section_list_manageAll', 'section_list_manage', 'section_list_view', 'section_list_viewAll'];
constants.SECTION_ALLOC_PERMISSIONS = ['section_allocation_manageAll', 'section_allocation_manage', 'section_allocation_view', 'section_allocation_viewAll'];

constants.SUBJECT_PERMISSIONS = ['subject_list_manageAll', 'subject_list_manage', 'subject_list_view', 'subject_list_viewAll'];
constants.SUBJECT_ALLOC_PERMISSIONS = ['subject_allocation_manageAll', 'subject_allocation_manage', 'subject_allocation_view', 'subject_allocation_viewAll'];

constants.HOLIDAY_TYPE_PERMISSIONS = ['holiday_types_manageAll', 'holiday_types_manage', 'holiday_types_view', 'holiday_types_viewAll'];
constants.HOLIDAY_PERMISSIONS = ['holidays_manageAll', 'holidays_manage', 'holidays_view', 'holidays_viewAll'];

constants.DEPARTMENT_PERMISSIONS = ['departments_manageAll', 'departments_manage', 'departments_view', 'departments_viewAll'];
constants.DESIGNATION_PERMISSIONS = ['designation_manageAll', 'designation_manage', 'designation_view', 'designation_viewAll'];

constants.ADD_STUDENT_PERMISSIONS = ['students_manageAll', 'students_viewAll', 'students_manage', 'students_view'];
constants.EMPLOYEE_PERMISSIONS = ['employees_manageAll', 'employees_viewAll', 'employees_manage', 'employees_view'];

constants.LEAVE_TYPE_PERMISSIONS = ['leave_types_manageAll', 'leave_types_manage', 'leave_types_view', 'leave_types_viewAll'];
constants.LEAVE_ASSIGN_PERMISSIONS = ['leave_assignments_manageAll', 'leave_assignments_manage', 'leave_assignments_view', 'leave_assignments_viewAll'];

constants.VEHICLE_PERMISSIONS = ['vehicle_manageAll', 'vehicle_manage', 'vehicle_view', 'vehicle_viewAll'];
constants.DRIVER_PERMISSIONS = ['driver_manageAll', 'driver_manage', 'driver_view', 'driver_viewAll'];
constants.ROUTE_PERMISSIONS = ['route_manageAll', 'route_manage', 'route_view', 'route_viewAll'];
constants.VEHICLE_ALLOC__PERMISSIONS = ['transport_allocation_manageAll', 'transport_allocation_manage', 'transport_allocation_view', 'transport_allocation_viewAll'];

constants.EXAM_TYPE_PERMISSIONS = ['written_exam_type_manageAll', 'written_exam_type_manage', 'written_exam_type_view', 'written_exam_type_viewAll'];
constants.EXAM_SCHEDULE_PERMISSIONS = ['exam_schedule_manageAll', 'exam_schedule_manage', 'exam_schedule_view', 'exam_schedule_viewAll'];
constants.MARKS_UPLOAD_PERMISSIONS = ['marks_upload_manageAll', 'marks_upload_manage', 'marks_upload_view', 'marks_upload_viewAll'];
constants.HALL_OF_FAME_PERMISSIONS = ['hall_of_fame_view','hall_of_fame_viewAll','hall_of_fame_manage','hall_of_fame_manageAll'];
constants.PARENT_INFORMATION_PERMISSIONS = ['Parent_information_manageAll'];
constants.STUDENT_PROMOTIONS_PERMISSIONS = ['student_promotion_view', 'student_promotion_viewAll', 'student_promotion_manage', 'student_promotion_manageAll'];

module.exports = constants;
