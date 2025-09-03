/**
 * Created by Cyril on 2/22/2017.
 */


import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../../common/index";
import {AddDepartmentComponent} from "./add-department/add-department.component";
import {CommonService} from "../../../../../services/common/common.service";


@Component({
    templateUrl: 'department.html',
    styles: [`
    .dataTables_empty {
         text-align: center;
    }
    `], encapsulation: ViewEncapsulation.Emulated


})
export class DepartmentComponent implements OnInit {

    @ViewChild(AddDepartmentComponent) addDepartmentComponent: AddDepartmentComponent;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls : ServiceUrls,
                private commonService: CommonService,
                private constants: Constants,
                private messages: Messages) { }
    ngOnInit() {
        this.baseService.setTitle('NSA - Department')
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.enableDataTable(this.serviceUrls.department);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.DEPARTMENT_PERMISSIONS);
    }

    addDepartment(event: any) {
        this.addDepartmentComponent.openModal(event, 'Save', 'Add Department', null, this);
    }

    updateDepartment(event: any, dept_id: string) {
        this.addDepartmentComponent.openModal(event, 'Update', 'Edit Department', event.target.value, this);
    }

    deleteDepartment() {
        this.baseService.showWarning();
    }

    confirmDelete(event: any) {
        var value = event.target.value;
        this.commonService.deleteObj(this.serviceUrls.department + value, 'datatable-department');
    }
}
