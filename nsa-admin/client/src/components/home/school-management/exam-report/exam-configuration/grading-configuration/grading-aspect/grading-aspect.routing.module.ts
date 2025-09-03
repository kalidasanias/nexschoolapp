/**
 * Created by maggi on 22/05/17.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GradingAspectComponent} from "./grading-aspect.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: GradingAspectComponent}
        ])
    ],
    exports: [RouterModule],
})
export class GradingAspectRoutingModule { }