/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { PortionsRoutingModule } from "./portions.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { PortionsComponent } from "./portions.component";

@NgModule({

    imports: [
        AppSharedModule,
        PortionsRoutingModule
    ],
    exports: [],
    declarations: [PortionsComponent],
    providers: [],
})
export class PortionsModule { }