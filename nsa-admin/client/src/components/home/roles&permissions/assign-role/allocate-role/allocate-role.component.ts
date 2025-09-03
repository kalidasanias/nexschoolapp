/**
 * Created by deepak on 6/14/2017.
 */
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from '../../../../../services/index';
import { Constants, ServiceUrls} from '../../../../../common/index';
import { DualListComponent } from "../../../../dual-list/dual-list.component";
import { CommonService } from "../../../../../services/common/common.service";
declare var _ :any


@Component({
    selector: 'allocate-role',
    templateUrl: 'allocate-role.html'
})


export class AllocateRoleComponent implements OnInit {

    emp: any[];
    selectedEmp: any[];
    key: any;
    empData: any;
    employees: any[]
    role: any;
    roleTypes: any[];
    display: any;
    format: any = {  add: '', remove: '', all: '', none: '', direction: DualListComponent.LTR };
    @ViewChild('selectRole') selectRole: ElementRef;
    @ViewChild('selectRoleypes') selectRoleypes: ElementRef;

    constructor(private baseService: BaseService, private fb: FormBuilder, private commonService: CommonService, private serviceUrls: ServiceUrls,
                private constants: Constants) {
    }

    ngOnInit(){
        this.selectedEmp = [];
        this.emp = [];
        this.key = "userName";
        this.display = "firstName";
        this.getAllEmployees();
        this.getSchoolRoles();
    }

    openOverlay(event: any) {
        this.resetForm();
        this.baseService.openOverlay(event);
    }

    closeOverlay() {
        this.baseService.closeOverlay('#allocateRole');
    }

    getAllEmployees() {
        this.commonService.get(this.serviceUrls.employee).then(
            users => this.callBackUsers(users)
        )
    }

    callBackUsers(emp: any) {
        this.emp = emp;
        this.employees = emp;

    }

    getSchoolRoles() {
        this.commonService.get(this.serviceUrls.roles).then(
            roles => this.callBackRoles(roles)
        )
    }

    callBackRoles(roles: any) {
        this.roleTypes = roles;
        this.baseService.enableSingleSelWithDisabled('#select-role', this.roleTypes, this.constants.roleObj, null, this.constants.isEnable)
    }

    save(id: any) {
        var form = {};
        var dataFound = this.setValidations();
        if(dataFound) {
            form['roles'] = this.baseService.extractOptions(this.selectRole.nativeElement.selectedOptions)
            form['users'] = this.selectedEmp;
            form['id'] = this.baseService.extractOptions(this.selectRole.nativeElement.selectedOptions)[0].id;
            this.commonService.put(this.serviceUrls.roles + 'user', form).then(
                result => this.callBackResult(result, id, false),
                error => this.callBackResult(<any>error, id, true)
            )
        }
    }

    callBackResult(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.enableDivLoading('.datatable-assign-roles', this.constants.updating);
            var thisObj = this;
            setTimeout(function () {
                thisObj.baseService.dataTableReload('datatable-assign-roles');
                thisObj.baseService.disableDivLoading('.datatable-assign-roles');
            }, 1000)
            this.baseService.closeOverlay('#allocateRole');
            this.baseService.closeModal('editAssignRole')
        }
    }

    setValidations() {
        var dataFound = false;
        var role = this.baseService.extractOptions(this.selectRole.nativeElement.selectedOptions)[0].id;
        if(!role) {
            this.baseService.showNotification('Select Role', '', 'bg-danger');
        } else {
            dataFound = true;
        }

        return dataFound;
    }

    updateRole(event: any) {
        var value = event.target.value;
        if(value.length > 0) {
            value = JSON.parse(event.target.value);
            this.commonService.get(this.serviceUrls.employee + value.userName).then(
                employee => this.callBackEmployee(employee)
            )
        }
    }

    callBackEmployee(data: any) {
        this.empData = data;
        var roleArr = this.baseService.JsonToArray(data.roles, this.constants.generalObj);
        this.baseService.enableSelectWithDisabled('.select-role-types', this.roleTypes, this.constants.roleObj,  roleArr, this.constants.isEnable);
        this.baseService.openModal('editAssignRole');

    }

    search() {
        var dataFound = this.setUpdateRoleValidations();
        if(dataFound) {
            var role = this.baseService.extractOptions(this.selectRole.nativeElement.selectedOptions);
            this.commonService.get(this.serviceUrls.roles + 'user/' + role[0].id).then(
                users => this.callBackUserRoles(users))
        }
    }

    callBackUserRoles(users: any) {
        var _this = this;
        if(users != undefined) {
            this.selectedEmp = users;
            if (this.selectedEmp.length > 0) {
                var perm = this.emp.filter(function(user: any){
                    var found = _this.selectedEmp.find(selectUser => selectUser.userName === user.userName);
                    return !found;
                });
            }
        } else {
            this.selectedEmp = [];
            this.emp = this.employees;
        }
    }

    update(id: any) {
        var dataFound = this.setUpdateValidations();
        var array = [];
        array.push(this.empData);
        if(dataFound) {
            var form = {};
            form['roles'] = this.baseService.extractOptions(this.selectRoleypes.nativeElement.selectedOptions)
            form['users'] = array;
            this.commonService.put(this.serviceUrls.roles + 'user/' + this.empData.user_name, form).then(
                result => this.callBackResult(result, id, false),
                error => this.callBackResult(<any>error, id, true)
            )
        }
    }

    setUpdateValidations() {
        var dataFound = false;
        var role = this.baseService.extractOptions(this.selectRoleypes.nativeElement.selectedOptions);
        if(role.length < 1) {
            this.baseService.showNotification('Select Role', '', 'bg-danger');
        } else {
            dataFound = true;
        }

        return dataFound;
    }


    setUpdateRoleValidations() {
        var dataFound = false;
        var role = this.baseService.extractOptions(this.selectRole.nativeElement.selectedOptions);
        if(role.length < 1) {
            this.baseService.showNotification('Select Role', '', 'bg-danger');
        } else {
            dataFound = true;
        }

        return dataFound;
    }

    resetForm() {
        this.selectedEmp = [];
        this.emp = [];
        this.getAllEmployees();
        this.baseService.enableSingleSelWithDisabled('#select-role', this.roleTypes, this.constants.roleObj, null, this.constants.isEnable);
    }

    getDetails(data: any, value :any, key: any, compareKey: any) : any[] {
        var selectedScholar :any[]= [];
        data.forEach(function (feeScholar:any) {
            for(let node in value) {
                if(feeScholar[key] == value[node][compareKey]) {
                    selectedScholar.push(feeScholar);
                }
            }
        });

        return selectedScholar;
    }

}