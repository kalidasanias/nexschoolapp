import { NgModule } from '@angular/core';

import {DashboardNotificationsComponent} from "./notifications.component";
import {DashboardNotificationsRoutingModule} from "./notifications.routing.module";

@NgModule({

    imports: [
        DashboardNotificationsRoutingModule
    ],
    exports: [],
    declarations: [DashboardNotificationsComponent],
    providers: [],
})
export class DashboardNotificationsModule { }