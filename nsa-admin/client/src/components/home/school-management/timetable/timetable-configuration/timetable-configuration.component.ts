/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {BaseService} from "../../../../../services/index";
import {ServiceUrls, Constants} from "../../../../../common/index";
import {NewTimetableConfigurationComponent} from "./new-timetable-configuration/new-timetable-configuration.component";
import {EditTimetableConfigurationComponent} from "./edit-timetable-configuration/edit-timetable-configuration.component";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    templateUrl: 'timetable-configuration.html'
})

export class TimetableConfigurationComponent implements OnInit {

    @ViewChild(NewTimetableConfigurationComponent) newTimetableConfigurationComponent: NewTimetableConfigurationComponent;
    @ViewChild(EditTimetableConfigurationComponent) editTimeTableConfig : EditTimetableConfigurationComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private router: Router, private constants: Constants,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Timetable Configuration')
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.timetableConfig);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.TIMETABLE_CONF_PERMISSIONS);
    }

    newTimetableConfig(event: any) {
        this.newTimetableConfigurationComponent.openOverlay(event);
    }

    reload() {
        this.baseService.dataTableReload('datatable-timetable-config');
    }

    requested_delete(event: any) {
        var value = event.target.value;
        this.commonService.deleteObject(this.serviceUrls.timetableConfig + JSON.parse(value).timetable_config_id, value, 'datatable-timetable-config');
        this.reload();
    }

    warning(value:any) {
        this.baseService.showWarning();
    }

    getTimetableConfig(event: any) {
        this.editTimeTableConfig.getTimeTableConfigById(event);
    }
}
