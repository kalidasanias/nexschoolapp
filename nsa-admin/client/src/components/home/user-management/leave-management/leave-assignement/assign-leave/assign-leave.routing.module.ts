/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignLeaveComponent} from "./assign-leave.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AssignLeaveComponent}
        ])
    ],
    exports: [RouterModule],
})
export class AssignLeaveRoutingModule { }