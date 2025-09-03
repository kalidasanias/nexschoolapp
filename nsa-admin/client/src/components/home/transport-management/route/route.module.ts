/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule, Pipe, PipeTransform } from '@angular/core';

import { AppSharedModule } from "../../../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RouteRoutingModule } from "./route.routing.module";
import { RouteComponent } from "./route.component";
import { AddRouteComponent } from "./add-route/add-route.component";
import { GoogleAPI } from "../../common/map/googleAPI";


@Pipe({
    name: 'ndDriverFilter'
})
export class DriverPipe implements PipeTransform {
    transform(drivers: any, filter_driver_id: any): any {
        if (filter_driver_id && Array.isArray(drivers)) {
            return drivers.filter(driver => driver.id === filter_driver_id);
        } else {
            return drivers;
        }
    }
}


@NgModule({
    imports: [
        AppSharedModule,
        ReactiveFormsModule,
        RouteRoutingModule
    ],
    exports: [],
    declarations: [RouteComponent, AddRouteComponent, DriverPipe]
    // providers: [GoogleAPI],
})
export class RouteModule { }

