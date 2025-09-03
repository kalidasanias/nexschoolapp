/**
 * Created by Cyril on 2/22/2017.
 */


import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService, DateService} from "../../../../../services/index";
import {ExtCalendarComponent} from "../../../common/calendar/ext.calendar.component";
import {AddEventComponent} from "./add-event/add-event.component";
import {ViewEventComponent} from "./view-events/view.component";
import {CommonService} from "../../../../../services/common/common.service";
import {ServiceUrls, Constants} from "../../../../../common/index";

declare var moment: any;

@Component({
    templateUrl: 'create-events.html'
})
export class CreateEventsComponent implements OnInit {

    todayEve: any[];
    latestEve: any[];
    userEve: any[];
    events: any= {};
    classEve: any[];
    enable: boolean = false;

    @ViewChild(AddEventComponent) addEventComponent: AddEventComponent;
    @ViewChild(ViewEventComponent) viewEventComponent: ViewEventComponent;
    @ViewChild(ExtCalendarComponent) exeCalendar: ExtCalendarComponent;

    constructor(private baseService: BaseService,
                private commonService: CommonService, private constants: Constants,
                private serviceUrls: ServiceUrls,
                private dateService: DateService) { }

    ngOnInit() {
        this.baseService.setTitle('NSA - Create Activity');
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.selectStyle();
        this.getSlots();
        this.getTodayEvents();
        this.getlatestEvents();
        this.getUserEvents();
        this.getClassEvents();
        this.enable = this.baseService.havePermissionsToEdit(this.constants.CREATE_EVENTS_PERMISSIONS);
    }

    addEvent(event: any) {
        this.addEventComponent.openOverlay(event);
    }


    getEventById(event: any) {
        this.viewEventComponent.getEventById(event);
    }

    getTodayEvents() {
        this.commonService.get(this.serviceUrls.event + 'today/').then(
            todayEve => this.callBackTodayEve(todayEve)
        )
    }

    callBackTodayEve(todayEve: any) {
        this.todayEve = todayEve;
        setTimeout(() => {
            this.baseService.enableSlide('.slider');
        }, 500);
    }

    getlatestEvents() {
        this.commonService.get(this.serviceUrls.event + 'latest').then(
            latestEve => this.callBacklatestEve(latestEve)
        )
    }

    callBacklatestEve(latestEve: any) {
        this.latestEve = latestEve;
        setTimeout(() => {
            this.baseService.enableSlide('.latest-slider');
        }, 500);

    }

    getUserEvents() {
        var user = this.baseService.findUser().user_name;
        this.commonService.get(this.serviceUrls.event + 'user/' + user).then(
            userEve => this.callBackUserEve(userEve)
        )
    }

    callBackUserEve(userEve: any) {
        this.userEve = userEve;
        setTimeout(() => {
            this.baseService.enableSlide('.user-slider');
        }, 500);

    }

    getClassEvents() {
        var user = this.baseService.findUser().user_name;
        this.commonService.get(this.serviceUrls.empClassEvents + user).then(
            classEve => this.callBackClassEve(classEve)
        )
    }

    callBackClassEve(classEve: any) {
        this.classEve = classEve;
        setTimeout(() => {
            this.baseService.enableSlide('.class-slider');
        }, 500);

    }

    renderCalendar(data: any) {
        this.exeCalendar.enableCalendar(data, 'month', this.enable);
    }

    refreshCalendar(data: any) {
        this.exeCalendar.refresh(data)
    }

    getSlots() {
        this.commonService.get(this.serviceUrls.empTimetableSlots).then(result => this.callBackEmpTimetableSlots(result))
    }

    callBackEmpTimetableSlots(data: any) {
        this.events.eleAttr = '.fullcalendar';
        this.events.weekEle = '#eventData';
        this.events.slots = data;
        this.events.viewMenu = '#viewEveDet';
        this.events.newEventButton = '#createButton';
        this.events.events = this.events
        this.events.key = 'event_id';
        this.renderCalendar(this.events);
        this.refreshCalendar(this.events);

    }

    getWeekData(event: any) {
        var date = new Date(event.target.value);
        date.setDate(date.getDate() + 1);
        var weekNumber = this.dateService.getWeekNumber(date);
        this.commonService.get(this.serviceUrls.weekEvent + '?monthNo=' + date.getMonth() + '&year=' + date.getFullYear()).then(result => this.callbackWeekData(result))
    }

    callbackWeekData(data: any) {
        this.events.events = data;
        this.refreshCalendar(this.events)
    }

    render() {
        setTimeout(() => {
            this.getSlots();
            this.getTodayEvents();
            this.getlatestEvents();
            this.getUserEvents();
            this.getClassEvents();
        } , 1000);
    }


}
