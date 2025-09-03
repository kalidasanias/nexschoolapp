/**
 * Created by Cyril on 2/22/2017.
 */

import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {BaseService, TransportService} from "../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../common/index";
import {CreateDriverComponent} from "./create-driver/create-driver.component";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'driver.html',
    styles: [`
    .dataTables_empty {
         text-align: center;
    }
    `], encapsulation: ViewEncapsulation.Emulated
})

export class DriverComponent implements OnInit {

    @ViewChild(CreateDriverComponent) createDriverComponent: CreateDriverComponent;

    dept_id_to_delete: string;
    drivers: any[];
    hideNoDataInfo: boolean;
    enable: boolean = false;

    constructor(private baseService: BaseService, private  serviceUrls: ServiceUrls,
                public transportService: TransportService, private commonService: CommonService,
                public constants: Constants, public messages: Messages) { }

    ngOnInit() {
        this.baseService.setTitle('NSA - Driver Details');
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.enableDataTable(this.serviceUrls.driver);
        this.drivers = [];
        this.hideNoDataInfo = true;
        this.enable = this.baseService.havePermissionsToEdit(this.constants.DRIVER_PERMISSIONS);
    }

    addDriver(event: any) {
        this.createDriverComponent.openOverlay(event, 'Save', 'Add Driver', null, this);
    }

    updateDriver(event: any) {
        this.createDriverComponent.openOverlay(event, 'Update', 'Edit Driver', event.target.value, this);
    }

    deleteWarning(event: any) {
        this.baseService.showWarning();
    }

    confirmDelete(event: any) {
        if (event.target.value !== '') {
            this.commonService.deleteObj(this.serviceUrls.driver + event.target.value, 'datatable-drivers');
            this.baseService.dataTableReload('datatable-drivers');
        }
    }

}
