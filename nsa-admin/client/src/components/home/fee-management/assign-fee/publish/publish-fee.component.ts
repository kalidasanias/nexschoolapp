import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {BaseService} from "../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../common/index";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    selector: 'publish',
    templateUrl: 'publish-fee.html'
})
export class PublishFeeComponent implements OnInit {

    @ViewChild('sms') sms: ElementRef
    @ViewChild('email') email: ElementRef
    @ViewChild('push') push: ElementRef

    assignedUsers: any
    feeTypesDetails: any
    feeTypes: any
    totalFeeAmount: any
    feeAssignmentForm: any
    dueDate: any;
    assignees: any;
    refundAmount: any;
    feature:any[];

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants) { }

    ngOnInit() {
        this.feeTypesDetails = "";
        this.createDetailsForm();
        this.getFeatureChannelConfiguration();
    }


    openOverlay(event:any) {
        this.commonService.getActiveFeatureChannelDetails(this.feature);
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#publish1');
    }

    createDetailsForm() {
        this.feeAssignmentForm =  this.fb.group({
            'status': "true",
            'feeAssignmentId' : '',
            'paidDate': '',
            'createdDate': '',
            'feeAssignmentName': '',
            'dueDate': '',
            'notifyTo': this.fb.group({
                'status': this.constants.Sent
            }),
            "notify":  this.fb.group({
                "sms":false,
                "email": false,
                "push": false
            })
        })
    }

    getFeeDetails(event: any) {
        this.commonService.get(this.serviceUrls.getFeeAssignment + event.target.value).then(
            result => this.callBack(result)
        );

        this.baseService.dataTableDestroy('datatable-fee-details');
        this.baseService.enableDataTableAjax(this.serviceUrls.getFeeAssignedUser + event.target.value, null);
        this.openOverlay(event);
    }

    callBack(result: any) {
        this.feeTypesDetails = result;
        this.feeTypes = result.feeTypes;
        this.assignees = (this.transform(result.classes, 'name')).toString();
        this.totalFeeAmount = result.totalFeeAmount;
        this.dueDate = result.dueDate;
        this.refundAmount = this.calculateRefundAmount(result.feeTypes);
    }

    saveFeeDetails(id: any) {
        this.feeAssignmentForm._value.feeAssignmentId = this.feeTypesDetails.feeAssignmentId;
        this.feeAssignmentForm._value.createdDate = this.feeTypesDetails.createdDate;
        this.feeAssignmentForm._value.notify.sms = this.sms.nativeElement.checked;
        this.feeAssignmentForm._value.notify.email = this.email.nativeElement.checked;
        this.feeAssignmentForm._value.notify.push = this.push.nativeElement.checked;
        this.feeAssignmentForm._value.classes = this.feeTypesDetails.classes;
        this.feeAssignmentForm._value.languages = this.feeTypesDetails.languages;
        this.feeAssignmentForm._value.feeAssignmentName = this.feeTypesDetails.feeAssignmentName;
        this.feeAssignmentForm._value.dueDate = this.feeTypesDetails.dueDate;
        if(this.feeAssignmentForm.valid) {
            this.commonService.put(this.serviceUrls.publishFeeAssign + this.feeAssignmentForm._value.feeAssignmentId, this.feeAssignmentForm._value).then(
                result => this.saveFeeAssignmentCallBack(result, id, false),
                error => this.saveFeeAssignmentCallBack(<any>error, id, true)
            )
        }
    }

    saveFeeAssignmentCallBack(result:any, id:any, error:boolean){
        var successMsg = "Fee details published to all parents." ;
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');

        } else {
            this.baseService.showNotification(successMsg, "", 'bg-success');
            this.baseService.closeOverlay('#publish1');
            this.resetForm();
            this.baseService.dataTableReload('datatable-fee-export');

        }
    }

    resetForm() {
        this.createDetailsForm();
    }

    transform(value:any[], args:any):any {
        let keys = [];
        for (let key in value) {
            keys.push(value[key][args]);
        }
        return keys;
    }

    calculateRefundAmount(data: any) :any {
        let ramount = 0;
        for (let key in data) {
            var percent = data[key].percent;
            var amount = data[key].amount;
            if(data[key].percent != "") {
                ramount = ramount +  amount * (Number(percent)/100);
            }
        }
        return ramount;
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
}