/**
 * Created by senthil on 1/24/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ServiceUrls, Constants} from "../../../../common/index";

import {AddFeeStructureComponent} from "../../../index";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'fee-structure.html'
})
export class FeeStructureComponent implements OnInit {

    @ViewChild(AddFeeStructureComponent) addFeeStructureComponent: AddFeeStructureComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls, private constants: Constants,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Fee Structure');
        /*this.baseService.enableDataTable();*/
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.getFeeStructures);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.FEE_STRUCTURE_PERMISSIONS);
    }

    addFeeStructure(event: any) {
        this.addFeeStructureComponent.openOverlay(event);
    }

    getFeeStructureType(event: any) {
        this.addFeeStructureComponent.getFeeStructure(event);
    }

    requested_delete(event: any) {
        var value = event.target.value;
        this.commonService.deleteObject(this.serviceUrls.deleteFeeStructure + JSON.parse(value).feeStructureId, value, 'datatable-structure-export');
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-structure-export');
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }
}