/**
 * Created by senthilPeriyasamy on 12/23/2016.
 */
import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../services/index";
import {CommonService} from "../../../services/common/common.service";
import {ServiceUrls} from "../../../common/constants/service.urls";
declare var jQuery: any;

@Component({
    selector: 'second-nav',
    templateUrl: 'second-nav.html'
})
export class SecondNavComponent implements OnInit {
    features:any[];
    user: any;
    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) {
    }
    ngOnInit() {
        this.baseService.enableAppJs();
        this.getAllFeature();
        this.user = this.baseService.findUser();
    }

    getAllFeature() {
        this.commonService.get(this.serviceUrls.getFeatureDetails)
            .then(features => this.callback(features));
    }

    callback(result: any) {
        this.features = result;
        var $this = this
        setTimeout(function() {
            $this.baseService.navSelect();
        }, 100);

    }
}