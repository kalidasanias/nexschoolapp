/**
 * Created by Cyril on 2/22/2017.
 */


import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../../common/index";
import {AddDesignationComponent} from "./add-designation/add-designation.component";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    templateUrl: 'designation.html',
    styles: [`
    .dataTables_empty {
         text-align: center;
    }
    `], encapsulation: ViewEncapsulation.Emulated


})
export class DesignationComponent implements OnInit {

    @ViewChild(AddDesignationComponent) addDesignationComponent: AddDesignationComponent;
    desg_id_to_delete: string;
    designations: any[];
    enable: boolean = false;
    hideNoDataInfo: boolean;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants,
                private messages: Messages) { }
    ngOnInit() {
        this.baseService.setTitle('NSA - Designation')
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.enableDataTable(this.serviceUrls.designation)
        this.designations = [];
        this.hideNoDataInfo = true;
        this.enable = this.baseService.havePermissionsToEdit(this.constants.DESIGNATION_PERMISSIONS);
    }

    addDesignation(event: any) {
        this.addDesignationComponent.openModal(event, 'Save', 'Add Designation', null, this);
    }

    updateDesignation(event: any) {
        this.addDesignationComponent.openModal(event, 'Update', 'Edit Designation', event.target.value, this);
    }

    deleteDesignation() {
        this.baseService.showWarning();
    }

    confirmDelete(event: any) {
        this.commonService.deleteObj(this.serviceUrls.designation + event.target.value, 'datatable-designation');
    }
}