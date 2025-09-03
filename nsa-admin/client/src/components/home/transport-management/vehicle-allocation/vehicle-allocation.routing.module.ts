/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleAllocationComponent} from "./vehicle-allocation.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: VehicleAllocationComponent}
        ])
    ],
    exports: [RouterModule],
})
export class VehicleAllocationRoutingModule { }