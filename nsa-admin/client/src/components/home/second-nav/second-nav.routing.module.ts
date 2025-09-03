/**
 * Created by senthilPeriyasamy on 12/23/2016.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecondNavComponent } from "./second-nav.component";

const routes: Routes = [
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SecondNavRoutingModule { }