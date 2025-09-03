/**
 * Created by Cyril on 2/22/2017.
 */


import { NgModule } from '@angular/core';

import { CommunicationRoutingModule } from "./communication.routing.module";
import { AppSharedModule } from "../../../shared/shared.module";
import { CommunicationComponent } from "../communication/communication.component";

@NgModule({

    imports: [
        AppSharedModule,
        CommunicationRoutingModule
    ],
    exports: [],
    declarations: [CommunicationComponent],
    providers: [],
})
export class CommunicationModule { }