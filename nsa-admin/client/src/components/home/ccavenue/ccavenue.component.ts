/**
 * Created by senthil on 3/24/2017.
 */
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {ServiceUrls} from "../../../common/constants/service.urls";
import {BaseService} from "../../../services/";
import {CommonService} from "../../../services/common/common.service";
declare var jQuery:any;

@Component({
    selector: 'ccavenue',
    templateUrl: 'ccavenue.html'
})
export class CcavenueComponent implements OnInit {
    url: SafeResourceUrl;
    id: any;
    constructor(private sanitizer: DomSanitizer,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private baseService: BaseService,
                private activatedRoute: ActivatedRoute) {

        this.activatedRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
            this.getCCReqDetails();
        });
    }

    ngOnInit() {
        /*jQuery( "#nonseamless" ).submit();*/
        /*jQuery("iframe#paymentFrame").load(function () {
            window.addEventListener("message", function (e) {
                jQuery("#paymentFrame").css("height", e.data["newHeight"] + "px");
            }, false);
        });*/
    }

    getCCReqDetails() {
        this.commonService.post(this.serviceUrls.getReqDetails, {feeId: this.id}).then(
            data => this.reqCallBack(data)
        )
    }

    reqCallBack(result: any) {
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(result.hash);
        this.baseService.disableLoading();
    }
}