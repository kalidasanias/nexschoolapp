import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {DashboardAttendanceComponent} from "./attendance.component";

const routes: Routes = [
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardAttendanceRoutingModule { }