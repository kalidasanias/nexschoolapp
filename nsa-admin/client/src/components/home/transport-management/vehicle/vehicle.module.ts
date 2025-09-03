/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { VehicleRoutingModule } from "./vehicle.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { VehicleComponent } from "./vehicle.component";
import { AddVehicleComponent } from "./add-vehicle/add-vehicle.component";

@NgModule({

    imports: [
        AppSharedModule,
        VehicleRoutingModule
    ],
    exports: [],
    declarations: [VehicleComponent, AddVehicleComponent],
    providers: [],
})
export class VehicleModule { }