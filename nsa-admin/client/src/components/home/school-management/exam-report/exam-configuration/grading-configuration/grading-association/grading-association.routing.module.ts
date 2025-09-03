/**
 * Created by maggi on 22/05/17.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GradingAssociationComponent} from "./grading-association.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: GradingAssociationComponent}
        ])
    ],
    exports: [RouterModule],
})
export class GradingAssociationRoutingModule { }