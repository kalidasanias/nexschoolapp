/**
 * Created by senthil on 2/16/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ServiceUrls} from "../../../../../src/common/index";

import {PaymentComponent} from "./payment/payment.component";
import {InvoiceComponent} from "./invoice/invoice.component";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'fee-pay.html'
})
export class FeePayComponent implements OnInit {

    @ViewChild(PaymentComponent) PaymentComponent: PaymentComponent
    @ViewChild(InvoiceComponent) InvoiceComponent: InvoiceComponent

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {

    }

    feeDetailsObj: any = {}
    feeTansactionDetails: any[] = []

    ngOnInit() {
        this.baseService.setTitle('NSA-fee-pay');
        this.baseService.enablePickerDate();
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.getAssignedUsersFeeDetails);
    }

    payNow(event:any) {
        this.commonService.get(this.serviceUrls.getSchoolDetails).then(
            result => this.callback(result, event, false),
            error => this.callback(<any>error, event, true))

    }

    viewInvoice(event:any) {
        this.InvoiceComponent.getPaymentDetailsById(event);
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

    callback(result: any, event: any, err: any) {
        if(err) {
            this.baseService.showNotification('Failure!', result.message, 'bg-danger');
        } else if(result.sub_merchant_id){
            this.PaymentComponent.getPaymentDetailsById(event);
        } else {
            this.baseService.showNotification('Failure!', 'Online Payment is not Enabled', 'bg-danger');
        }
    }

}