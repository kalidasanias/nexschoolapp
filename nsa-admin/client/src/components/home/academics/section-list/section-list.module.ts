/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { SectionListRoutingModule } from "./section-list.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { SectionListComponent } from "../section-list/section-list.component";
import { AddSectionComponent } from "../section-list/add-section/add-section.component";


@NgModule({

    imports: [
        AppSharedModule,
        SectionListRoutingModule
    ],
    exports: [],
    declarations: [SectionListComponent, AddSectionComponent],
    providers: [],
})
export class SectionListModule { }