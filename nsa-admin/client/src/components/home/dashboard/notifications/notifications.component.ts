/**
 * Created by Senthilkumar on 03/31/2017.
 */
import {Component, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ExtCalendarComponent} from "../../common/calendar/ext.calendar.component";
import {CommonService} from "../../../../services/common/common.service";
import {ServiceUrls} from "../../../../common/constants/service.urls";

@Component({
    selector: 'dashboard-notifications',
    templateUrl: 'notifications.html'
})
export class DashboardNotificationsComponent {
    events: any = {};
    notifications: any
    upcomingEvents: any
    user: any;
    calendarData: any;
    exams: any = {};
    checkId: any;
    studentDetails: any;

    @ViewChild(ExtCalendarComponent) exeCalendar: ExtCalendarComponent;
    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {}
    ngOnInit() {
        this.user = this.baseService.findUser();
        this.getSlots();
        this.getUserNotifications();
        this.getDashboardEvents();
        this.getUpcomingEvents();
        this.commonService.get(this.serviceUrls.getDashboardNotifications);
    }

    renderCalendar(data: any) {
        this.exeCalendar.enableCalendar(data, 'month', true);
    }

    getSlots() {
        this.commonService.get(this.serviceUrls.empTimetableSlots).then(result => this.callBackEmpTimetableSlots(result))
    }

    callBackEmpTimetableSlots(data: any) {

    }

    refreshCalendar(data: any) {
        this.exeCalendar.refresh(data)
    }

    getUserNotifications() {
        this.commonService.get(this.serviceUrls.getUserNotification + this.user.user_name).then(result => this.userNotificationCallback(result));
    }

    userNotificationCallback(result: any) {
        this.notifications = result;
    }

    getUpcomingEvents() {
        this.commonService.get(this.serviceUrls.event + 'latest').then(result => this.upcomingEventsCallback(result));
    }

    upcomingEventsCallback(result: any) {
        this.upcomingEvents = result;
    }

    getWeekData(event: any) {
        var date = new Date(event.target.value);
        var userType = this.baseService.findUser();
        if(userType.user_type == 'Student'){
            this.commonService.get(this.serviceUrls.getStudentCalendarDetails + '?monthNo='+ date.getMonth() + '&year=' + date.getFullYear() + '&classId='+ this.studentDetails.class_id + '&sectionId='+ this.studentDetails.section_id).then(result => this.dashboardWeekCallback(result))
        }else {
            this.commonService.get(this.serviceUrls.getDashboardEvents + this.user.user_name + '?monthNo=' + date.getMonth() + '&year=' + date.getFullYear()).then(result => this.dashboardWeekCallback(result))
        }

    }
   /* callbackWeekData(data: any) {
        console.info('monthlyeventsdashbordevents');
        this.events.events = data;
        this.refreshCalendar(this.events)
    }*/

    dashboardWeekCallback(result: any) {
        this.exams.events = result.exams;
        this.events.events = result.events;
        if(this.checkId == 'exams'){
            this.refreshCalendar(this.exams);
        } else {
            this.refreshCalendar(this.events);
        }
    }

    getDashboardEvents() {
        var userType = this.baseService.findUser();
        if(userType.user_type == 'Student'){
            this.commonService.get(this.serviceUrls.getStudentDetailsByName + userType.user_name).then(result => this.callBackStudent(result));
        }else {
            var date = new Date();
            this.commonService.get(this.serviceUrls.getDashboardEvents + this.user.user_name +'?monthNo=' + date.getMonth() + '&year=' + date.getFullYear()).then(result => this.dashboardEventsCallback(result));
        }
    }

    callBackStudent(result: any){
        this.studentDetails = result[0].classes[0];
        var date = new Date();
        this.commonService.get(this.serviceUrls.getStudentCalendarDetails + '?monthNo='+ date.getMonth() + '&year=' + date.getFullYear() + '&classId='+ this.studentDetails.class_id + '&sectionId='+ this.studentDetails.section_id).then(result => this.dashboardEventsCallback(result))
    }

    dashboardEventsCallback(result: any) {
        this.calendarData = result.exams;
        this.events.events = result.events;
        this.events.eleAttr = '.fullcalendar';
        this.events.weekEle = '#eventData';
        this.renderCalendar(this.events);
    }

    eventsData(id: any){
        this.checkId = id;
        this.events.weekEle = '#eventData';
        this.renderCalendar(this.events);

    }

    examData(id: any) {
        this.checkId = id;
        this.exams.eleAttr = '.fullcalendar';
        this.exams.weekEle = '#eventData';
        this.exams.events = this.calendarData;
        this.renderCalendar(this.exams);
    }

}

