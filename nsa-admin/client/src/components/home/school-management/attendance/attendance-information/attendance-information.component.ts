/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {ServiceUrls, Constants} from "../../../../../common/index";
import {RecordAttendanceComponent} from "./record-attendance/record-attendance.component";
import {EditAttendanceComponent} from "./edit-attendance/edit-attendance.component";
import {DateService} from "../../../../../services/common/date.service";
import {NotificationLogsComponent} from "../../../notification/notification-logs/notification-logs.component";

@Component({
    templateUrl: 'attendance-information.html'
})
export class AttendanceInformationComponent implements OnInit {

    @ViewChild(RecordAttendanceComponent) recordAttendanceComponent: RecordAttendanceComponent;
    @ViewChild(NotificationLogsComponent) notificationLogsComponent: NotificationLogsComponent;
    @ViewChild(EditAttendanceComponent) editAttendanceComponent: EditAttendanceComponent;
    @ViewChild('date') date: ElementRef;
    enable: boolean = false;
    startDate: any;
    endDate: any;
    dates: any;
    isDuration: boolean = false

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private dateService: DateService,
                private constants: Constants) {

    }
    
    ngOnInit() {
        this.today(null);
        this.baseService.setTitle('NSA - Attendance Information');
        this.baseService.enableAppJs();
        this.baseService.selectStyle();
        this.baseService.enablePickerDate();
        /*this.getAttendanceInfo();*/
        this.enable = this.baseService.havePermissionsToEdit(this.constants.ATTENDANCE_INFO_PERMISSIONS);
        /*this.baseService.enableDataTableExample();*/
        //this.baseService.enableSelect();
        /*this.baseService.enableDataTable();*/
    }

    recordAttendance(event: any) {
        this.recordAttendanceComponent.openOverlay(event);
    }

    getAttendanceById(event: any) {
        this.editAttendanceComponent.getAttendanceById(event);
    }

    today(event: any) {
        this.isDuration = false
        var date = this.dateService.getToday();
        this.setDate(date)
    }

    week(event: any) {
        this.isDuration = false
        var date = this.dateService.getCurrentWeek();
        this.setDate(date)
    }

    month(event: any) {
        this.isDuration = false
        var date = this.dateService.getCurrentMonth();
        this.setDate(date)
    }

    setDate(date: any) {
        this.startDate = date[0]
        this.endDate = date[1]
        this.getAttendanceInfo();
    }

    getAttendanceInfo() {
        this.baseService.destroyDatatable('.datatable-attendance-export');
        this.baseService.enableDataTable(this.serviceUrls.getAttendanceLists + '?startDate=' + this.startDate + '&endDate=' + this.endDate);
    }

    duration(event: any) {
        this.isDuration = true;
        this.getDataByDuration(event);
    }

    getDataByDuration(event: any) {
        this.dates = this.date.nativeElement.innerText;
        var split = this.dates.split('-');
        this.startDate = this.dateService.getStartTime(split[0].trim())
        this.endDate = this.dateService.getEndTime(split[1].trim())
        this.getAttendanceInfo();
    }

    getNotificationLog(event: any) {
        this.notificationLogsComponent.getNotificationLogsByObj(event)
    }
}
