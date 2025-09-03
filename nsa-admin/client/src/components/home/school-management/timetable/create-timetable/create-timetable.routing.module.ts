/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTimetableComponent} from "./create-timetable.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CreateTimetableComponent}
        ])
    ],
    exports: [RouterModule],
})
export class CreateTimetableRoutingModule { }