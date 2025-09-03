/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ServiceUrls} from "../../../../common/constants/service.urls";
import {Constants, Messages} from "../../../../common/index";
import {AssignUserComponent} from "./assign-user/assign-user.component";
import {TransportService} from "../../../../services/transport/transport.service";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'vehicle-allocation.html'
})
export class VehicleAllocationComponent implements OnInit {

    id_to_delete: any;
    classSections: any[];
    routes: any[];
    enable: boolean = false;

    @ViewChild(AssignUserComponent) assignUserComponent: AssignUserComponent;
    constructor(private constants: Constants,
                private messages: Messages,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private baseService: BaseService,
                private transportService: TransportService) { }

    ngOnInit() {
        this.baseService.setTitle('NSA - Allocated Students');
        this.commonService.get(this.serviceUrls.classSession).then(classSections => this.callBack(classSections));
        this.transportService.getAll(this.serviceUrls.route).then(routes => this.callbackRoutes(routes));
        this.enable = this.baseService.havePermissionsToEdit(this.constants.VEHICLE_ALLOC_PERMISSIONS);
    }

    callBack(classSections: any) {
        this.classSections = classSections;
    }

    callbackRoutes(routes: any[]) {
        this.routes = routes;
        this.baseService.getAllRoutes(routes);
        this.baseService.enableDataTable(this.serviceUrls.userAssign);
    }

    assignUser(event: any) {
        if (this.routes.length > 0) {
            this.assignUserComponent.openOverlay(event, this);
        } else {
            this.baseService.showNotification('No Routes Created', '', 'bg-danger');
        }
    }

    unassignStudent() {
        this.baseService.showWarning();
    }

    confirmDelete(event: any) {
        this.transportService.delete(this.serviceUrls.userAssign+event.target.value).then(
            result => this.callBackSuccessDelete(result),
            error => this.callBackSuccessDelete(<any>error));
    }

    callBackSuccessDelete(data: any) {
        this.baseService.showInformation('top', this.messages.delete_success, this.constants.n_success);
        this.baseService.dataTableReload('datatable-student-allocation');
    }
}
