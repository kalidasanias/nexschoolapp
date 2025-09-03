/**
 * Created by Cyril on 2/22/2017.
 */


import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {ServiceUrls, Constants} from "../../../../../common/index";
import {AddEventTypesComponent} from "./add-event-types/add-event-types.component";
import {CommonService} from "../../../../../services/common/common.service";


@Component({
    templateUrl: 'event-types.html'
})

export class EventTypesComponent implements OnInit {

    @ViewChild(AddEventTypesComponent) addEventTypesComponent: AddEventTypesComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls, private constants: Constants,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Categories')
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.enableDataTable(this.serviceUrls.eventType)
        this.enable = this.baseService.havePermissionsToEdit(this.constants.EVENTS_TYPES_PERMISSIONS);
    }

    addEventTypes(event: any) {
        this.addEventTypesComponent.openOverlay(event);
    }

    requested_delete(event: any) {
        var value = event.target.value;
        this.commonService.deleteObject(this.serviceUrls.eventType + JSON.parse(value).event_type_id, value, 'datatable-event-types');
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-event-types');
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }

    getEventType(id: any, event: any) {
        this.addEventTypesComponent.getEventType(id, event);
    }

}
