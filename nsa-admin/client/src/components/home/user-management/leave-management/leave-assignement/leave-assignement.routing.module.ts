/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaveAssignementComponent} from "./leave-assignement.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: LeaveAssignementComponent}
        ])
    ],
    exports: [RouterModule],
})
export class LeaveAssignementRoutingModule { }