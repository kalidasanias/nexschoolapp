/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { AppSharedModule } from "../../../shared/shared.module";
import { LiveRoutingModule } from "./live.routing.module";
import { LiveComponent } from "./live.component";
import { TransportNotificationLogsComponent } from "./transport-notification-logs/transport-notification-logs.component"

@NgModule({
    imports: [
        AppSharedModule,
        LiveRoutingModule
    ],
    exports: [],
    declarations: [LiveComponent, TransportNotificationLogsComponent]
})
export class LiveModule { }

