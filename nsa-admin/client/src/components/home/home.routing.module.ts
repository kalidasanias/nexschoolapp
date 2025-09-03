/**
 * Created by SenthilPeriyasamy on 10/26/2016.
 */
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {DashboardComponent, HomeComponent} from "../index";

import {AuthGuard} from "../../services/index";
import * as myGlobals from '../../common/constants/global';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: HomeComponent,
                canActivateChild: [AuthGuard],
                data: {roles: myGlobals.ALL_USER},
                children: [
                    { path: '', component: DashboardComponent},
                    { path: 'notification', loadChildren: './notification/notification.module#NotificationModule', data: {roles: myGlobals.ASAE_USER ,breadcrumb: 'Notification'}},
                    { path: 'voice', loadChildren: './voice/voice.module#VoiceModule', data: {roles: myGlobals.ASAE_USER ,breadcrumb: 'Voice Call'}},
                    { path: 'change-pwd', loadChildren: './my-account/change-pwd/change-pwd.module#ChangePasswordModule', data: {roles: myGlobals.ALL_USER, breadcrumb: 'Change Password'}},
                    { path: 'roles', loadChildren: './roles&permissions/create-role/roles&permissions.module#RolesAndPermissionsModule', data: {roles: myGlobals.ALL_USER, breadcrumb: 'Create Role'}},
                    { path: 'assign-roles', loadChildren: './roles&permissions/assign-role/assign-role.module#AssignRoleModule', data: {roles: myGlobals.ALL_USER, breadcrumb: 'Assign Role'}},
                    { path: 'ccavenue/:id', loadChildren: './ccavenue/ccavenue.module#CcavenueModule', data: {roles: myGlobals.ALL_USER, breadcrumb: 'CCAvenue'}},
                    { path: 'fee-types', loadChildren: './fee-management/fee-configuration/fee-types/fee-types.module#FeeTypesModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Fee Types'}},
                    { path: 'fee-scholarship', loadChildren: './fee-management/fee-configuration/fee-scholarship/fee-scholarship.module#FeeScholarshipModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Fee Scholarship'}},
                    { path: 'fee-structure', loadChildren: './fee-management/fee-structure/fee-structure.module#FeeStructureModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Fee Structure'}},
                    { path: 'assign-fees', loadChildren: './fee-management/assign-fee/assign-fee.module#AssignFeeModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Assign Fees'}},
                    { path: 'pay-fee', loadChildren: './fee-management/pay/fee-pay.module#FeePayModule', data: {roles: myGlobals.S_USER, breadcrumb: 'Pay Fee'}},
                    { path: 'academics-year', loadChildren: './academics/academics-year/academics-year.module#AcademicsYearModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Academic Year'}},
                    { path: 'course-management', loadChildren: './academics/course-management/course-management.module#CourseManagementModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Course Management'}},
                    { path: 'classes', loadChildren: './academics/classes/classes.module#ClassesModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Classes'}},
                    { path: 'section-list', loadChildren: './academics/section-list/section-list.module#SectionListModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Section List'}},
                    { path: 'section-allocation', loadChildren: './academics/section-allocation/section-allocation.module#SectionAllocationModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Section Allocation'}},
                    { path: 'subject-list', loadChildren: './academics/subject-list/subject-list.module#SubjectListModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Subject List'}},
                    { path: 'subject-allocation', loadChildren: './academics/subject-allocation/subject-allocation.module#SubjectAllocationModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Subject Allocation'}},
                    { path: 'holiday-types', loadChildren: './academics/holiday-types/holiday-types.module#HolidayTypesModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Holiday Types'}},
                    { path: 'holiday', loadChildren: './academics/holiday/holiday.module#HolidayModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Holiday'}},
                    { path: 'department', loadChildren: './user-management/employee-management/department/department.module#DepartmentModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Department'}},
                    { path: 'designation', loadChildren: './user-management/employee-management/designation/designation.module#DesignationModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Designation'}},
                    { path: 'category', loadChildren: './user-management/employee-management/category/category.module#CategoryModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Category'}},
                    { path: 'employees', loadChildren: './user-management/employee-management/employees/employees.module#EmployeesModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Employees'}},
                    { path: 'leave-types', loadChildren: './user-management/leave-management/leave-types/leave-types.module#LeaveTypesModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Leave Types'}},
                    { path: 'leave-assignments', loadChildren: './user-management/leave-management/leave-assignement/leave-assignement.module#LeaveAssignementModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Leave Assignments'}},
                    { path: 'assign-leave', loadChildren: './user-management/leave-management/leave-assignement/assign-leave/assign-leave.module#AssignLeaveModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Assign Leave'}},
                    { path: 'students', loadChildren: './user-management/student-management/students.module#StudentsModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Students'}},
                    { path: 'attendance-history', loadChildren: './school-management/attendance/attendance-history/attendance-history.module#AttendanceHistoryModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Attendance History'}},
                    { path: 'student-promotions', loadChildren: './school-management/promotions/promotions.module#PromotionsModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Promotions'}},
                    { path: 'shuffle-students', loadChildren: './school-management/shuffle-student/shuffle-student.module#ShuffleStudentsModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Promotions'}},
                    { path: 'attendance-information', loadChildren: './school-management/attendance/attendance-information/attendance-information.module#AttendanceInformationModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Attendance Information'}},
                    { path: 'assignement-types', loadChildren: './school-management/homework/assignement-types/assignement-types.module#AssignementTypesModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Assignement Types'}},
                    { path: 'create-assignments', loadChildren: './school-management/homework/create-assignments/create-assignments.module#CreateAssignmentsModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Create Assignments'}},
                    //{ path: 'grading-system', loadChildren: './school-management/exam-report/exam-configuration/grading-system/grading-system.module#GradingSystemModule'},

                    { path: 'exam-system', loadChildren: './school-management/exam-report/exam-configuration/exam-system/exam-system.module#ExamSystemModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Exam System'}},
                    { path: 'portions', loadChildren: './school-management/exam-report/portions/portions.module#PortionsModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Portions'}},
                    { path: 'marks-upload', loadChildren: './school-management/exam-report/marks-upload/marks-upload.module#MarksUploadModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Marks Upload'}},
                    { path: 'promotion-list', loadChildren: './school-management/exam-report/promotion-list/promotion-list.module#PromotionListModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Promotion List'}},
                    { path: 'timetable-configuration', loadChildren: './school-management/timetable/timetable-configuration/timetable-configuration.module#TimetableConfigurationModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Timetable Configuration'}},
                    { path: 'manage-timetable', loadChildren: './school-management/timetable/manage-timetable/manage-timetable.module#ManageTimetableModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Manage Timetable'}},
                    { path: 'create-timetable', loadChildren: './school-management/timetable/create-timetable/create-timetable.module#CreateTimetableModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Create Timetable'}},
                    { path: 'communication', loadChildren: './activities/communication/communication.module#CommunicationModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Communication'}},
                    { path: 'suggestions', loadChildren: './activities/suggestions/suggestions.module#SuggestionsModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Suggestions'}},
                    { path: 'onboard-notification', loadChildren: './activities/onboard-notification/onboard-notification.module#OnboardNotificationModule', data: { roles: myGlobals.SA_USER, breadcrumb: 'Onboard Notification'}},
                    { path: 'parent-information', loadChildren:'./user-management/student-management/parent-information/parent-information.module#ParentInformationModule', data: { roles: myGlobals.SA_USER, breadcrumb: 'Parent Information'}},
                    { path: 'hall-of-fame', loadChildren: './activities/hall-of-fame/hall-of-fame.module#HallOfFameModule', data: { roles: myGlobals.ASAE_USER, breadcrumb: 'Hall Of Fame'}},
                    { path: 'create-events', loadChildren: './activities/event-management/create-events/create-events.module#CreateEventsModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Create Events'}},
                    { path: 'event-types', loadChildren: './activities/event-management/event-types/event-types.module#EventTypesModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Event Types'}},
                    { path: 'activity-types', loadChildren: './activities/event-management/activity-types/activity-types.module#ActivityTypesModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Activity Types'}},
                    { path: 'event-venues', loadChildren: './activities/event-management/event-venues/event-venues.module#EventVenuesModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'School Venues'}},
                    { path: 'journal-management', loadChildren: './activities/journal-management/journal-management.module#JournalManagementModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Journal Management'}},
                    { path: 'dashboard-gallery', loadChildren: './asset-management/dashboard/dashboard-gallery.module#DashboardGalleryModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Dashboard Gallery'}},
                    { path: 'gallery', loadChildren: './asset-management/gallery/gallery.module#GalleryModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Gallery'}},
                    { path: 'gallery/gallery-view/:id/:name', loadChildren: './asset-management/gallery/view/gallery-view.module#GalleryViewModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Gallery'}},
                    { path: 'success', loadChildren: './confirmation/success/success.module#SuccessModule', data: {roles: myGlobals.ALL_USER, breadcrumb: 'Success'}},
                    { path: 'failure', loadChildren: './confirmation/failure/failure.module#FailureModule', data: {roles: myGlobals.ALL_USER, breadcrumb: 'Failure'}},
                    { path: 'vehicle', loadChildren: './transport-management/vehicle/vehicle.module#VehicleModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Vehicle'}},
                    { path: 'driver', loadChildren: './transport-management/driver/driver.module#DriverModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Driver'}},
                    { path: 'route', loadChildren: './transport-management/route/route.module#RouteModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Route'}},
                    { path: 'allocated', loadChildren: './transport-management/vehicle-allocation/vehicle-allocation.module#VehicleAllocationModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Vehicle Allocation'}},
                    { path: 'tracking', loadChildren: './transport-management/tracking/live.module#LiveModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Live Tracking'}},
                    { path: '*path', redirectTo: '/failure'},
                    { path: 'exam-schedule', loadChildren: './school-management/exam-report/exam-configuration/exam-settings/exam-settings.module#ExamSettingsModule'},
                    { path: 'progresscard-generation', loadChildren: './school-management/exam-report/exam-configuration/progress-card-generation/progresscard-generation.module#ProgressCardGenerationModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Progress Card Generation'}},
                    { path: 'grading-system', loadChildren: './school-management/exam-report/exam-configuration/grading-system/grading-system.module#GradingSystemModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Grading System'}},
                    { path: 'grading-configuration', loadChildren: './school-management/exam-report/exam-configuration/grading-configuration/grading-configuration.module#GradingConfigurationModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Grading Configuration'}},
                    { path: 'progress-card-config', loadChildren: './school-management/exam-report/exam-configuration/progress-card-config/progress-card-config.module#ProgressCardModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Progress Card'}},
                    { path: 'my-leaves', loadChildren: './user-management/leave-management/my-leaves/my-leaves.module#MyLeavesModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'My Leaves'}},
                    { path: 'leaves-approval', loadChildren: './user-management/leave-management/leaves-approval/leaves-approval.module#LeavesApprovalModule', data: {roles: myGlobals.ASAE_USER, breadcrumb: 'Leaves Approval'}}
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class HomeRoutingModule {
}
