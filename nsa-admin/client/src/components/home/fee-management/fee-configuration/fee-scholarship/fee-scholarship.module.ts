/**
 * Created by senthil on 1/24/2017.
 */
import { NgModule } from '@angular/core';

import { FeeScholarshipRoutingModule } from "./fee-scholarship.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";

import { FeeScholarshipComponent, AddScholarshipComponent } from "../../../../index";

@NgModule({

    imports: [
        AppSharedModule,
        FeeScholarshipRoutingModule
    ],
    exports: [],
    declarations: [FeeScholarshipComponent, AddScholarshipComponent],
    providers: [],
})
export class FeeScholarshipModule { }