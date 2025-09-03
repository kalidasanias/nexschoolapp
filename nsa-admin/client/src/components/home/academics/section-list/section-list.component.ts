/**
 * Created by Cyril on 2/22/2017.
 */

import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ServiceUrls, Constants} from "../../../../common/index";
import {AddSectionComponent} from "./add-section/add-section.component";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'section-list.html',
})
export class SectionListComponent implements OnInit {
    @ViewChild(AddSectionComponent) addSectionComponent: AddSectionComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService, private constants: Constants) {
    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Sections')
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.section);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.SECTION_PERMISSIONS)
    }

    addSection(event:any) {
        this.addSectionComponent.openOverlay(event)
    }

    request_delete(event:any) {
        var value = event.target.value
        this.commonService.deleteObject(this.serviceUrls.section + JSON.parse(value).id, value, 'datatable-sectionList');
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-sectionList');
    }

    request_delete_warning() {
        this.baseService.showWarning();
    }

    editSection(event:any) {
        this.addSectionComponent.getEditSection(event);
    }
}
