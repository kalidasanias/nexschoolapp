/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { DepartmentRoutingModule } from "./department.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { DepartmentComponent } from "./department.component";
import { AddDepartmentComponent } from "./add-department/add-department.component";

@NgModule({

    imports: [
        AppSharedModule,
        DepartmentRoutingModule
    ],
    exports: [],
    declarations: [DepartmentComponent, AddDepartmentComponent],
    providers: [],
})
export class DepartmentModule { }