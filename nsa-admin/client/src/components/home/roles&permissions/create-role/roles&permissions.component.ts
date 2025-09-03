/**
 * Created by senthil-p on 08/06/17.
 */
import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { BaseService } from '../../../../services/index';
import { AddRoleComponent } from "./add-roles/add-role.component";
import { ServiceUrls } from "../../../../common/constants/service.urls";
import { CommonService } from "../../../../services/common/common.service";

@Component({
    selector: 'roles&permisions',
    templateUrl:'roles&permissions.html'
})

export class RolesAndPermissionsComponent implements OnInit {

    features: any
    roles: any
    @ViewChild(AddRoleComponent) addRoleComponent: AddRoleComponent;

    constructor(private fb: FormBuilder, private serviceUrls: ServiceUrls,
                private baseService: BaseService, private commonService: CommonService){
    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Create Role')
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.roles)
    }

    addRole(event: any) {
        this.addRoleComponent.openOverlay(event);
    }

    updateRole(event: any) {
        this.addRoleComponent.updateRole(event);
    }

    requested_delete(event:any) {
        var rolesObject =JSON.parse( event.target.value);
        this.commonService.deleteObj(this.serviceUrls.permissions + rolesObject.id, 'datatable-roles')
        this.reload();
    }

    reload() {
        this.baseService.dataTableReload('datatable-roles');
    }

    requested_warning(value:any) {
        this.baseService.showWarning();
    }


}
