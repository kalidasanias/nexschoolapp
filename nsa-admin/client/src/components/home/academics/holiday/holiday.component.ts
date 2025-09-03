/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {Constants, ServiceUrls} from "../../../../common/index";
import {AddSchoolHolidayTypeComponent} from "../../academics/holiday/add-school-holidays/add-school-holidays.component";
import {AddWeekOffComponent} from "./add-week-off/add-week-off.component";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'holiday.html'
})
export class HolidayComponent implements OnInit {

    @ViewChild( AddSchoolHolidayTypeComponent ) addSchoolHolidayTypeComponent: AddSchoolHolidayTypeComponent;
    @ViewChild( AddWeekOffComponent ) addWeekOffComponent: AddWeekOffComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants : Constants) { }

    ngOnInit() {
        this.baseService.setTitle('NSA - Holidays')
        this.baseService.selectStyle();
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.getAllSchoolHolidays);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.HOLIDAY_PERMISSIONS);
    }

    addschoolholiday(event: any){
        this.addSchoolHolidayTypeComponent.openOverlay(event);
    }

    addWeekOff(event: any){
        this.addWeekOffComponent.openOverlay(event);
    }

    getschoolholidayType(event: any) {
        this.addSchoolHolidayTypeComponent.getschoolHoliday(event);
    }

    requested_delete(event: any) {
        var value = event.target.value;
        this.commonService.deleteObject(this.serviceUrls.schoolHoliday + JSON.parse(value).holidayId, value, 'datatable-schoolholidays');
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-schoolholidays');
    }

    requested_warning() {
        this.baseService.showWarning();
    }

}
