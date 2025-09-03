/**
 * Created by bharatkumarr on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityTypesComponent} from "./activity-types.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ActivityTypesComponent}
        ])
    ],
    exports: [RouterModule],
})
export class ActivityTypesRoutingModule { }