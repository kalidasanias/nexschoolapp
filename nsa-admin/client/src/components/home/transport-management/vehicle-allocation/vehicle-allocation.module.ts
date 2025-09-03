/**
 * Created by Cyril on 2/22/2017.
 */
import { NgModule } from '@angular/core';
import { VehicleAllocationRoutingModule } from "./vehicle-allocation.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { VehicleAllocationComponent } from "./vehicle-allocation.component";
import { AssignUserComponent } from "./assign-user/assign-user.component";

@NgModule({

    imports: [
        AppSharedModule,
        VehicleAllocationRoutingModule
    ],
    exports: [],
    declarations: [VehicleAllocationComponent, AssignUserComponent],
    providers: [],
})
export class VehicleAllocationModule { }