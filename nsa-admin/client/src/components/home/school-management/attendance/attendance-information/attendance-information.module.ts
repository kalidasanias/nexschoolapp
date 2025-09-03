/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { AttendanceInformationRoutingModule } from "./attendance-information.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { AttendanceInformationComponent } from "./attendance-information.component";
import {RecordAttendanceComponent} from "./record-attendance/record-attendance.component";
import {EditAttendanceComponent} from "./edit-attendance/edit-attendance.component";
import {NotificationLogsComponent} from "../../../notification/notification-logs/notification-logs.component";

@NgModule({

    imports: [
        AppSharedModule,
        AttendanceInformationRoutingModule
    ],
    exports: [],
    declarations: [AttendanceInformationComponent, RecordAttendanceComponent, EditAttendanceComponent
    ],
    providers: [],
})
export class AttendanceInformationModule { }