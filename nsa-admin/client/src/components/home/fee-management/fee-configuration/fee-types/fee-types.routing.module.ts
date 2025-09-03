/**
 * Created by senthil on 1/24/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeeTypesComponent } from "./fee-types.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FeeTypesComponent}
        ])
    ],
    exports: [RouterModule],
})
export class FeeTypesRoutingModule { }