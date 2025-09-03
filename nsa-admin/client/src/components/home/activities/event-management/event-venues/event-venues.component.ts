/**
 * Created by Cyril on 2/22/2017.
 */


import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {ServiceUrls, Constants} from "../../../../../common/index";
import {AddVenueComponent} from "./add-venue/add-venue.component";
import {CommonService} from "../../../../../services/common/common.service";


@Component({
    templateUrl: 'event-venues.html'
})
export class EventVenuesComponent implements OnInit {

    @ViewChild(AddVenueComponent) AddVenueComponent: AddVenueComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private commonService: CommonService, private constants: Constants,
                private serviceUrls: ServiceUrls) {
    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Event Venue')
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.enableDataTable(this.serviceUrls.eventVenue);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.EVENTS_VENUES_PERMISSIONS);
        /*this.baseService.enableDataTableExample();*/
        //this.baseService.enableSelect();
        /*this.baseService.enableDataTable();*/
    }

    addEventVenues(event: any) {
        this.AddVenueComponent.openOverlay(event);
    }

    requested_delete(event: any) {
        var value = event.target.value;
        this.commonService.deleteObject(this.serviceUrls.eventVenue + JSON.parse(value).venue_type_id, value, 'datatable-event-venue');
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-event-venue');
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }

    getEventVenue(id: any, event: any) {
        this.AddVenueComponent.getEventVenue(id, event);
    }

}
