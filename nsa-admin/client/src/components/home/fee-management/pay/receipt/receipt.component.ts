/**
 * Created by senthil on 18/09/17.
 */
import {Component, Input, OnInit} from '@angular/core';
import {BaseService} from "../../../../../services/index";
import {CommonService} from "../../../../../services/common/common.service";
import {ServiceUrls} from "../../../../../common/constants/service.urls";
declare var $ : any;
declare var _ : any;

@Component({
    selector: 'receipt',
    templateUrl: 'receipt.html',

})
export class ReceiptComponent implements OnInit {
    @Input() feeDetails: any
    private transactions: any = {}
    amount: any;
    user: any;
    schoolDetails: any;
    address: any;

    generatedDate: any = new Date()

    @Input()
    set transaction(transaction: any) {
        this.transactions = transaction;
    }

    constructor(private baseService: BaseService, private commonService: CommonService,
                private serviceUrls: ServiceUrls) {}

    ngOnInit() {
        this.getSchoolDetails();
    }

    getSchoolDetails(){
        this.commonService.get(this.serviceUrls.getSchoolDetails).then(schoolDetails => this.callback(schoolDetails));
    }

    callback(details: any){
        this.user = details;
        var street1 = details.street_address_1 ? details.street_address_1 +',' +'<br/>': '';
        var street2 = details.street_address_2 ? details.street_address_2 +',' + '<br/>':'';
        var contactNumbers = details.phone_number ? _.values(details.phone_number) : [];
        var contactInformation = !_.isEmpty(contactNumbers) ?  'Mobile :' + contactNumbers : '';
        this.address = street1 + street2 + contactInformation + '.';
        if(details.logo) {
            var url = this.baseService.getBaseUrlWithoutSchool();
            this.schoolDetails = url + details.logo;
        }
    }
}
