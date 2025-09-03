/**
 * Created by bharatkumarr on 2/22/2017.
 */


import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {ServiceUrls, Constants} from "../../../../../common/index";
import {AddActivityTypeComponent} from "./add-activity-type/add-activity-type.component";
import {CommonService} from "../../../../../services/common/common.service";


@Component({
    templateUrl: 'activity-types.html'
})

export class ActivityTypesComponent implements OnInit {

    @ViewChild(AddActivityTypeComponent) addActivityTypeComponent: AddActivityTypeComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls, private constants: Constants,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.enableDataTable(this.serviceUrls.activityType)
        this.enable = this.baseService.havePermissionsToEdit(this.constants.ACTIVITY_TYPES_PERMISSIONS);
    }

    addActivityType(event: any) {
        this.addActivityTypeComponent.openOverlay(event);
    }

    requested_delete(event: any) {
        var value = event.target.value;
        this.commonService.deleteObject(this.serviceUrls.activityType + JSON.parse(value).activity_type_id, value, 'datatable-activity-types');
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-activity-types');
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }

    getActivityType(id: any, event: any) {
        this.addActivityTypeComponent.getActivityType(id, event);
    }

}
