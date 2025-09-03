/**
 * Created by maggi on 07/05/17.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgressCardSettingComponent } from "./configuration.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ProgressCardSettingComponent}
        ])
    ],
    exports: [RouterModule],
})
export class ProgressCardSettingRoutingModule{ }