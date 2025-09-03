/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignementTypesComponent} from "./../../../../index";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AssignementTypesComponent}
        ])
    ],
    exports: [RouterModule],
})
export class AssignementTypesRoutingModule { }