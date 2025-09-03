/**
 * Created by senthil on 2/16/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeePayComponent } from "./fee-pay.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FeePayComponent}
        ])
    ],
    exports: [RouterModule],
})
export class FeePayRoutingModule { }