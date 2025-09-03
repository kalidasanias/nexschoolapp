/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunicationComponent} from "./communication.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: CommunicationComponent}
        ])
    ],
    exports: [RouterModule],
})
export class CommunicationRoutingModule { }