/**
 * Created by SenthilPeriyasamy on 10/28/2016.
 */
'use strict';

import { Injectable } from '@angular/core';

Injectable();
export class ServiceUrls {

    serviceBaseUrl = 'http://localhost:3333/rest/api/v1/nsa/';
    authUrl = this.serviceBaseUrl + 'auth';
    logoutUrl = this.serviceBaseUrl + 'auth/invalidate/';
    forgotPwdUrl = this.serviceBaseUrl + 'forgot';
    changePwdUrl = this.serviceBaseUrl + 'auth/changepwd/';
    resetPwdUrl = this.serviceBaseUrl + 'auth/reset';
    sendOtpUrl = this.serviceBaseUrl + 'auth/sendotp';
    getAllTemplatesUrl = this.serviceBaseUrl + 'sms/templates';
    getMediaCountUrl = this.serviceBaseUrl + 'sms/media/1';
    getAllRoles = this.serviceBaseUrl + 'contact/roles'
    getTemplateByID = this.serviceBaseUrl + 'sms/template';
    saveTemplate = this.serviceBaseUrl + 'sms/notifications';
    getNotificaionLogsByObject = this.serviceBaseUrl + 'sms/object/';
    saveDaftTemplate = this.serviceBaseUrl + 'sms/notification/draft/';
    saveSentTemplate = this.serviceBaseUrl + 'sms/notification/sent/';
    deleteDraftNotificationUrl = this.serviceBaseUrl + 'sms/notification/draft/';
    getAllNotifications = this.serviceBaseUrl + 'sms/notifications';
    getNotificationById = this.serviceBaseUrl + 'sms/notification';
    updateNotification = this.serviceBaseUrl + 'sms/notification/draft';
    getAllNotificationLogs = this.serviceBaseUrl + 'sms/notification/log';
    checkStatusUrl = this.serviceBaseUrl + 'sms/status/';
    getAllUsersUrl = this.serviceBaseUrl + 'sms/users';
    getUserNotification = this.serviceBaseUrl + 'notification/log/';
    getUserNotificationByUser = this.serviceBaseUrl + 'sms/notification/user/';
    OnboardNotification = this.serviceBaseUrl + 'onboard/';
    allVoiceNotification = this.serviceBaseUrl + 'voice/messages';
    voiceNotification = this.serviceBaseUrl + 'voice/';
    voiceCountUrl = this.serviceBaseUrl + 'sms/media/5';
    audioUrl = this.serviceBaseUrl + 'voice/audio';
    scheduleVoiceNow = this.serviceBaseUrl + 'voice/now';
    getAllAudios = this.serviceBaseUrl + 'voice/audios';

    // Dashboard
    getDashboardInfo = this.serviceBaseUrl + 'dashboard/info';
    getDashboardCount = this.serviceBaseUrl + 'dashboard/employee/';
    getDashboardNotifications = this.serviceBaseUrl + 'dashboard/notifications';
    getDashboardAttendance = this.serviceBaseUrl + 'dashboard/attendance';
    getDashboardTimetable = this.serviceBaseUrl + 'dashboard/timetable';
    getDashboardNotes = this.serviceBaseUrl + 'dashboard/notes';
    getDashboardCalendar = this.serviceBaseUrl + 'dashboard/calendar';
    getDashboardEvents = this.serviceBaseUrl + 'dashboard/events/';
    getStudentCalendarDetails = this.serviceBaseUrl + 'dashboard/calendar/student/';
    getStudentDetailsByName = this.serviceBaseUrl + 'es/user/';


    //Taxanomy
    getAllCategoriesUrl = this.serviceBaseUrl + 'taxanomy';
    getFeeCategories = this.serviceBaseUrl + 'taxanomy/fee';
    getLevelCategories = this.serviceBaseUrl + 'taxanomy/classes/';
    getAllDeptCategories = this.serviceBaseUrl + 'taxanomy/dept';

    //Terms
    getAllTerms = this.serviceBaseUrl + 'terms/';

    //Languages
    getAllLanguages = this.serviceBaseUrl + 'languages/';

    //classes
    getAllClasses = this.serviceBaseUrl + 'classes/';
    getActiveClasses =this.serviceBaseUrl +'classes/active';
    getClassByClassId = this.serviceBaseUrl + 'classes/';
    updateClassStatus = this.serviceBaseUrl + 'classes/';
    getSectionsByClass = this.serviceBaseUrl + 'sections/class/';
    getPromotionsSec = this.serviceBaseUrl + 'promotions/class/sections/';

    //course Managements
    getAllCourses = this.serviceBaseUrl +'course/';

    //feedback

    getFeedBack = this.serviceBaseUrl + 'feedback/';

    //Academics
    getAllAcademics = this.serviceBaseUrl + 'academics/';

    getSchoolDetails = this.serviceBaseUrl + 'school/';
    getSchoolLogo = this.serviceBaseUrl + 'school/logo/';

    //holidays types
    getAllHolidayTypes = this.serviceBaseUrl +'holidays/types/';
    holidays = this.serviceBaseUrl + 'holidays/types/';
    //school holidays
    getAllSchoolHolidays =  this.serviceBaseUrl + 'holidays/school/';
    schoolHoliday = this.serviceBaseUrl + 'holidays/school/';

    //Subjects
    getSchoolSubjects = this.serviceBaseUrl + 'subject/';
    getActiveSchoolSubjects = this.serviceBaseUrl + 'subject/active';
    getSchoolSubjectById =this.serviceBaseUrl +'subject/';
    deleteSchoolSubject = this.serviceBaseUrl + 'subject/';
    updateSchoolSubject =this.serviceBaseUrl + 'subject/';
    saveSchoolSubject =this.serviceBaseUrl + 'subject/';
	getSubjectsBySections = this.serviceBaseUrl + 'subject/section';
	getSubjectsByMultiSections = this.serviceBaseUrl + 'subject/sections';

    getSchoolClassSubject = this.serviceBaseUrl + 'subject/allocations/all';
    getSchoolClassSubjects = this.serviceBaseUrl + 'subject/allocation';
    saveSchoolClassSubjects = this.serviceBaseUrl+ 'subject/allocation';
    deleteSchoolClassSubjects = this.serviceBaseUrl + 'subject/allocation/';

	//subjectaspects
    aspects = this.serviceBaseUrl +'aspects/';

    //Fee
    getFeeTypes = this.serviceBaseUrl + 'fee/types/';
    getFeeType = this.serviceBaseUrl + 'fee/type';
    saveFeeType = this.serviceBaseUrl + 'fee/type';
    updateFeeType = this.serviceBaseUrl + 'fee/type/';
    deleteFeeType = this.serviceBaseUrl + 'fee/type/';

    getFeeScholarships = this.serviceBaseUrl + 'fee/scholarships/';
    getValidFeeScholarships = this.serviceBaseUrl + 'fee/scholarships/valid/';
    getFeeScholarship = this.serviceBaseUrl + 'fee/scholarship/';
    saveFeeScholarship = this.serviceBaseUrl + 'fee/scholarship';
    updateFeeScholarship = this.serviceBaseUrl + 'fee/scholarship/';
    deleteFeeScholarship = this.serviceBaseUrl + 'fee/scholarship/';

    getFeeStructures = this.serviceBaseUrl + 'fee/structures';
    getActiveFeeStructures =this.serviceBaseUrl+'fee/structures/active';
    getFeeStructure = this.serviceBaseUrl + 'fee/structure/';
    saveFeeStructure = this.serviceBaseUrl + 'fee/structure';
    updateFeeStructure = this.serviceBaseUrl + 'fee/structure/';
    deleteFeeStructure  = this.serviceBaseUrl + 'fee/structure/';

    getFeeAssignments = this.serviceBaseUrl + 'fee/assignments';
    getFeeAssignment = this.serviceBaseUrl + 'fee/assignment/';
    saveFeeAssignment = this.serviceBaseUrl + 'fee/assign';
    updateFeeAssignment = this.serviceBaseUrl + 'fee/assignment/';
    deleteFeeAssignment = this.serviceBaseUrl + 'fee/assignment/';
    getFeeAssignedUsers = this.serviceBaseUrl + 'fee/assign/users/';
    getFeeAssignedUser = this.serviceBaseUrl + 'fee/users/';

    getFeeAssignmentsDetails = this.serviceBaseUrl + 'fee/assignments/details/';
    getFeeAssignmentDetail = this.serviceBaseUrl + 'fee/assignments/detail/';
    saveFeeAssignmentDetail = this.serviceBaseUrl + 'fee/assignments/detail/';
    deleteFeeAssignmentDetail = this.serviceBaseUrl + 'fee/assignments/detail/';
    updateFeeAssignmentDetail = this.serviceBaseUrl + 'fee/assign/details';

    updateAssignFeeAndDetails = this.serviceBaseUrl + 'fee/assign/';
    getFeatureDetails = this.serviceBaseUrl + 'feature/active/';
    getChildFeatureDetails = this.serviceBaseUrl + 'feature/child/';
    getFeatureById = this.serviceBaseUrl + 'feature/';
    getFeatureChannelConfiguration = this.serviceBaseUrl + 'feature/channel/';
    publishFeeAssign = this.serviceBaseUrl + 'fee/publish/';
    getFeeScholarshipUsers = this.serviceBaseUrl + 'fee/scholarships/users/';

    getAssignedUsersFeeDetails = this.serviceBaseUrl + 'fee/assign/users/';
    getUserContactDetails = this.serviceBaseUrl + 'user/contact/details';

    /*emp management*/
    getAllEmployees = this.serviceBaseUrl + 'user/employees/details';
    getActiveEmployees = this.serviceBaseUrl +'employee/active';
    roles = this.serviceBaseUrl + 'roles/';
    permissions = this.serviceBaseUrl + 'roles/permissions/';

    //Assignment Feature

    getAssignmentTypes = this.serviceBaseUrl + 'assignment/types/';
    deleteAssignmentAttachement = this.serviceBaseUrl + 'assignment/attachments/';
    deleteNotifyAttachement = this.serviceBaseUrl + 'sms/notification/attachments/';

    getAssignments = this.serviceBaseUrl + 'assignment';
    getAssignment = this.serviceBaseUrl + 'assignment';
    saveAssignment = this.serviceBaseUrl + 'assignment';
    updateAssignment = this.serviceBaseUrl + 'assignment/';
    deleteAssignment = this.serviceBaseUrl + 'assignment/';

    department = this.serviceBaseUrl + 'department/';
    designation = this.serviceBaseUrl + 'designation/';
    vehicle = this.serviceBaseUrl + 'vehicle/';
    activeVehicle = this.serviceBaseUrl + 'vehicle/active';
    driver = this.serviceBaseUrl + 'driver/';
    route = this.serviceBaseUrl + 'route/';
    tracking = this.serviceBaseUrl + 'tracking/';
    employee = this.serviceBaseUrl + 'employee/';
    resetPwd = this.serviceBaseUrl + 'employee/pwdreset';
    userAttachments = this.serviceBaseUrl + 'user/attachments/';
    employeeSearch = this.serviceBaseUrl + 'employee/dept/';
    student = this.serviceBaseUrl + 'student/';
    classSession = this.serviceBaseUrl + 'classes/sections/';
    leaveType = this.serviceBaseUrl + 'leavetype/';
    leaveAssign = this.serviceBaseUrl + 'leaveassign/';
    studentByClassAndSection = this.serviceBaseUrl + 'vehicleallocation/users/';
    userAssign = this.serviceBaseUrl + 'vehicleallocation/';
    getRoutesByVehicle = this.serviceBaseUrl + 'vehicle/route/';

    //communication
    ChannelFeatures =this.serviceBaseUrl + 'feature/channel';

    getAllAssignmentsTypes = this.serviceBaseUrl + 'assignment/types/';
    getAssignmentType = this.serviceBaseUrl + 'assignment/type/';
    saveAssignmentType = this.serviceBaseUrl + 'assignment/type';
    addAttachments = this.serviceBaseUrl + 'assignment/attachments/'
    addNotificationAttachments = this.serviceBaseUrl + 'sms/notification/attachments/';
    updateAssignementType = this.serviceBaseUrl + 'assignment/type/';
    deleteAssignementType = this.serviceBaseUrl + 'assignment/type/';

    getAssignmentDetail = this.serviceBaseUrl + 'assignment/details/';
    getAssignmentDetailById = this.serviceBaseUrl + 'assignment/details/';



    //ElastiSearch Query
    getUsersByClassAndSections = this.serviceBaseUrl + 'es/student/classes';
    getAllStudents = this.serviceBaseUrl + 'es/student/all';
    searchStudent = this.serviceBaseUrl + 'es/search/';

    //Attendance
    getAttedanceUsersByClassAndSections = this.serviceBaseUrl + 'attendance/class/';
    getAttendanceLists = this.serviceBaseUrl + 'attendance/';
    saveAttendance = this.serviceBaseUrl + 'attendance/';
    updateAttendance = this.serviceBaseUrl + 'attendance/';

    getDetailsByAttendanceId = this.serviceBaseUrl + 'attendance/details/';
    getAttendanceOverviewByUser = this.serviceBaseUrl + 'attendance/user/overview/';

    getOverallAttendanceHistory = this.serviceBaseUrl + 'attendance/history/';
    getAttendanceHistory = this.serviceBaseUrl + 'attendance/history';

    getAllStudentLeaveHistory = this.serviceBaseUrl + '/attendance/leave/history/class/';
    getOverallLeaveHistory = this.serviceBaseUrl + '/attendance/leave/history/overall/';
    getStudentLeaveHistory = this.serviceBaseUrl + 'attendance/details/user/';
    getSchoolAttendanceOverview = this.serviceBaseUrl + 'attendance/history/overview';

    /*CCAvenue Payment GateWay*/
    payByCash = this.serviceBaseUrl + 'payment/bycash';
    getReqDetails = this.serviceBaseUrl + 'ccavenue/';
    getTransactionDetails = this.serviceBaseUrl + 'transaction/';

    /*Timetable*/
    timetableConfig = this.serviceBaseUrl + 'timetable/config/';
    timetableConfigByClass = this.serviceBaseUrl + 'timetable/config/class/';
    timetableAllConfigClasses = this.serviceBaseUrl + 'timetable/allconfigClass';
    getClassTeacher = this.serviceBaseUrl + 'timetable/class/teacher/';
    classTimetable = this.serviceBaseUrl + 'timetable/class/';
    empTimetableSlots = this.serviceBaseUrl + 'timetable/emp/';
    timetableForClass = this.serviceBaseUrl + 'timetable/class/';
    timetableForClassAdd = this.serviceBaseUrl + 'timetable/class/add/';
    saveAndNotify = this.serviceBaseUrl + 'timetable/publish/';
    timetable = this.serviceBaseUrl + 'timetable/';
    EmployeeTimetable = this.serviceBaseUrl + 'timetable/emp';
    EmpTimetable = this.serviceBaseUrl + 'timetable/emp/cal/';
    TimetableAttachement = this.serviceBaseUrl + 'attachments';
    notesNotifyUrl = this.serviceBaseUrl + 'timetable/notes/notify';
    specialDayTimetable = this.serviceBaseUrl + 'timetable/special/day';
    employeeTimetable = this.serviceBaseUrl + 'timetable/employee/details';
    generateTimtetable = this.serviceBaseUrl + 'timetable/generate/';

    /*Section List*/
    section = this.serviceBaseUrl  + 'sections/';
    activeSection = this.serviceBaseUrl  + 'sections/active';

    /* Hall Of Fame*/
     hallOfFame = this.serviceBaseUrl + 'halloffame/';
     getAllAwards = this.serviceBaseUrl + 'halloffame/awards';
     hallOfFameDetails = this.serviceBaseUrl + 'halloffame/details/';
    /*section-Allocation*/
    SectionByClass = this.serviceBaseUrl + 'sections/allocation/details';
    deleteSectionByClass = this.serviceBaseUrl + 'sections/allocation/details/';
    updateSectionByClass = this.serviceBaseUrl + 'sections/allocation/details/';
    getSecByClass = this.serviceBaseUrl + 'sections/class';

    getAllDays = this.serviceBaseUrl + 'days';
    getAllPeriods = this.serviceBaseUrl + 'periods';
    getClassPeriods = this.serviceBaseUrl + 'periods/class/';
    savefile = this.serviceBaseUrl + 'timetable/notes';
    getfile = this.serviceBaseUrl + 'timetable/view/notes';

    //Events
    eventType = this.serviceBaseUrl + 'events/types/';
    activityType = this.serviceBaseUrl + 'events/activity/';
    eventVenue = this.serviceBaseUrl + 'events/venues/';
    event = this.serviceBaseUrl + 'events/';
    eventAttachments = this.serviceBaseUrl + 'events/attachments/';
    eventDetails = this.serviceBaseUrl + 'events/details/';
    weekEvent = this.serviceBaseUrl + 'events/month/year/';
    empClassEvents = this.serviceBaseUrl + 'events/user/class/';

    //school details
    school_details = this.serviceBaseUrl + 'auth/credentials/'
    subjectByEmployee = this.serviceBaseUrl + 'employee/subject/'

    //Leaves Feature

    leavesTaken = this.serviceBaseUrl + 'leaves/emp/taken/'
    pastleavesTaken =this.serviceBaseUrl +'leaves/emp/past/taken/'
    remainigleaves = this.serviceBaseUrl + 'leaves/emp/remaining/'
    userLeaves = this.serviceBaseUrl + 'leaves/emp/apply/'
    leaves = this.serviceBaseUrl + 'leaves/emp/'
    leavesCal = this.serviceBaseUrl + 'leaves/emp/cal/'
    leavesReason = this.serviceBaseUrl + 'leaves/emp/reason/'
    requestedLeaves = this.serviceBaseUrl + 'leaves/emp/requested/'
    employeeList = this.serviceBaseUrl + 'leaves/employees/list/'
    approvalHistory = this.serviceBaseUrl + 'leaves/approval/history/'
    schoolWeekOff = this.serviceBaseUrl + 'holidays/school/week/off/'
    galleryCategory = this.serviceBaseUrl + 'gallery/category/'
    galleryAlbum = this.serviceBaseUrl + 'gallery/'
    galleryAlbumDetails = this.serviceBaseUrl + 'gallery/details/'

    //Exams
    examType = this.serviceBaseUrl + 'exam/type/'
    examSchedule = this.serviceBaseUrl + 'exam/schedule/'
    examScheduleByType = this.serviceBaseUrl + 'exam/schedule/type/'
    deletePortionAttachement = this.serviceBaseUrl + 'exam/attachemnet/'
    getPortion = this.serviceBaseUrl + 'exam/portion/'

    examScheduleByClassAndSection = this.serviceBaseUrl + 'exam/schedule/details/'
    getUsersByClassAndSection = this.serviceBaseUrl + 'marks/details/'
    getMarkList = this.serviceBaseUrl + 'marks/list/'
    getMarkstat = this.serviceBaseUrl + 'marks/statistics/'
    getGradeStatsBySub = this.serviceBaseUrl + 'marks/grade/sub/'
    getGradeRankBySub = this.serviceBaseUrl + 'marks/ranks/sub/'
    getranks = this.serviceBaseUrl + 'marks/ranks/'
    updateMarks = this.serviceBaseUrl + 'marks/update/'
    publishMarks = this.serviceBaseUrl + 'marks/publish/'
    deleteMark = this.serviceBaseUrl + 'marks/list/'
    getMarkListSheet = this.serviceBaseUrl + 'marks/generate/'
    uploadMarkListSheet = this.serviceBaseUrl + 'marks/uploadsheet/'

    testing = this.serviceBaseUrl + 'ping/get/'
    testingHeading = this.serviceBaseUrl + 'ping/heading/'
    testingData = this.serviceBaseUrl + 'ping/data/'

    //parentInformation urls
    parent = this.serviceBaseUrl + 'members/';
    parentInfo = this.serviceBaseUrl + 'members/allParents';

    printPC = this.serviceBaseUrl + 'marks/print';

    //promote Studnets
    getPromoteStudents = this.serviceBaseUrl + 'promotions/users/';
    promoteStudents = this.serviceBaseUrl + 'promotions/class/students/';
    promotedClass = this.serviceBaseUrl + 'promotions/classes/';
    getAcademicYears = this.serviceBaseUrl + 'promotions/academic/years';
    getUserClassifications = this.serviceBaseUrl + 'members/user/classifications'
}
