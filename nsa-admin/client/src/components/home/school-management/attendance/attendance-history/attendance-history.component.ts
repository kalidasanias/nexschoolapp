/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../common/index";
import {ViewLeaveRecordComponent} from "./view-leave-record/view-leave-record.component";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    templateUrl: 'attendance-history.html'
})
export class AttendanceHistoryComponent implements OnInit {

    @ViewChild('singleClass') singleClass:ElementRef
    @ViewChild('singleSubject') singleSubject:ElementRef
    @ViewChild('singleSection') singleSection:ElementRef
    @ViewChild('date') date:ElementRef
    @ViewChild(ViewLeaveRecordComponent) viewLeaveRecordComponent: ViewLeaveRecordComponent;

    sections: any;
    classId: any;
    classes: any;
    startDate: any;
    endDate: any;
    sectionId: any;
    dates: any;
    className: any;
    attendanceOverview: any = {};
    sectionName: any;
    constId:'00000000-0000-0000-0000-000000000000';

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private constants: Constants) {
    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Attendance History');
        this.baseService.enableAppJs();
        this.startDate = new Date();
        this.endDate = new Date();
        this.baseService.enablePickerDate();
        this.baseService.dataTableDestroy('datatable-attendance-history');
        var constId = '00000000-0000-0000-0000-000000000000';
        this.baseService.enableDataTable(this.serviceUrls.getAttendanceHistory + '?classId=' + constId + '&sectionId=' + constId + '&startDate=' + 'April 13, 2017' + '&endDate=' + 'April 13, 2017');
        this.getALlClasses();
    }

    getStudentLeaveHistory(event: any) {
        this.viewLeaveRecordComponent.getStudentLeaveHistory(event);
    }

    getALlClasses() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            classes => this.callBackClasses(classes)
        )
    }

    callBackClasses(data: any) {
        this.classes = data;
        this.baseService.enableSelectWithEmpty('#bootstrap-class', data, this.constants.classObj, null);
    }

    getSectionByClass() {
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        if (this.classId == undefined || this.classId == "") {
            this.baseService.addHideClass('#sections');
        } else {
            this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
            this.baseService.removeHideClass('#sections');
            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then(
                sections => this.callBackSections(sections)
            )
        }
    }

    callBackSections(data: any) {
        this.sections = data;
        this.baseService.enableSelectWithEmpty('#bootstrap-section', data, this.constants.sectionObj, null)
    }

    getAttendanceHistoryData() {
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        this.className = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].name;
        if (this.classId == undefined || this.classId == "") {
            this.baseService.showNotification("Select Class", "", 'bg-danger');
        } else {
            this.baseService.removeHideClass('#overview');
            this.sectionId = this.baseService.extractOptions(this.singleSection.nativeElement.selectedOptions)[0].id;
            this.sectionName = this.baseService.extractOptions(this.singleSection.nativeElement.selectedOptions)[0].name;
            this.baseService.dataTableDestroy('datatable-attendance-history');
            this.dates = this.date.nativeElement.textContent.trim();
            var split = this.dates.split('-');
            this.startDate = split[0].trim();
            this.endDate = split[1].trim();
            this.commonService.get(this.serviceUrls.getSchoolAttendanceOverview + '?classId=' + this.classId + '&sectionId=' + this.sectionId + '&startDate=' + this.startDate + '&endDate=' + this.endDate).then(
                attendanceOverview => this.attendanceOverview = attendanceOverview);
            var url = this.serviceUrls.getAttendanceHistory + '?classId=' + this.classId + '&sectionId=' + this.sectionId + '&startDate=' + this.startDate + '&endDate=' + this.endDate;
            this.baseService.enableDataTable(url);
        }
    }

    resetForm() {
        this.baseService.addHideClass('#sections');
        this.baseService.addHideClass('#overview');
        this.getALlClasses();
        this.baseService.dataTableDestroy('datatable-attendance-history');
        var constId = '00000000-0000-0000-0000-000000000000';
        this.baseService.enableDataTable(this.serviceUrls.getAttendanceHistory + '?classId=' + constId + '&sectionId=' + constId + '&startDate=' + '' + '&endDate=' + '');

    }

}
