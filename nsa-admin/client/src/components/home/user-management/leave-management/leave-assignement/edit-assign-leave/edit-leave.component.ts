/**
 * Created by Cyril  on 05-Mar-17.
 */
import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants} from "../../../../../../common/constants/constants";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";
import {CommonService} from "../../../../../../services/common/common.service";


@Component({
    selector: 'edit-leave',
    templateUrl: 'edit-leave.html'
})

export class EditLeaveComponent implements OnInit {
    @ViewChild('dept') dept: ElementRef;
    @ViewChild('desg') desg: ElementRef;
    @ViewChild('gender') gender: ElementRef;
    @ViewChild('date_of_birth') date_of_birth: ElementRef;
    @ViewChild('date_of_joining') date_of_joining: ElementRef;

    leave: any;
    leaveForm: any;
    employee: any;
    modalId: any;
    parent: any;
    buttonVal: string;
    departments: any[];
    designations: any[];

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants) {
    }

    ngOnInit() {
        this.createEmployeeForm();
        this.employee= "";
        // this.getDependantData();
    }


    openOverlay(event:any, bVal:string, id: string, parent:any) {
        this.baseService.openOverlay(event);
        this.commonService.get(this.serviceUrls.leaveAssign + id)
            .then(currentLeave => this.callbackLeave(currentLeave, event));
    }

    callbackLeave(leave: any, event: any) {
        this.leave = leave;
        this.editForm(leave);
    }

    getDependantData() {
        this.commonService.get(this.serviceUrls.department)
            .then(departments => this.callbackDepartments(departments));

        this.commonService.get(this.serviceUrls.designation)
            .then(designations => this.callbackDesignations(designations));
    }

    callbackDepartments(departments: any[]) {
        this.departments = departments;
    }

    callbackDesignations(designations: any[]) {
        this.designations = designations;
    }

    closeOverlay() {
        this.baseService.closeOverlay('#edit-leave-overlay');
    }


    createEmployeeForm() {
        this.leaveForm = this.fb.group({
            'id': '',
            'emp_id': [{value:'', disabled:true}],
            'emp_username': [{value:'', disabled:true}],
            'reporting_emp_id': [{value:'', disabled:true}],
            'reporting_emp_username': [{value:'', disabled:true}],
            'dept_id': [{value:'', disabled:true}],
            'department': [{value:'', disabled:true}],
            'desg_id': [{value:'', disabled:true}],
            'designation': [{value:'', disabled:true}],
            'leave_type_name': [{value:'', disabled:true}],
            'leave_type_id':[{value:'', disabled:true}],
            'no_of_leaves': ['', Validators.required]
        });
    }

    editForm(form: any) {
        var department = '', designation = '';
        if (form.department != null && form.department != undefined) {
            department = form.department.dept_name;
        }
        if (form.designation != null && form.designation != undefined) {
            designation = form.designation.desg_name;
        }
        this.leaveForm = this.fb.group({
            'id' : form.id,
            'emp_id': [{value: form.emp_id, disabled:true}],
            'emp_username': [{value: form.emp_username, disabled:true}],
            'reporting_emp_id': [{value: form.reporting_emp_id, disabled:true}],
            'reporting_emp_username': [{value: form.reporting_emp_username, disabled:true}],
            'dept_id': [{value: form.dept_id, disabled:true}],
            'department': [{value:department, disabled:true}],
            'desg_id': [{value: form.desg_id, disabled:true}],
            'designation': [{value:designation, disabled:true}],
            'leave_type_name': [{value: form.leave_type_name, disabled:true}],
            'leave_type_id': [{value: form.leave_type_id, disabled:true}],
            'no_of_leaves': [form.no_of_leaves, Validators.required]
        });
    }

    saveLeave(id:any) {
        this.leave.no_of_leaves = this.leaveForm.controls.no_of_leaves.value;
        this.commonService.put(this.serviceUrls.leaveAssign + this.leave.id,  this.leave).then(
            result => this.saveLeaveCallBack(result, id, 'Updated', false),
            error => this.saveLeaveCallBack(<any>error, id, 'Updated', true))
    }


    saveLeaveCallBack(result:any, id:any, method: string, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.closeOverlay();
            this.baseService.dataTableReload('datatable-leave-assign');
            this.resetForm();
        }
    }

    resetForm(){
        this.createEmployeeForm();
        this.employee= "";
    }
}