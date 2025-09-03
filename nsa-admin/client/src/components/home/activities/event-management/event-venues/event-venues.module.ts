/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { EventVenuesRoutingModule } from "./event-venues.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { EventVenuesComponent } from "./event-venues.component";
import {AddVenueComponent} from "./add-venue/add-venue.component";

@NgModule({

    imports: [
        AppSharedModule,
        EventVenuesRoutingModule
    ],
    exports: [],
    declarations: [EventVenuesComponent, AddVenueComponent],
    providers: [],
})
export class EventVenuesModule { }