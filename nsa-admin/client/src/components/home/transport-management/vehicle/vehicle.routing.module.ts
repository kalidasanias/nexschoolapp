/**
 * Created by Cyril on 2/22/2017.
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleComponent} from "./vehicle.component";

const routes: Routes = [
];

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: VehicleComponent}
        ])
    ],
    exports: [RouterModule],
})
export class VehicleRoutingModule { }