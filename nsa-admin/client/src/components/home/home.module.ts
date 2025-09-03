/**
 * Created by SenthilPeriyasamy on 10/26/2016.
 */
import {NgModule} from "@angular/core";
import {AppSharedModule} from "../shared/shared.module";

import {TreeModule} from "primeng/primeng";

import {HomeRoutingModule} from "./home.routing.module";
import {
    BreadcrumbComponent,
    DashboardAttendanceComponent,
    DashboardCalendarComponent,
    DashboardComponent,
    DashboardNotificationsComponent,
    FooterComponent,
    HomeComponent,
    InfoComponent,
    SecondNavComponent,
    TopNavComponent
} from "../index";

import {
    DateService,
    TransportService,
    TreeService,
} from "../../services/index";
import {CalendarService} from "../../services/calendar/calendar.service";
import {BreadcrumbService} from "./breadcrumb/breadcrumb.service";

@NgModule({
    imports: [
        AppSharedModule,
        TreeModule,
        HomeRoutingModule,
    ],
    entryComponents: [
    ],
    declarations: [
        HomeComponent,
        TopNavComponent,
        SecondNavComponent,
        BreadcrumbComponent,
        FooterComponent,
        DashboardComponent,
        InfoComponent,
        DashboardNotificationsComponent,
        DashboardAttendanceComponent,
        DashboardCalendarComponent
    ],
    providers: [
        DateService,
        TreeService,
        CalendarService,
        TransportService,
        BreadcrumbService
    ]
})
export class HomeModule {}
