/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { CreateEventsRoutingModule } from "./create-events.routing.module";
import { AppSharedModule } from "../../../../shared/shared.module";
import { CreateEventsComponent } from "../create-events/create-events.component";
import {AddEventComponent} from "./add-event/add-event.component";
import { TreeModule, SharedModule, AutoCompleteModule} from "primeng/primeng";
import {ViewEventComponent} from "./view-events/view.component";

@NgModule({

    imports: [
        AppSharedModule,NKDatetimeModule,TreeModule, SharedModule,AutoCompleteModule,
        CreateEventsRoutingModule
    ],
    exports: [],
    declarations: [CreateEventsComponent, AddEventComponent, ViewEventComponent],
    providers: [],
})

export class CreateEventsModule { }