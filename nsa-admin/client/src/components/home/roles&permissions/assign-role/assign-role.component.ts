/**
 * Created by deepak on 6/14/2017.
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { BaseService } from '../../../../services/index';
import { ServiceUrls } from "../../../../common/constants/service.urls";
import { AllocateRoleComponent } from "./allocate-role/allocate-role.component";

@Component({
    selector: 'assign-role',
    templateUrl:'assign-role.html'
})

export class AssignRoleComponent implements OnInit {

    features: any
    roles: any
    @ViewChild(AllocateRoleComponent) allocateComponent : AllocateRoleComponent;

    constructor(private fb: FormBuilder, private serviceUrls: ServiceUrls,
                private baseService: BaseService){
    }

    ngOnInit() {
        this.baseService.setTitle('NSA - Assign Role')
        this.baseService.enableAppJs();
        this.baseService.enableDataTable(this.serviceUrls.employee)
    }

    allocateRole(event: any) {
        this.allocateComponent.openOverlay(event);
    }

    updateRole(event: any) {
        this.allocateComponent.updateRole(event);
    }

}