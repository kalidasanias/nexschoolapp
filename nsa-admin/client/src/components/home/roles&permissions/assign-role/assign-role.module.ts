/**
 * Created by deepak on 6/14/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignRoleComponent } from "./assign-role.component";
import { AssignRoleRoutingModule } from "./assign-role.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { AllocateRoleComponent } from "./allocate-role/allocate-role.component";

@NgModule({
    imports: [
        AppSharedModule,
        AssignRoleRoutingModule
    ],
    exports: [],
    declarations: [AssignRoleComponent, AllocateRoleComponent],
    providers: [],
})
export class AssignRoleModule { }
