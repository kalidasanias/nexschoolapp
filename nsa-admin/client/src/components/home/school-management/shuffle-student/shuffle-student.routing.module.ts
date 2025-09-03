/**
 * Created by Sai Deepak on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShuffleStudentsComponent} from "./shuffle-student.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ShuffleStudentsComponent}
        ])
    ],
    exports: [RouterModule],
})
export class ShuffleStudentsRoutingModule { }