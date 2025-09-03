/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveComponent } from "./live.component";


@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: LiveComponent}
        ])
    ],
    exports: [RouterModule],
})
export class LiveRoutingModule { }