/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';
import { TimetableConfigurationRoutingModule } from "./timetable-configuration.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { TimetableConfigurationComponent } from "./timetable-configuration.component";
import { NewTimetableConfigurationComponent } from "../timetable-configuration/new-timetable-configuration/new-timetable-configuration.component"
import {EditTimetableConfigurationComponent} from "./edit-timetable-configuration/edit-timetable-configuration.component";

@NgModule({

    imports: [
        AppSharedModule,NKDatetimeModule,
        TimetableConfigurationRoutingModule
    ],
    exports: [],
    declarations: [TimetableConfigurationComponent, NewTimetableConfigurationComponent, EditTimetableConfigurationComponent],
    providers: [],
})
export class TimetableConfigurationModule { }