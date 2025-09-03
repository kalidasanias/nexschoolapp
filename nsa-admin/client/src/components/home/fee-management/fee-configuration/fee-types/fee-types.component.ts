/**
 * Created by senthil on 1/24/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {ServiceUrls, Constants} from "../../../../../common/index";
import {BaseService} from "../../../../../services/index";

import {AddFeeComponent} from "../../../../index";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    templateUrl: 'fee-types.html'
})
export class FeeTypesComponent implements OnInit {

    @ViewChild(AddFeeComponent) addFeeComponent: AddFeeComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls, private constants: Constants,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Fee Types');
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.getFeeTypes);
        /*this.baseService.enableFormMultiSelect();*/
        /*this.baseService.enableBootstrapSelect();*/
        this.enable = this.baseService.havePermissionsToEdit(this.constants.FEE_TYPE_PERMISSIONS)
    }

    addFee(event: any) {
        this.addFeeComponent.openOverlay(event)
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }

    getFeeType(event: any) {
        this.addFeeComponent.getFeeType(event)
    }

    requested_delete(event: any) {
        var value = event.target.value;
        this.commonService.deleteObject(this.serviceUrls.deleteFeeType + JSON.parse(value).id, value, 'datatable-fee-type');
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-fee-type');
    }

}