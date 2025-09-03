/**
 * Created by bharat on 08/28/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Constants, Messages, ServiceUrls} from "../../../../common/index";
import {BaseService, DateService} from "../../../../services/index";
import {CommonService} from "../../../../services/common/common.service";
import {ScheduleVoiceComponent} from "./schedule-voice/schedule-voice.component";
@Component({
    selector: 'schedules',
    templateUrl: 'schedules.html'
})
export class SchedulesComponent implements OnInit {

    @ViewChild(ScheduleVoiceComponent) scheduleVoiceComponent: ScheduleVoiceComponent;
    @ViewChild('date') date: ElementRef;

    enable: boolean = false;
    data:any[] = [];
    startDate: any;
    endDate: any;
    dates: any;
    isDuration: boolean = false;

    constructor(private constants:Constants,
                private baseService:BaseService,
                private serviceUrls: ServiceUrls,
                private dateService: DateService,
                private commonService:CommonService) {
    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Voice Messages');
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.enable = true;
        this.today(null);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.VOICE_PERMISSIONS)
    }

    scheduleVoice(event: any) {
        this.scheduleVoiceComponent.openOverlay(event);
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
        this.getFilteredNotifications();
    }

    getFilteredNotifications() {
        this.baseService.destroyDatatable('.datatable-voice');
        this.baseService.enableDataTable(this.serviceUrls.allVoiceNotification + '?startDate=' + this.startDate + '&endDate=' + this.endDate);
    }

    updateDriver(event:any) {
        this.scheduleVoiceComponent.getNotification(event)
    }

    duration(event: any) {
        this.isDuration = true
    }

    deleteWarning() {
        this.baseService.showWarning();
    }

    confirmDelete(event: any) {
        var value = JSON.parse(event.target.value);
        if(value){
            this.commonService.deleteObj(this.serviceUrls.scheduleVoiceNow +'/' +  value.notification_id, 'datatable-voice');
        }

    }

    getDataByDuration(event: any) {
        this.dates = this.date.nativeElement.innerText;
        var split = this.dates.split('-');
        this.startDate = this.dateService.getStartTime(split[0].trim())
        this.endDate = this.dateService.getEndTime(split[1].trim())
        this.getFilteredNotifications();
    }
}