/**
 * Created by senthil on 3/25/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SuccessComponent} from "./success.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: SuccessComponent}
        ])
    ],
    exports: [RouterModule],
})
export class SuccessRoutingModule { }