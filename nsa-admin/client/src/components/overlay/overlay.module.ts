/**
 * Created by senthil on 6/04/2017.
 */


import {NgModule} from "@angular/core";

import {OverlayRoutingModule} from "./overlay.routing.module";
import {AppSharedModule} from "../shared/shared.module";

@NgModule({

    imports: [
        AppSharedModule,
        OverlayRoutingModule
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class OverlayModule { }