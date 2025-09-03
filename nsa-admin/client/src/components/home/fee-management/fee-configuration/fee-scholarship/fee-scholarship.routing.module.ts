/**
 * Created by senthil on 1/24/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeeScholarshipComponent } from "./fee-scholarship.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FeeScholarshipComponent}
        ])
    ],
    exports: [RouterModule],
})
export class FeeScholarshipRoutingModule { }