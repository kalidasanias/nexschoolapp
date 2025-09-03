/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamScheduleComponent} from "./exam-schedule.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ExamScheduleComponent}
        ])
    ],
    exports: [RouterModule],
})
export class ExamScheduleRoutingModule { }