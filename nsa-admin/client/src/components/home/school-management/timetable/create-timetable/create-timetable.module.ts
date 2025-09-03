/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { CreateTimetableRoutingModule } from "./create-timetable.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { CreateTimetableComponent } from "./create-timetable.component";
import {ClassTimetableComponent} from "./class-timetable/class-timetable.component";
import {EmpTimetableComponent} from "./emp-timetable/emp-timetable.component";
import {NewTimetableComponent} from "./class-timetable/new-timetable/new-timetable.component";
import { UploadNotesComponent } from './class-timetable/upload-notes/upload-notes.component'
import {ViewEmpTimetableComponent} from "./emp-timetable/emp-timetable-view/view-emp-timetable.component";
import {GenerateTimetableComponent} from "./class-timetable/generate-timetable/generate-timetable.component";

@NgModule({

    imports: [
        AppSharedModule,
        CreateTimetableRoutingModule
    ],
    exports: [],
    declarations: [
        CreateTimetableComponent,
        ClassTimetableComponent,
        ViewEmpTimetableComponent,
        EmpTimetableComponent,
        NewTimetableComponent,
        UploadNotesComponent,
        GenerateTimetableComponent
    ],
    providers: [],
})
export class CreateTimetableModule { }