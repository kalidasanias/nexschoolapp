/**
 * Created by senthil on 3/24/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CcavenueComponent } from "./ccavenue.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CcavenueComponent}
        ])
    ],
    exports: [RouterModule],
})
export class CcavenueRoutingModule { }