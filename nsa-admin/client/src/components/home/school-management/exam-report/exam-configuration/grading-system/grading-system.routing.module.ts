/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GradingSystemComponent} from "./grading-system.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: GradingSystemComponent}
        ])
    ],
    exports: [RouterModule],
})
export class GradingSystemRoutingModule { }