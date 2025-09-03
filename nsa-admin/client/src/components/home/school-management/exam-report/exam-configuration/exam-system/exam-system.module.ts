/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { ExamSystemRoutingModule } from "./exam-system.routing.module";
import { AppSharedModule } from "../../../../../shared/shared.module";
import { ExamSystemComponent } from "./exam-system.component";

@NgModule({

    imports: [
        AppSharedModule,
        ExamSystemRoutingModule
    ],
    exports: [],
    declarations: [ExamSystemComponent],
    providers: [],
})
export class ExamSystemModule { }