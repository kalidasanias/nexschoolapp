/**
 * Created by Sai Deepak on 05-Mar-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../common/index";
import {AddAssignmentComponent} from "./add-assignment/add-assignment.component";
import {ViewAssignmentComponent} from "./view-assignment/view-assignment.component";
import {CommonService} from "../../../../../services/common/common.service";
import {NotificationLogsComponent} from "../../../notification/notification-logs/notification-logs.component";
import {DateService} from "../../../../../services/common/date.service";
import {AttachmentComponent} from "../../../common/attachment/attachment.component";

@Component({
    templateUrl: 'create-assignments.html'
})
export class CreateAssignmentsComponent implements OnInit {

    @ViewChild(AddAssignmentComponent) addAssignmentComponent: AddAssignmentComponent;
    @ViewChild(NotificationLogsComponent) notificationLogsComponent: NotificationLogsComponent;
    @ViewChild(ViewAssignmentComponent) viewAssignmentComponent: ViewAssignmentComponent;
    @ViewChild(AttachmentComponent) attachmentComponent: AttachmentComponent;
    @ViewChild('singleClass') singleClass: ElementRef;
    @ViewChild('singleSubject') singleSubject: ElementRef;
    @ViewChild('singleSection') singleSection: ElementRef;
    @ViewChild('date') date: ElementRef;

    classId: any;
    filterForm: any;
    sections: any;
    classes: any;
    enable: boolean = false;
    isDuration: boolean = false
    startDate: any;
    endDate: any;
    dates: any;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private dateService: DateService,
                private constants: Constants) { }

    ngOnInit() {
        this.today(null);
        this.baseService.setTitle('NSA - Create Homework');
        this.baseService.enableAppJs();
        this.baseService.selectStyle()
        this.baseService.enablePickerDate();
        // this.baseService.enableDataTable(this.serviceUrls.getAssignments);
        var data = {};
        data['subjectId'] = '';
        data['sectionId'] = '';
        data['classId'] = '';
        data['startDate'] = this.startDate;
        data['endDate'] = this.endDate;
        this.baseService.enableDataTableAjax(this.serviceUrls.getAssignmentDetail, data);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.ASSIGNMENT_PERMISSIONS);
        this.getAllClasses();
    }

    requested_delete(event: any) {
        var value = event.target.value;
        if(value){
            this.commonService.deleteObject(this.serviceUrls.deleteAssignment + JSON.parse(value).id, value, 'datatable-assignment-export');
            this.reload();
        }
    }

    reload() {
        this.baseService.enableDivLoading('.datatable-assignment-export', this.constants.updating);
        var thisObj = this;
        setTimeout(function () {
            thisObj.baseService.dataTableReload('datatable-assignment-export');
            thisObj.baseService.disableDivLoading('.datatable-assignment-export');
        }, 1000)
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }

    getAssignment(event: any, value: any) {
        this.addAssignmentComponent.getAssignment(event, value, this);
    }

    getAssignmentDetailById(event: any) {
        this.viewAssignmentComponent.getAssignmentDetailById(event, this.attachmentComponent);
    }

    addNewAssignment(event: any) {
        this.addAssignmentComponent.openOverlay(event, this);
    }

    getAllClasses() {
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
        if(this.classId == undefined || this.classId == "") {
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
        this.baseService.enableSelectWithEmpty('#bootstrap-section', data, this.constants.sectionObj, null)
    }

    save(){
        var data = {};
        var subjectId : any;
        var sectionId: any;
        subjectId = this.baseService.extractOptions(this.singleSubject.nativeElement.selectedOptions)[0].id;
        sectionId = this.baseService.extractOptions(this.singleSection.nativeElement.selectedOptions)[0];
        data['subjectId'] = subjectId;
        data['sectionId'] = sectionId == undefined ? "" : sectionId.id;
        data['classId'] = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        data['startDate'] = this.startDate;
        data['endDate'] = this.endDate;
        this.baseService.dataTableDestroy('datatable-assignment-export');
        this.baseService.enableDataTableAjax(this.serviceUrls.getAssignmentDetail, data);
        this.reload();

    }

    resetForm() {
        this.baseService.enableSelectWithEmpty('#bootstrap-section', this.sections, this.constants.sectionObj, null);
        this.baseService.enableSelectWithEmpty('#bootstrap-class', this.classes, this.constants.classObj, null);
        this.today(null);
        this.addAssignmentComponent.resetTable();
        var data = {};
        data['subjectId'] = '';
        data['sectionId'] = '';
        data['classId'] = '';
        data['startDate'] = this.startDate;
        data['endDate'] = this.endDate;
        this.baseService.dataTableDestroy('datatable-assignment-export');
        this.baseService.enableDataTableAjax(this.serviceUrls.getAssignmentDetail, data);
    }

    getNotificationLog(event: any) {
        this.notificationLogsComponent.getNotificationLogsByObj(event)
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
        // this.getAssignmentsInfo();
    }

    getAssignmentsInfo() {
        this.baseService.destroyDatatable('.datatable-assignment-export');
        this.baseService.enableDataTable(this.serviceUrls.getAssignments + '?startDate=' + this.startDate + '&endDate=' + this.endDate);
    }

    duration(event: any) {
        this.isDuration = true
    }

    getDataByDuration(event: any) {
        this.dates = this.date.nativeElement.innerText;
        var split = this.dates.split('-');
        this.startDate = this.dateService.getStartTime(split[0].trim())
        this.endDate = this.dateService.getEndTime(split[1].trim())
        // this.getAssignmentsInfo();
    }
}