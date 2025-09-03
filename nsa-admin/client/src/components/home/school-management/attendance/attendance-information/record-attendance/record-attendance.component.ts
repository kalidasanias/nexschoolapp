/**
 * Created by Sai Deepak on 15-Mar-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../common/index";
import {CommonService} from "../../../../../../services/common/common.service";
declare var jQuery: any;

@Component({
    selector: 'record-attendance',
    templateUrl: 'record-attendance.html'
})

export class RecordAttendanceComponent implements OnInit {

    @ViewChild('singleClass') singleClass: ElementRef;
    @ViewChild('date') date: ElementRef;
    @ViewChild('singleSection') singleSection: ElementRef;
    @ViewChild('sms') sms: ElementRef;
    @ViewChild('email') email: ElementRef;
    @ViewChild('push') push: ElementRef;
    @ViewChild('presntees') presntees: ElementRef;
    @ViewChild('absentees') absentees: ElementRef;
    classes: any;
    sections: any;
    classId: any;
    currentDate: any;
    sectionId: any;
    dates: any;
    className: any;
    sectionName: any;
    constId: '00000000-0000-0000-0000-000000000000';
    feature:any[];
    notifyHostelers: any;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private constants: Constants,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        this.getActiveClasses();
        this.getFeatureChannelConfiguration();
    }

    openOverlay(event:any) {
        this.baseService.enableLoadingWithMsg('')
        this.baseService.addDisabled('#saveAttendance');
        this.commonService.getActiveFeatureChannelDetails(this.feature);
        this.currentDate = new Date();
        this.baseService.enableSelectWithEmpty('#attendance-class', this.classes, this.constants.classObj, null);
        this.baseService.addHideClass('#sections');
        this.baseService.dataTableDestroy('datatable-record-attendance');
        this.baseService.dataTableDestroy('datatable-edit-attendance');
        this.baseService.enableDataSourceDatatable(this.serviceUrls.getAttedanceUsersByClassAndSections + this.constId +'/section/' + this.constId +'/2016-03-01');
        this.baseService.openOverlay(event);
        this.baseService.disableLoading()
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#record_attendance');

    }

    getActiveClasses() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            classes => this.callBackClasses(classes)
        )
    }

    callBackClasses(data: any) {
        this.classes = data;
    }

    getSectionByClass() {
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        if(this.classId.length < 1) {
            this.baseService.addHideClass('#sections');
        }  else {
            this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
            this.baseService.removeHideClass('#sections');

            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then(
                sections => this.callBackSections(sections)
            )
        }
    }

    callBackSections(data: any) {
        this.sections = data;
        this.baseService.enableSelect('#attendance-section', data, this.constants.sectionObj, null)
    }


    getAttendanceData() {
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        this.className = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].name;
        var dataFound = this.setValidations();
        if(dataFound){
            this.sectionId = this.baseService.extractOptions(this.singleSection.nativeElement.selectedOptions)[0].id;
            this.sectionName = this.baseService.extractOptions(this.singleSection.nativeElement.selectedOptions)[0].name;
            this.baseService.dataTableDestroy('datatable-record-attendance');
            this.baseService.dataTableDestroy('datatable-edit-attendance');
            this.dates = this.date.nativeElement.value;
            var url = this.serviceUrls.getAttedanceUsersByClassAndSections + this.classId + '/section/' +this.sectionId + '/' + this.dates;
            this.baseService.enableDataSourceDatatable(url);
            this.commonService.getActiveFeatureChannelDetails(this.feature)
            this.baseService.removeDisabled('#saveAttendance');
        }
    }

    save(id: any, event: any) {
        this.saveJson(id, event.target.value);
    }


    saveAttendanceCallBack(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#record_attendance');
            this.baseService.dataTableReload('datatable-attendance-export');
        }
        this.baseService.disableBtnLoading(id);
    }

    saveJson(id: any, values: any) {
        if(this.classId != undefined || this.classId != "") {
            var value = JSON.parse(values);
            var user = this.baseService.findUser();
            var data = {};
            var notify = {};
            var notifyTo = {};
            var notifiedTo = [];
            notifyTo['status'] = this.constants.Sent;
            notify['sms'] = this.sms.nativeElement.checked;
            notify['email'] = this.email.nativeElement.checked;
            notify['push'] = this.push.nativeElement.checked;
            notify['notifyHostelers'] =  this.notifyHostelers;
            this.presntees.nativeElement.checked ? notifiedTo.push('Present') : null;
            this.absentees.nativeElement.checked ? notifiedTo.push('Absent') : null;
            data['classId'] = this.classId;
            data['className'] = this.className;
            data['sectionId'] = this.sectionId;
            data['sectionName'] = this.sectionName;
            data['attendanceDate'] = this.dates;
            data['recordedBy'] = user.user_name;
            data['recordedUsername'] = user.name;
            data['updatedBy'] = user.user_name;
            data['updatedUsername'] = user.name;
            data['users'] = value;
            data['notify'] = notify;
            data['notifyTo'] = notifyTo;
            data['notifiedTo'] = notifiedTo;
            this.baseService.enableBtnLoading(id);

            this.commonService.post(this.serviceUrls.saveAttendance, data).then(
                result => this.saveAttendanceCallBack(result, id, false),
                error => this.saveAttendanceCallBack(<any>error, id, true))


        } else {
            this.baseService.showNotification("submit class Details!", "", 'bg-danger');
        }
    }

    resetForm() {
        this.baseService.addDisabled('#saveAttendance');
        this.baseService.enableSelectWithEmpty('#attendance-class', this.classes, this.constants.classObj, null);
        this.baseService.addHideClass('#sections');
        this.baseService.dataTableDestroy('datatable-record-attendance');
        this.baseService.dataTableDestroy('datatable-edit-attendance');
        this.baseService.enableDataSourceDatatable(this.serviceUrls.getAttedanceUsersByClassAndSections + this.constId +'/section/' + this.constId +'/2016-03-01');
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

    setValidations() : any {
        var dataFound = false;
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        this.dates = this.date.nativeElement.value;
        this.currentDate = this.date.nativeElement.value;
        if(this.classId.length < 1) {
            this.baseService.showNotification("Enter Class Details", "", 'bg-danger');
        } else if (this.dates.length < 1) {
            this.baseService.showNotification("Enter Date", "", 'bg-danger');
        } else {
            dataFound = true;
        }

        return dataFound;
    }
}