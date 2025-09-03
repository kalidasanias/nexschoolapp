/**
 * Created by senthil on 5/24/2017.
 */

import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../../common/index";
import {ExtCalendarComponent} from "../../../common/calendar/ext.calendar.component";
import {ApplyLeavesComponent} from "./apply-leave/apply-leave.component";
import {CommonService} from "../../../../../services/common/common.service";


@Component({
    templateUrl: 'my-leaves.html',
})
export class MyLeavesComponent implements OnInit {

    events: any = {};
    user: any;
    remLeaves: any;
    approvedLeaves: any;
    appliedLeaves: any;
    denialForm: any;
    enable : boolean = false;

    @ViewChild(ExtCalendarComponent) exeCalendar: ExtCalendarComponent;
    @ViewChild(ApplyLeavesComponent) applyLeaveComponent: ApplyLeavesComponent;

    constructor(private baseService: BaseService,
                private serviceUrls : ServiceUrls,
                private commonService: CommonService,
                private fb: FormBuilder,
                public constants: Constants,
                public messages: Messages) { }

    ngOnInit() {
        this.baseService.setTitle('NSA - My Leaves')
        this.baseService.enableAppJs();
        this.user = this.baseService.findUser();
        this.baseService.enablePickerDate();
        this.getSlots();
        this.getLeaveCalendar();
        this.getRemainingLeaves();
        this.getAppliedLeaves();
        this.getLeavesTaken();
        this.createForm();
        this.baseService.enableDataTable(this.serviceUrls.department)
        this.enable = this.baseService.havePermissionsToEdit(this.constants.LEAVE_ASSIGN_PERMISSIONS)
    }

    applyLeave(event: any) {
        this.applyLeaveComponent.openOverlay(event);
    }

    createForm() {
        this.denialForm = this.fb.group({
            'denialDesc': ['', Validators.required],
        });
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

    renderCalendar(data: any) {
        this.exeCalendar.enableCalendar(data, 'month', true)
    }

    refreshCalendar(data: any) {
        this.exeCalendar.refresh(data)
    }

    getLeaveCalendar() {
        this.commonService.get(this.serviceUrls.leavesCal + this.user.user_name).then(result => this.dashboardEventsCallback(result));
    }

    dashboardEventsCallback(result: any) {
        this.events.events = result
        this.refreshCalendar(this.events);
    }

    getRemainingLeaves() {
        this.commonService.get(this.serviceUrls.remainigleaves + this.user.user_name).then(
            remLeaves => this.remLeaves = remLeaves
        )
    }

    getLeavesTaken() {
        this.commonService.get(this.serviceUrls.pastleavesTaken + this.user.user_name).then(
            approvedLeaves => this.approvedLeaves = approvedLeaves
        )
    }

    getAppliedLeaves() {
        this.commonService.get(this.serviceUrls.userLeaves + this.user.user_name).then(
            appliedLeaves => this.appliedLeaves = appliedLeaves
        )
    }

    getLeaveDetails(obj: any, event: any) {
        this.applyLeaveComponent.getLeaveDetailsById(obj, event);
    }

    render() {
        this.getRemainingLeaves();
        this.getAppliedLeaves();
        this.getLeavesTaken();
    }

    openModal(obj: any) {
        this.commonService.get(this.serviceUrls.leavesReason + obj.appliedLeaveId +'/' + this.constants.DENY).then(
            reason => this.callBackReason(reason)
        )
    }

    callBackReason(form: any) {
        this.denialForm = this.fb.group({
            'denialDesc': [form.reason],
        });
        this.baseService.openModal('denyReasons');
    }
}
