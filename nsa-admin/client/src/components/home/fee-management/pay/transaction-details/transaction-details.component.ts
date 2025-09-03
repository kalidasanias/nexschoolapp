/**
 * Created by senthil on 18/09/17.
 */
import {Component, Input, OnInit} from '@angular/core';
import {BaseService} from "../../../../../services/base/base.service";
import {ServiceUrls} from "../../../../../common/constants/service.urls";

@Component({
    selector: 'transaction-details',
    templateUrl: 'transaction-details.html'
})
export class TransactionDetailsComponent implements OnInit {
    @Input() feeDetailsObj: any
    @Input() feeTansactionDetails: any
    transactions: any = {}

    constructor(private baseService: BaseService, private serviceUrl: ServiceUrls) { }
    ngOnInit() {
    }

    generateReceipt(event: any) {
        var id = event.target.firstChild.value;
        this.transactions = this.baseService.getObject(this.feeTansactionDetails, {fee_trans_id: id})
        setTimeout(() =>{
            this.HTMLtoPDF();
        }, 100)
    }

    HTMLtoPDF() {
        this.baseService.HTMLtoPDF(this.serviceUrl.getSchoolLogo, this.feeDetailsObj.firstName + '_' +this.feeDetailsObj.feeAssignmentName);
    }
}