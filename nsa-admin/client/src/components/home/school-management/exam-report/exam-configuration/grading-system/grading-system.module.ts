/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { GradingSystemRoutingModule } from "./grading-system.routing.module";
import { GradingSystemComponent } from "./grading-system.component";
import { AddGradingSystemComponent } from "./add-grading/add-grading.component";

@NgModule({

    imports: [
        GradingSystemRoutingModule
    ],
    exports: [],
    declarations: [ AddGradingSystemComponent,GradingSystemComponent],
    providers: [],
})
export class GradingSystemModule { }