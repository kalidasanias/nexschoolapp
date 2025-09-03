/**
 * Created by senthil on 1/24/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignFeeComponent } from "./assign-fee.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AssignFeeComponent}
        ])
    ],
    exports: [RouterModule],
})
export class AssignFeeRoutingModule { }