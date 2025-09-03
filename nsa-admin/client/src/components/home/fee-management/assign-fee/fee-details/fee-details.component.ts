/**
 * Created by senthil on 1/25/2017.
 */
import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {ServiceUrls} from "../../../../../common/index";
import * as myGlobals from "../../../../../common/constants/global";
import {CommonService} from "../../../../../services/common/common.service";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {ValidationService} from "../../../../../services/validation/validation.service";

declare var $: any

@Component({
    selector: 'fee-details',
    templateUrl: 'fee-details.html'
})
export class FeeDetailsComponent implements OnInit  {

    assignedUsers: any
    feeTypesDetails: any
    feeTypes: any
    totalFeeAmount: any
    dueDate: any
    amountPayable: any
    assignees: any;
    refundAmount: any;
    isPartial: boolean
    feeDetailsObj: any = {}
    feeTansactionDetails: any[] = []
    paymentForm: any

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) { }

    ngOnInit() {
        this.feeTypesDetails= "";
        this.createForm(1)
    }

    createForm(max: any) {
        this.paymentForm = this.fb.group({
            'amount': ['', [Validators.required, ValidationService.numberValueValidator({min: 1, max: max}, 'partialAmount')]],
        });
    }

    openOverlay(event:any) {
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        this.baseService.closeOverlay('#feeDetails');
    }


    feeDetails(event: any) {
        this.commonService.get(this.serviceUrls.getFeeAssignment + event.target.value).then(
            result => this.callBack(result)
        );

        this.baseService.dataTableDestroy('datatable-fee-details');
        this.baseService.enableDataTableAjax(this.serviceUrls.getFeeAssignedUser + event.target.value, null);
        this.openOverlay(event)
    }

    callBack(result: any) {
        this.feeTypesDetails = result;
        this.feeTypes = result.feeTypes;
        this.assignees = (this.transform(result.classes, 'name')).toString();
        this.totalFeeAmount = result.totalFeeAmount;
        this.dueDate = result.dueDate;
        this.refundAmount = this.calculateRefundAmount(result.feeTypes);
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

    requested_warning(event:any) {
        this.isPartial = false
        this.feeDetailsObj = JSON.parse(event.target.value)
        this.amountPayable = this.feeDetailsObj.netAmount - (this.feeDetailsObj.paidAmount || 0)
        this.createForm(this.amountPayable)
        $('#cash-payment').modal('show');
    }

    getTransactionDetails(event: any) {
        this.feeDetailsObj = JSON.parse(event.target.value)
        this.commonService.get(this.serviceUrls.getTransactionDetails + this.feeDetailsObj.feeAssignmentDetailId).then(
            trans => this.callBackTrans(trans)
        )
    }

    callBackTrans(trans: any) {
        this.feeTansactionDetails = trans;
        this.baseService.openModal('cash-receipt')
    }

    partial() {
        this.isPartial = true
    }

    full() {
        this.isPartial = false
    }

    payByCash(event: any) {
        this.baseService.enableBtnLoading('confirmSubmit');
        if(!this.baseService.isEmptyObject($('#payByCashObj').val())) {
            var value = JSON.parse($('#payByCashObj').val());
            value['isPartial'] = this.isPartial;
            var amt = this.isPartial ? this.paymentForm._value.amount : this.amountPayable;
            value['paidAmount'] = String(Number(amt) + Number((this.feeDetailsObj.paidAmount || 0)))
            value['collectedAmount'] = String(amt)
            this.commonService.post(this.serviceUrls.payByCash, value).then(
                result => this.payByCashCallBack(result, false),
                error => this.payByCashCallBack(<any>error, true))
        } else {
            this.baseService.disableBtnLoading('confirmSubmit')
        }
    }

    payByCashCallBack(result: any, err: boolean) {
        if(err) {
            this.baseService.showNotification(result.message, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.dataTableReload('datatable-fee-details');
            $('#cash-payment').modal('hide');
        }
        this.baseService.disableBtnLoading('confirmSubmit')
    }

    checkRole(event: any) {
        if(!this.baseService.checkRole(myGlobals.ASA_USER)) {
            this.baseService.hideColumn('.datatable-fee-details', [6])
        }
    }

}