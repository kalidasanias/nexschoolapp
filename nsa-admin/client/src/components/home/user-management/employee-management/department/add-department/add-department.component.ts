/**
 * Created by Bharatkumarr  on 27-Mar-17.
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {BaseService} from "../../../../../../services/index";
import {Constants} from "../../../../../../common/constants/constants";
import {ServiceUrls} from "../../../../../../common/constants/service.urls";
import {CommonService} from "../../../../../../services/common/common.service";


@Component({
    selector: 'add-department',
    templateUrl: 'add-department.html'
})


export class AddDepartmentComponent implements OnInit {

    departmentForm: any;
    department: any;
    modalId: any;
    buttonVal: string;
    modalTitle: string;
    parent: any;

    constructor(private baseService: BaseService,
                private fb: FormBuilder,
                private serviceUrls: ServiceUrls,
                private commonService: CommonService,
                private constants: Constants) {
    }

    ngOnInit() {
        this.createDepartmentForm();
        this.department= "";
    }

    openModal(event:any, bVal:string, title: string, dept_id: string, parent:any) {
        this.buttonVal = bVal;
        this.modalTitle = title;
        this.parent = parent;
        if (bVal == 'Update') {
            this.commonService.get(this.serviceUrls.department + dept_id)
                .then(department => this.callBack(department));
        }
        this.baseService.openOverlay(event);
        if (bVal == 'Save') this.resetForm();
    }

    closeOModal() {
        this.baseService.closeOverlay('#addDepartment');
    }


    createDepartmentForm() {
        this.departmentForm = this.fb.group({
            'dept_name': ['', Validators.required],
            'dept_alias': '',
            'updated_by': ''
        });
    }

    editForm(form: any) {
        this.departmentForm = this.fb.group({
            'dept_name': [form.dept_name,[Validators.required]],
            'dept_alias': form.dept_alias,
            'updated_by': form.updated_by
        });
    }

    saveDepartment(id:any) {
        this.baseService.enableBtnLoading(id);
        if (this.department.dept_id == undefined) {
            this.departmentForm._value.updated_by = this.baseService.findUser().name;
            delete this.departmentForm.updated_by;
            this.commonService.post(this.serviceUrls.department, this.departmentForm._value).then(
                result => this.saveDepartmentCallBack(result.message,'bg-success', id),
                error => this.saveDepartmentCallBack(<any>error,'bg-danger', id))

        } else {
            this.department.dept_name = this.departmentForm._value.dept_name;
            this.department.dept_alias = this.departmentForm._value.dept_alias;
            delete this.department.updated_by;
            this.commonService.put(this.serviceUrls.department + this.department.dept_id, this.department).then(
                result => this.saveDepartmentCallBack(result.message,'bg-success', id),
                error => this.saveDepartmentCallBack(<any>error,'bg-danger', id))
        }
        this.closeOModal();
    }

    getDepartment(event: any){
        this.modalId = event;
        this.commonService.get(this.serviceUrls.department + event.target.value).then(
            department => this.callBack(department)
        );
    }

    callBack(currDepartment: any) {
        this.department = currDepartment;
        this.editForm(currDepartment);
    }

    saveDepartmentCallBack(msg:string, msgIcon:string, btnVal: any) {
        this.baseService.showNotification(msg, "", msgIcon);
        this.baseService.disableBtnLoading(btnVal);
        this.baseService.closeOverlay('#addDepartment');
        this.resetForm();
        this.baseService.dataTableReload('datatable-department');
        this.commonService.get(this.serviceUrls.department);

    }

    resetForm(){
        this.createDepartmentForm();
        this.department= "";
    }

}