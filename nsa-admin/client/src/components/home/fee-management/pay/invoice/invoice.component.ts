/**
 * Created by senthil on 2/16/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
import {ServiceUrls} from "../../../../../common/constants/service.urls";
declare var jQuery: any;

@Component({
    selector: 'invoice',
    templateUrl: 'invoice.html'
})
export class InvoiceComponent implements OnInit {
    feeDetails: any;
    transactions: any;
    modalId: any;
    user: any;
    @ViewChild('test') el: ElementRef;


    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) { }
    ngOnInit() {
        this.feeDetails == "";
        this.transactions == "";
        this.user == "";
    }

    openOverlay(event: any) {
        jQuery('body').addClass('no-print');
        this.baseService.openOverlay(event);
    }

    closeOverlay(event:any) {
        jQuery('body').removeClass('no-print');
        this.baseService.closeOverlay('#invoice');
    }

    getPaymentDetailsById(event: any) {
        this.modalId = event;
        this.feeDetails = JSON.parse(event.target.value)
        this.commonService.get(this.serviceUrls.getTransactionDetails + this.feeDetails.feeAssignmentDetailId).then(
            trans => this.callBackTrans(trans)
        )

    }

    callBack(details: any) {
        this.feeDetails = details;
        this.openOverlay(this.modalId)
    }

    callBackTrans(trans: any) {
        this.transactions = trans;
        this.user = this.baseService.findUser()
        this.openOverlay(this.modalId)
    }

    HTMLtoPDF() {
        this.baseService.HTMLtoPDF(this.serviceUrls.getSchoolLogo, this.feeDetails.feeAssignmentName);
    }
}