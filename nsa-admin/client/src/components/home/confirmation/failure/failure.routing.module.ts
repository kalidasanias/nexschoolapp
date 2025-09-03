/**
 * Created by senthil on 3/25/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FailureComponent } from "./failure.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FailureComponent}
        ])
    ],
    exports: [RouterModule],
})
export class FailureRoutingModule { }