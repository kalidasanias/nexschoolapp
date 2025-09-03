/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { NotificationRoutingModule } from "./notification.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { NotificationComponent } from "./notification.component";

@NgModule({

    imports: [
        AppSharedModule,
        NotificationRoutingModule
    ],
    exports: [],
    declarations: [NotificationComponent],
    providers: [],
})
export class NotificationModule { }