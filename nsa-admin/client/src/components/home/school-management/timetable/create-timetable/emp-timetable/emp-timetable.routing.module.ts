/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EmpTimetableComponent} from "./emp-timetable.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: EmpTimetableComponent}
        ])
    ],
    exports: [RouterModule],
})
export class EmpTimetableRoutingModule { }