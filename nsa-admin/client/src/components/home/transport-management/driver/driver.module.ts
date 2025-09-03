/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { DriverRoutingModule } from "./driver.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { DriverComponent } from "./driver.component";
import { CreateDriverComponent } from "./create-driver/create-driver.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({

    imports: [
        AppSharedModule,
        ReactiveFormsModule,
        DriverRoutingModule
    ],
    exports: [],
    declarations: [DriverComponent, CreateDriverComponent],
    providers: [],
})
export class DriverModule { }