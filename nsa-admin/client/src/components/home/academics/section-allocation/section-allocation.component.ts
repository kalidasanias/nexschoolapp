/**
 * Created by Cyril on 2/22/2017.
 */

import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../services/index";
import {ServiceUrls, Constants} from "../../../../common/index";
import {AssociateSection} from "./associate-section/associate-section.components";
import {AssociateSectionEditComponent} from "./associate-section-edit/associate-section-edit.component";
import {CommonService} from "../../../../services/common/common.service";

@Component({
    templateUrl: 'section-allocation.html',
})
export class SectionAllocationComponent implements OnInit {

    @ViewChild(AssociateSection) associateSection: AssociateSection;
    @ViewChild(AssociateSectionEditComponent) associateSectionEditComponent: AssociateSectionEditComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls, private constants: Constants,
                private commonService: CommonService) {
    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Section Allocation')
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.SectionByClass)
        this.reload();
        this.enable = this.baseService.havePermissionsToEdit(this.constants.SECTION_ALLOC_PERMISSIONS)
    }

    associateSections(event:any) {
        this.associateSection.openOverlay(event);
    }

    request_delete(event:any) {
        var value = event.target.value;
       this.commonService.deleteObject(this.serviceUrls.deleteSectionByClass + JSON.parse(value).classId, value, 'datatable-sectionAllocation');
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-sectionAllocation');
    }

    request_delete_warning() {
        this.baseService.showWarning();
    }

    editAssociateSection(event:any) {
        this.associateSectionEditComponent.getEditAssociateSection(event);
    }
}
