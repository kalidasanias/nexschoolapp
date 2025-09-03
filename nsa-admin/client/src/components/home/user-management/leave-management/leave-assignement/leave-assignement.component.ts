/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {ServiceUrls} from "../../../../../common/constants/service.urls";
import {EditLeaveComponent} from "./edit-assign-leave/edit-leave.component";
import {Constants, Messages} from "../../../../../common/index";
import {AssignLeaveComponent} from "./assign-leave/assign-leave.component";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    templateUrl: 'leave-assignement.html'
})
export class LeaveAssignementComponent implements OnInit {

    leaves: any[];
    leaveObj: any;
    departments: any[];
    id_to_delete: any;
    enable: boolean = false;

    @ViewChild(EditLeaveComponent) editLeaveComponent: EditLeaveComponent;
    @ViewChild(AssignLeaveComponent) assignLeaveComponent: AssignLeaveComponent;

    constructor(private constants: Constants,
                private messages: Messages,
                private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Leave Assignment')
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.enable = this.baseService.havePermissionsToEdit(this.constants.LEAVE_ASSIGN_PERMISSIONS);
        this.commonService.get(this.serviceUrls.department)
            .then(departments => this.callbackDepartments(departments));

    }

    callbackDepartments(departments: any[]) {
        this.departments = departments;

        this.commonService.get(this.serviceUrls.leaveAssign)
            .then(leaves => this.callbackLeaves(leaves));
    }

    callbackLeaves(leaves: any[]) {
        this.leaves = leaves;
        this.baseService.enableDataTableAjax(this.serviceUrls.leaveAssign, {departments: this.departments});
    }

    editLeaveAssign(event: any) {
        this.editLeaveComponent.openOverlay(event, 'update', event.target.value, this);
    }

    assignLeave(event: any) {
        this.assignLeaveComponent.openOverlay(event);
    }

    deleteLeaveAssign(event: any) {
        this.baseService.showWarning();
        var value = JSON.parse(event.target.value);
        this.id_to_delete = value.id;
        console.log(" this.id_to_delete ",  this.id_to_delete )
        this.leaveObj = event.target.value;
    }

    confirmDelete() {
        this.commonService.deleteObject(this.serviceUrls.leaveAssign + this.id_to_delete, this.leaveObj, 'datatable-leave-assign');
    }

    callBackSuccessDelete(data: any) {
        this.baseService.showInformation('top', this.messages.delete_success, this.constants.n_success);
        this.baseService.dataTableReload('datatable-leave-assign');
    }
}
