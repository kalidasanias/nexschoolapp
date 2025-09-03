/**
 * Created by maggi on 19/05/17.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GradingConfigurationComponent } from "./grading-configuration.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: GradingConfigurationComponent}
        ])
    ],
    exports: [RouterModule],
})
export class GradingConfigurationRoutingModule{ }