/**
 * Created by Sai Deepak on 16-Mar-17.
 */
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../common/index";
import {CommonService} from "../../../../../../services/common/common.service";

@Component({
    selector: 'edit-attendance',
    templateUrl: 'edit-attendance.html',
    encapsulation: ViewEncapsulation.None
})

export class EditAttendanceComponent implements OnInit {

    attendanceId: any;
    presentPercent: any;
    noOfPresent: any;
    noOfAbsent: any;
    attendance: any;
    feature:any[];
    notifyHostelers: any;
    @ViewChild('sms') sms: ElementRef;
    @ViewChild('email') email: ElementRef;
    @ViewChild('push') push: ElementRef;
    @ViewChild('present') presntees: ElementRef;
    @ViewChild('absent') absentees: ElementRef;
    enable: boolean = false;
    enableData: boolean = true;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        this.getFeatureChannelConfiguration();
        this.presentPercent = "";
        this.noOfPresent = "";
        this.noOfAbsent = "";
        this.enable = this.baseService.havePermissionsToEdit(this.constants.ATTENDANCE_INFO_PERMISSIONS);
    }
    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)
        )
    }

    callBackChannels(data: any) {
        this.feature = data;
        this.notifyHostelers = data.notify_hostelers;
        this.commonService.getActiveFeatureChannelDetails(data);
    }

    openOverlay(event:any) {
        this.getFeatureChannelConfiguration();
        this.commonService.getActiveFeatureChannelDetails(this.feature);
        this.baseService.openOverlay(event);
    }
    closeOverlay(event:any) {
        this.baseService.closeOverlay('#edit_attendance');
    }

    getAttendanceById(value: any) {
        var values = JSON.parse(value.target.value);
        var cyear = (localStorage.getItem(this.constants.cyear) == 'true');
        this.enableData = values.editPermissions && cyear;
        this.attendanceId = values.id;
        this.presentPercent = values.presentPercent;
        this.noOfPresent = values.noOfPresent;
        this.noOfAbsent = values.noOfAbsent;
        this.attendance = values;
        this.baseService.dataTableDestroy('datatable-edit-attendance');
        this.baseService.dataTableDestroy('datatable-record-attendance');
        this.baseService.enableDataTableAjax(this.serviceUrls.getDetailsByAttendanceId + values.id, null);
        this.commonService.getActiveFeatureChannelDetails(this.feature);
        this.openOverlay(value);
    }

    save(id: any, event: any) {
        this.baseService.enableBtnLoading(id);
        var value = JSON.parse(event.target.value);
        this.saveJson(id, value, this.attendance);
    }

    saveAttendanceCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#edit_attendance');
            this.baseService.dataTableReload('datatable-attendance-export');
        }
        this.baseService.disableBtnLoading(id);
    }

    saveJson(id: any, values: any, form: any) {
        var data = {};
        var user = this.baseService.findUser();
        data['classId'] = form.classId;
        data['className'] = form.className;
        data['sectionId'] = form.sectionId;
        data['sectionName'] = form.sectionName;
        data['updatedBy'] = user.user_name;
        data['updatedUsername'] = user.name;
        data['users'] = values;

        var user = this.baseService.findUser();
        var data = {};
        var notify = {};
        var notifyTo = {};
        var notifiedTo = [];
        notifyTo['status'] = this.constants.Sent;
        notify['sms'] = this.sms.nativeElement.checked;
        notify['email'] = this.email.nativeElement.checked;
        notify['push'] = this.push.nativeElement.checked;
        notify['notifyHostelers'] = this.notifyHostelers;
        this.presntees.nativeElement.checked ? notifiedTo.push('Present') : null;
        this.absentees.nativeElement.checked ? notifiedTo.push('Absent') : null;
        data['classId'] = form.classId;
        data['className'] = form.className;
        data['sectionId'] = form.sectionId;
        data['sectionName'] = form.sectionName;
        data['updatedBy'] = user.user_name;
        data['updatedUsername'] = user.name;
        data['users'] = values;
        data['users'] = values;
        data['notify'] = notify;
        data['notifyTo'] = notifyTo;
        data['notifiedTo'] = notifiedTo;

        this.commonService.put(this.serviceUrls.updateAttendance + this.attendanceId, data).then(
            result => this.saveAttendanceCallBack(result, id, false),
            error => this.saveAttendanceCallBack(<any>error, id, true))
    }
}