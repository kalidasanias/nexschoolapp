/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { AttendanceHistoryRoutingModule } from "./attendance-history.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { AttendanceHistoryComponent } from "./attendance-history.component";
import { ViewLeaveRecordComponent } from "./view-leave-record/view-leave-record.component";

@NgModule({

    imports: [
        AppSharedModule,
        AttendanceHistoryRoutingModule
    ],
    exports: [],
    declarations: [AttendanceHistoryComponent, ViewLeaveRecordComponent],
    providers: [],
})
export class AttendanceHistoryModule { }