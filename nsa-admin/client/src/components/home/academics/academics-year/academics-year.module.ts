/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { AcademicsYearRoutingModule } from "./academics-year.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { AcademicsYearComponent } from "../academics-year/academics-year.component";

@NgModule({

    imports: [
        AppSharedModule,
        AcademicsYearRoutingModule
    ],
    exports: [],
    declarations: [AcademicsYearComponent],
    providers: [],
})
export class AcademicsYearModule { }