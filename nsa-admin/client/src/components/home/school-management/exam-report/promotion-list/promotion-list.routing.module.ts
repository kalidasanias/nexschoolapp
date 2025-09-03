/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionListComponent} from "./promotion-list.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: PromotionListComponent}
        ])
    ],
    exports: [RouterModule],
})
export class PromotionListRoutingModule { }