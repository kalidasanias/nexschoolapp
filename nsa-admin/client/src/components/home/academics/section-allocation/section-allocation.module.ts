/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { SectionAllocationRoutingModule } from "./section-allocation.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { SectionAllocationComponent } from "../section-allocation/section-allocation.component";
import { AssociateSection } from '../section-allocation/associate-section/associate-section.components'
import { AssociateSectionEditComponent } from "../section-allocation/associate-section-edit/associate-section-edit.component"
@NgModule({

    imports: [
        AppSharedModule,
        SectionAllocationRoutingModule
    ],
    exports: [],
    declarations: [SectionAllocationComponent, AssociateSection, AssociateSectionEditComponent],
    providers: [],
})
export class SectionAllocationModule { }