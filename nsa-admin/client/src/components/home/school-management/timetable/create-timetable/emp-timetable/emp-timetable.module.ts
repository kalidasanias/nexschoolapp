/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { AppSharedModule } from "../../../../../shared/shared.module";
import {EmpTimetableRoutingModule} from "./emp-timetable.routing.module";

@NgModule({

    imports: [
        AppSharedModule,
        EmpTimetableRoutingModule
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class EmpTimetableModule { }