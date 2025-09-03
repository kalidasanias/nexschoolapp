/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ServiceUrls, Constants} from "../../../../common/index";
import {AddHolidayTypeComponent} from "./add-holiday-type/add-holiday-type.component";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'holiday-types.html'
})
export class HolidayTypesComponent implements OnInit {
    @ViewChild( AddHolidayTypeComponent ) addHolidayTypeComponent: AddHolidayTypeComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls:ServiceUrls, private constants: Constants,
                private commonService: CommonService) {

    }
    ngOnInit() {
        this.baseService.setTitle('NSA - Holiday Types')
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.getAllHolidayTypes);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.HOLIDAY_TYPE_PERMISSIONS);

    }

    addholidaytype(event: any) {
        this.addHolidayTypeComponent.openOverlay(event)
    }

    getholidayType(event: any) {
        this.addHolidayTypeComponent.getholidayType(event);
    }

    requested_delete(event: any) {
        var value = event.target.value;
        this.commonService.deleteObject(this.serviceUrls.holidays + JSON.parse(value).holidayTypeId, value, 'datatable-holidaytypes');
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-holidaytypes');
    }

    requested_warning() {
        this.baseService.showWarning();
    }

}
