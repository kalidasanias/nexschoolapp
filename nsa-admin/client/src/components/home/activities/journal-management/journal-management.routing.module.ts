/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JournalManagementComponent} from "./journal-management.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: JournalManagementComponent}
        ])
    ],
    exports: [RouterModule],
})
export class JournalManagementRoutingModule { }