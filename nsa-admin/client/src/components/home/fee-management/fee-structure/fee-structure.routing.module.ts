/**
 * Created by senthil on 1/24/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeeStructureComponent } from "./fee-structure.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FeeStructureComponent}
        ])
    ],
    exports: [RouterModule],
})
export class FeeStructureRoutingModule { }