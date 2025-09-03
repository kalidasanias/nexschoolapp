/**
 * Created by Sai Deepak on 5/24/2017.
 */

import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../../common/index";
import {CommonService} from "../../../../../../../services/common/common.service";

@Component({
    selector: 'respond-leave',
    templateUrl: 'respond-leaves.html'
})
export class RespondLeaveComponent implements OnInit {

    leaveDetails: any = {};
    remainLeavs: any
    leaves: any;
    feature: any;
    denialForm: any;
    @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private fb: FormBuilder,
                private commonService: CommonService,
                private constants: Constants) {

    }

    ngOnInit() {
        this.createForm();
        this.getFeatureChannelConfiguration();
    }

    createForm() {
        this.denialForm = this.fb.group({
            'denialDesc': ['', Validators.required],
        });
    }

    openOverlay(event: any) {
        this.createForm();
        this.commonService.getActiveFeatureChannelDetails(this.feature);
        this.baseService.openOverlay(event);
    }

    closeOverlay(event: any) {
        this.baseService.closeOverlay('#respondLeave');
    }

    getLeaveDetailByUser(event: any, obj: any) {
        obj = JSON.parse(obj);
        this.leaves = obj;
        this.commonService.get(this.serviceUrls.leaves + obj.appliedLeaveId).then(
            leaveDetails => this.callBackLeaveDetails(leaveDetails)
        )

        this.baseService.dataTableDestroy('datatable-respond-leaves');
        this.baseService.dataTableDestroy('datatable-approval-history');
        this.baseService.enableDataSourceDatatable(this.serviceUrls.leavesTaken + obj.empId)
        this.commonService.get(this.serviceUrls.remainigleaves + obj.empId).then(
            remainLeav => this.remainLeavs = remainLeav
        )
        this.baseService.openOverlay(event);
    }

    callBackLeaveDetails(form: any) {
        this.leaveDetails = form;
        if(form.status != undefined) {
            if(form.status == this.constants.APPROVED){
                this.baseService.removeDisabled('#deny');
                this.baseService.addDisabled('#approved');
            } else if (form.status == this.constants.DENY) {
                this.baseService.removeDisabled('#approved');
                this.baseService.addDisabled('#deny');
            } else {
                this.baseService.removeDisabled('#approved');
                this.baseService.removeDisabled('#deny');
            }
        }

    }

    update(id: any) {
        if(this.leaves.appliedLeaveId != "" && this.denialForm.valid) {
            this.baseService.enableBtnLoading(id);
            this.setFormValues();
            this.leaves.leaveReason = this.denialForm._value.denialDesc;
            this.leaves.status = this.constants.DENY;

            this.commonService.put(this.serviceUrls.leaves + this.leaves.appliedLeaveId, this.leaves).then(
                result => this.saveCallBack(result, id, false),
                error => this.saveCallBack(<any>error, id, true)
            )
        }
    }

    approve(id: any) {
        if(this.leaves.appliedLeaveId != "") {
            this.baseService.enableBtnLoading(id);
            this.setFormValues();
            this.leaves.status = this.constants.APPROVED;

            this.commonService.put(this.serviceUrls.leaves + this.leaves.appliedLeaveId, this.leaves).then(
                result => this.saveCallBack(result, id, false),
                error => this.saveCallBack(<any>error, id, true)
            )
        }
    }

    saveCallBack(result: any, id: any, error: boolean){
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
        }
        this.baseService.dataTableReload('datatable-requested-leaves');
        this.baseService.closeOverlay('#respondLeave');
        this.baseService.closeModal('denyReason');
        this.baseService.disableBtnLoading(id)
    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channel => this.callBackChannels(channel)
        )
    }

    callBackChannels(data: any) {
        this.feature = data;
        this.commonService.getActiveFeatureChannelDetails(data);
    }

    setFormValues() {
        var notify = {};
        var notifyTo = {};
        notifyTo['status'] = this.constants.Sent
        notify['sms'] = this.sms.nativeElement.checked;
        notify['email'] = this.email.nativeElement.checked;
        notify['push'] = this.push.nativeElement.checked;
        this.leaves['notify'] = notify
        this.leaves['notifyTo'] = notifyTo;
        this.leaves['leaveTypeName'] = this.leaveDetails.leaveTypeName;
    }

    openModal() {
        this.createForm();
        this.baseService.openModal('denyReason');
    }

}
