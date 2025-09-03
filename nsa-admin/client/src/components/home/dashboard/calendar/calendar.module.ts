import { NgModule } from '@angular/core';

import {DashboardCalendarComponent} from "./calendar.component";
import {DashboardCalendarRoutingModule} from "./calendar.routing.module";

@NgModule({

    imports: [
        DashboardCalendarRoutingModule
    ],
    exports: [],
    declarations: [DashboardCalendarComponent],
    providers: [],
})
export class DashboardCalendarModule { }