/**
 * Created by senthil on 1/24/2017.
 */
import { NgModule } from '@angular/core';
import {AppSharedModule} from "../../../../shared/shared.module";

import { FeeTypesRoutingModule } from "./fee-types.routing.module";

import { AddFeeComponent, FeeTypesComponent } from '../../../../index'

@NgModule({

    imports: [
        AppSharedModule,
        FeeTypesRoutingModule
    ],
    exports: [],
    declarations: [FeeTypesComponent, AddFeeComponent],
    providers: [],
})
export class FeeTypesModule { }