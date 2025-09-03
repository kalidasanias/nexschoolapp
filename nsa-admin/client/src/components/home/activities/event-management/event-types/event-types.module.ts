/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { EventTypesRoutingModule } from "./event-types.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { EventTypesComponent } from "./event-types.component";
import { AddEventTypesComponent } from "./add-event-types/add-event-types.component";

@NgModule({

    imports: [
        AppSharedModule,
        EventTypesRoutingModule
    ],
    exports: [],
    declarations: [EventTypesComponent, AddEventTypesComponent],
})
export class EventTypesModule { }