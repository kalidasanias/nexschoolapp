/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { AppSharedModule } from "../../../../../shared/shared.module";
import {ClassTimetableRoutingModule} from "./class-timetable.routing.module";

@NgModule({

    imports: [
        AppSharedModule,
        ClassTimetableRoutingModule
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class ClassTimetableModule { }