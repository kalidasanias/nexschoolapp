/**
 * Created by Sai Deepak on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyLeavesComponent } from "./my-leaves.component";


const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: MyLeavesComponent}
        ])
    ],
    exports: [RouterModule],
})
export class MyLeavesRoutingModule { }