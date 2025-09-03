/**
 * Created by senthil on 1/24/2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { AppSharedModule } from '../../../shared/shared.module'
import { FeeStructureRoutingModule } from "./fee-structure.routing.module";

import { AddFeeStructureComponent, FeeStructureComponent } from '../../../index'

@NgModule({

    imports: [
        AppSharedModule,
        FeeStructureRoutingModule
    ],
    exports: [],
    declarations: [FeeStructureComponent, AddFeeStructureComponent],
    providers: [],
})
export class FeeStructureModule { }