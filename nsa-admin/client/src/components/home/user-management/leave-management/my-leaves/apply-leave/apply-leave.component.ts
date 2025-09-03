/**
 * Created by senthil on 5/24/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService, DateService} from "../../../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../../../common/index";
import {CommonService} from "../../../../../../services/common/common.service";
declare var moment: any;


@Component({
    selector: 'apply-leave',
    templateUrl: 'apply-leave.html',
})
export class ApplyLeavesComponent implements OnInit {

    buttonVal: any;
    applyLeaveForm: any;
    leave: any;
    schoolWeeks: any;
    modalId: any;
    user: any;
    leaveTypes: any
    feature: any;
    holidays: any;
    totalDays: any

    @ViewChild('leaveType') leaveType: ElementRef;
    @ViewChild('fullDate') fullDate: ElementRef;
    @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef

    constructor(private baseService: BaseService,
                private serviceUrls : ServiceUrls,
                private commonService: CommonService,
                private fb: FormBuilder,
                private dateService : DateService,
                public constants: Constants,
                public messages: Messages) { }


    ngOnInit() {
        this.getUserLeaveTypes();
        this.createApplyLeaveForm();
        this.getFeatureChannelConfiguration();
    }


    openOverlay(event: any) {
        this.resetForm();
        this.commonService.getActiveFeatureChannelDetails(this.feature);
        this.baseService.addHideClass('#cancel');
        this.buttonVal = this.constants.Save;
        if(this.leaveTypes.length > 0) {
            this.baseService.openOverlay(event)
        } else {
            this.baseService.showNotification('Unable to apply for leave since no leaves have been assigned. Please contact the school admin.', '', 'bg-danger');
        }

    }


    createApplyLeaveForm() {
        this.applyLeaveForm = this.fb.group({
            'leaveTypeName': [''],
            'date': '',
            'fromDate': '',
            'toDate' : '',
            'leaveReason': ['', Validators.required],
            "notify":  this.fb.group({
                "sms":'',
                "email": '',
                "push": ''
            }),
            'notifyTo': this.fb.group({
                'status': this.constants.Sent
            })
        });
    }

    closeOverlay() {
        this.baseService.closeOverlay('#applyLeave')
    }

    getLeaveDetailsById(obj: any, event: any) {
        this.modalId = event;
        this.buttonVal = this.constants.Update;
        var id = obj.appliedLeaveId;
        this.commonService.get(this.serviceUrls.leaves + id).then(
            leave => this.callBackLeave(leave)
        )
    }

    callBackLeave(leave: any) {
        this.leave = leave;
        this.baseService.removeHideClass('#cancel');
        this.editForm(leave);
    }

    editForm(form: any) {
        $('.selectedDate').text(form.fromDate + '   -   ' +  form.toDate)
        this.applyLeaveForm = this.fb.group({
            'leaveReason': [form.leaveReason, Validators.required],
        });
        this.baseService.enableSelectWithEmpty('#select-leaveType', this.leaveTypes, this.constants.leaveTypeObj, form.leaveTypeId);
        this.getFeatureChannelConfiguration();
        this.baseService.openOverlay(this.modalId)
    }

    resetForm() {
        this.createApplyLeaveForm();
        this.baseService.enableSelectWithEmpty('#select-leaveType', this.leaveTypes, this.constants.leaveTypeObj, null);
    }

    getUserLeaveTypes() {
        this.user = this.baseService.findUser();
        this.commonService.get(this.serviceUrls.leaveAssign + 'employee/' + this.user.user_name).then(
            leavTypes => this.callBackLeaveType(leavTypes)
        )
    }

    callBackLeaveType(data: any) {
        this.leaveTypes = data;
        this.baseService.enableSelectWithEmpty('#select-leaveType', this.leaveTypes, this.constants.leaveTypeObj, null);
    }

    saveLeaveType(id: any) {
        var dataFound = this.setValidations();
        if(this.applyLeaveForm.valid && dataFound) {
            this.baseService.enableBtnLoading(id);
            if(!this.leave) {
                this.setFormValues();
                this.commonService.post(this.serviceUrls.leaves, this.applyLeaveForm._value).then(
                    result => this.saveCallBack(result, id, false),
                    error => this.saveCallBack(<any>error, id, true)
                )

            } else {
                var form = this.setFormUpdateValues(this.leave, this.applyLeaveForm);
                this.commonService.put(this.serviceUrls.leaves + form.appliedLeaveId, form).then(
                    result => this.saveCallBack(result, id, false),
                    error => this.saveCallBack(<any>error, id, true)
                )

            }

        }
    }

    setFormValues() {
        var date = this.fullDate.nativeElement.innerText.split('   -   ');
        this.applyLeaveForm._value.fromDate = date[0];
        this.applyLeaveForm._value.toDate = date[1];
        this.applyLeaveForm._value.status = this.constants.PENDING
        this.applyLeaveForm._value.notify.sms = this.sms.nativeElement.checked;
        this.applyLeaveForm._value.notify.email = this.email.nativeElement.checked;
        this.applyLeaveForm._value.notify.push = this.push.nativeElement.checked;
        this.applyLeaveForm._value.leaveTypeId = this.baseService.extractOptions(this.leaveType.nativeElement.selectedOptions)[0].id;
        this.applyLeaveForm._value.empId = this.user.user_name;
        this.applyLeaveForm._value.empFirstName = this.user.first_name;
    }

    saveCallBack(result: any, id: any, error: boolean){

        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            $('#render').click();
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.closeOverlay();
            this.leave ="";
        }
        this.baseService.disableBtnLoading(id)
    }

    setFormUpdateValues(form: any, updateForm: any): any {
        var date = this.fullDate.nativeElement.innerText.split('   -   ');
        form.fromDate = date[0];
        form.toDate = date[1];
        form.leaveTypeId = this.baseService.extractOptions(this.leaveType.nativeElement.selectedOptions)[0].id;
        form.leaveTypeName = this.baseService.extractOptions(this.leaveType.nativeElement.selectedOptions)[0].name;
        form.leaveReason = updateForm._value.leaveReason;
        var notify = {};
        var notifyTo = {};
        notifyTo['status'] = this.constants.Sent
        notify['sms'] = this.sms.nativeElement.checked;
        notify['email'] = this.email.nativeElement.checked;
        notify['push'] = this.push.nativeElement.checked;
        form['notify'] = notify;
        form['notifyTo'] = notifyTo;

        return form;
    }


    setFormCancelValues(form: any, updateForm: any): any {
        var date = this.fullDate.nativeElement.innerText.split('   -   ');
        form.fromDate = date[0];
        form.toDate = date[1];
        form.leaveTypeId = this.baseService.extractOptions(this.leaveType.nativeElement.selectedOptions)[0].id;
        form.leaveTypeName = this.baseService.extractOptions(this.leaveType.nativeElement.selectedOptions)[0].name;
        form.leaveReason = updateForm._value.leaveReason;
        form.status = this.constants.CANCELLED
        var notify = {};
        var notifyTo = {};
        notifyTo['status'] = this.constants.Sent
        notify['sms'] = this.sms.nativeElement.checked;
        notify['email'] = this.email.nativeElement.checked;
        notify['push'] = this.push.nativeElement.checked;
        form['notify'] = notify
        form['notifyTo'] = notifyTo

        return form;
    }

    update(id: any) {
        //this.baseService.enableBtnLoading(id)
        var form = this.setFormCancelValues(this.leave, this.applyLeaveForm);
        this.commonService.put(this.serviceUrls.leaves + form.appliedLeaveId, form).then(
            result => this.saveCallBack(result, id, false),
            error => this.saveCallBack(<any>error, id, true)
        )
    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)
        )
    }

    callBackChannels(data: any) {
        this.feature = data;
        this.commonService.getActiveFeatureChannelDetails(data);
    }

    setValidations() {

        var dataFound = false;
        var type = this.baseService.extractOptions(this.leaveType.nativeElement.selectedOptions)[0].id;
        if(type.length < 1 && type == '') {
            this.baseService.showNotification("Enter Leave Type", '', 'bg-danger')
        } else {
            dataFound = true;
        }

        return dataFound;
    }

}
