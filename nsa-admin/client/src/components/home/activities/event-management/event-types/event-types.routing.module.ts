/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventTypesComponent} from "./event-types.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: EventTypesComponent}
        ])
    ],
    exports: [RouterModule],
})
export class EventTypesRoutingModule { }