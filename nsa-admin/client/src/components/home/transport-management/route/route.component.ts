/**
 * Created by Cyril on 2/22/2017.
 */

import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {BaseService, TransportService} from "../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../common/index";
import {AddRouteComponent} from "./add-route/add-route.component";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'route.html',
    styles: [`
    .dataTables_empty {
         text-align: center;
    }
    `], encapsulation: ViewEncapsulation.Emulated,

})

export class RouteComponent implements OnInit {

    @ViewChild(AddRouteComponent) addRouteComponent: AddRouteComponent;

    routes: any[];
    city: string;
    schoolDetails: any;
    googleMap: any;
    googleApiLoaded: boolean;
    hideNoDataInfo: boolean;
    enable: boolean = false;
    drivers: any;

    constructor(private baseService: BaseService, private  serviceUrls: ServiceUrls,
                public transportService: TransportService, private commonService: CommonService,
                public constants: Constants, public messages: Messages) { }
    ngOnInit() {
        this.baseService.setTitle('NSA - Route Details');
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.transportService.getAll(this.serviceUrls.driver).then(drivers => this.callBackDriver(drivers));

        this.routes = [];
        this.hideNoDataInfo = true;
        this.googleApiLoaded = false;
        this.googleMap = false;
        this.enable = this.baseService.havePermissionsToEdit(this.constants.ROUTE_PERMISSIONS);
        this.transportService.getSchoolDetails(this.serviceUrls.school_details).then(school_details => this.callBackSchoolDetails(school_details));
    }

    callBackDriver(pDrivers: any) {
        this.drivers = pDrivers;
        this.baseService.enableDataTableAjax(this.serviceUrls.route, pDrivers);
    }

    callBackSchoolDetails(schoolDetails: any) { //loading google api
        this.schoolDetails = schoolDetails;
        if (!window['google']) {
            (<any>window).googleMapsReady = this.onMapsReady.bind(this);
            this.baseService.enableGoogleMapApi(schoolDetails.map_key);
        } else {
            this.onMapsReady();
        }
    }

    onMapsReady() { //google callback function and created google.maps intance before overlay loading
        this.googleApiLoaded = true;
    }

    getAllRoutes() {
        this.baseService.dataTableReload('datatable-routes');
    }

    callBack(routes: any) {
        if (routes.length > 0) {
            this.routes = routes;
            this.hideNoDataInfo = true;
        } else {
            this.hideNoDataInfo = false;
            this.routes = [];
        }
    }

    addRoute(event: any) {
        this.addRouteComponent.openOverlay(event, 'Save', 'Add Route', null, this);
    }

    updateRoute(event: any) {
        this.addRouteComponent.openOverlay(event, 'Update', 'Edit Route', event.target.value, this);
    }

    deleteWarning(event: any) {
        this.baseService.showWarning();
    }


    confirmDelete(event: any) {
        if (event.target.value !== '') {
            this.commonService.deleteObj(this.serviceUrls.route + event.target.value, 'datatable-routes');
            this.baseService.dataTableReload('datatable-routes');
        }
    }

}
