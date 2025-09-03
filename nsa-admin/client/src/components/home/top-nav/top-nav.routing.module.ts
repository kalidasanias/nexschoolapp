/**
 * Created by SenthilPeriyasamy on 10/26/2016.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TopNavComponent} from "./top-nav.component";

const routes: Routes = [
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TopNavRoutingModule { }