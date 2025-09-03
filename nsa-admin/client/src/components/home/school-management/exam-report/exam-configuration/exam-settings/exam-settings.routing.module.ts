/**
 * Created by maggi on 07/05/17.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamSettingsComponent } from "./exam-settings.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ExamSettingsComponent}
        ])
    ],
    exports: [RouterModule],
})
export class ExamSettingsRoutingModule{ }