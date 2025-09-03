/**
 * Created by senthil on 1/24/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ServiceUrls, Constants} from "../../../../common/index";

import {AddNewFeeComponent, FeeDetailsComponent} from "../../../index";
import {PublishFeeComponent} from "./publish/publish-fee.component";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'assign-fee.html'
})
export class AssignFeeComponent implements OnInit {

    @ViewChild(AddNewFeeComponent) addNewFeeComponent: AddNewFeeComponent
    @ViewChild(FeeDetailsComponent) feeDetailsComponent: FeeDetailsComponent
    @ViewChild(PublishFeeComponent) publishFeeComponent: PublishFeeComponent
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private commonService: CommonService,
                private ServiceUrls: ServiceUrls, private constants: Constants,
                private serviceUrls: ServiceUrls) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Assign Fees')
        this.baseService.enableDataTable(this.serviceUrls.getFeeAssignments);
        /*this.baseService.enableDataTable();*/
        /*this.baseService.enableSelect('.bootstrap-select', this.arr);
         this.baseService.enableMultiSelect(null, this.arr);
         this.baseService.enableMultiSelectAll(null, null);
         this.baseService.enableMultiSelectFilteringAll(null, null);*/
        this.baseService.enablePickerDate();
        this.baseService.enableAppJs();
        this.enable = this.baseService.havePermissionsToEdit(this.constants.FEE_ASSIGN_PERMISSIONS)
    }

    addNewFee(event: any) {
        this.addNewFeeComponent.openOverlay(event);
    }

    feeDetails($event: any) {
        this.feeDetailsComponent.feeDetails($event);
    }

    reload() {
        this.baseService.dataTableReload('datatable-fee-export');
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }

    requested_delete(event: any) {
        var value = event.target.value;
        if(!this.baseService.isEmptyObject(value)) {
            this.commonService.deleteObject(this.serviceUrls.deleteFeeAssignment + JSON.parse(value).feeAssignmentId, value, 'datatable-fee-export');
            this.reload();
        }
    }

    getFeeAssignment(id: any, value: any, event: any) {
        this.addNewFeeComponent.getFeeAssignmentById(id, value, event);
    }

    publishFee(event: any) {
        this.publishFeeComponent.getFeeDetails(event);
    }

}