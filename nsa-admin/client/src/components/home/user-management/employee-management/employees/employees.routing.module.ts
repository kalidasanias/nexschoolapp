/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent} from "./employees.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: EmployeesComponent}
        ])
    ],
    exports: [RouterModule],
})
export class EmployeesRoutingModule { }