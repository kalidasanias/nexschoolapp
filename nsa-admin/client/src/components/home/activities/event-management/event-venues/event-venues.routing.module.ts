/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventVenuesComponent} from "./event-venues.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: EventVenuesComponent}
        ])
    ],
    exports: [RouterModule],
})
export class EventVenuesRoutingModule { }