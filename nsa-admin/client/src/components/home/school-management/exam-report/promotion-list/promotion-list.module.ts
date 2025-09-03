/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { PromotionListRoutingModule } from "./promotion-list.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { PromotionListComponent } from "./promotion-list.component";

@NgModule({

    imports: [
        AppSharedModule,
        PromotionListRoutingModule
    ],
    exports: [],
    declarations: [PromotionListComponent],
    providers: [],
})
export class PromotionListModule { }