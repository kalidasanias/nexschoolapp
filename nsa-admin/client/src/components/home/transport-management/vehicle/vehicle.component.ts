/**
 * Created by Cyril on 2/22/2017.
 */

import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {BaseService, TransportService} from "../../../../services/index";
import {CommonService} from "../../../../services/common/common.service";
import {Constants, Messages, ServiceUrls} from "../../../../common/index";
import {AddVehicleComponent} from "./add-vehicle/add-vehicle.component";

@Component({
    templateUrl: 'vehicle.html',
    styles: [`
    .dataTables_empty {
         text-align: center;
    }
    `], encapsulation: ViewEncapsulation.Emulated
})

export class VehicleComponent implements OnInit {

    @ViewChild(AddVehicleComponent) addVehicleComponent: AddVehicleComponent;
    reg_no_to_delete: string;
    reg_no_change_status: string;
    vehicles: any[];
    hideNoDataInfo: boolean;
    enable: boolean = false;

    constructor(private baseService: BaseService, private  serviceUrls: ServiceUrls,
                public transportService: TransportService,
                private commonService: CommonService,
                public constants: Constants, public messages: Messages) { }

    ngOnInit() {
        this.baseService.setTitle('NSA - Vehicle Details');
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.enableDataTable(this.serviceUrls.vehicle);
        // this.getAllVehicles();
        this.vehicles = [];
        this.hideNoDataInfo = true;
        this.enable = this.baseService.havePermissionsToEdit(this.constants.VEHICLE_PERMISSIONS);
    }

    getAllVehicles() {
        this.transportService.getAll(this.serviceUrls.vehicle).then(vehicles => this.callBack(vehicles));
    }

    callBack(vehicles: any) {

        if (vehicles.length > 0) {
            this.vehicles = vehicles;
            this.hideNoDataInfo = true;
        } else {
            this.hideNoDataInfo = false;
            this.vehicles = [];
        }
    }

    addVehicle(event: any) {
        this.addVehicleComponent.openOverlay(event, 'Save', 'Add Vehicle', null, this);
    }

    updateVehicle(event: any) {
        this.addVehicleComponent.openOverlay(event, 'Update', 'Edit Vehicle', event.target.value, this);
    }

    deleteVehicle(event: any) {
        this.baseService.showWarning();
    }

    vehicleStatus(event: any) {
        var data = JSON.parse(event.target.value);
        if (data.active) {
            this.baseService.showInfoWarning('Are you sure?', 'Yes, De-activate It', 'warning');
            this.reload();
        } else {
            this.baseService.showInfoWarning('Are you sure?', 'Yes, Activate It', 'warning');
        }

    }

    changeStatus(event:any) {
        if (event.target.value !== '') {
            var data = JSON.parse(event.target.value);
            var reqBody = {};

            if (data.active) {
                reqBody['active'] = 'de-active';
            } else {
                reqBody['active'] = 'active';
            }

            this.transportService.patch(this.serviceUrls.vehicle+data.reg_no, reqBody).then(
             result => this.changeStatusCallBack(reqBody),
             error => this.changeStatusErrCallBack(error))
        }
    }

    changeStatusCallBack(reqBody: any) {
        this.baseService.showNotification('Vehicle '+ reqBody.active + ' successfully', "", 'bg-success');
        this.reload()
    }

    changeStatusErrCallBack(error: any) {
        this.baseService.showInformation('top', error, this.constants.n_info);
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-vehicle');
    }

    confirmDelete(event: any) {
        if (event.target.value !== '') {
            this.commonService.deleteObj(this.serviceUrls.vehicle +   event.target.value, 'datatable-vehicle');
            this.vehicles = [];
        }
    }

}
