/**
 * Created by deepak  on 27-Mar-17.
 */
import { Component, OnInit, DoCheck,  ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseService } from '../../../../../services/index';
import { Constants, ServiceUrls} from '../../../../../common/index';
import { DualListComponent } from "../../../../dual-list/dual-list.component";
import { CommonService } from "../../../../../services/common/common.service";
declare var _: any;

@Component({
    selector: 'add-role',
    templateUrl: 'add-role.html'
})


export class AddRoleComponent implements OnInit {

    permissions: any[];
    selectedPermissions: any[];
    overallPermissions: any[];
    key: any;
    roleForm: any;
    role: any;
    updateRoles: any;
    display: any;
    update: boolean = false;
    roleTypes: any[];
    results: any[];
    dualList: boolean = true;
    enableDate: boolean = true;
    sCheck: boolean = false;
    defaultCheck: boolean = true;
    format: any = {  add: '', remove: '', all: '', none: '', direction: DualListComponent.LTR };
    btnVal: any;

    constructor(private baseService: BaseService, private fb: FormBuilder, private commonService: CommonService, private serviceUrls: ServiceUrls,
                private constants: Constants) {
    }

    ngOnInit() {
        this.selectedPermissions = [];
        this.permissions = [];
        this.key = "id";
        this.display = "name";
        this.createForm();
        this.getAllPermissions();
        this.getSchoolRoles();

    }

    createForm() {
        this.roleForm = this.fb.group({
            'roleName': ['', Validators.required],
            'roleDesc': '',
            'permissions': []
        });
    }

   openOverlay(event: any) {
       this.resetForm();
       this.createForm();
       this.btnVal = this.constants.Save;
       this.baseService.openOverlay(event);
   }

    closeOverlay() {
        this.baseService.closeOverlay('#addRole');
    }

    /*search() {

        if(!(this.roleForm._value.roleName.name) == false) {
            this.roleForm._value.roleName = this.roleForm._value.roleName.name;
        }
        this.commonService.get(this.serviceUrls.roles + 'types/permissions/' +  this.roleForm._value.roleName).then(
            permissions => this.callBackSearch(permissions)
        )

    }

    callBackSearch(perm: any) {
        console.log(perm.role_id)
        if(perm.role_id != undefined) {
            this.commonService.get(this.serviceUrls.roles + perm.role_id).then(
                role => this.callBackData(role, perm)
            )
        } else {
            this.dualList = false;
            this.selectedPermissions = [];
        }

    }

    callBackData(role: any, perm: any) {
        this.role = role;
        if(role.default_value) {
            this.defaultCheck = false;
            this.enableDate = false;
        } else {
            this.defaultCheck = true;
            this.enableDate = true;
            this.callBackRoles(perm)
            this.dualList = false;
        }
    }

    callBackPermissions(perm: any) {
        this.overallPermissions = perm;
        this.permissions = perm;
    }*/

    search() {
        if(!(this.roleForm._value.roleName.name) == false) {
            this.roleForm._value.roleName = this.roleForm._value.roleName.name;
        }
        this.checkRoles();
    }

    checkRoles() {
        var role = this.roleTypes.find((obj) => obj['name'].toLowerCase() === (this.roleForm._value.roleName).toLowerCase());
        if(!role) {
            this.dualList = false;
            this.enableDate = true;
            this.defaultCheck = true;
            this.role = "";
            if(!this.update) {
                this.selectedPermissions = [];
            }

        } else {
            this.callBackData(role)
        }
    }

    callBackData(role: any) {
        this.role = role;
        if(role.default_value) {
            this.defaultCheck = false;
            this.enableDate = false;
            this.dualList = false;
        } else {
            this.defaultCheck = true;
            this.enableDate = true;
            this.dualList = false;
            this.commonService.get(this.serviceUrls.roles + 'types/permissions/' +  role.name).then(
                permissions => this.callBackRoles(permissions))
        }
    }

    callBackPermissions(perm: any) {
        this.overallPermissions = perm;
        this.permissions = perm;
    }

    save(id: any) {
        var dataFound = this.setValidations();
        if(dataFound && this.defaultCheck && this.roleForm.valid) {
            this.roleForm._value.permissions = this.selectedPermissions;
            if(!this.role && !this.update) {
                this.commonService.post(this.serviceUrls.permissions, this.roleForm._value).then(
                    result => this.callBackResult(result, id, false),
                    error => this.callBackResult(<any>error, id, true)
                )
            } else {
                if(this.update) {
                    var updateFound = this.setUpdateValidations();
                    if(updateFound) {
                        this.updateAndSaveRole(this.updateRoles.id)
                    }

                } else {
                    this.updateAndSaveRole(this.role.id)
                }
            }
        }

    }

    updateAndSaveRole(id: any) {
        this.commonService.put(this.serviceUrls.permissions + id, this.roleForm._value).then(
            result => this.callBackResult(result, id, false),
            error => this.callBackResult(<any>error, id, true)
        )
    }


    callBackResult(result:any, id:any, error:boolean) {
        if (error) {
            this.baseService.showNotification(result, "", 'bg-danger');
        } else {
            this.baseService.showNotification(result.message, "", 'bg-success');
            this.baseService.closeOverlay('#addRole');
            this.dualList = true;
            this.baseService.dataTableReload('datatable-roles');
        }
    }

    updateRole(event: any) {
        this.getSchoolRoles();
        var value = event.target.value;
        this.btnVal = this.constants.Update;
        if(value.length > 0) {
            value = JSON.parse(event.target.value);
            this.updateRoles = value;
            this.role = value;
            this.editForm(value);
            this.commonService.get(this.serviceUrls.permissions + value.id).then(
                roles => this.callBackRoles(roles)
            )
            this.dualList = false;
            this.sCheck = true;
            this.update = true;
            this.baseService.openOverlay(event)
        }

    }

    callBackRoles(roles: any) {
        var _this = this;
        if((!roles.permission_id == false)) {
            this.selectedPermissions = roles.permission_id;
            if (this.selectedPermissions.length > 0) {
                var perm = this.permissions.filter(function(user: any){
                    var found = _this.selectedPermissions.find(selectUser => selectUser.id === user.id);
                    return !found;
                });
            }
        } else  {
            this.selectedPermissions = [];
            this.permissions = this.overallPermissions;
        }
    }

    editForm(form: any) {
        this.roleForm = this.fb.group({
            'roleName': [form.name, Validators.required],
            'roleDesc': form.description,
        });
    }

    getAllPermissions() {
        this.commonService.get(this.serviceUrls.permissions + 'all').then(
            permissions => this.callBackPermissions(permissions)
        )
    }

    setValidations() {
        var dataFound = false;
        if(!this.defaultCheck) {
            this.baseService.showNotification(this.constants.SystemPermissionValdation, '', 'bg-danger');
        } else if (this.selectedPermissions.length === 0 ) {
            this.baseService.showNotification(this.constants.PermissionValdation, '', 'bg-danger');
        } else {
            dataFound = true;
        }

        return dataFound;
    }

    setUpdateValidations() {
        var dataFound = false;
        if(this.role && this.update) {
            if(this.role.id == this.updateRoles.id) {
                dataFound = true;
            } else {
                this.baseService.showNotification("The Role Name Is Already Assigned", '', 'bg-danger');
            }

        } else {
            dataFound = true;
        }

        return dataFound;
    }
    changed() {
        setTimeout(() => {
            if(this.roleForm._value.roleName == "" && !this.update) {
                this.dualList = true;
            }
        }, 300);
    }

    searchRole(event: any) {
        this.commonService.get(this.serviceUrls.roles + '?q='  +event.query).then(
            texts => this.results = texts
        )
    }

    resetForm() {
        this.enableDate = true;
        this.defaultCheck = true;
        this.selectedPermissions = [];
        this.sCheck = false;
        this.dualList = true;
        this.update = false;
        this.getAllPermissions();
        this.getSchoolRoles();
        this.role = "";
    }

    getSchoolRoles() {
        this.commonService.get(this.serviceUrls.roles).then(
            roles => this.roleTypes = roles
        )
    }
}