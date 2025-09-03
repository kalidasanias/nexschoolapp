/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {ServiceUrls, Constants} from "../../../../../common/index";
import {AddAssignmentTypesComponent} from "./add-assignment-types/add-assignment-types.component";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    templateUrl: 'assignement-types.html'
})
export class AssignementTypesComponent implements OnInit {

    @ViewChild(AddAssignmentTypesComponent) addAssignmentTypesComponent: AddAssignmentTypesComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,  private constants: Constants) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Homework Types');
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.enable = this.baseService.havePermissionsToEdit(this.constants.ASSIGNMENT_TYPE_PERMISSIONS);
        this.baseService.enableDataTable(this.serviceUrls.getAllAssignmentsTypes);
    }

    addAssignmentTypes(id: any) {
        this.addAssignmentTypesComponent.openOverlay(id);
    }

    requested_delete(event: any) {
        var value = event.target.value;
        this.commonService.deleteObject(this.serviceUrls.deleteAssignementType + JSON.parse(value).id, value, 'datatable-assignament-types');
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-assignament-types');
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }

    getAssignmentType(event: any) {
        this.addAssignmentTypesComponent.getAssignmentType(event);
    }
}