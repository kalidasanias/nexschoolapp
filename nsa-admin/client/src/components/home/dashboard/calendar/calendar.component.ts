/**
 * Created by Senthilkumar on 03/31/2017.
 */
import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ExtCalendarComponent} from "../../common/calendar/ext.calendar.component";
import {CommonService} from "../../../../services/common/common.service";
import {ServiceUrls} from "../../../../common/constants/service.urls";

@Component({
    selector: 'dashboard-calendar',
    templateUrl: 'calendar.html'
})
export class DashboardCalendarComponent implements  OnInit, AfterViewInit {

    @ViewChild(ExtCalendarComponent) exeCalendar: ExtCalendarComponent;

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        this.initCalendar();
    }

    ngAfterViewInit() {
        this.getAttendanceDetails();
    }

    initCalendar() {
        this.commonService.get(this.serviceUrls.getDashboardAttendance).then(
            attendance => this.renderCalendar(attendance, 'week')
        )
    }

    renderCalendar(data: any, view: any) {
        this.exeCalendar.enableCalendar(data, view, true)
    }

    refreshCalendar(data: any) {
        this.exeCalendar.refresh(data)
    }

    getAttendanceDetails() {
        this.commonService.get(this.serviceUrls.getDashboardAttendance).then(
            attendance => this.refreshCalendar(attendance)
        )
    }

    getTimetableDetails() {
        this.commonService.get(this.serviceUrls.getDashboardTimetable).then(
            timetable => this.refreshCalendar(timetable)
        )
    }

    getNotesDetails() {
        this.commonService.get(this.serviceUrls.getDashboardTimetable).then(
            notes => this.refreshCalendar(notes)
        )
    }
}