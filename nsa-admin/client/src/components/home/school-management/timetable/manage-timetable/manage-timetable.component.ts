/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {ServiceUrls, Constants} from "../../../../../common/index";
import {AddSpecialDayComponent} from "./add-special-timetable/add-special-timetable.component";
import {EditSpecialDayComponent} from "./edit-special-timtable/edit-special-timetable.component";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    templateUrl: 'manage-timetable.html'
})
export class ManageTimetableComponent implements OnInit {

    @ViewChild(AddSpecialDayComponent) addSpecialDayComponent: AddSpecialDayComponent;
    @ViewChild(EditSpecialDayComponent) editSpecialDayComponent: EditSpecialDayComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls, private constants: Constants,
                private commonService: CommonService) {
    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Special Timetable')
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.selectStyle();
        this.baseService.enableDataTable(this.serviceUrls.specialDayTimetable);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.SPECIAL_TIMETABLE_PERMISSIONS);
    }

    requested_delete(event: any) {
        var value = event.target.value;
        this.commonService.deleteObject(this.serviceUrls.specialDayTimetable, value, 'datatable-special-day');
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-special-day');
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }

    addConfig(event: any) {
        this.addSpecialDayComponent.openOverlay(event);
    }

    getSpecialDay(event: any) {
        this.editSpecialDayComponent.getSpecialDay(event);
    }

}
