/**
 * Created by maggi on 07/05/17.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgressCardConfigComponent } from "./progress-card-config.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ProgressCardConfigComponent}
        ])
    ],
    exports: [RouterModule],
})
export class ProgressCardConfigRoutingModule{ }