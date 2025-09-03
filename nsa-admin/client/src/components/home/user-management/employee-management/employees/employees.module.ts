/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { EmployeesRoutingModule } from "./employees.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { EmployeesComponent } from "../employees/employees.component";
import {AddEmployeeComponent} from "./add-employee/add-employee.component";
import { TreeModule, SharedModule} from "primeng/primeng";

@NgModule({

    imports: [
        AppSharedModule,
        EmployeesRoutingModule,
        TreeModule, SharedModule
    ],
    exports: [],
    declarations: [EmployeesComponent, AddEmployeeComponent],
    providers: [],
})
export class EmployeesModule { }