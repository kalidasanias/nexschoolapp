/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../../common/index";
import {CreateLeaveTypesComponent} from "./create-leave-type/create-leave-type.component";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    templateUrl: 'leave-types.html',
    styles: [`
    .dataTables_empty {
         text-align: center;
    }
    `], encapsulation: ViewEncapsulation.Emulated
})
export class LeaveTypesComponent implements OnInit {

    @ViewChild(CreateLeaveTypesComponent) createLeaveComponent: CreateLeaveTypesComponent

    leaveTypes: any[];
    enable: boolean = false;

    constructor(private constants: Constants,
                private messages: Messages,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private baseService: BaseService) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Leave Types')
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.enableDataTable(this.serviceUrls.leaveType);
        this.enable = this.baseService.havePermissionsToEdit(this.constants.LEAVE_TYPE_PERMISSIONS);
    }


    addLeaveType(event: any) {
        this.createLeaveComponent.openModal(event, 'Save', 'Add Leave Type', null, this);
    }

    updateLeaveType(event: any) {
        this.createLeaveComponent.openModal(event, 'Update', 'Edit Leave Type', event.target.value, this);
    }

    deleteLeaveType() {
        this.baseService.showWarning();
    }

    confirmDelete(event: any) {
        this.commonService.deleteObj(this.serviceUrls.leaveType + event.target.value, 'datatable-leave-type');
    }
}
