/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { DesignationRoutingModule } from "./designation.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { DesignationComponent } from "../designation/designation.component";
import {AddDesignationComponent} from "./add-designation/add-designation.component";

@NgModule({

    imports: [
        AppSharedModule,
        DesignationRoutingModule
    ],
    exports: [],
    declarations: [DesignationComponent, AddDesignationComponent],
    providers: [],
})
export class DesignationModule { }