/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamSystemComponent} from "./exam-system.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ExamSystemComponent}
        ])
    ],
    exports: [RouterModule],
})
export class ExamSystemRoutingModule { }