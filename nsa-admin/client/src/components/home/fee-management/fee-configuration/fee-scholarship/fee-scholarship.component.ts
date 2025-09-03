/**
 * Created by senthil on 1/24/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {ServiceUrls, Constants} from "../../../../../../src/common/index";
import {BaseService} from "../../../../../services/index";

import {AddScholarshipComponent} from "../../../../index";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    templateUrl: 'fee-scholarship.html'
})
export class FeeScholarshipComponent implements OnInit {

    @ViewChild(AddScholarshipComponent) addScholarshipComponent: AddScholarshipComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                public serviceUrls:ServiceUrls,  private constants: Constants,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Fee Scholarship');
        this.baseService.enableDataTable(this.serviceUrls.getFeeScholarships);
        this.baseService.enablePickerDate();
        this.baseService.enableAppJs();
        this.enable = this.baseService.havePermissionsToEdit(this.constants.FEE_SCHOLARSHIP_PERMISSIONS);
    }

    addScholarship(id: any) {
        this.addScholarshipComponent.openOverlay(id);
    }

    requested_delete(event:any) {
        var value = event.target.value;
        this.commonService.deleteObject(this.serviceUrls.deleteFeeScholarship + JSON.parse(value).id, value, 'datatable-scholarship')
        this.reload();
    }

    getFeeScholarships(event:any) {
        this.addScholarshipComponent.getFeeScholarships(event);
    }

    reload() {
        this.baseService.dataTableReload('datatable-scholarship');
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }
}