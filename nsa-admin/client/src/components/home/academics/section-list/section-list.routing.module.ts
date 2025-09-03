/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SectionListComponent} from "./section-list.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: SectionListComponent}
        ])
    ],
    exports: [RouterModule],
})
export class SectionListRoutingModule { }