/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, OnInit, ViewChild} from "@angular/core";
import {BaseService} from "../../../../../services/index";
import {Constants, Messages, ServiceUrls} from "../../../../../common/index";
import {AddEmployeeComponent} from "./add-employee/add-employee.component";
import {CommonService} from "../../../../../services/common/common.service";

@Component({
    templateUrl: 'employees.html'
})
export class EmployeesComponent implements OnInit {
    @ViewChild(AddEmployeeComponent) addEmployeeComponent: AddEmployeeComponent;
    private emp_to_delete: string;
    enable: boolean = false;

    constructor(private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants,
                private messages: Messages) {

    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Employees')
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();
        this.baseService.enableDataTable(this.serviceUrls.employee + 'all');

        this.enable = this.baseService.havePermissionsToEdit(this.constants.EMPLOYEE_PERMISSIONS)
    }

    addEmployee(event: any) {
        this.addEmployeeComponent.openOverlay(event, 'Save', null, this);
    }

    editEmployee(event: any) {
        this.addEmployeeComponent.editEmployee(event);
    }

    deleteEmployee(event: any) {
        var obj = JSON.parse(event.target.value);
        if(obj.active === true) {
            this.baseService.showInfoWarning("Are you sure you want to deactivate the user?","Deactive!", 'warning')
            obj.active = false;
        } else {
            this.baseService.showInfoWarning("Are you sure you want to activate the user?","Active!", 'warning')
            obj.active = true;
        }
        this.emp_to_delete = obj;
    }

    confirmDelete() {
        if(this.emp_to_delete != undefined) {
            this.commonService.deleteEmployee(this.emp_to_delete)
                .then(data => this.callBackSuccessDelete(data))
                .catch(err => this.callBackErrorDelete(err));
        }

    }

    callBackSuccessDelete(data: any) {
        this.baseService.showInformation('top', this.messages.update_success, this.constants.n_success);
        this.baseService.enableDivLoading('.datatable-employee', this.constants.updating);
        var thisObj = this;
        setTimeout(function () {
            thisObj.baseService.dataTableReload('datatable-employee');
            thisObj.baseService.disableDivLoading('.datatable-employee');
        }, 1000)

    }

    callBackErrorDelete(err: any) {
        this.baseService.showInformation('top', err, this.constants.n_info);
        this.reload();
    }

    reload(){
        this.baseService.dataTableReload('datatable-employee');
    }

    resetPwd(event: any) {
        this.emp_to_delete = undefined;
        var value = event.target.value;
        if(value.length > 0) {
            var obj = JSON.parse(event.target.value)
            this.commonService.post(this.serviceUrls.resetPwd, obj).then(
                result => this.resetPwdCallback(result, false),
                error => this.resetPwdCallback(<any>error, true));
        }

    }

    resetPwdCallback(result: any, err: boolean) {
        if(err) {
            this.baseService.showNotification('Failure!', result, 'bg-danger');
        } else {
            this.baseService.clearText('#resetPwd');
            this.baseService.showNotification('Success!', result.message, 'bg-success');
        }
    }

    request_warning() {
        this.baseService.showInfoWarning("Are you Sure Want to reset password", "Reset Password", 'warning');
    }

}
