/**
 * Created by anjan on 8/1/2017.
 */

import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ServiceUrls} from "../../../../common/index";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'suggestions.html'
})

export class SuggestionsComponent implements OnInit{

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls) { }
    ngOnInit() {
        this.baseService.setTitle('NSA - Suggestions')
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.getFeedBack);
    }

}