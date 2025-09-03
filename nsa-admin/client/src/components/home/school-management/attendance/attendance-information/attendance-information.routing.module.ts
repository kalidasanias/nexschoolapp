/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceInformationComponent} from "./attendance-information.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AttendanceInformationComponent}
        ])
    ],
    exports: [RouterModule],
})
export class AttendanceInformationRoutingModule { }