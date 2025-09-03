/**
 * Created by Sai Deepak on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PromotionsComponent} from "./promotions.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: PromotionsComponent}
        ])
    ],
    exports: [RouterModule],
})
export class PromotionsRoutingModule { }