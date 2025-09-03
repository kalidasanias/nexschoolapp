/**
 * Created by maggi on 07/05/17.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WrittenExamComponent } from "./written-exam.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: WrittenExamComponent}
        ])
    ],
    exports: [RouterModule],
})
export class WrittenExamRoutingModule{ }