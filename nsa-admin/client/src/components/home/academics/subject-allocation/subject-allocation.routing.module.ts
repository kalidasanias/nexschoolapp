/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubjectAllocationComponent} from "./subject-allocation.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: SubjectAllocationComponent}
        ])
    ],
    exports: [RouterModule],
})
export class SubjectAllocationRoutingModule { }