/**
 * Created by Sai Deepak on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LeavesApprovalComponent} from "./leaves-approval.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: LeavesApprovalComponent}
        ])
    ],
    exports: [RouterModule],
})
export class LeavesApprovalRoutingModule { }