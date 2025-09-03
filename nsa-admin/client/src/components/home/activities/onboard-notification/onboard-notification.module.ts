/**
 * Created by intellishine on 8/18/2017.
 */
import { NgModule } from '@angular/core';
import { AppSharedModule } from "../../../shared/shared.module";
import { OnboardNotificationComponent } from './onboard-notification.component';
import { OnboardNotificationRoutingModule } from './onboard-notification.routing.module';
import {SharedModule, TreeModule} from "primeng/primeng";

@NgModule({
    imports: [
        OnboardNotificationRoutingModule,TreeModule,SharedModule, AppSharedModule
    ],
    exports: [],
    declarations: [OnboardNotificationComponent],
    providers: [],
})

export class OnboardNotificationModule { }