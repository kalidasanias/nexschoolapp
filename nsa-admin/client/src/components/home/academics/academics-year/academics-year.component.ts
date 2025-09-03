/**
 * Created by Cyril on 2/22/2017.
 */


import {Component, OnInit} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ServiceUrls} from "../../../../common/index";


@Component({
    templateUrl: 'academics-year.html'
})
export class AcademicsYearComponent implements OnInit {

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Academics Year');
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.enableDataTable(this.serviceUrls.getAllAcademics)
    }
}
