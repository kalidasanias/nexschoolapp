/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {BaseService} from "../../../../../../services/index";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";
import {CommonService} from "../../../../../../services/common/common.service";
declare var _ : any;

@Component({
    selector: 'assign-leave',
    templateUrl: 'assign-leave.html'
})
export class AssignLeaveComponent implements OnInit {

    @ViewChild('department') department: ElementRef;
    @ViewChild('reportingManager') reportingManager: ElementRef;
    @ViewChild('employee') employee: ElementRef;

    departments: any[];
    employees: any[];
    allEmployees: any[];
    leave:any;
    constId: '00000000-0000-0000-0000-000000000000';

    constructor(private router: Router,
                private baseService: BaseService,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.baseService.enableAppJs();
        this.baseService.enablePickerDate();

        this.commonService.get(this.serviceUrls.department)
            .then(departments => this.callbackDepartments(departments));

        this.commonService.get(this.serviceUrls.getActiveEmployees)
            .then(employees => this.callbackAllEmployees(employees));
    }

    openOverlay(event: any) {
        this.resetForm();
        this.baseService.removeChecked('#example-select-all');
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.baseService.closeOverlay('#assignLeave');
    }

    callbackLeave(leave: any) {
        this.leave = leave;
    }

    callbackDepartments(departments: any[]) {
        this.departments = departments;
        this.baseService.enableSelectWithEmpty('#select-dept', departments, [ 'dept_name', 'dept_id' ], null);
    }

    getLeaveTypes() {
        var dataFound = this.setValidations();
        if(dataFound) {
            this.baseService.removeChecked('#example-select-all');
            this.baseService.removeDisabled('#saveLeave');
            this.baseService.dataTableDestroy('datatable-leaves');
            this.baseService.enableDataSourceDatatable(this.serviceUrls.leaveType);
        }
    }

    assignLeave(event: any, id: any) {
        this.baseService.enableBtnLoading(id);
        var deptId = this.baseService.extractOptionValue(this.department.nativeElement.selectedOptions)[0];
        var repMgr= this.baseService.extractOptions(this.reportingManager.nativeElement.selectedOptions)[0];
        var emp = this.baseService.extractOptions(this.employee.nativeElement.selectedOptions);

        var leaves = JSON.parse(event.target.value);
        var reqBody :any[] = [];
        for(var i=0; i< emp.length; i++){
            for (var j=0; j< leaves.length; j++) {
                this.getFormData(reqBody, deptId, repMgr, emp[i], leaves[j]);
            }
        }

        var dataFound = this.setValidations();
      
        if(reqBody.length < 1) {
            dataFound = false;
            this.baseService.showNotification('Enter Leave Details', '', 'bg-danger');
            this.baseService.removeDisabled('#saveLeave');
        }
        if(dataFound) {
            this.commonService.post(this.serviceUrls.leaveAssign, reqBody).then(
                result => this.saveCallBack(result.message,'bg-success', false, id),
                error => this.saveCallBack(<any> error,'bg-danger', true, id))
        }
    }

    saveCallBack(msg:string, msgIcon:string, err: any, id: any) {
        if(err) {
            this.baseService.showNotification(msg, "", msgIcon);
        } else {
            this.baseService.showNotification(msg, "", msgIcon);
            this.baseService.closeOverlay('#assignLeave');
            this.baseService.dataTableReload('datatable-leave-assign');
            this.resetForm();
        }
        this.baseService.disableBtnLoading(id);
    }

    getFormData(reqBody: any[], deptId:string, repMgr:any, emp:any, leaves: any){
        var assignLeaveEmp = {};
        assignLeaveEmp['emp_id'] = emp.id;
        assignLeaveEmp['emp_username'] = emp.name;
        assignLeaveEmp['reporting_emp_id'] = repMgr.id;
        assignLeaveEmp['reporting_emp_username'] = repMgr.name;
        assignLeaveEmp['leave_type_id'] = leaves.leave_type_id;
        assignLeaveEmp['leave_type_name'] = leaves.leave_type_name;
        assignLeaveEmp['no_of_leaves'] = parseInt(leaves.days) ;
        assignLeaveEmp['dept_id'] = deptId;
        reqBody.push(assignLeaveEmp);
    }

    getEmployeeByDept() {
        var deptId = this.baseService.extractOptionValue(this.department.nativeElement.selectedOptions)[0];
        if(deptId.length < 1) {
            this.resetForm();

        } else {
            var emp = this.baseService.extractOptions(this.employee.nativeElement.selectedOptions);
            this.baseService.enableSelect('#reporting-manager', this.allEmployees, [ 'firstName', 'userName' ], null);
            this.commonService.get(this.serviceUrls.employeeSearch + deptId)
                .then(employees => this.callbackEmployees(employees));

            this.baseService.removeHideClass('#rm');
            this.baseService.removeHideClass('#emp');
            this.reset();
        }

    }

    callbackEmployees(employees: any[]) {
        this.employees = employees;
        this.baseService.enableMultiSelectFilteringAll('#bootstrap-class', employees, [ 'firstName', 'userName' ], null);
    }

    callbackAllEmployees(employees: any[]) {
        this.allEmployees = employees;
        this.baseService.enableSelect('#reporting-manager', employees, [ 'firstName', 'userName' ], null);
    }

    employeeSelection(){
        var emp = this.baseService.extractOptions(this.employee.nativeElement.selectedOptions);
        if(_.isEmpty(emp)){
           this.reset();
        }
    }

    reset(){
        this.baseService.dataTableDestroy('datatable-leaves');
        var constId = '00000000-0000-0000-0000-000000000000';
        this.baseService.enableDataSourceDatatable(this.serviceUrls.leaveType + constId);
        this.baseService.addDisabled('#saveLeave');
    }

    resetForm() {
        this.baseService.enableSelectWithEmpty('#select-dept', this.departments, [ 'dept_name', 'dept_id' ], null);
        this.baseService.addHideClass('#rm');
        this.baseService.addHideClass('#emp');
        this.baseService.addDisabled('#saveLeave');
        this.baseService.dataTableDestroy('datatable-leaves');
        var constId = '00000000-0000-0000-0000-000000000000';
        this.baseService.enableDataSourceDatatable(this.serviceUrls.leaveType + constId);

    }

    setValidations() : any {
        var dataFound = false;
        var deptId = this.baseService.extractOptionValue(this.department.nativeElement.selectedOptions)[0];
        var repMgr= this.baseService.extractOptions(this.reportingManager.nativeElement.selectedOptions)[0];
        var emp = this.baseService.extractOptions(this.employee.nativeElement.selectedOptions);
        if(deptId.length < 1) {
            this.baseService.showNotification("Enter Department Details", "", 'bg-danger');
        } else if (repMgr.length < 1) {
            this.baseService.showNotification("Enter Report Manager Details", "", 'bg-danger');
        } else if (emp.length < 1) {
            this.baseService.showNotification("Enter Employee Details", "", 'bg-danger');
        } else {
            dataFound = true;
        }
        return dataFound;
    }

}
