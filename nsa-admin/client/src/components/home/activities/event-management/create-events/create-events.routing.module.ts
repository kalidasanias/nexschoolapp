/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateEventsComponent} from "./create-events.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CreateEventsComponent}
        ])
    ],
    exports: [RouterModule],
})
export class CreateEventsRoutingModule { }