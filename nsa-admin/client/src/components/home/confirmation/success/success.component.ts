/**
 * Created by senthil on 3/25/2017.
 */
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {BaseService} from "../../../../services/base/base.service";
import {CommonService} from "../../../../services/common/common.service";
import {ServiceUrls} from "../../../../common/constants/service.urls";

@Component({
    selector: 'success',
    templateUrl: 'success.html'
})
export class SuccessComponent implements OnInit {

    id: any;
    transactions: any;
    feeDetails: any;

    constructor(private activatedRoute: ActivatedRoute,
                private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {

        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.id = params['id'];
        });
    }
    ngOnInit() {
        this.getTransactionDetails(this.id);
        this.commonService.get(this.serviceUrls.getFeeAssignmentDetail + this.id).then(
            result => this.callBack(result)
        );
    }

    getTransactionDetails(id: any) {
        this.commonService.get(this.serviceUrls.getTransactionDetails + this.id).then(
            data => this.reqCallBack(data)
        )
    }

    reqCallBack(result: any) {
        this.transactions = result;
    }

    HTMLtoPDF() {
        this.baseService.HTMLtoPDF(this.serviceUrls.getSchoolLogo, this.feeDetails.feeAssignmentName);
    }

    callBack(details: any) {
        this.feeDetails = details;
    }

}