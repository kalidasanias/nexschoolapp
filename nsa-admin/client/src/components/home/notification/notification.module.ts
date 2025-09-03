/**
 * Created by senthil on 1/24/2017.
 */
import { NgModule } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';

import { NotificationComponent } from "./notification.component";
import { AppSharedModule } from "../../shared/shared.module";
import { NotificationRoutingModule } from "./notification.routing.module";
import {TreeModule, SharedModule, AutoCompleteModule} from "primeng/primeng";
import {MyNotificationComponent} from "./my-notification/my-notification.component";
import {AllNotificationComponent} from "./all-notification/all-notification.component";

@NgModule({

    imports: [
       TreeModule, SharedModule, AppSharedModule,
        ReactiveFormsModule,FormsModule,
        CommonModule,
        AutoCompleteModule,
        NotificationRoutingModule,

    ],
    exports: [],
    declarations: [NotificationComponent, MyNotificationComponent, AllNotificationComponent],
})
export class NotificationModule { }