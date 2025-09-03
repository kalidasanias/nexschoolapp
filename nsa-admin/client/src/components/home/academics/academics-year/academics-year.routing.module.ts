/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicsYearComponent} from "./academics-year.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AcademicsYearComponent}
        ])
    ],
    exports: [RouterModule],
})
export class AcademicsYearRoutingModule { }