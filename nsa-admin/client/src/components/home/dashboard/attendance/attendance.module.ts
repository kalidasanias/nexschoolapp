import { NgModule } from '@angular/core';

import {DashboardAttendanceComponent} from "./attendance.component";
import {DashboardAttendanceRoutingModule} from "./attendance.routing.module";

@NgModule({

    imports: [
        DashboardAttendanceRoutingModule
    ],
    exports: [],
    declarations: [DashboardAttendanceComponent],
    providers: [],
})
export class InfoModule { }