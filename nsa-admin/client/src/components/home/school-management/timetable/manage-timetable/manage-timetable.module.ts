/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { ManageTimetableRoutingModule } from "./manage-timetable.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { ManageTimetableComponent } from "./manage-timetable.component";
import { AddSpecialDayComponent } from "./add-special-timetable/add-special-timetable.component";
import { EditSpecialDayComponent } from "./edit-special-timtable/edit-special-timetable.component";

@NgModule({

    imports: [
        AppSharedModule,
        ManageTimetableRoutingModule
    ],
    exports: [],
    declarations: [ManageTimetableComponent, AddSpecialDayComponent, EditSpecialDayComponent],
    providers: [],
})
export class ManageTimetableModule { }