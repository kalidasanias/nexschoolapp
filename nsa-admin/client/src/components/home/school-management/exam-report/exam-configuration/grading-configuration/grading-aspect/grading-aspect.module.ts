/**
 * Created by maggi on 22/05/17.
 */
import { NgModule } from '@angular/core';

import { AppSharedModule } from "../../../../../../shared/shared.module";
import {GradingAspectRoutingModule} from "./grading-aspect.routing.module";

@NgModule({

    imports: [
        AppSharedModule,
        GradingAspectRoutingModule
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class GradingAspectModule { }