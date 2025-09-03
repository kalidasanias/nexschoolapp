/**
 * Created by SenthilPeriyasamy on 10/26/2016.
 */
import { NgModule } from '@angular/core';

import {TopNavComponent} from "./top-nav.component";
import {TopNavRoutingModule} from "./top-nav.routing.module";

@NgModule({

    imports: [
        TopNavRoutingModule
    ],
    exports: [],
    declarations: [TopNavComponent],
    providers: [],
})
export class TopNavModule { }