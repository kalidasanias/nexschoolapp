/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageTimetableComponent} from "./manage-timetable.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ManageTimetableComponent}
        ])
    ],
    exports: [RouterModule],
})
export class ManageTimetableRoutingModule { }